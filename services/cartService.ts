
import type { CartItem, PrescriptionData } from '../types';
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
  
  addToCart(productId: string, quantity: number = 1, prescription?: PrescriptionData): void {
    const cart = getCart();
    // If adding a prescription, we treat it as a unique line item usually, 
    // but for this prototype, if there is a prescription, we won't merge with existing items without prescription.
    const existingItemIndex = cart.findIndex(item => 
      item.productId === productId && 
      // Logic: If new item has prescription, it doesn't match an item without (and vice versa)
      ((!item.prescription && !prescription) || (item.prescription?.fileName === prescription?.fileName))
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ productId, quantity, prescription });
    }
    saveCart(cart);
  },

  removeFromCart(productId: string): void {
    let cart = getCart();
    // Simple removal by ID (removes all variants of that product)
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
  },

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const cart = getCart();
    // Updates first matching product found
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