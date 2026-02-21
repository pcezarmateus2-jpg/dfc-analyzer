import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  periodo: string;
  data_inicio?: string;
  data_fim?: string;
  receitas_total: number;
  despesas_total: number;
  saldo: number;
  receitas_por_categoria: any;
  despesas_por_categoria: any;
  receitas_por_loja?: any;
  despesas_por_loja?: any;
  created_at: string;
}
