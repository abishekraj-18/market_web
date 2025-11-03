import React from 'react';
import { Product } from '../types';
import { HeartIcon, ShareIcon } from './Icons';

interface ProductDetailProps {
    product: Product;
    onBuyNow: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (productId: number) => void;
    isWishlisted: boolean;
    onShare: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBuyNow, onAddToCart, onToggleWishlist, isWishlisted, onShare }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                 {product.extraImageUrl && <img src={product.extraImageUrl} alt={`${product.name} alternate view`} className="w-full h-auto object-cover rounded-lg shadow-md" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-2xl font-bold text-sky-600">₹{product.price.toFixed(2)}</p>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="border-t pt-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Availability:</span> 
                    {product.stock > 0 ? 
                        <span className="text-green-600"> In Stock ({product.stock} available)</span> : 
                        <span className="text-red-600"> Out of Stock</span>
                    }
                </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-grow px-6 py-3 bg-sky-100 text-sky-700 font-semibold rounded-lg hover:bg-sky-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                   Add to Cart
                </button>
                <button
                    onClick={() => onBuyNow(product)}
                    disabled={product.stock === 0}
                    className="flex-grow px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>
                <button
                    onClick={() => onShare(product)}
                    className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:border-sky-500 hover:text-sky-500 transition-colors"
                    aria-label="Share product link"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
                 <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 border rounded-lg transition-colors ${isWishlisted ? 'text-red-500 border-red-300' : 'text-gray-600 border-gray-300 hover:border-red-500 hover:text-red-500'}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon className="w-6 h-6" filled={isWishlisted} />
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;