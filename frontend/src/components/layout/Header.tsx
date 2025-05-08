import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import CartDrawer from '../cart/CartDrawer';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </span>
            <span className="font-bold text-xl hidden sm:inline-block">BestFurFriends</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink to="/" className={({ isActive }) => 
                  `${navigationMenuTriggerStyle()} ${isActive ? 'bg-accent text-accent-foreground' : ''}`
                }>
                  Home
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                    <li className="col-span-2">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Products
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse our complete collection of premium dog products
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/shop?category=food" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Food</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Premium nutrition for your furry friend
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/shop?category=toys" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Toys</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Fun and durable toys for playtime
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/shop?category=accessories" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Accessories</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Collars, leashes, and more for your pup
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/shop?category=grooming" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Grooming</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Keep your dog looking and feeling their best
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/about" className={({ isActive }) => 
                  `${navigationMenuTriggerStyle()} ${isActive ? 'bg-accent text-accent-foreground' : ''}`
                }>
                  About
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/contact" className={({ isActive }) => 
                  `${navigationMenuTriggerStyle()} ${isActive ? 'bg-accent text-accent-foreground' : ''}`
                }>
                  Contact
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Section: Search, Cart, User */}
          <div className="flex items-center space-x-4">
            {/* Search Form - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] lg:w-[300px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="icon"
                type="submit"
                className="absolute right-0"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <Button 
              onClick={openCart} 
              variant="ghost" 
              size="icon"
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/orders">Orders</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                      <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">B</span>
                      </span>
                      <span className="font-bold text-xl">BestFurFriends</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mt-6">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        type="submit"
                        className="absolute right-0 top-0"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="mt-6 flex-1">
                    <ul className="space-y-4">
                      <li>
                        <NavLink
                          to="/"
                          className={({ isActive }) => 
                            `block py-2 ${isActive ? 'font-bold text-primary' : ''}`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Home
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/shop"
                          className={({ isActive }) => 
                            `block py-2 ${isActive ? 'font-bold text-primary' : ''}`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Shop
                        </NavLink>
                        
                        <ul className="pl-4 mt-2 space-y-2">
                          <li>
                            <Link 
                              to="/shop?category=food" 
                              className="block py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Food
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/shop?category=toys" 
                              className="block py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Toys
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/shop?category=accessories" 
                              className="block py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Accessories
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/shop?category=grooming" 
                              className="block py-1 text-muted-foreground hover:text-foreground"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Grooming
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <NavLink
                          to="/about"
                          className={({ isActive }) => 
                            `block py-2 ${isActive ? 'font-bold text-primary' : ''}`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          About
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/contact"
                          className={({ isActive }) => 
                            `block py-2 ${isActive ? 'font-bold text-primary' : ''}`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Contact
                        </NavLink>
                      </li>
                    </ul>
                  </nav>

                  {/* Mobile Auth Links */}
                  <div className="mt-6 border-t pt-6">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <p className="font-medium">My Account</p>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/account/profile" 
                              className="block py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/account/orders" 
                              className="block py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Orders
                            </Link>
                          </li>
                          {user?.isAdmin && (
                            <li>
                              <Link 
                                to="/admin" 
                                className="block py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Admin Dashboard
                              </Link>
                            </li>
                          )}
                          <li>
                            <button 
                              onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                              }}
                              className="block py-1 text-red-500"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <Button asChild>
                          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                            Register
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Shopping Cart Drawer */}
      <CartDrawer />
    </header>
  );
} 
