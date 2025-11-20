
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import type { Order } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Icon } from '../../components/Icon';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = await authService.getUser();
      if (!user) {
        onNavigate('user/login');
        return;
      }
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
      setIsLoading(false);
    };
    fetchOrders();
  }, [onNavigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending_verification': return 'text-yellow-600 bg-yellow-100';
      case 'delivered': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
            <Icon name="cart" className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
            <h2 className="text-xl font-semibold text-gray-600">No orders yet</h2>
            <button onClick={() => onNavigate('user/products')} className="mt-4 text-primary font-bold hover:underline">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-700">{order.id.slice(0, 8)}...</span></p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="p-6">
                 <div className="space-y-2 mb-4">
                    {/* We are handling items as simple JSON here for display */}
                    {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity} x {item.product_name}</span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                 </div>
                 <div className="border-t pt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Payment: <span className="font-semibold uppercase">{order.payment_method}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                        {formatCurrency(order.total_amount)}
                    </div>
                 </div>
                 {order.status === 'rejected' && (
                     <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm">
                         <strong>Note:</strong> Your payment verification failed. Please contact support or try placing the order again with valid proof.
                     </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
