import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ChevronDown, ChevronUp, Package, ExternalLink } from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Badge } from "../ui/badge";

// Mocked order data - in a real app, this would come from the API
const mockOrders = [
  {
    id: "1001",
    date: "2023-06-15T10:30:00Z",
    total: 79.96,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "Premium Organic Dog Food",
        price: 39.99,
        quantity: 2,
        image: "/images/category-food.jpg",
      },
    ],
    tracking_number: "TRK123456789",
  },
  {
    id: "1002",
    date: "2023-07-22T14:20:00Z",
    total: 64.97,
    status: "shipped",
    items: [
      {
        id: 2,
        name: "Durable Chew Toy",
        price: 14.99,
        quantity: 1,
        image: "/images/category-toys.jpg",
      },
      {
        id: 3,
        name: "Adjustable Collar",
        price: 19.99,
        quantity: 1,
        image: "/images/category-accessories.jpg",
      },
      {
        id: 4,
        name: "Grooming Brush",
        price: 29.99,
        quantity: 1,
        image: "/images/category-grooming.jpg",
      },
    ],
    tracking_number: "TRK987654321",
  },
  {
    id: "1003",
    date: "2023-08-03T09:15:00Z",
    total: 94.95,
    status: "processing",
    items: [
      {
        id: 5,
        name: "Orthopedic Dog Bed",
        price: 94.95,
        quantity: 1,
        image: "/images/category-accessories.jpg",
      },
    ],
  },
];

// Status badge colors
const statusColors = {
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-amber-500/10 text-amber-500",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  // Simulate API fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            You haven't placed any orders yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              Explore our products and place your first order today!
            </p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View and track your previous orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <Collapsible
              key={order.id}
              open={expandedOrders.includes(order.id)}
              onOpenChange={() => toggleOrderExpanded(order.id)}
              className="border rounded-lg"
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <Badge
                        className={`${
                          statusColors[order.status as keyof typeof statusColors]
                        } capitalize`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expandedOrders.includes(order.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle order details</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <Separator />
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col flex-1 justify-center">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.tracking_number && (
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            Tracking Number:
                          </p>
                          <p className="text-sm">{order.tracking_number}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://example.com/track/${order.tracking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Track Order
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/order/confirmation/${order.id}`}>
                        View Order Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
