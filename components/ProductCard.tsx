
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import { Icon } from './Icon';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistService.isWishlisted(product.id));
    
    const handleStorageChange = () => {
       setIsWishlisted(wishlistService.isWishlisted(product.id));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [product.id]);

  const checkAuth = async () => {
    const session = await authService.getSession();
    if (!session) {
        // Direct redirect to signup without confirmation dialog
        onNavigate('user/signup');
        return false;
    }
    return true;
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (await checkAuth()) {
        wishlistService.toggleWishlist(product.id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (await checkAuth()) {
        cartService.addToCart(product.id);
        alert("Added to cart!");
    }
  };
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer group flex flex-col"
      onClick={() => onNavigate(`user/product/${product.id}`)}>
      <div className="relative">
        <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover" />
        {product.offer && (
          <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{product.offer}</div>
        )}
        <button onClick={handleToggleWishlist} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-dark hover:text-red-500 transition-colors" aria-label="Toggle Wishlist">
          <Icon name="wishlist" className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-500 uppercase font-semibold">{product.brand}</h3>
        <h2 className="text-lg font-bold text-dark truncate flex-grow">{product.name}</h2>
        <p className="text-2xl font-extrabold text-primary mt-2">{formatCurrency(product.price)}</p>
        <button 
          onClick={handleAddToCart}
          className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
