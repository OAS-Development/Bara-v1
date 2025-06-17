# 📊 DATABASE MIGRATION QUICK GUIDE

## Before Starting Session 3

Since Supabase is now connected but migrations haven't been run yet, you have two options:

### Option A: Run Migrations First (Recommended)
1. Run: `./show-migrations.sh` to see the SQL
2. Go to [Supabase SQL Editor](https://app.supabase.com)
3. Copy and run each migration
4. Then start Session 3

### Option B: Let Claude Code Handle It
Session 3 now includes migration steps and will guide Claude Code through the process.

## Current Database Status
- ✅ Supabase connected
- ✅ Environment variables set
- ⚠️ Tables not created yet
- ⚠️ RLS policies not applied yet

## Quick Commands
```bash
# See migrations to run manually
./show-migrations.sh

# Or just start Session 3 and follow along
cat CLAUDE_CODE_SESSION_3_PROMPT.txt | pbcopy
```

## After Migrations
Once migrations are run, you'll have:
- `projects` table
- `tasks` table  
- `tags` table
- `task_tags` junction table
- `perspectives` table
- All with Row Level Security enabled

Then the real magic begins! 🚀
