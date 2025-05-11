import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

// UI Components
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

export default function Cart() {
  const { items, total, removeFromCart, updateItemQuantity } = useCart();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-muted bg-background">
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-12 font-medium text-muted-foreground text-sm mb-4 pb-4 border-b">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6 flex gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        {item.discountPrice && (
                          <Badge className="absolute top-0 right-0 bg-primary text-xs">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link 
                          to={`/products/${item.id}`} 
                          className="font-medium hover:underline line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      {item.discountPrice ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatPrice(item.discountPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateItemQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => {
                            updateItemQuantity(item.id, item.quantity + 1);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="font-medium">
                        {formatPrice(
                          (item.discountPrice || item.price) * item.quantity
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-muted bg-background sticky top-24">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-center mt-4">
                  <Button variant="link" asChild className="text-sm">
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
