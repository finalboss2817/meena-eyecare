
import type { CartItem } from '../types';
import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

const getCart = (): CartItem[] => {
  return storageService.getItem<CartItem[]>(STORAGE_KEYS.CART) ?? [];
};

const saveCart = (cart: CartItem[]) => {
  storageService.setItem(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new Event('storage'));
};

export const cartService = {
  getCart,
  
  addToCart(productId: string, quantity: number = 1): void {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCart(cart);
  },

  removeFromCart(productId: string): void {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
  },

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
  },

  clearCart(): void {
    saveCart([]);
  },

  getCartItemCount(): number {
    return getCart().reduce((count, item) => count + item.quantity, 0);
  },
};
