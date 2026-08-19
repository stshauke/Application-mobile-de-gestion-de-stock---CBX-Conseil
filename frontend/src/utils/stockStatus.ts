import { Product, StockStatus } from '../types';

export function getStockStatus(product: Product): StockStatus {
  if (product.quantity === 0) return 'out';
  if (product.quantity <= product.alert_threshold) return 'low';
  return 'normal';
}

export const STOCK_STATUS_CONFIG: Record<StockStatus, { label: string; color: string; icon: string }> = {
  normal: { label: 'Normal', color: '#198754', icon: 'check-circle' },
  low: { label: 'Stock faible', color: '#ffc107', icon: 'exclamation-triangle' },
  out: { label: 'Rupture', color: '#dc3545', icon: 'times-circle' },
};
