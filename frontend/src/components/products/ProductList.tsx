import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types from ProductCard.tsx for consistency
interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  stockCount: number;
}

interface ProductListProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  itemsPerPage?: number;
  showPagination?: boolean;
  variant?: 'grid' | 'carousel';
  cardVariant?: 'default' | 'horizontal';
  columns?: 2 | 3 | 4;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  title,
  subtitle,
  itemsPerPage = 8,
  showPagination = true,
  variant = 'grid',
  cardVariant = 'default',
  columns = 4
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Calculate products to display for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  // Determine column classes based on the columns prop
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };
  
  return (
    <div className="w-full">
      {/* Optional Header Section */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      
      {/* Products Grid or Carousel */}
      {variant === 'grid' ? (
        <div className={`grid ${columnClasses[columns]} gap-4 md:gap-6`}>
          {currentProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              variant={cardVariant}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto pb-4 flex gap-4 snap-x">
            {currentProducts.map(product => (
              <div 
                key={product.id} 
                className="min-w-[280px] max-w-[350px] snap-start"
              >
                <ProductCard 
                  product={product}
                  variant={cardVariant}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;
              
              return (
                <Button
                  key={pageNumber}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductList; 
