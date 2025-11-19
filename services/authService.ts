
import { supabaseClient } from './supabase';
import type { Profile, SignUpData } from '../types';

export const authService = {
  // EMAIL AUTH
  async signUp(credentials: SignUpData) {
    const { data, error } = await supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // PHONE OTP AUTH
  async sendOtp(phone: string) {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return data;
  },

  async verifyOtp(phone: string, token: string) {
    const { data, error } = await supabaseClient.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  // GENERAL AUTH & PROFILE
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  async getUser() {
     const { data, error } = await supabaseClient.auth.getUser();
     if (error) throw error;
     return data.user;
  },

  onAuthStateChange(callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(callback);
    return subscription;
  },
  
  async getProfileForCurrentUser(): Promise<Profile | null> {
    const user = await this.getUser();
    if (!user) return null;

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // If the profile doesn't exist (e.g. trigger failed or not set up), we don't want to crash the app.
      // We just return null, and the UI should fallback to session user metadata.
      console.warn('Could not fetch user profile from DB (it might not exist yet):', error.message);
      return null;
    }

    return data as Profile;
  },
  
  async updateProfile(fullName: string): Promise<Profile | null> {
    const user = await this.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabaseClient
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date() })
        .eq('id', user.id)
        .select()
        .single();
        
    if (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
    
    return data as Profile;
  }
};
