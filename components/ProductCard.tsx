import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './Icons';

interface ProductCardProps {
    product: Product;
    onBuyNow: (product: Product) => void;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (productId: number) => void;
    isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow, onViewDetails, onAddToCart, onToggleWishlist, isWishlisted }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group flex flex-col hover:shadow-xl hover:shadow-sky-100/80">
            <div className="relative">
                <div className="cursor-pointer overflow-hidden" onClick={() => onViewDetails(product)}>
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className={`w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-125 ${product.stock === 0 ? 'grayscale' : ''}`}
                        loading="lazy"
                    />
                     {product.extraImageUrl && (
                        <img
                            src={product.extraImageUrl}
                            alt={`${product.name} alternate view`}
                            className={`w-full h-56 object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-125 ${product.stock === 0 ? 'grayscale' : ''}`}
                            loading="lazy"
                        />
                    )}
                </div>
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none z-10">
                        <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                    className="absolute top-2 right-2 p-2 bg-white/70 rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-colors duration-200 z-20"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`} filled={isWishlisted} />
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-sky-600">₹{product.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                         <button
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                            className="px-3 py-1.5 border border-sky-600 text-sky-600 text-xs font-semibold rounded-full hover:bg-sky-50 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        >
                           Add to Cart
                        </button>
                        <button
                            onClick={() => onBuyNow(product)}
                            disabled={product.stock === 0}
                            className="px-3 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-full hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;