import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard, Calendar } from 'lucide-react';

// UI Components
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // In a real app, we would fetch order details from the backend
  // Here we'll use a mock order
  const order = {
    id: orderId || '123',
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    total: '$127.95',
    items: [
      {
        id: 1,
        name: 'Premium Organic Dog Food',
        price: '$39.99',
        quantity: 2,
        image: '/images/category-food.jpg'
      },
      {
        id: 2,
        name: 'Durable Chew Toy',
        price: '$14.99',
        quantity: 1,
        image: '/images/category-toys.jpg'
      },
      {
        id: 3,
        name: 'Adjustable Collar',
        price: '$19.99',
        quantity: 1,
        image: '/images/category-accessories.jpg'
      }
    ],
    shipping: {
      address: '123 Main St, Anytown, USA 12345',
      method: 'Standard Shipping',
      estimated_delivery: '3-5 business days'
    },
    payment: {
      method: 'Credit Card',
      last4: '1234'
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Thank you for your purchase. Your order has been received and is now being processed.
            You will receive an email confirmation shortly.
          </p>
          <div className="text-sm bg-muted px-4 py-2 rounded-md">
            Order Number: <span className="font-medium">{order.id}</span>
          </div>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                Placed on {order.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className="font-medium text-sm">{item.price}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>{`$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}`}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$114.96</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Tax</span>
                    <span>$12.99</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Truck className="mr-2 h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{order.shipping.address}</p>
                </div>
                <div>
                  <p className="font-medium">Method</p>
                  <p className="text-sm text-muted-foreground">{order.shipping.method}</p>
                </div>
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">{order.shipping.estimated_delivery}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">{order.payment.method}</p>
                </div>
                {order.payment.last4 && (
                  <div>
                    <p className="font-medium">Card ending in</p>
                    <p className="text-sm text-muted-foreground">•••• {order.payment.last4}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Billing Date</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-4 justify-center mt-6">
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            {/* In a real app, this would link to the user's orders page */}
            <Button variant="outline" asChild>
              <Link to="/account/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
