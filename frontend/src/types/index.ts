export interface Product {
  id: number;
  name: string;
  reference: string;
  description: string | null;
  category: string;
  quantity: number;
  alert_threshold: number;
  updated_at: string;
  created_at: string;
}

export type StockStatus = 'normal' | 'low' | 'out';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
  ProductForm: { productId?: number };
};
