import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Separator } from "../components/ui/separator";
import { Search } from "lucide-react";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query parameters
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  
  // Local state for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  
  // Fetch products and categories
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    category_id: categoryParam ? parseInt(categoryParam) : undefined,
    min_price: priceRange[0],
    max_price: priceRange[1],
    search: searchQuery,
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { addToCart, isInCart, getItemQuantity, updateItemQuantity } = useCart();
  
  // Update URL when search term changes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update search params
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };
  
  // Set category filter
  const handleCategoryChange = (categoryId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="all-categories" 
                    checked={!categoryParam}
                    onCheckedChange={() => handleCategoryChange(null)}
                  />
                  <Label 
                    htmlFor="all-categories" 
                    className="ml-2 cursor-pointer"
                  >
                    All Categories
                  </Label>
                </div>
                
                {isLoadingCategories ? (
                  <div>Loading categories...</div>
                ) : (
                  Array.isArray(categories) ? (
                    categories.map((category) => (
                      <div key={`cat-${category.id}`} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={categoryParam === (category.id?.toString() || '')}
                          onCheckedChange={() => handleCategoryChange(category.id?.toString() || '')}
                        />
                        <Label 
                          htmlFor={`category-${category.id}`} 
                          className="ml-2 cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div>No categories available</div>
                  )
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-6">
                <Slider 
                  defaultValue={[0, 200]} 
                  max={200} 
                  step={5}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex items-center justify-between">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('min_price', priceRange[0].toString());
                    newParams.set('max_price', priceRange[1].toString());
                    setSearchParams(newParams);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Search and sort */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
          
          {/* Products grid */}
          {isLoadingProducts ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-lg">Loading products...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">
                {categoryParam && Array.isArray(categories) && categories.find(c => c.id?.toString() === categoryParam)?.name 
                  ? `${categories.find(c => c.id?.toString() === categoryParam)?.name} Products`
                  : "All Products"}
                {searchQuery && ` - Search results for "${searchQuery}"`}
              </h2>
              
              {productsData?.products?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => {
                      setSearchParams({});
                      setPriceRange([0, 200]);
                      setSearchTerm('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsData?.products.map((product) => (
                    <Card key={product.id} className="flex flex-col h-full">
                      <div className="relative overflow-hidden aspect-square rounded-t-lg">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        {product.discount_price && (
                          <Badge className="absolute top-2 right-2 bg-primary">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <CardDescription>
                          {product.category?.name || ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-grow">
                        <div className="flex items-center mb-2">
                          {product.discount_price ? (
                            <>
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(product.discount_price)}
                              </span>
                              <span className="ml-2 text-sm line-through text-muted-foreground">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        {isInCart(product.id) ? (
                          <div className="flex items-center w-full">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newQty = getItemQuantity(product.id) - 1;
                                updateItemQuantity(product.id, newQty);
                              }}
                              disabled={getItemQuantity(product.id) <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-4 text-center w-8">
                              {getItemQuantity(product.id)}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newQty = getItemQuantity(product.id) + 1;
                                updateItemQuantity(product.id, newQty);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full" 
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {productsData?.total_pages && productsData.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: productsData.total_pages }, (_, i) => i + 1).map((page) => (
                      <Button 
                        key={page}
                        variant={page === productsData.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('page', page.toString());
                          setSearchParams(newParams);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
