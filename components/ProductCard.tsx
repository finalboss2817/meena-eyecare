import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    wishlistService.toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartService.addToCart(product.id);
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
          className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
          Add to Cart
        </button>
      </div>
    </div>
  );
};