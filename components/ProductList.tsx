import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    onBuyNow: (product: Product) => void;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
    layout?: 'grid' | 'horizontal';
    title?: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, onBuyNow, onViewDetails, onAddToCart, wishlist, onToggleWishlist, layout = 'grid', title }) => {
    
    if (layout === 'horizontal') {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>}
                    <div className="flex overflow-x-auto space-x-6 pb-4 horizontal-scroll">
                        {products.map(product => (
                            <div key={product.id} className="w-72 flex-shrink-0">
                               <ProductCard 
                                    product={product} 
                                    onBuyNow={onBuyNow} 
                                    onViewDetails={onViewDetails}
                                    onAddToCart={onAddToCart} 
                                    onToggleWishlist={onToggleWishlist}
                                    isWishlisted={wishlist.includes(product.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                 <style>{`
                    .horizontal-scroll {
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none; /* Firefox */
                    }
                    .horizontal-scroll::-webkit-scrollbar {
                        display: none; /* Chrome, Safari, and Opera */
                    }
                `}</style>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                      <ProductCard 
                          key={product.id} 
                          product={product} 
                          onBuyNow={onBuyNow} 
                          onViewDetails={onViewDetails}
                          onAddToCart={onAddToCart} 
                          onToggleWishlist={onToggleWishlist}
                          isWishlisted={wishlist.includes(product.id)}
                      />
                  ))}
              </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <p className="text-lg text-gray-600">No products found.</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;