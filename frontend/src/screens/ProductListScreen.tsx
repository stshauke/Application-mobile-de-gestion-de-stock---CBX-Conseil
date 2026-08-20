import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import { getProducts } from '../services/api';
import { notifyOutOfStockProducts } from '../services/notifications';
import ProductCard from '../components/ProductCard';
import SearchFilterBar from '../components/SearchFilterBar';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export default function ProductListScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const hasNotifiedRef = useRef(false);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data);

      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        notifyOutOfStockProducts(data).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation, loadProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion de stock</Text>
        <Text style={styles.subtitle}>{filteredProducts.length} article(s)</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          style={styles.dashboardLink}
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.7}
        >
          <View style={styles.dashboardLinkLeft}>
            <FontAwesome5 name="chart-pie" size={15} color="#0d6efd" />
            <Text style={styles.dashboardLinkText}>Voir le tableau de bord</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={13} color="#adb5bd" />
        </TouchableOpacity>

        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {error && (
          <View style={styles.errorBox}>
            <FontAwesome5 name="exclamation-circle" size={16} color="#dc3545" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome5 name="box-open" size={40} color="#ced4da" />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProductForm', {})}
        activeOpacity={0.85}
      >
        <FontAwesome5 name="plus" size={20} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d6efd',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#e7f0ff',
    marginTop: 2,
  },
  body: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#842029',
    fontSize: 13,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: '#adb5bd',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d6efd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  dashboardLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dashboardLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dashboardLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
});
