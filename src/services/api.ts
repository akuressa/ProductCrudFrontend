import { Product } from '../types/product';

const BACKEND_API_URL = 'http://127.0.0.1:8000/api/products';

export interface CreateProductData {
  title: string;
  price: number;
  description?: string | null;
  category: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(BACKEND_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create product' }));
      throw new Error(errorData.message || 'Failed to create product');
    }
    const data = await response.json();
    // Transform backend response to match Product interface
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

