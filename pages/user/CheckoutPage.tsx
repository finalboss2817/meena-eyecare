
import React, { useState } from 'react';
import { cartService } from '../../services/cartService';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process payment. Here, we just mock success.
    cartService.clearCart();
    setIsOrderPlaced(true);
  };

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-dark mt-4">Thank You!</h1>
          <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mt-1">This is a mock confirmation. No actual order was processed.</p>
          <button 
            onClick={() => onNavigate('user/home')} 
            className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <p className="text-center text-red-600 bg-red-100 p-3 rounded-md mb-8 max-w-2xl mx-auto">
        <strong>Prototype Notice:</strong> This is a mock checkout page. No real data is collected or processed.
      </p>
      <form onSubmit={handlePlaceOrder} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" defaultValue="John Doe" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" defaultValue="john.doe@example.com" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <input type="text" id="address" defaultValue="123 Vision St" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="card" className="block text-sm font-medium text-gray-700">Card Details</label>
            <input type="text" id="card" placeholder="**** **** **** 1234" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <button type="submit" className="w-full mt-8 bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-colors">
          Place Mock Order
        </button>
      </form>
    </div>
  );
};
