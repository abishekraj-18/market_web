import React from 'react';
import { Order, OrderStatus } from '../types';

interface CustomerOrderHistoryProps {
    orders: Order[];
}

const CustomerOrderHistory: React.FC<CustomerOrderHistoryProps> = ({ orders }) => {

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800';
            case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
            case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>You have no past orders.</p>
                <p className="text-sm mt-2">When you place an order, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                            <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
                            <p className="text-sm text-gray-500">
                                Placed on {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="mb-4">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.quantity} &times; ₹{item.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-1">Shipping Address</h5>
                            <address className="not-italic text-gray-600">
                                {order.customerDetails.fullName}<br />
                                {order.customerDetails.addressLine1}<br />
                                {order.customerDetails.city}, {order.customerDetails.state} {order.customerDetails.zipCode}
                            </address>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-1">Order Summary</h5>
                            <dl className="space-y-1 text-gray-600">
                                <div className="flex justify-between">
                                    <dt>Payment Method:</dt>
                                    <dd>{order.paymentMethod}</dd>
                                </div>
                                <div className="flex justify-between font-bold text-gray-800">
                                    <dt>Total:</dt>
                                    <dd>₹{order.total.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerOrderHistory;