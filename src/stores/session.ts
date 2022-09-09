import type { User } from '@supabase/supabase-js';
import { writable } from 'svelte/store';

export const defaultUser = {} as User;
export const user = writable<User>();
