import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

type ExpoExtra = {
	supabaseUrl?: string;
	supabaseAnonKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {}) as ExpoExtra;

export const supabase = createClient(extra.supabaseUrl ?? '', extra.supabaseAnonKey ?? '');
