import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('REACT_APP_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('REACT_APP_SUPABASE_ANON_KEY');
  
  throw new Error(
    `Missing Supabase environment variables: ${missing.join(', ')}\n\n` +
    'Please:\n' +
    '1. Check that .env file exists in the root directory\n' +
    '2. Verify the variables start with REACT_APP_\n' +
    '3. RESTART your dev server (npm start) after creating/modifying .env\n' +
    '4. Environment variables are only loaded when the server starts!'
  );
}

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'portfolio-react',
    },
  },
});

// Export a function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('projects').select('id').limit(1);
    if (error) throw error;
    return { connected: true, error: null };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

