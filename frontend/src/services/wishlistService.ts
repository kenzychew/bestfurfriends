import api from './api';
import { Product } from './productService';

export interface WishlistItem {
  wishlist_item_id: number;
  user_id: number;
  product_id: number;
  added_at: string;
  product: Product;
}

export interface Wishlist {
  items: WishlistItem[];
}

const wishlistService = {
  // Get user's wishlist
  getWishlist: async (): Promise<Wishlist> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (productId: number): Promise<Wishlist> => {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: number): Promise<Wishlist> => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Check if item is in wishlist
  isInWishlist: async (productId: number): Promise<boolean> => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.items.some(item => item.product_id === productId);
    } catch {
      // If there's an error (like user not logged in), item is not in wishlist
      return false;
    }
  },
};

export default wishlistService; 
