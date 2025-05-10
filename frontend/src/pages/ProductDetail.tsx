import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProductReviews } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { Star, ShoppingCart, Check, Info } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  
  // Get product data
  const { data: product, isLoading, error } = useProduct(productId ? parseInt(productId) : 0);
  const { data: reviews } = useProductReviews(productId ? parseInt(productId) : 0);
  const { addToCart, isInCart, getItemQuantity, updateItemQuantity } = useCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>
              Sorry, the product you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <div className="bg-muted rounded-lg overflow-hidden aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.discount_price && (
            <Badge className="absolute top-4 right-4 bg-primary">
              Sale
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.category?.name}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(product.average_rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.review_count
                ? `${product.review_count} ${
                    product.review_count === 1 ? "review" : "reviews"
                  }`
                : "No reviews yet"}
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            {product.discount_price ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.discount_price)}
                </span>
                <span className="text-xl line-through text-muted-foreground">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          <Separator />

          {isInCart(product.id) ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none"
                  onClick={() => {
                    const newQty = getItemQuantity(product.id) - 1;
                    updateItemQuantity(product.id, newQty);
                  }}
                  disabled={getItemQuantity(product.id) <= 1}
                >
                  -
                </Button>
                <span className="w-10 text-center">
                  {getItemQuantity(product.id)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none"
                  onClick={() => {
                    const newQty = getItemQuantity(product.id) + 1;
                    updateItemQuantity(product.id, newQty);
                  }}
                >
                  +
                </Button>
              </div>
              <div className="flex-1">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/cart">
                    <Check className="mr-2 h-4 w-4" />
                    View in Cart
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="p-4">
            <div className="grid gap-4">
              {product.weight && (
                <div className="grid grid-cols-2 border-b pb-2">
                  <span className="font-medium">Weight:</span>
                  <span>
                    {product.weight} {product.weight_unit || "kg"}
                  </span>
                </div>
              )}
              {product.ingredients && (
                <div className="grid grid-cols-2 border-b pb-2">
                  <span className="font-medium">Ingredients:</span>
                  <span>{product.ingredients}</span>
                </div>
              )}
              <div className="grid grid-cols-2 border-b pb-2">
                <span className="font-medium">Category:</span>
                <span>{product.category?.name || "Uncategorized"}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium">
                          {review.user
                            ? `${review.user.first_name} ${review.user.last_name}`
                            : "Anonymous"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to leave a review!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
