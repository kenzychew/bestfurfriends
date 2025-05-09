import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const CartDrawer = () => {
  const { 
    items, 
    itemCount,
    total,
    updateItemQuantity,
    removeFromCart,
    emptyCart,
    isOpen,
    closeCart
  } = useCart();

  // Calculate additional values
  const subtotal = total;
  const shipping = items.length > 0 ? 599 : 0; // $5.99 shipping, free if cart is empty
  const tax = Math.round(subtotal * 0.07); // 7% tax
  const orderTotal = subtotal + shipping + tax;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild onClick={closeCart}>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 mt-4">
              {items.map((item) => (
                <div key={item.id} className="flex py-4 border-b">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="text-sm font-semibold">
                        <Link to={`/products/${item.id}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4">
                        {item.discountPrice 
                          ? formatPrice(item.discountPrice) 
                          : formatPrice(item.price)
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p>Subtotal</p>
                  <p>{formatPrice(subtotal)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>Shipping</p>
                  <p>{shipping === 0 ? 'Free' : formatPrice(shipping)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>Tax (7%)</p>
                  <p>{formatPrice(tax)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>{formatPrice(orderTotal)}</p>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={emptyCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="pt-4">
                <Button variant="link" asChild className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer; 
