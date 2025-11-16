
import { supabaseClient } from './supabase';
import type { EducationContent } from '../types';

export const educationService = {
  async getContent(): Promise<EducationContent[]> {
    const { data, error } = await supabaseClient
      .from('lens_education')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      console.error('Error fetching education content:', error);
      return [];
    }
    return data as EducationContent[];
  },

  async getContentById(id: string): Promise<EducationContent | null> {
    const { data, error } = await supabaseClient
      .from('lens_education')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching education content by ID:', error);
      return null;
    }
    return data as EducationContent;
  },

  async addContent(content: Omit<EducationContent, 'id'>): Promise<EducationContent | null> {
    const { data, error } = await supabaseClient
      .from('lens_education')
      .insert(content)
      .select()
      .single();
    if (error) {
      console.error('Error adding education content:', error);
      return null;
    }
    return data as EducationContent;
  },

  async updateContent(id: string, content: Partial<EducationContent>): Promise<EducationContent | null> {
    const { data, error } = await supabaseClient
      .from('lens_education')
      .update(content)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating education content:', error);
      return null;
    }
    return data as EducationContent;
  },

  async deleteContent(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('lens_education')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting education content:', error);
      throw error;
    }
  },
};
