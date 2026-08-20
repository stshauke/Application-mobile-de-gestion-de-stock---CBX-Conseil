import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import { getProducts } from '../services/api';
import { getStockStatus } from '../utils/stockStatus';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const CHART_COLORS = ['#0d6efd', '#6610f2', '#d63384', '#fd7e14', '#198754', '#20c997', '#0dcaf0'];

export default function DashboardScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation, loadProducts]);

  const stats = useMemo(() => {
    const total = products.length;
    const outOfStock = products.filter((p) => getStockStatus(p) === 'out').length;
    const lowStock = products.filter((p) => getStockStatus(p) === 'low').length;
    const normal = total - outOfStock - lowStock;
    return { total, outOfStock, lowStock, normal };
  }, [products]);

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([category, count], index) => ({
      category,
      count,
      percentage: max > 0 ? count / max : 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [products]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard icon="boxes" label="Total produits" value={stats.total} color="#0d6efd" />
          <StatCard icon="times-circle" label="En rupture" value={stats.outOfStock} color="#dc3545" />
          <StatCard icon="exclamation-triangle" label="Stock faible" value={stats.lowStock} color="#ffc107" />
          <StatCard icon="check-circle" label="Stock normal" value={stats.normal} color="#198754" />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Répartition par catégorie</Text>
          {categoryDistribution.length === 0 ? (
            <Text style={styles.emptyText}>Aucune donnée disponible</Text>
          ) : (
            categoryDistribution.map((entry) => (
              <View key={entry.category} style={styles.barRow}>
                <Text style={styles.barLabel} numberOfLines={1}>{entry.category}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.max(entry.percentage * 100, 6)}%`, backgroundColor: entry.color },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{entry.count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <FontAwesome5 name={icon} size={16} color={color} solid />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#212529',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  barLabel: {
    width: 90,
    fontSize: 12,
    color: '#495057',
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#f1f3f5',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  barValue: {
    width: 24,
    fontSize: 12,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'right',
  },
  emptyText: {
    color: '#adb5bd',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
