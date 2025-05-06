import api from './api';
import { Product } from './productService';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface CreateOrderData {
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

const orderService = {
  // Create a new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get order details by ID
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get current user's order history
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/users/orders');
    return response.data;
  },

  // Cancel an order
  cancelOrder: async (orderId: number): Promise<Order> => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderService; 
