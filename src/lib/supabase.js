import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gapzhyqiejlgwmycqebn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcHpoeXFpZWpsZ3dteWNxZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzY2NTgsImV4cCI6MjA2ODE1MjY1OH0.BW-CqK9n2JmfvE_VOegHHLJpcGTqrWuAkyJgaVqX5Ps';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export default supabase;