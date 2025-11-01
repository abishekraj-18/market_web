
import React, { useState } from 'react';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import Modal from './Modal';

interface OwnerDashboardProps {
    products: Product[];
    orders: Order[];
    onLogout: () => void;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onDeleteProduct: (id: number) => void;
    onUpdateOrderStatus: (id: number, status: OrderStatus) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ products, orders, onLogout, onAddProduct, onDeleteProduct, onUpdateOrderStatus }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '', price: 0, imageUrl: '', extraImageUrl: '', description: '', stock: 0, category: ProductCategory.Stationery
    });
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value }));
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        onAddProduct(newProduct);
        setNewProduct({ name: '', price: 0, imageUrl: '', extraImageUrl: '', description: '', stock: 0, category: ProductCategory.Stationery });
        setIsAdding(false);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete.id);
            setProductToDelete(null);
        }
    };
    
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800';
            case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
            case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-800">Owner Dashboard</h1>
                    <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Logout</button>
                </div>

                <div className="mb-8">
                     <h2 className="text-2xl font-semibold text-sky-700 mb-4">Recent Orders ({orders.length})</h2>
                     <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                         <table className="w-full text-left">
                             <thead className="bg-gray-50 border-b">
                                 <tr>
                                     <th className="p-4 font-semibold">Order ID</th>
                                     <th className="p-4 font-semibold">Customer</th>
                                     <th className="p-4 font-semibold">Date</th>
                                     <th className="p-4 font-semibold">Total</th>
                                     <th className="p-4 font-semibold">Status</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {orders.length > 0 ? orders.map(order => (
                                     <tr key={order.id} className="border-b hover:bg-gray-50">
                                         <td className="p-4 text-sm text-gray-600">#{order.id}</td>
                                         <td className="p-4">{order.customerDetails.fullName}</td>
                                         <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                         <td className="p-4">₹{order.total.toFixed(2)}</td>
                                         <td className="p-4">
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className={`px-2 py-1 text-sm font-medium rounded-full border-2 ${getStatusColor(order.status)}`}
                                            >
                                                {Object.values(OrderStatus).map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                         </td>
                                     </tr>
                                 )) : (
                                     <tr>
                                         <td colSpan={5} className="text-center p-8 text-gray-500">No orders yet.</td>
                                     </tr>
                                 )}
                             </tbody>
                         </table>
                     </div>
                </div>

                <h2 className="text-2xl font-semibold text-sky-700 mb-4">Manage Products</h2>
                <div className="mb-6">
                    <button onClick={() => setIsAdding(!isAdding)} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        {isAdding ? 'Cancel' : 'Add New Product'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Product Name" className="p-2 border rounded" required />
                            <input name="price" type="number" step="0.01" value={newProduct.price} onChange={handleInputChange} placeholder="Price" className="p-2 border rounded" required />
                            <input name="imageUrl" value={newProduct.imageUrl} onChange={handleInputChange} placeholder="Image URL" className="p-2 border rounded" required />
                            <input name="extraImageUrl" value={newProduct.extraImageUrl || ''} onChange={handleInputChange} placeholder="Extra Image URL (Optional)" className="p-2 border rounded" />
                            <input name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" className="p-2 border rounded" required />
                            <select name="category" value={newProduct.category} onChange={handleInputChange} className="p-2 border rounded" required>
                                {Object.values(ProductCategory).map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" className="p-2 border rounded col-span-1 md:col-span-2" required />
                            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition col-span-1 md:col-span-2">Save Product</button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 flex items-center space-x-4">
                                        <div className="flex -space-x-4">
                                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-md border-2 border-white"/>
                                            {p.extraImageUrl && <img src={p.extraImageUrl} alt={`${p.name} extra`} className="w-12 h-12 object-cover rounded-md border-2 border-white"/>}
                                        </div>
                                        <span>{p.name}</span>
                                    </td>
                                    <td className="p-4">₹{p.price.toFixed(2)}</td>
                                    <td className="p-4">{p.stock}</td>
                                    <td className="p-4">
                                        <button onClick={() => setProductToDelete(p)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                title="Confirm Product Deletion"
            >
                {productToDelete && (
                    <div>
                        <p className="text-gray-700">
                            Are you sure you want to delete the product: <span className="font-semibold">{productToDelete.name}</span>?
                        </p>
                        <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OwnerDashboard;
