import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Slider } from '../../components/ui/slider';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Category } from '../../types/product';
import { ProductFilterParams } from '../../types/api';
import { getCategories } from '../../services/productService';

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilterParams) => void;
  initialFilters?: ProductFilterParams;
}

const ProductFilter = ({ onFilterChange, initialFilters = {} }: ProductFilterProps) => {
  const [filters, setFilters] = useState<ProductFilterParams>({
    category_id: initialFilters.category_id,
    min_price: initialFilters.min_price || 0,
    max_price: initialFilters.max_price || 200,
    sort_by: initialFilters.sort_by || 'created_at',
    sort_order: initialFilters.sort_order || 'desc',
    search: initialFilters.search || '',
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesData || [];

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      min_price: value[0],
      max_price: value[1],
    });
  };

  const handleCategoryChange = (categoryId: number) => {
    setFilters({
      ...filters,
      category_id: filters.category_id === categoryId ? undefined : categoryId,
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters({
      ...filters,
      sort_by: sortBy as 'price' | 'name' | 'created_at',
      sort_order: sortOrder as 'asc' | 'desc',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters: ProductFilterParams = {
      category_id: undefined,
      min_price: 0,
      max_price: 200,
      sort_by: 'created_at',
      sort_order: 'desc',
      search: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filter Products</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">Search</Label>
            <Input
              id="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-2 block">Sort By</Label>
            <Select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Price Range (SGD)</Label>
            <div className="pt-4 px-2">
              <Slider
                defaultValue={[filters.min_price || 0, filters.max_price || 200]}
                max={200}
                step={1}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>SGD {filters.min_price}</span>
                <span>SGD {filters.max_price}</span>
              </div>
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <Label className="mb-2 block">Categories</Label>
              <div className="space-y-2">
                {categories.map((category: Category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.category_id === category.id}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-4">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter; 
 