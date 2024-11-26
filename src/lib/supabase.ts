import { createClient } from '@supabase/supabase-js'

// Make sure these environment variables are properly set
const supabaseUrl = 'https://bpgyebhkyqbwzcpvyszi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZ3llYmhreXFid3pjcHZ5c3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NDM5NDMsImV4cCI6MjA0ODExOTk0M30.YKh9wcta2GKi25v9ZWRO2oTeyI66Bp_mA7W_aIrX0VY'

// Add some validation
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Log the URL (but not the key for security)
console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey)

// Don't create new instances elsewhere in your code 

