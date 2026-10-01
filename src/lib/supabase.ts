import { createClient } from '@supabase/supabase-js';

// Clés publiques (publishable) : la sécurité repose sur les règles RLS de la base.
const DEFAULT_URL = 'https://pknkuxhjmhmcewnzvfjy.supabase.co';
const DEFAULT_KEY = 'sb_publishable_ojKjFM8-MioPVpK5X3EJkg_A2rOZb5c';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const url = envUrl && envUrl.startsWith('https://') && envUrl.includes('.supabase.co') ? envUrl : DEFAULT_URL;
const key = envKey && envKey.length > 40 ? envKey : DEFAULT_KEY;

export const supabase = createClient(url, key);
