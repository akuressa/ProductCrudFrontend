import React from 'react';
import Link from 'next/link';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer h-full">
        {/* <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4"
          />
        </div> */}
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
      </div>
    </Link>
  );
};

export default ProductCard;

