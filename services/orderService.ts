
import { supabaseClient } from './supabase';
import type { Order, OrderStatus } from '../types';

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order | null> {
    // In a real production app, items would be in a separate table 'order_items'.
    // For this prototype, we will store items as a JSONB column in the 'orders' table if simple,
    // or just strictly type it here assuming the backend handles it.
    
    const { data, error } = await supabaseClient
      .from('orders')
      .insert({
        ...orderData,
        status: 'pending_verification',
        // Ensuring items are stored properly. If Supabase schema has 'items' as JSONB:
        items: orderData.items 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    return data as Order;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
    return data as Order[];
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
    return data as Order[];
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await supabaseClient
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};
