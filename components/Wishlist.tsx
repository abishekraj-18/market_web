import React from 'react';
import { Product } from '../types';
import { HeartIcon, ShoppingCartIcon } from './Icons';

interface WishlistProps {
    items: Product[];
    onClose: () => void;
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product) => void;
    onBuyNow: (product: Product) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onClose, onToggleWishlist, onAddToCart, onBuyNow }) => {
    return (
        <div className="flex flex-col" style={{ minHeight: '400px' }}>
            {items.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-gray-500">
                    <HeartIcon className="h-24 w-24 text-sky-300" />
                    <p className="mt-4 text-lg font-semibold">Your wishlist is empty</p>
                    <p className="text-sm mt-1">Tap the heart on products to save them.</p>
                     <div className="mt-6">
                        <button type="button" className="font-medium text-sky-600 hover:text-sky-500" onClick={onClose}>
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                     </div>
                </div>
            ) : (
                <>
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                        <ul className="divide-y divide-gray-200">
                            {items.map(item => (
                                <li key={item.id} className="flex py-4 items-center">
                                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                                        {item.stock === 0 && <p className="text-xs text-red-500 font-semibold">Out of Stock</p>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                         <button 
                                            onClick={() => onAddToCart(item)} 
                                            className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400"
                                            aria-label="Add to cart"
                                            disabled={item.stock === 0}
                                        >
                                             <ShoppingCartIcon className="w-5 h-5"/>
                                         </button>
                                          <button
                                            onClick={() => onBuyNow(item)}
                                            disabled={item.stock === 0}
                                            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Buy Now
                                        </button>
                                         <button 
                                            onClick={() => onToggleWishlist(item.id)} 
                                            className="p-2 border border-gray-300 rounded-full text-red-500 hover:bg-gray-100 transition"
                                            aria-label="Remove from wishlist"
                                        >
                                            <HeartIcon className="w-5 h-5" filled={true}/>
                                         </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Wishlist;