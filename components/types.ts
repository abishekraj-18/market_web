export enum ProductCategory {
  Stationery = 'Stationery',
  Grocery = 'Grocery',
  Fruit = 'Fruit',
  Vegetable = 'Vegetable',
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  extraImageUrl?: string;
  description: string;
  stock: number;
  category: ProductCategory;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export enum PaymentMethod {
  UPI = 'UPI',
  COD = 'Cash on Delivery',
}

export enum OrderStatus {
  Pending = 'Pending',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface Order {
  id: number;
  customerDetails: ShippingAddress;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  orderDate: string;
  status: OrderStatus;
}