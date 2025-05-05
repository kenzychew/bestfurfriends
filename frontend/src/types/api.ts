export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilterParams extends PaginationParams {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
} 
