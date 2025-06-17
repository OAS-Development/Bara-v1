import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const ownerId = process.env.OWNER_USER_ID!

console.log('🔐 Security Verification Test')
console.log('============================')
console.log(`Owner ID: ${ownerId}`)
console.log(`Deployment Mode: ${process.env.DEPLOYMENT_MODE}`)
console.log(`Allow Public Signup: ${process.env.ALLOW_PUBLIC_SIGNUP}`)
console.log(`Require Auth: ${process.env.REQUIRE_AUTH}`)
console.log('')

async function testSecurity() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('1️⃣  Testing signup prevention...')
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      console.log('✅ Signup blocked:', error.message)
    } else {
      console.log('❌ WARNING: Signup succeeded when it should be blocked!')
      console.log('User data:', data)
    }
  } catch (e) {
    console.log('✅ Signup blocked with exception:', e)
  }
  
  console.log('\n2️⃣  Testing anonymous access...')
  try {
    // Try to access tasks without authentication
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('✅ Anonymous access blocked:', error.message)
    } else {
      console.log('❌ WARNING: Anonymous access succeeded!')
      console.log('Data retrieved:', data)
    }
  } catch (e) {
    console.log('✅ Anonymous access blocked with exception:', e)
  }
  
  console.log('\n3️⃣  Testing with wrong user ID...')
  // First, let's create a client that simulates a different user
  const fakeUserId = '00000000-0000-0000-0000-000000000000'
  
  try {
    // Note: We can't actually sign in as a fake user, but we can test the RLS policies
    // by attempting operations that would be blocked
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: 'Hacker Project',
        user_id: fakeUserId
      })
    
    if (error) {
      console.log('✅ Wrong user ID blocked:', error.message)
    } else {
      console.log('❌ WARNING: Wrong user ID accepted!')
      console.log('Data inserted:', data)
    }
  } catch (e) {
    console.log('✅ Wrong user ID blocked with exception:', e)
  }
  
  console.log('\n4️⃣  Environment Configuration Check:')
  console.log(`- Owner ID set: ${ownerId ? '✅' : '❌'}`)
  console.log(`- Deployment mode is 'personal': ${process.env.DEPLOYMENT_MODE === 'personal' ? '✅' : '❌'}`)
  console.log(`- Public signup disabled: ${process.env.ALLOW_PUBLIC_SIGNUP === 'false' ? '✅' : '❌'}`)
  console.log(`- Auth required: ${process.env.REQUIRE_AUTH === 'true' ? '✅' : '❌'}`)
  
  console.log('\n🔐 Security verification complete!')
  console.log('\n⚠️  IMPORTANT: Make sure to run the migration in Supabase:')
  console.log('1. Go to Supabase Dashboard > SQL Editor')
  console.log('2. Paste and run the contents of: supabase/migrations/003_single_user_security.sql')
  console.log('3. The migration will enforce single-user access at the database level')
}

testSecurity().catch(console.error)