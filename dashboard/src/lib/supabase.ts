import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tipezmvjddkzlcyijqqq.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcGV6bXZqZGRremxjeWlqcXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNTMwMDEsImV4cCI6MjA4NDcyOTAwMX0.aJGzV4umjWyhSm28kPz4BjjLT9lSkaR_pwzZg-6HpZQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
