import { useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Package, CreditCard, Heart, LogOut } from 'lucide-react';

// UI Components
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

export default function Account() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold mb-3">Account Navigation</h2>
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/account/profile" 
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
                  location.pathname === '/account/profile' ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link 
                to="/account/orders" 
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
                  location.pathname === '/account/orders' ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Link>
              <Link 
                to="/account/payment-methods" 
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
                  location.pathname === '/account/payment-methods' ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Link>
              <Link 
                to="/account/wishlist" 
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
                  location.pathname === '/account/wishlist' ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-accent text-destructive hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
          
          {user?.isAdmin && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Admin</h2>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 
