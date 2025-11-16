import React, { useState, useEffect } from 'react';
import { wishlistService } from '../../services/wishlistService';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    setIsLoading(true);
    const items = wishlistService.getWishlist();
    const productIds = items.map(item => item.productId);

    if (productIds.length > 0) {
        const products = await productService.getProductsByIds(productIds);
        setWishlistProducts(products);
    } else {
        setWishlistProducts([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">Your wishlist is empty.</h2>
          <p className="text-gray-500 mt-2">Add your favorite items to your wishlist to see them here.</p>
          <button onClick={() => onNavigate('user/products')} className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
            Discover Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
