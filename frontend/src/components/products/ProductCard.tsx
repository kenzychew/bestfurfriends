import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCartStore, CartItem } from '../../stores/cartStore';
import { formatPrice } from '../../utils/formatters';

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

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  variant = 'default'
}) => {
  const { addItem } = useCartStore();
  const isHorizontal = variant === 'horizontal';
  const isOnSale = product.discountPrice !== undefined;
  const isOutOfStock = product.stockCount <= 0;
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: isOnSale && product.discountPrice ? product.discountPrice : product.price,
      image: product.image,
      quantity: 1
    };
    
    addItem(cartItem);
  };

  return (
    <Card className={`overflow-hidden group ${isHorizontal ? 'flex' : 'flex-col'}`}>
      <div className={`relative ${isHorizontal ? 'w-1/3' : 'w-full aspect-square'}`}>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <Badge variant="destructive" className="px-2 py-1">
              Sale
            </Badge>
          )}
          
          {product.isNew && (
            <Badge variant="secondary" className="px-2 py-1">
              New
            </Badge>
          )}
          
          {product.isFeatured && (
            <Badge variant="outline" className="px-2 py-1 bg-white">
              Featured
            </Badge>
          )}
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-8 h-8"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      
      <div className={`flex flex-col ${isHorizontal ? 'flex-1 p-4' : ''}`}>
        <CardContent className={`p-4 ${isHorizontal ? 'pb-2' : ''}`}>
          <div className="mb-1 text-sm text-muted-foreground">
            {product.category}
          </div>
          
          <Link to={`/products/${product.id}`} className="hover:underline">
            <h3 className="font-medium text-base line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-1">
            {isOnSale ? (
              <>
                <span className="font-medium text-destructive">
                  {formatPrice(product.discountPrice as number)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-medium">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {isHorizontal && product.rating && (
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < Math.floor(product.rating as number) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs text-muted-foreground">
                ({product.rating})
              </span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard; 
