import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// If either variable is missing, supabase is null and reporting is disabled.
// The app still loads and shows providers from providers.json.
export const supabase = url && key ? createClient(url, key) : null
