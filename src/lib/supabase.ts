import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  status: string;
  price_per_unit: number;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  ration_card_number: string;
  phone_number: string;
  address: string;
  family_members: number;
  active: boolean;
  created_at: string;
}

export interface StockUpdate {
  id: string;
  product_id: string;
  previous_quantity: number;
  new_quantity: number;
  previous_status: string;
  new_status: string;
  updated_by: string;
  notes: string;
  created_at: string;
}

export interface Notification {
  id: string;
  beneficiary_id: string;
  product_id: string;
  message: string;
  status: string;
  sent_at: string;
  created_at: string;
}
