import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      sales: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          sale_date: string;
          total_amount: number;
          payment_method: 'Cash' | 'Bank';
          notes?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          sale_date: string;
          total_amount: number;
          payment_method: 'Cash' | 'Bank';
          notes?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          sale_date?: string;
          total_amount?: number;
          payment_method?: 'Cash' | 'Bank';
          notes?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          expense_date: string;
          description: string;
          amount: number;
          payment_method: 'Cash' | 'Bank';
          category: string;
          notes?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          expense_date: string;
          description: string;
          amount: number;
          payment_method: 'Cash' | 'Bank';
          category: string;
          notes?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          expense_date?: string;
          description?: string;
          amount?: number;
          payment_method?: 'Cash' | 'Bank';
          category?: string;
          notes?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          item_type: 'Cake' | 'Cupcake';
          flavor: string;
          quantity: number;
          price_per_item: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          sale_id: string;
          item_type: 'Cake' | 'Cupcake';
          flavor: string;
          quantity: number;
          price_per_item: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          sale_id?: string;
          item_type?: 'Cake' | 'Cupcake';
          flavor?: string;
          quantity?: number;
          price_per_item?: number;
          subtotal?: number;
        };
      };
    };
  };
};