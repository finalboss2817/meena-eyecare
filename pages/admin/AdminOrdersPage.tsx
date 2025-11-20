
import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Icon } from '../../components/Icon';

interface AdminOrdersPageProps {
  onNavigate: (path: string) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await orderService.getAllOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: 'approved' | 'rejected') => {
      if(window.confirm(`Are you sure you want to mark this order as ${status.toUpperCase()}?`)) {
          await orderService.updateOrderStatus(orderId, status);
          loadOrders(); // Refresh list
      }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      
      {selectedProof && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
              <div className="relative max-w-3xl w-full bg-white rounded-lg p-2">
                  <button onClick={() => setSelectedProof(null)} className="absolute top-2 right-2 bg-gray-200 p-1 rounded-full hover:bg-gray-300"><Icon name="close" /></button>
                  <img src={selectedProof} alt="Payment Proof" className="w-full h-auto max-h-[80vh] object-contain" />
              </div>
          </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">ID: {order.id.slice(0, 8)}</div>
                  <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="text-sm font-semibold text-primary mt-1">{formatCurrency(order.total_amount)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{order.full_name}</div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-[150px]" title={order.address}>{order.address}</div>
                </td>
                <td className="px-6 py-4">
                   <span className="uppercase text-xs font-bold bg-gray-100 px-2 py-1 rounded">{order.payment_method}</span>
                   {order.payment_proof_url && (
                       <button 
                        onClick={() => setSelectedProof(order.payment_proof_url || null)}
                        className="block mt-2 text-xs text-blue-600 hover:underline cursor-pointer flex items-center"
                       >
                           <Icon name="eye" className="w-3 h-3 mr-1"/> View Proof
                       </button>
                   )}
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      order.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      order.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                     {order.status}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   {order.status === 'pending_verification' && (
                       <div className="flex justify-end space-x-2">
                           <button onClick={() => handleStatusUpdate(order.id, 'approved')} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200">Approve</button>
                           <button onClick={() => handleStatusUpdate(order.id, 'rejected')} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200">Reject</button>
                       </div>
                   )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
