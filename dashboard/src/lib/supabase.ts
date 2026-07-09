import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tipezmvjddkzlcyijqqq.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcGV6bXZqZGRremxjeWlqcXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNTMwMDEsImV4cCI6MjA4NDcyOTAwMX0.aJGzV4umjWyhSm28kPz4BjjLT9lSkaR_pwzZg-6HpZQ'

/** Login / session management */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Data reads always use the anon key (same as the original HTML/PHP tools).
 * The auth client attaches the logged-in JWT, which can be blocked by RLS.
 */
export const supabaseData = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: 'delta-rentals-data',
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
