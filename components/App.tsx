import React, { useState } from 'react';
import { Product, Order, OrderStatus, CartItem, ProductCategory } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Modal from './components/Modal';
import CheckoutForm from './components/CheckoutForm';
import ProductDetail from './components/ProductDetail';
import OwnerLogin from './components/OwnerLogin';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerOrderHistory from './components/CustomerOrderHistory';
import ShoppingCart from './components/ShoppingCart';
import Wishlist from './components/Wishlist';
import Sidebar from './components/Sidebar';

function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [isViewingMyOrders, setIsViewingMyOrders] = useState(false);

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'store' | 'ownerLogin' | 'ownerDashboard'>('store');

  const [toastMessage, setToastMessage] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<Omit<Order, 'id' | 'orderDate' | 'status'> | null>(null);

  const handleShareProduct = (product: Product) => {
      const productUrl = `${window.location.origin}?product=${product.id}`;
      navigator.clipboard.writeText(productUrl).then(() => {
          setToastMessage('Product link copied to clipboard!');
          setTimeout(() => {
              setToastMessage('');
          }, 3000);
      }).catch(err => {
          console.error('Failed to copy text: ', err);
          setToastMessage('Failed to copy link.');
           setTimeout(() => {
              setToastMessage('');
          }, 3000);
      });
  };

  const handleBuyNow = (product: Product) => {
    setSelectedProductForDetail(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setSelectedProductForCheckout(product);
  };
  
  const handleAddToCart = (productToAdd: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, productToAdd.stock);
        return prevCart.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlist(prev => 
        prev.includes(productId) 
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
    );
  };
  
  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    setIsSidebarOpen(false);
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
        handleRemoveFromCart(productId);
        return;
    }
    setCart(prevCart => prevCart.map(item => 
        item.id === productId ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
    ));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const handleCheckoutFromCart = () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert('This would proceed to a checkout page for all items in the cart.');
      // In a real app, you would navigate to a multi-item checkout page.
      setIsCartOpen(false);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: orders.length + 1,
      orderDate: new Date().toISOString(),
      status: OrderStatus.Pending,
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Update stock
    const orderedItem = orderData.items[0];
    setProducts(prev => prev.map(p => p.id === orderedItem.id ? { ...p, stock: p.stock - orderedItem.quantity } : p));
    setSelectedProductForCheckout(null);
  };

  const handleOwnerLoginClick = () => {
    setCurrentView('ownerLogin');
  };

  const handleLoginSuccess = () => {
    setIsOwnerLoggedIn(true);
    setCurrentView('ownerDashboard');
  };

  const handleLogout = () => {
    setIsOwnerLoggedIn(false);
    setCurrentView('store');
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };
  
  const handleUpdateOrderStatus = (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleMyOrdersClick = () => {
    setIsViewingMyOrders(true);
  };

  const closeModal = () => {
    setSelectedProductForDetail(null);
    setSelectedProductForCheckout(null);
    setIsViewingMyOrders(false);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setShowQrCode(false);
    setPendingOrderData(null);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const renderContent = () => {
    switch (currentView) {
      case 'ownerLogin':
        return <OwnerLogin onLoginSuccess={handleLoginSuccess} />;
      case 'ownerDashboard':
        return isOwnerLoggedIn ? <OwnerDashboard 
          products={products}
          orders={orders}
          onLogout={handleLogout}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        /> : <OwnerLogin onLoginSuccess={handleLoginSuccess} />;
      case 'store':
      default:
        const searchedProducts = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const getCategoryEnum = (categoryName: string) => {
          switch (categoryName) {
            case 'Fruits': return ProductCategory.Fruit;
            case 'Vegetables': return ProductCategory.Vegetable;
            case 'Grocery Things': return ProductCategory.Grocery;
            case 'Stationery Things': return ProductCategory.Stationery;
            default: return null;
          }
        };
        
        const newGroceryIds = [18, 19, 20, 21, 22, 23, 29, 30, 31, 32, 33];
        const stationeryIds = [1, 2, 4, 5, 6, 7, 8, 24, 25, 26, 27, 28, 34, 35, 36, 37, 38];
        
        const newGroceryProducts = products.filter(p => newGroceryIds.includes(p.id));
        const stationeryProducts = products.filter(p => stationeryIds.includes(p.id));
        const otherProducts = products.filter(p => !newGroceryIds.includes(p.id) && !stationeryIds.includes(p.id));
      
        return (
          <>
            <Header 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              onOwnerLoginClick={handleOwnerLoginClick}
              onMyOrdersClick={handleMyOrdersClick}
              cartCount={cartItemCount}
              onCartClick={() => setIsCartOpen(true)}
              wishlistCount={wishlist.length}
              onWishlistClick={() => setIsWishlistOpen(true)}
              onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* QR Code Overlay - Appears above all cards */}
            {showQrCode && pendingOrderData && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-start justify-center pt-8 pb-8 overflow-y-auto"
                onClick={() => {
                  setShowQrCode(false);
                  setPendingOrderData(null);
                }}
              >
                <div 
                  className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 mt-8 mb-8 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowQrCode(false);
                      setPendingOrderData(null);
                      // Keep checkout modal open
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                    aria-label="Close QR Code"
                  >
                    ×
                  </button>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Scan to Pay</h3>
                    <p className="text-sm text-gray-600 mb-4">Scan the QR code below with your PhonePe app</p>
                    <div className="flex justify-center mb-6">
                      <img 
                        src="/qrpayaluga.jpg" 
                        alt="PhonePe QR Code" 
                        className="rounded-lg shadow-md border-2 border-gray-200 max-w-xs w-full h-auto"
                      />
                    </div>
                    <p className="text-xl font-bold text-sky-600 mb-6">Total: ₹{pendingOrderData.total.toFixed(2)}</p>
                    <button
                      onClick={() => {
                        handlePlaceOrder(pendingOrderData);
                        setShowQrCode(false);
                        setPendingOrderData(null);
                        setSelectedProductForCheckout(null);
                      }}
                      className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                      Complete Order
                    </button>
                  <button
                    onClick={() => {
                      setShowQrCode(false);
                      setPendingOrderData(null);
                      // Keep checkout modal open so user can change payment method
                    }}
                    className="w-full mt-3 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back to Checkout
                  </button>
                  </div>
                </div>
              </div>
            )}

             {/* Off-canvas Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                </div>
                <Sidebar activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
            </div>

            {activeCategory === 'All Products' ? (
              <>
                 <ProductList 
                    products={newGroceryProducts.filter(p => 
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )} 
                    layout="horizontal"
                    title="Fresh Groceries"
                    onBuyNow={handleBuyNow} 
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onShare={handleShareProduct}
                  />
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg p-8 text-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Weekend Special!</h2>
                            <p className="text-lg">Get 15% off on all stationery items. Use code: <span className="font-mono bg-white/20 px-2 py-1 rounded">WEEKEND15</span></p>
                        </div>
                    </div>
                   <ProductList 
                    products={stationeryProducts.filter(p => 
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )} 
                    layout="horizontal"
                    title="Stationery Things"
                    onBuyNow={handleBuyNow} 
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onShare={handleShareProduct}
                  />
                   <ProductList 
                    products={otherProducts.filter(p => 
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )} 
                    title="More For You"
                    onBuyNow={handleBuyNow} 
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onShare={handleShareProduct}
                  />
              </>
            ) : (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">{activeCategory}</h2>
                      <button 
                          onClick={() => setActiveCategory('All Products')}
                          className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
                      >
                          &larr; Show All Products
                      </button>
                    </div>
                   <ProductList 
                      products={searchedProducts.filter(p => p.category === getCategoryEnum(activeCategory))} 
                      onBuyNow={handleBuyNow} 
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCart}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                      onShare={handleShareProduct}
                    />
                </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {renderContent()}

      {/* Product Detail Modal */}
      <Modal isOpen={!!selectedProductForDetail} onClose={closeModal} title={selectedProductForDetail?.name || 'Product Details'}>
        {selectedProductForDetail && <ProductDetail 
            product={selectedProductForDetail} 
            onBuyNow={handleBuyNow} 
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(selectedProductForDetail.id)}
            onShare={handleShareProduct}
        />}
      </Modal>
      
      {/* Checkout Modal */}
      <Modal isOpen={!!selectedProductForCheckout} onClose={closeModal} title={`Checkout: ${selectedProductForCheckout?.name || ''}`}>
        {selectedProductForCheckout && (
          <CheckoutForm 
            product={selectedProductForCheckout} 
            onClose={closeModal} 
            onPlaceOrder={handlePlaceOrder}
            onShowQrCode={(orderData) => {
              setPendingOrderData(orderData);
              setShowQrCode(true);
            }}
          />
        )}
      </Modal>

      {/* My Orders Modal */}
      <Modal isOpen={isViewingMyOrders} onClose={closeModal} title="My Orders">
        <CustomerOrderHistory orders={orders} />
      </Modal>

      {/* Shopping Cart Modal */}
      <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Shopping Cart">
          <ShoppingCart 
              cartItems={cart}
              onClose={() => setIsCartOpen(false)}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckoutFromCart}
              onBuyNow={handleBuyNow}
          />
      </Modal>
      
      {/* Wishlist Modal */}
       <Modal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} title="Your Wishlist">
          <Wishlist
              items={wishlistedProducts}
              onClose={() => setIsWishlistOpen(false)}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={(product) => {
                  handleAddToCart(product);
              }}
              onBuyNow={(product) => {
                  handleBuyNow(product);
              }}
          />
      </Modal>

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full shadow-lg z-[100] animate-toast-in-up">
            <p>{toastMessage}</p>
        </div>
      )}

      <style>{`
        @keyframes toast-in-up {
            0% {
                opacity: 0;
                transform: translate(-50%, 20px);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        .animate-toast-in-up {
            animation: toast-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;