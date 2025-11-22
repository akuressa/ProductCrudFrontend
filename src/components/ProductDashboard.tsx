import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getProducts, setSearchTerm, setCategory, setPriceRange, setSortBy, clearFilters, setCurrentPage, editProduct, removeProduct, clearProducts } from '../store/productSlice';
import {
  selectFilteredAndSortedProducts,
  selectPaginatedProducts,
  selectTotalPages,
  selectUniqueCategories,
  selectPriceRange,
} from '../store/productSelectors';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Product } from '../types/product';
import { logoutUser } from '../store/authSlice';

const ProductDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allProducts = useSelector(selectFilteredAndSortedProducts);
  const products = useSelector(selectPaginatedProducts);
  const totalPages = useSelector(selectTotalPages);
  const categories = useSelector(selectUniqueCategories);
  const priceRange = useSelector(selectPriceRange);
  const { loading, error, filters, pagination } = useSelector((state: RootState) => state.products);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Local state for filter values (not applied until Apply button is clicked)
  const [localCategory, setLocalCategory] = useState<string>('');
  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');
  const [localSortBy, setLocalSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  // UI state for showing/hiding filter and sort sections
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProducts());
    } else {
      // Clear products when user logs out
      dispatch(clearProducts());
    }
  }, [dispatch, isAuthenticated]);

  // Initialize local state from Redux filters
  useEffect(() => {
    setLocalCategory(filters.category);
    setLocalSortBy(filters.sortBy);
    if (filters.minPrice !== null) {
      setLocalMinPrice(filters.minPrice.toString());
    } else {
      setLocalMinPrice('');
    }
    if (filters.maxPrice !== null) {
      setLocalMaxPrice(filters.maxPrice.toString());
    } else {
      setLocalMaxPrice('');
    }
  }, [filters]);

  const handleApplyFilters = () => {
    dispatch(setCategory(localCategory));
    dispatch(setPriceRange({
      min: localMinPrice === '' ? null : parseFloat(localMinPrice),
      max: localMaxPrice === '' ? null : parseFloat(localMaxPrice),
    }));
    setShowFilters(false);
  };

  const handleApplySort = () => {
    dispatch(setSortBy(localSortBy));
    setShowSort(false);
  };

  const handleClearFilters = () => {
    setLocalCategory('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalSortBy('name');
    dispatch(clearFilters());
    setShowFilters(false);
    setShowSort(false);
  };

  // Don't block the UI on error - show the dashboard with error message

  const hasActiveFilters =
    filters.searchTerm ||
    filters.category ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.sortBy !== 'name';

  // Filter Icon SVG
  const FilterIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );

  // Sort Icon SVG
  const SortIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Auth Buttons */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Product Dashboard
            </h1>
            <p className="text-gray-600">
              Showing {allProducts.length} product{allProducts.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` (Page ${pagination.currentPage} of ${totalPages})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.name || user?.email}</p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
                <button
                  onClick={() => dispatch(logoutUser())}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Control Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* First Row: Search Input with Filter and Sort Buttons */}
          <div className="flex items-end gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name or category..."
                  value={filters.searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter and Sort Buttons */}
            <div className="flex gap-4 items-end">
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowSort(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FilterIcon />
                Filters
              </button>
              <button
                onClick={() => {
                  setShowSort(!showSort);
                  setShowFilters(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showSort
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SortIcon />
                Sort
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Add Button */}
            <div className="ml-auto">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setShowFilters(false);
                  setShowSort(false);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>

          {/* Filter Options Section */}
          {showFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="flex flex-wrap items-end gap-4">
                {/* Category Filter */}
                <div className="flex-1 min-w-[150px] max-w-[200px]">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div className="flex-1 min-w-[120px] max-w-[150px]">
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price ($)
                  </label>
                  <input
                    id="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Min: $${priceRange.min.toFixed(2)}`}
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Max Price */}
                <div className="flex-1 min-w-[120px] max-w-[150px]">
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price ($)
                  </label>
                  <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Max: $${priceRange.max.toFixed(2)}`}
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sort Options Section */}
          {showSort && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 min-w-[150px] max-w-[250px]">
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    value={localSortBy}
                    onChange={(e) =>
                      setLocalSortBy(e.target.value as 'name' | 'price-low' | 'price-high')
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={handleApplySort}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Sort
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium">{error}</p>
                  {!isAuthenticated && (
                    <p className="text-yellow-700 text-sm mt-1">Please login or register to view products.</p>
                  )}
                </div>
              </div>
              {isAuthenticated && (
                <button
                  onClick={() => dispatch(getProducts())}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800">Loading products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && allProducts.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No products found matching your filters.</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && allProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onEdit={(product) => {
                    setEditingProduct(product);
                    setShowAddForm(false);
                  }}
                  onDelete={(product) => setDeletingProduct(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => dispatch(setCurrentPage(pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pagination.currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {(() => {
                    const pages: (number | string)[] = [];
                    const current = pagination.currentPage;
                    const total = totalPages;

                    if (total <= 7) {
                      // Show all pages if 7 or fewer
                      for (let i = 1; i <= total; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(1);

                      if (current > 3) {
                        pages.push('...');
                      }

                      // Show pages around current
                      const start = Math.max(2, current - 1);
                      const end = Math.min(total - 1, current + 1);

                      for (let i = start; i <= end; i++) {
                        if (i !== 1 && i !== total) {
                          pages.push(i);
                        }
                      }

                      if (current < total - 2) {
                        pages.push('...');
                      }

                      // Always show last page
                      if (total > 1) {
                        pages.push(total);
                      }
                    }

                    return pages.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => dispatch(setCurrentPage(page as number))}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            pagination.currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                </div>

                <button
                  onClick={() => dispatch(setCurrentPage(pagination.currentPage + 1))}
                  disabled={pagination.currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pagination.currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal */}
      {(showAddForm || editingProduct) && (
        <ProductForm
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          existingCategories={categories}
          product={editingProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Product</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{deletingProduct.title}"</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await dispatch(removeProduct(deletingProduct.id)).unwrap();
                      setDeletingProduct(null);
                    } catch (error) {
                      console.error('Failed to delete product:', error);
                    }
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default ProductDashboard;

