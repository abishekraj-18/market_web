import React, { useState } from 'react';
import { Product, ShippingAddress, PaymentMethod, Order, CartItem } from '../types';

interface CheckoutFormProps {
    product: Product;
    onClose: () => void;
    onPlaceOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => void;
}

// Define InputField as a standalone component outside of CheckoutForm
const InputField: React.FC<{ 
    name: keyof ShippingAddress, 
    label: string, 
    placeholder: string, 
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string, 
    required?: boolean 
}> = ({ name, label, placeholder, value, onChange, type = 'text', required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-gray-100 focus:bg-white transition-colors text-black"
        />
    </div>
);

const CheckoutForm: React.FC<CheckoutFormProps> = ({ product, onClose, onPlaceOrder }) => {
    const [quantity, setQuantity] = useState(1);
    const [isShowingQrCode, setIsShowingQrCode] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: '',
        addressLine1: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
    
    const handleIncreaseQuantity = () => {
        setQuantity(prev => Math.min(prev + 1, product.stock));
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const total = product.price * quantity;

    const finalizeOrder = () => {
        const itemToOrder: CartItem = { ...product, quantity };
        onPlaceOrder({
            customerDetails: shippingAddress,
            items: [itemToOrder],
            total: total,
            paymentMethod: paymentMethod,
        });
        alert(`Thank you for your order! Your order for ${quantity} x ${product.name} has been placed.`);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMethod === PaymentMethod.UPI) {
            setIsShowingQrCode(true);
        } else {
            finalizeOrder();
        }
    };
    
    if (isShowingQrCode) {
        const upiQrUrl = "https://ibb.co/wND1h7NM";
        
        return (
            <div className="text-center p-4">
                <h3 className="text-lg font-semibold text-gray-800">Scan to Pay with UPI</h3>
                <p className="text-sm text-gray-600 mt-1">Scan the QR code below with your favorite UPI app.</p>
                <div className="flex justify-center my-6">
                    <img src={upiQrUrl} alt="UPI QR Code" className="rounded-lg shadow-md border w-64 h-64 object-contain" />
                </div>
                <p className="text-2xl font-bold text-sky-600">Total: ₹{total.toFixed(2)}</p>
                <div className="mt-6 space-y-3">
                    <button
                        onClick={finalizeOrder}
                        className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                        Complete Order
                    </button>
                     <button
                        onClick={() => setIsShowingQrCode(false)}
                        className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Back to Form
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-4">
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-4">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-600">₹{product.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md self-end sm:self-center">
                        <button type="button" onClick={handleDecreaseQuantity} className="px-3 py-1 text-gray-600 font-bold text-lg disabled:opacity-50" disabled={quantity <= 1}>-</button>
                        <p className="px-4 text-center w-12 font-medium">{quantity}</p>
                        <button type="button" onClick={handleIncreaseQuantity} className="px-3 py-1 text-gray-600 font-bold text-lg disabled:opacity-50" disabled={quantity >= product.stock}>+</button>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-lg text-sky-700">1. Shipping Address</h4>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <InputField name="fullName" label="Full Name" placeholder="John Doe" value={shippingAddress.fullName} onChange={handleInputChange} />
                    </div>
                    <div className="sm:col-span-2">
                         <InputField name="addressLine1" label="Address" placeholder="123 Main St" value={shippingAddress.addressLine1} onChange={handleInputChange} />
                    </div>
                    <InputField name="city" label="City" placeholder="San Francisco" value={shippingAddress.city} onChange={handleInputChange} />
                    <InputField name="state" label="State / Province" placeholder="CA" value={shippingAddress.state} onChange={handleInputChange} />
                    <InputField name="zipCode" label="ZIP / Postal Code" placeholder="94103" value={shippingAddress.zipCode} onChange={handleInputChange} />
                    <InputField name="phone" label="Phone Number" placeholder="(123) 456-7890" type="tel" value={shippingAddress.phone} onChange={handleInputChange} />
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-lg text-sky-700">2. Payment Method</h4>
                <div className="mt-4 space-y-3">
                    <div
                        onClick={() => setPaymentMethod(PaymentMethod.UPI)}
                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === PaymentMethod.UPI ? 'border-sky-600 ring-2 ring-sky-500' : 'border-gray-300'}`}
                    >
                        <input type="radio" name="paymentMethod" value={PaymentMethod.UPI} checked={paymentMethod === PaymentMethod.UPI} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500" readOnly/>
                        <label className="ml-3 block text-sm font-medium text-gray-700">UPI</label>
                    </div>
                     <div
                        onClick={() => setPaymentMethod(PaymentMethod.COD)}
                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === PaymentMethod.COD ? 'border-sky-600 ring-2 ring-sky-500' : 'border-gray-300'}`}
                    >
                        <input type="radio" name="paymentMethod" value={PaymentMethod.COD} checked={paymentMethod === PaymentMethod.COD} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500" readOnly/>
                        <label className="ml-3 block text-sm font-medium text-gray-700">Cash on Delivery</label>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                >
                    Place Order (₹{total.toFixed(2)})
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;