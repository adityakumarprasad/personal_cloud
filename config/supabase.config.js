require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('URL loaded:', !!supabaseUrl) // Should show: true
console.log('Key loaded:', !!supabaseServiceKey) // Should show: true

const supabase = createClient(supabaseUrl, supabaseServiceKey)

module.exports = supabase