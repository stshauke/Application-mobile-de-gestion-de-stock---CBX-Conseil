import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../types';
import { getProductById, updateStock } from '../services/api';
import { getStockStatus, STOCK_STATUS_CONFIG } from '../utils/stockStatus';
import StockMovementModal from '../components/StockMovementModal';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'IN' | 'OUT' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      setError(null);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleStockMovement = async (quantity: number) => {
    if (!modalType) return;
    setSubmitting(true);
    try {
      const updated = await updateStock(productId, modalType, quantity);
      setProduct(updated);
      setModalType(null);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.centered}>
        <FontAwesome5 name="exclamation-circle" size={32} color="#dc3545" />
        <Text style={styles.errorText}>{error || 'Produit introuvable'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const status = getStockStatus(product);
  const config = STOCK_STATUS_CONFIG[status];
  const updatedDate = new Date(product.updated_at).toLocaleString('fr-FR');

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${config.color}20` }]}>
              <FontAwesome5 name={config.icon} size={13} color={config.color} solid />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>
          <Text style={styles.reference}>Réf. {product.reference}</Text>
        </View>

        <View style={styles.quantityCard}>
          <Text style={styles.quantityValue}>{product.quantity}</Text>
          <Text style={styles.quantityLabel}>unités en stock</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionIn]}
            onPress={() => setModalType('IN')}
          >
            <FontAwesome5 name="plus" size={16} color="#ffffff" />
            <Text style={styles.actionText}>Entrée de stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionOut]}
            onPress={() => setModalType('OUT')}
          >
            <FontAwesome5 name="minus" size={16} color="#ffffff" />
            <Text style={styles.actionText}>Sortie de stock</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="tags" label="Catégorie" value={product.category} />
          <InfoRow icon="exclamation-triangle" label="Seuil d'alerte" value={String(product.alert_threshold)} />
          <InfoRow icon="clock" label="Dernière mise à jour" value={updatedDate} />
          {product.description && (
            <View style={styles.descriptionBlock}>
              <View style={styles.infoRow}>
                <FontAwesome5 name="align-left" size={14} color="#6c757d" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Description</Text>
              </View>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <StockMovementModal
        visible={modalType !== null}
        type={modalType || 'IN'}
        onClose={() => setModalType(null)}
        onConfirm={handleStockMovement}
        loading={submitting}
      />
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <FontAwesome5 name={icon} size={14} color="#6c757d" style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    padding: 24,
    gap: 12,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#0d6efd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reference: {
    fontSize: 13,
    color: '#adb5bd',
    marginTop: 4,
  },
  quantityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  quantityValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#212529',
  },
  quantityLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionIn: {
    backgroundColor: '#198754',
  },
  actionOut: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  infoIcon: {
    width: 22,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  descriptionBlock: {
    paddingTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginTop: 6,
  },
});
