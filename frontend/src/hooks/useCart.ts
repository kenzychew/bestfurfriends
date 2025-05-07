import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  toggleCart,
  setCartOpen,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectIsCartOpen
} from '../store/slices/cartSlice';
import { CartItem } from '../store/slices/cartSlice';
import { Product } from '../services/productService';

export const useCart = () => {
  const dispatch = useDispatch();
  
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isOpen = useSelector(selectIsCartOpen);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discount_price,
      image: product.image_url,
      quantity
    };
    dispatch(addItem(cartItem));
  }, [dispatch]);

  const removeFromCart = useCallback((productId: number) => {
    dispatch(removeItem(productId));
  }, [dispatch]);

  const updateItemQuantity = useCallback((productId: number, quantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  }, [dispatch]);

  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const openCart = useCallback(() => {
    dispatch(setCartOpen(true));
  }, [dispatch]);

  const closeCart = useCallback(() => {
    dispatch(setCartOpen(false));
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const isInCart = useCallback((productId: number) => {
    return items.some((item: CartItem) => item.id === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = items.find((item: CartItem) => item.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  return {
    items,
    total,
    itemCount,
    isOpen,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    emptyCart,
    openCart,
    closeCart,
    toggle,
    isInCart,
    getItemQuantity
  };
}; 
