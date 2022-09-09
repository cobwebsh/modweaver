import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const user = writable(null as User | null);
