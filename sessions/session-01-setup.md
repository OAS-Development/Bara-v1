# Session 1: Project Setup & Authentication

## Session Metadata
```json
{
  "session": 1,
  "title": "Project Setup & Authentication",
  "duration": "45 minutes",
  "type": "implementation",
  "project": "Bara-v1",
  "dependencies": []
}
```

## Objectives
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up Supabase project and authentication
3. Configure environment variables
4. Create basic folder structure
5. Implement authentication flow
6. Verify everything works correctly
7. Push to GitHub

## Context
Starting fresh with Bara-v1 personal productivity suite. This is the foundation session where we establish the project structure and authentication system.

## Implementation Steps

### 0. Initialize Git Repository
```bash
git init
git remote add origin https://github.com/OAS-Development/Bara-v1.git
```

### 1. Initialize Project
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
npx create-next-app@latest . --typescript --tailwind --app --use-npm --src-dir
```

### 2. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install @radix-ui/themes @radix-ui/react-icons
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form zod
npm install -D @types/node
```

### 3. Create Folder Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── inbox/
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── supabase/
│   └── utils/
├── hooks/
├── stores/
└── types/
```

### 4. Environment Configuration
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Supabase Client Setup
Create `src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 6. Auth Components
Create login form, signup form, and auth provider components.

### 7. Protected Route Middleware
Implement middleware to protect dashboard routes.

### 8. Verify Development Server
```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in browser
# Verify the page loads without errors
# Check the console for any warnings

# Once verified, stop the server with Ctrl+C
```

### 9. Verify Build Process
```bash
# Ensure the project builds successfully
npm run build

# This should complete without errors
# If there are TypeScript errors, fix them before proceeding
```

### 10. Run Type Checking
```bash
# Run TypeScript compiler to check for type errors
npx tsc --noEmit

# This should complete with no output (meaning no errors)
```

### 11. Test Authentication Flow
```bash
# Start the dev server again
npm run dev

# In your browser:
# 1. Navigate to http://localhost:3000/login
# 2. Test creating a new account
# 3. Verify redirect to /inbox after successful signup
# 4. Test logout functionality
# 5. Verify that accessing /inbox when logged out redirects to /login
# 6. Test login with the created account

# Stop the server with Ctrl+C when testing is complete
```

### 12. Commit and Push to GitHub
```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "Session 1: Project setup and authentication"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Expected Outputs
- Next.js project initialized and running
- Supabase authentication working
- Login/Signup pages created and functional
- Protected dashboard route working
- Basic folder structure established
- Code pushed to GitHub repository

## Success Criteria Checklist
- [ ] Project runs on localhost:3000 without errors
- [ ] Build command completes successfully
- [ ] TypeScript has no compilation errors
- [ ] Can create new user account
- [ ] Can login with existing account
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Logout functionality works
- [ ] Code is committed and pushed to GitHub

## Session Completion Report
After completing all steps and verification, provide this report:

```json
{
  "session": 1,
  "status": "complete|blocked|partial",
  "completedObjectives": [
    "Git repository initialized",
    "Next.js project created",
    "Dependencies installed",
    "Folder structure created",
    "Supabase authentication implemented",
    "All verification tests passed",
    "Code pushed to GitHub"
  ],
  "blockers": [
    // List any issues encountered
  ],
  "nextSession": 2,
  "notes": "Any important context for next session"
}
```

## If Blocked
If you encounter any blockers:
1. Document the specific error message
2. Note which step failed
3. Include any troubleshooting attempted
4. Report partial completion status
