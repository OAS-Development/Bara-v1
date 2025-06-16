# Quick Start: Building Bara-v1

## Today's Action Items

### 1. Set Up Development Environment (30 mins)
```bash
# Create project directory
mkdir bara-v1
cd bara-v1

# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --use-npm

# Create Supabase project at https://app.supabase.com
# Save your project URL and anon key
```

### 2. Initial Project Structure (1 hour)
```bash
# Create folder structure
mkdir -p src/components/{layout,tasks,projects,ui}
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/lib/{supabase,import,ai,context}
mkdir -p src/app/{auth,inbox,projects,library,travel,financial}
```

### 3. Environment Setup (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
```

### 4. Install Core Dependencies
```bash
# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# State management & data fetching
npm install zustand @tanstack/react-query

# UI components
npm install @radix-ui/themes @radix-ui/react-icons
npm install class-variance-authority clsx tailwind-merge

# Forms & validation
npm install react-hook-form zod

# Encryption & sync
npm install crypto-js yjs y-indexeddb

# Development tools
npm install -D @types/crypto-js
```

### 5. Create Your First Components

#### src/components/layout/Sidebar.tsx
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const perspectives = [
  { id: 'inbox', label: 'Inbox', icon: '📥', color: 'bg-blue-600' },
  { id: 'work', label: 'Work', icon: '💼', color: 'bg-indigo-600' },
  { id: 'personal', label: 'Personal', icon: '👤', color: 'bg-gray-600' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: 'bg-cyan-600' },
  { id: 'financial', label: 'Financial', icon: '💰', color: 'bg-green-600' },
  { id: 'library', label: 'Library', icon: '📚', color: 'bg-purple-600' },
]

export function Sidebar() {
  const router = useRouter()
  const [selected, setSelected] = useState('inbox')

  return (
    <div className="w-[280px] h-full bg-[#26262b] border-r border-[#333338]">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#b3b3b3]">Bara</h1>
      </div>
      
      <nav className="px-3">
        {perspectives.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelected(item.id)
              router.push(`/${item.id}`)
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md
              text-[#e6e6e6] hover:bg-[#333338] transition-colors
              ${selected === item.id ? 'bg-[#333338]' : ''}
            `}
          >
            <span className={`
              w-6 h-6 rounded-full ${item.color} 
              flex items-center justify-center text-xs
            `}>
              {item.icon}
            </span>
            <span className="text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
```

### 6. Database Schema (Run in Supabase SQL Editor)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile extension
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  omnifocus_imported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core tables with RLS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('sequential', 'parallel')) DEFAULT 'parallel',
  status TEXT CHECK (status IN ('active', 'on-hold', 'completed', 'dropped')) DEFAULT 'active',
  parent_id UUID REFERENCES projects(id),
  notes TEXT,
  review_interval INTERVAL,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);
```

## Session Milestones

### Sessions 1-2: Foundation
- [ ] Set up Next.js project
- [ ] Configure Supabase
- [ ] Create basic layout components
- [ ] Implement dark theme

### Sessions 3-4: Core Features  
- [ ] Task CRUD operations
- [ ] Project management
- [ ] Basic inbox view
- [ ] Quick entry component

### Session 5: Polish & Deploy
- [ ] Keyboard shortcuts
- [ ] Basic sync working
- [ ] Deploy to Vercel
- [ ] Test with sample data

## Resources & Support

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

### Getting Help
- Create issues in your GitHub repo
- Use the Supabase Discord
- Next.js Discord community

## Start Coding NOW!

1. Open terminal
2. Run the setup commands above
3. Start with the Sidebar component
4. See it running: `npm run dev`
5. Iterate and improve!

Remember: Ship early, get feedback, iterate fast. You don't need everything perfect on day one!
