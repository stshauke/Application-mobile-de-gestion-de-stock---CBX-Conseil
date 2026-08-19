import { Platform } from 'react-native';
import { Product } from '../types';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
});

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Erreur HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  const qs = query.toString();
  return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
}

export function getProductById(id: number): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export interface CreateProductInput {
  name: string;
  reference: string;
  category: string;
  description?: string;
  quantity?: number;
  alert_threshold?: number;
}

export function createProduct(data: CreateProductInput): Promise<Product> {
  return request<Product>('/products', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProduct(id: number, data: Partial<CreateProductInput>): Promise<Product> {
  return request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function updateStock(id: number, type: 'IN' | 'OUT', quantity: number): Promise<Product> {
  return request<Product>(`/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ type, quantity }),
  });
}

export function deleteProduct(id: number): Promise<void> {
  return request<void>(`/products/${id}`, { method: 'DELETE' });
}
