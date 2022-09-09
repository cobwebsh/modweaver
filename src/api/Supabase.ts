import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_API_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error('Supabase API URL and/or key was not specified. Check your env vars.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
