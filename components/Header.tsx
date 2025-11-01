import React from 'react';
import { SearchIcon, UserIcon, ReceiptIcon, ShoppingCartIcon, HeartIcon, MenuIcon } from './Icons';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onOwnerLoginClick: () => void;
    onMyOrdersClick: () => void;
    onCartClick: () => void;
    cartCount: number;
    onWishlistClick: () => void;
    wishlistCount: number;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, onOwnerLoginClick, onMyOrdersClick, onCartClick, cartCount, onWishlistClick, wishlistCount, onMenuClick }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
                            aria-label="Open categories menu"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
                            Market Asset Management
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-100 focus:bg-white transition-colors text-black"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                         <button
                            onClick={onCartClick}
                            className="relative flex items-center px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-sky-400 hover:text-sky-600 shadow-sm transition-colors duration-200"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCartIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline text-sm font-medium">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={onWishlistClick}
                            className="relative flex items-center px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-sky-400 hover:text-sky-600 shadow-sm transition-colors duration-200"
                            aria-label="Wishlist"
                        >
                            <HeartIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline text-sm font-medium">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={onMyOrdersClick}
                            className="flex items-center px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-sky-400 hover:text-sky-600 shadow-sm transition-colors duration-200"
                            aria-label="My Orders"
                        >
                            <ReceiptIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline text-sm font-medium">My Orders</span>
                        </button>
                        <button
                            onClick={onOwnerLoginClick}
                            className="flex items-center px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-sky-400 hover:text-sky-600 shadow-sm transition-colors duration-200"
                             aria-label="Owner Portal"
                        >
                            <UserIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline text-sm font-medium">Owner Portal</span>
                        </button>
                    </div>
                </div>
                 <div className="relative md:hidden pb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-100 focus:bg-white transition-colors text-black"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;