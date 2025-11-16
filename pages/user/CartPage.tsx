
import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';
import type { CartItem, Product } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

type CartViewItem = {
  product: Product;
  quantity: number;
};

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const [cartItems, setCartItems] = useState<CartViewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    setIsLoading(true);
    const items = cartService.getCart();
    const productIds = items.map(item => item.productId);
    
    if (productIds.length > 0) {
        const products = await productService.getProductsByIds(productIds);
        const detailedItems: CartViewItem[] = items
          .map(item => {
            const product = products.find(p => p.id === item.productId);
            return product ? { product, quantity: item.quantity } : null;
          })
          .filter((item): item is CartViewItem => item !== null);
        setCartItems(detailedItems);
    } else {
        setCartItems([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleQuantityChange = (productId: string, quantity: number) => {
      cartService.updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
      cartService.removeFromCart(productId);
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
          <button onClick={() => onNavigate('user/products')} className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {cartItems.map(({ product, quantity }) => (
                <li key={product.id} className="flex flex-col sm:flex-row items-center py-6">
                  <img src={product.image_url} alt={product.name} className="w-28 h-28 object-cover rounded-md mb-4 sm:mb-0 shadow-sm"/>
                  <div className="flex-1 sm:ml-6 text-center sm:text-left">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-md font-bold text-primary mt-1">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                     <div className="flex items-center border rounded-md">
                      <button onClick={() => handleQuantityChange(product.id, quantity - 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"><Icon name="minus" className="w-5 h-5"/></button>
                      <span className="w-10 text-center font-semibold">{quantity}</span>
                      <button onClick={() => handleQuantityChange(product.id, quantity + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"><Icon name="plus" className="w-5 h-5"/></button>
                    </div>
                    <p className="font-semibold w-24 text-right">{formatCurrency(product.price * quantity)}</p>
                    <button onClick={() => handleRemove(product.id)} className="text-gray-500 hover:text-red-600 transition-colors" aria-label="Remove item"><Icon name="trash" /></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
            <h2 className="text-2xl font-bold border-b pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-lg">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between font-extrabold text-xl border-t pt-4 mt-4">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <button onClick={() => onNavigate('user/checkout')} className="w-full mt-6 bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};