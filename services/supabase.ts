import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqexrfocdipcymkjqrqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZXhyZm9jZGlwY3lta2pxcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjQxNjksImV4cCI6MjA3ODgwMDE2OX0.71jGWV2-VCJPrMCZ7DOX27pBQnjDsnSqeByDr8tVJwQ';

declare global {
    var supabase: {
        // FIX: The original generic signature for createClient was causing a type constraint
        // error due to a likely update in the underlying Supabase JS library.
        // This simplified signature resolves the issue and is sufficient for the app's needs
        // as it doesn't use generated Supabase types.
        createClient: (
            supabaseUrl: string,
            supabaseKey: string,
        ) => SupabaseClient;
    }
}

// Enable the real Supabase client
export const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);