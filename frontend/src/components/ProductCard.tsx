import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Product } from '../types';
import { getStockStatus, STOCK_STATUS_CONFIG } from '../utils/stockStatus';

interface Props {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const status = getStockStatus(product);
  const config = STOCK_STATUS_CONFIG[status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.statusBar, { backgroundColor: config.color }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <View style={[styles.badge, { backgroundColor: `${config.color}20` }]}>
            <FontAwesome5 name={config.icon} size={12} color={config.color} solid />
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        <Text style={styles.category}>{product.category}</Text>

        <View style={styles.footerRow}>
          <View style={styles.quantityRow}>
            <FontAwesome5 name="boxes" size={14} color="#6c757d" />
            <Text style={styles.quantityText}>{product.quantity} en stock</Text>
          </View>
          <Text style={styles.thresholdText}>Seuil : {product.alert_threshold}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statusBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  category: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  thresholdText: {
    fontSize: 12,
    color: '#adb5bd',
  },
});
