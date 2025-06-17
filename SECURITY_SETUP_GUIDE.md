# Security Configuration Instructions

## 1. Create/Update .env.local file

In your project root, create or update `.env.local`:

```bash
# REQUIRED SECURITY SETTINGS
OWNER_USER_ID=your-supabase-user-id-here
OWNER_EMAIL=your-email@example.com
DEPLOYMENT_MODE=personal
ALLOW_PUBLIC_SIGNUP=false
REQUIRE_AUTH=true

# Your existing Supabase settings (keep these)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key-if-you-have-it
```

## 2. Update the Migration File

The migration file needs YOUR specific user ID. 

1. Open: `supabase/migrations/003_single_user_security.sql`
2. Find all instances of `[OWNER_ID]` 
3. Replace with your actual user ID

Example:
```sql
-- Change this:
CONSTRAINT tasks_owner CHECK (user_id = '[OWNER_ID]')

-- To this (with your actual ID):
CONSTRAINT tasks_owner CHECK (user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
```

## 3. Run the Migration

### Option A: Via Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Paste the UPDATED migration content (with your ID)
3. Run the query

### Option B: Via Supabase CLI
```bash
# Make sure you're in the project directory
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

# Run the migration
npx supabase migration up
```

## 4. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## 5. Test It Works

1. Try to access Bara
2. You should be able to login with your account
3. Try to create a new account - it should fail
4. Check /admin/security to see the security dashboard

## Troubleshooting

If you get errors:
- "OWNER_USER_ID not set" → Check .env.local file
- "User not authorized" → Make sure the ID matches exactly
- Database errors → The migration might not have run correctly

Need your user ID? Run this in Bara's console:
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log("Your User ID:", user.id);
console.log("Your Email:", user.email);
```
