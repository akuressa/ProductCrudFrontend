import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Product } from '../types/product';

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectPagination = (state: RootState) => state.products.pagination;

export const selectFilteredAndSortedProducts = createSelector(
  [selectAllProducts, selectFilters],
  (products: Product[], filters) => {
    // Filter out invalid products and create a safe copy
    let filtered = products.filter(
      (product) => product && product.title && product.category !== undefined
    );

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.title?.toLowerCase() || '').includes(searchLower) ||
          (product.category?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== null) {
      filtered = filtered.filter((product) => (product.price || 0) >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter((product) => (product.price || 0) <= filters.maxPrice!);
    }

    // Sort products with safe access
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => {
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
        });
        break;
    }

    return filtered;
  }
);

export const selectUniqueCategories = createSelector([selectAllProducts], (products: Product[]) => {
  const categories = new Set(
    products
      .filter((product) => product && product.category)
      .map((product) => product.category)
  );
  return Array.from(categories).sort();
});

export const selectPriceRange = createSelector([selectAllProducts], (products: Product[]) => {
  const validProducts = products.filter((product) => product && typeof product.price === 'number');
  if (validProducts.length === 0) return { min: 0, max: 0 };
  const prices = validProducts.map((product) => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

export const selectPaginatedProducts = createSelector(
  [selectFilteredAndSortedProducts, selectPagination],
  (filteredProducts: Product[], pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredAndSortedProducts, selectPagination],
  (filteredProducts: Product[], pagination) => {
    return Math.ceil(filteredProducts.length / pagination.itemsPerPage);
  }
);

