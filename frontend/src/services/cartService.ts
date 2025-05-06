import api from './api';
import { Product } from './productService';

export interface CartItem {
  cart_item_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number = 1): Promise<Cart> => {
    const response = await api.post('/cart', { product_id: productId, quantity });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: number): Promise<Cart> => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (): Promise<{ message: string }> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

export default cartService; 
