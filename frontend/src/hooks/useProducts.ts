import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService, { ProductFilterParams, Category } from '../services/productService';

// Backend category response might use category_id instead of id
interface BackendCategory extends Omit<Category, 'id'> {
  id?: number;
  category_id?: number;
}

export const useProducts = (params?: ProductFilterParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProduct(productId),
    enabled: !!productId,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getFeaturedProducts(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productService.getCategories();
      console.log('Categories API response:', response);
      
      // Ensure each category has id and name properties
      if (Array.isArray(response)) {
        return response.map((category: BackendCategory) => ({
          id: category.id || category.category_id, // Handle different property names
          name: category.name,
          description: category.description,
          image_url: category.image_url
        }));
      }
      
      return response;
    },
  });
};

export const useProductsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['productsByCategory', categoryId],
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useProductReviews = (productId: number) => {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: () => productService.getProductReviews(productId),
    enabled: !!productId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      productId, 
      reviewData 
    }: { 
      productId: number; 
      reviewData: { rating: number; comment?: string } 
    }) => {
      return productService.addReview(productId, reviewData);
    },
    onSuccess: (_, variables) => {
      // Invalidate the product reviews query to refetch after adding a new review
      queryClient.invalidateQueries({
        queryKey: ['productReviews', variables.productId],
      });
      // Also invalidate the single product query since average rating might change
      queryClient.invalidateQueries({
        queryKey: ['product', variables.productId],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewId: number) => {
      return productService.deleteReview(reviewId);
    },
    onSuccess: () => {
      // We need a bit more context to invalidate the specific product reviews
      // This would typically involve passing more info like productId
      queryClient.invalidateQueries({
        queryKey: ['productReviews'],
      });
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () => productService.searchProducts(query),
    enabled: query.length > 2, // Only search when query is more than 2 characters
  });
}; 
