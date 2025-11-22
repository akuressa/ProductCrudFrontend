export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  // image: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: 'name' | 'price-low' | 'price-high';
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
}

