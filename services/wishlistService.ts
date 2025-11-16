
import type { WishlistItem } from '../types';
import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

const getWishlist = (): WishlistItem[] => {
  return storageService.getItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST) ?? [];
};

const saveWishlist = (wishlist: WishlistItem[]) => {
  storageService.setItem(STORAGE_KEYS.WISHLIST, wishlist);
  window.dispatchEvent(new Event('storage'));
};

export const wishlistService = {
  getWishlist,

  isWishlisted(productId: string): boolean {
    const wishlist = getWishlist();
    return wishlist.some(item => item.productId === productId);
  },

  toggleWishlist(productId: string): void {
    let wishlist = getWishlist();
    if (this.isWishlisted(productId)) {
      wishlist = wishlist.filter(item => item.productId !== productId);
    } else {
      wishlist.push({ productId });
    }
    saveWishlist(wishlist);
  },
  
  getWishlistItemCount(): number {
    return getWishlist().length;
  }
};
