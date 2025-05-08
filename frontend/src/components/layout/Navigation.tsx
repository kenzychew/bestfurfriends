import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  User, 
  X,
  ChevronDown,
  Heart,
  ShoppingBag 
} from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCartStore } from '../../stores/cartStore';
import CartDrawer from '../cart/CartDrawer';
import { cn } from '../../lib/utils';

const categories = [
  { name: 'Dogs', href: '/categories/dogs', subcategories: ['Food', 'Treats', 'Toys', 'Beds', 'Clothing'] },
  { name: 'Cats', href: '/categories/cats', subcategories: ['Food', 'Treats', 'Toys', 'Beds', 'Litter'] },
  { name: 'Small Pets', href: '/categories/small-pets', subcategories: ['Food', 'Cages', 'Accessories'] },
  { name: 'Birds', href: '/categories/birds', subcategories: ['Food', 'Cages', 'Toys'] },
  { name: 'Fish', href: '/categories/fish', subcategories: ['Food', 'Tanks', 'Decorations'] },
];

interface NavigationProps {
  transparent?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ transparent = false }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        transparent 
          ? "bg-transparent text-white" 
          : "bg-background border-b shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="BestFurFriends" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-bold">BestFurFriends</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.name} className="mb-3">
                          <NavigationMenuLink asChild>
                            <Link
                              to={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                              <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.subcategories.join(', ')}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/products">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      All Products
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Search */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 p-3 bg-background rounded-md shadow-lg">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search products..." 
                      className="flex-1" 
                      autoFocus
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setIsSearchOpen(false)}
                      aria-label="Close search"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              aria-label="Wishlist"
            >
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Account */}
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              aria-label="Account"
            >
              <Link to="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Cart */}
            <CartDrawer />
            
            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <Link 
                    to="/" 
                    className="text-lg font-medium px-2 py-2 hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <div className="border-t pt-4">
                    <p className="px-2 text-sm font-medium text-muted-foreground mb-2">
                      Shop By Category
                    </p>
                    {categories.map((category) => (
                      <div key={category.name} className="mb-2">
                        <Link 
                          to={category.href}
                          className="flex items-center justify-between px-2 py-2 hover:bg-accent rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>{category.name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <Link 
                      to="/products" 
                      className="px-2 py-2 hover:bg-accent rounded-md block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    <Link 
                      to="/about" 
                      className="px-2 py-2 hover:bg-accent rounded-md block mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link 
                      to="/contact" 
                      className="px-2 py-2 hover:bg-accent rounded-md block mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation; 
