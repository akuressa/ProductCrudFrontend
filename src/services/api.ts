import { Product } from '../types/product';
import { getToken } from './authApi';

const BACKEND_API_URL = 'http://127.0.0.1:8000/api/products';

// Helper function to get headers with auth token
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface CreateProductData {
  title: string;
  price: number;
  description?: string | null;
  category: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(BACKEND_API_URL, {
      headers,
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication required. Please login to view products.');
      }
      throw new Error('Failed to fetch products');
    }
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    throw new Error('Invalid response format from API');
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create product' }));
      throw new Error(errorData.message || 'Failed to create product');
    }
    const result = await response.json();
    const data = result.success && result.data ? result.data : result;
    const product: Product = {
      id: data.id,
      title: data.title,
      price: data.price,
      description: data.description,
      category: data.category,
    };
    return product;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const updateProduct = async (id: number, productData: CreateProductData): Promise<Product> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update product' }));
      throw new Error(errorData.message || 'Failed to update product');
    }
    const result = await response.json();
    const data = result.success && result.data ? result.data : result;
    const product: Product = {
      id: data.id,
      title: data.title,
      price: data.price,
      description: data.description,
      category: data.category,
    };
    return product;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete product' }));
      throw new Error(errorData.message || 'Failed to delete product');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

