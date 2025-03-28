
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = "https://tovkltnfqkjsdbuzalbk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdmtsdG5mcWtqc2RidXphbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjcxNjAsImV4cCI6MjA1ODcwMzE2MH0.e-QYAi5ThakwcOmtp5QBLmrp6qTgCVZUHwN_l3IEeSw";

// Create and export the supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
