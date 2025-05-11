import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { checkoutSchema, type CheckoutFormValues } from '../lib/validators';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';

// UI Components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, total, emptyCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('details'); // details, payment, confirmation
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      shippingAddress: '',
      billingAddress: '',
      paymentMethod: 'credit_card',
      sameAsBilling: true,
    },
  });
  
  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Watch sameAsBilling field to update billingAddress
  const sameAsBilling = form.watch('sameAsBilling');
  const shippingAddress = form.watch('shippingAddress');
  
  useEffect(() => {
    if (sameAsBilling) {
      form.setValue('billingAddress', shippingAddress);
    }
  }, [sameAsBilling, shippingAddress, form]);
  
  const handleSubmit = async (data: CheckoutFormValues) => {
    if (step === 'details') {
      setStep('payment');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order creation with setTimeout
    setTimeout(() => {
      console.log('Order data:', {
        ...data,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
        })),
        total_amount: total,
      });
      
      // Success - clear cart and show confirmation
      setIsSubmitting(false);
      setStep('confirmation');
      emptyCart();
      
      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate('/order/confirmation/123'); // Replace with actual order ID
      }, 3000);
    }, 2000);
  };
  
  if (step === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been received and is now being processed.
          </p>
          <p className="font-medium mb-8">
            You will receive an email confirmation shortly.
          </p>
          <Button asChild>
            <a href="/">Return to Home Page</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {step === 'details' ? (
                <>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State, Zip" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="sameAsBilling"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Billing address same as shipping address
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {!sameAsBilling && (
                      <FormField
                        control={form.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, City, State, Zip" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Continue to Payment
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="credit_card" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Credit / Debit Card
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="paypal" />
                                </FormControl>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('paymentMethod') === 'credit_card' && (
                      <div className="space-y-4 border p-4 rounded-md">
                        <div>
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep('details')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
        
        <div>
          <div className="rounded-lg border border-muted bg-background sticky top-24">
            <div className="p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(
                              (item.discountPrice || item.price) * item.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Tax (estimated)</span>
                    <span>{formatPrice(total * 0.07)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total + (total * 0.07))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
