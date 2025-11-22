import React from 'react';
import Link from 'next/link';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative">
      <Link href={`/products/${product.id}`} className="flex-grow">
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {product.title}
          </h3>
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {product.category}
            </span>
          </div>
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-2 right-2 flex gap-2">
        {onEdit && (
          <button
            onClick={handleEditClick}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-1.5 text-sm font-medium"
            title="Edit product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center gap-1.5 text-sm font-medium"
            title="Delete product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

