import type { Product, Category } from '../types';
import { supabaseClient } from './supabase';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseClient.from('products').select('*').order('name', { ascending: true });
    if (error) {
      console.error('Error fetching products:', error.message, error);
      return [];
    }
    return data as Product[];
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabaseClient.from('products').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching product:', error.message, error);
      return undefined;
    }
    return data as Product ?? undefined;
  },
  
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if(ids.length === 0) return [];
    const { data, error } = await supabaseClient.from('products').select('*').in('id', ids);
    if (error) {
        console.error('Error fetching products by ids:', error.message, error);
        return [];
    }
    return data as Product[];
  },

  async addProduct(productData: Omit<Product, 'id'>): Promise<Product | null> {
    const { data, error } = await supabaseClient.from('products').insert(productData).select();
    if (error) {
      console.error('Error adding product:', error.message, error);
      return null;
    }
    return data[0] as Product;
  },

  async updateProduct(updatedProduct: Product): Promise<Product | null> {
    const { id, ...updateData } = updatedProduct;
    const { data, error } = await supabaseClient.from('products').update(updateData).eq('id', id).select();
    if (error) {
      console.error('Error updating product:', error.message, error);
      return null;
    }
    return data[0] as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabaseClient.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error.message, error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabaseClient.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error.message, error);
      return [];
    }
    return data as Category[];
  },
  
  async getCategoryById(id: string): Promise<Category | undefined> {
    const { data, error } = await supabaseClient.from('categories').select('*').eq('id', id).single();
    if (error) {
        // Don't log "not found" as an error
        if (!error.message.includes('JSON object requested')) {
             console.error('Error fetching category:', error.message, error);
        }
        return undefined;
    }
    return data as Category ?? undefined;
  }
};