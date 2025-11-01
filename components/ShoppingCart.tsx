import React from 'react';
import { CartItem, Product } from '../types';

interface ShoppingCartProps {
    cartItems: CartItem[];
    onClose: () => void;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    onBuyNow: (product: Product) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, onClose, onUpdateQuantity, onRemoveItem, onCheckout, onBuyNow }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex flex-col" style={{ minHeight: '400px' }}>
            {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
                    <p className="text-sm mt-1">Add items to get started.</p>
                </div>
            ) : (
                <>
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex py-4">
                                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{item.name}</h3>
                                                <p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center border border-gray-300 rounded">
                                                 <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 disabled:opacity-50">-</button>
                                                 <p className="px-3 text-center w-8">{item.quantity}</p>
                                                 <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-2 py-1 text-gray-600 disabled:opacity-50">+</button>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => onBuyNow(item)} className="font-medium text-sky-600 hover:text-sky-500">Buy Now</button>
                                                <button onClick={() => onRemoveItem(item.id)} className="font-medium text-red-600 hover:text-red-500">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                
                    <div className="border-t border-gray-200 pt-6">
                         <div className="flex justify-between text-base font-medium text-gray-900">
                             <p>Subtotal</p>
                             <p>₹{subtotal.toFixed(2)}</p>
                         </div>
                         <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                         <div className="mt-6">
                             <button onClick={onCheckout} className="w-full flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-sky-700">
                                 Proceed to Checkout
                             </button>
                         </div>
                          <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                            <p>
                              or{' '}
                              <button type="button" className="font-medium text-sky-600 hover:text-sky-500" onClick={onClose}>
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </p>
                          </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;