import api from './api';

// Type def for how categories might come from the backend API
interface BackendCategoryResponse {
  id?: number;
  category_id?: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  category_id: number;
  image_url: string;
  weight?: number;
  weight_unit?: string;
  ingredients?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  average_rating?: number;
  review_count?: number;
}

export interface ProductFilterParams {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
  search?: string;
  page?: number;
  limit?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

// Define API response format based on backend structure
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const productService = {
  // Get all products with optional filtering
  getProducts: async (params?: ProductFilterParams): Promise<{
    products: Product[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get<ApiResponse<{
      products: Product[];
      pagination: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
      };
    }>>('/products', { params });
    
    // Extract data from the response
    const { products, pagination } = response.data.data;
    
    return {
      products,
      total: pagination.totalItems,
      page: pagination.currentPage,
      total_pages: pagination.totalPages
    };
  },

  // Get a single product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured');
    return response.data.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/search', { params: { q: query } });
    return response.data.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      console.log('Fetching categories...');
      const response = await api.get<ApiResponse<BackendCategoryResponse[]>>('/categories');
      console.log('Categories API raw response:', response);
      
      // Extract data from the response structure
      if (response.data && response.data.success && response.data.data) {
        console.log('Categories data extracted:', response.data.data);
        
        // Map the categories to ensure consistent structure
        return response.data.data.map(category => ({
          id: category.id || category.category_id || 0, // Handle both id formats with fallback
          name: category.name,
          description: category.description,
          image_url: category.image_url
        }));
      }
      
      console.log('No valid data found in response, returning empty array');
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get products in a category
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get<ApiResponse<{
      category: Category;
      products: Product[];
      pagination: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
      };
    }>>(`/categories/${categoryId}/products`);
    return response.data.data.products;
  },

  // Get reviews for a product
  getProductReviews: async (productId: number): Promise<Review[]> => {
    const response = await api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`);
    return response.data.data;
  },

  // Add a review for a product
  addReview: async (
    productId: number,
    reviewData: { rating: number; comment?: string }
  ): Promise<Review> => {
    const response = await api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, reviewData);
    return response.data.data;
  },

  // Delete a review
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};

export default productService; 
