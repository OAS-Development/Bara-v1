# Session 2: Database Schema & Layout Components (DOUBLE SESSION)

## Session Metadata
```json
{
  "session": 2,
  "title": "Database Schema & Layout Components",
  "duration": "90 minutes",
  "type": "implementation",
  "combinesSessions": [2, 3],
  "project": "Bara-v1",
  "dependencies": [1]
}
```

## Objectives
**Part A - Database Schema & RLS (45 min)**:
1. Create all GTD tables in Supabase
2. Set up Row Level Security policies
3. Generate TypeScript types
4. Test CRUD operations

**Part B - Layout Components (45 min)**:
1. Create three-panel layout structure
2. Implement Sidebar with perspectives
3. Add OmniFocus-style dark theme
4. Build responsive panel system

## Context
Session 1 complete. We have Next.js with TypeScript, Supabase auth working, and basic folder structure. Now building the data layer and UI foundation.

## Implementation Steps

### Part A: Database Schema & RLS (45 minutes)

#### 1. Create Supabase Schema
Create `supabase/migrations/001_create_tables.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE task_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE project_type AS ENUM ('sequential', 'parallel', 'single-actions');
CREATE TYPE repeat_unit AS ENUM ('days', 'weeks', 'months', 'years');
CREATE TYPE energy_level AS ENUM ('low', 'medium', 'high');

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  note TEXT,
  type project_type DEFAULT 'parallel',
  status task_status DEFAULT 'active',
  parent_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  review_interval_days INTEGER,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status task_status DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  defer_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  repeat_interval INTEGER,
  repeat_unit repeat_unit,
  estimated_minutes INTEGER,
  energy_required energy_level,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table (contexts)
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  icon TEXT,
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Task-Tag junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Perspectives table
CREATE TABLE perspectives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  filter_rules JSONB NOT NULL DEFAULT '{}',
  sort_rules JSONB NOT NULL DEFAULT '[]',
  position INTEGER DEFAULT 0,
  is_built_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_defer_date ON tasks(defer_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_parent_id ON projects(parent_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
```

#### 2. Create RLS Policies
Create `supabase/migrations/002_rls_policies.sql`:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE perspectives ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- Task-Tags policies
CREATE POLICY "Users can view own task tags" ON task_tags
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own task tags" ON task_tags
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own task tags" ON task_tags
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

-- Perspectives policies
CREATE POLICY "Users can view own perspectives" ON perspectives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own perspectives" ON perspectives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own perspectives" ON perspectives
  FOR UPDATE USING (auth.uid() = user_id AND NOT is_built_in);

CREATE POLICY "Users can delete own perspectives" ON perspectives
  FOR DELETE USING (auth.uid() = user_id AND NOT is_built_in);
```

#### 3. Generate TypeScript Types
```bash
npx supabase gen types typescript --project-id [your-project-id] > src/types/database.types.ts
```

#### 4. Create Database Hooks
Create `src/lib/supabase/hooks.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from './client'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type Project = Database['public']['Tables']['projects']['Row']

export function useTasks() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(*), tags:task_tags(tag:tags(*))')
        .eq('status', 'active')
        .order('position')
      
      if (error) throw error
      return data
    }
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
```

### Part B: Layout Components (45 minutes)

#### 5. Create Layout Structure
Update `src/app/(dashboard)/layout.tsx`:

```typescript
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/layout/main-content'
import { Inspector } from '@/components/layout/inspector'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar - 240px */}
      <aside className="w-60 border-r border-gray-800 flex-shrink-0">
        <Sidebar />
      </aside>
      
      {/* Main Content - Flexible */}
      <main className="flex-1 flex flex-col min-w-0">
        <MainContent>{children}</MainContent>
      </main>
      
      {/* Inspector - 320px, collapsible */}
      <aside className="w-80 border-l border-gray-800 flex-shrink-0">
        <Inspector />
      </aside>
    </div>
  )
}
```

#### 6. Create Sidebar Component
Create `src/components/layout/sidebar.tsx`:

```typescript
'use client'

import { Home, Calendar, Flag, Archive, Tag, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const perspectives = [
  { name: 'Inbox', href: '/inbox', icon: Home },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Upcoming', href: '/upcoming', icon: Calendar },
  { name: 'Anytime', href: '/anytime', icon: Archive },
  { name: 'Someday', href: '/someday', icon: Flag },
]

const organize = [
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tags', href: '/tags', icon: Tag },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* App Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Bara</h1>
      </div>
      
      {/* Perspectives */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
            Perspectives
          </h2>
          <nav className="space-y-1">
            {perspectives.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Organize */}
        <div className="p-2 mt-4">
          <h2 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
            Organize
          </h2>
          <nav className="space-y-1">
            {organize.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      {/* User Menu */}
      <div className="p-4 border-t border-gray-800">
        <button className="text-sm text-gray-400 hover:text-gray-200">
          Settings
        </button>
      </div>
    </div>
  )
}
```

#### 7. Create Main Content Area
Create `src/components/layout/main-content.tsx`:

```typescript
'use client'

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-800 flex items-center px-4">
        <button className="text-sm text-gray-400 hover:text-gray-200">
          View Options
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Quick Entry Bar */}
      <div className="h-14 border-t border-gray-800 flex items-center px-4">
        <input
          type="text"
          placeholder="Type to add to Inbox"
          className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
```

#### 8. Create Inspector Panel
Create `src/components/layout/inspector.tsx`:

```typescript
'use client'

import { X } from 'lucide-react'

export function Inspector() {
  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <button className="text-gray-400 hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <p className="text-sm text-gray-500">
          Select a task to view details
        </p>
      </div>
    </div>
  )
}
```

#### 9. Update Tailwind for Dark Theme
Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0a0a0b',
        }
      }
    },
  },
  plugins: [],
}
export default config
```

#### 10. Add Global Dark Mode
Update `src/app/layout.tsx`:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  )
}
```

### Verification Steps

#### 11. Test Database Connection
```bash
# Create a test file to verify database
cat > test-db.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testConnection() {
  const { data, error } = await supabase.auth.getUser()
  console.log('Auth test:', { data, error })
  
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select('*')
  console.log('Projects test:', { projects, projectError })
}

testConnection()
EOF

npx tsx test-db.ts
```

#### 12. Verify Layout Rendering
```bash
# Start the dev server
npm run dev

# In browser, navigate to http://localhost:3000/inbox
# Verify:
# - Three-panel layout displays
# - Dark theme applied consistently
# - Sidebar navigation works
# - No console errors
```

#### 13. Test TypeScript Types
```bash
# Ensure TypeScript compilation works
npx tsc --noEmit

# Should complete with no errors
```

#### 14. Build Verification
```bash
# Ensure production build works
npm run build

# Should complete successfully
```

### 15. Commit and Push
```bash
# Add all changes
git add .

# Commit with detailed message
git commit -m "Session 2: Database schema with RLS and three-panel layout

- Created complete GTD database schema in Supabase
- Implemented Row Level Security policies
- Generated TypeScript types from database
- Built three-panel layout matching OmniFocus design
- Added dark theme throughout application
- Created sidebar navigation with perspectives
- Implemented collapsible inspector panel
- Added React Query hooks for data fetching"

# Push to GitHub
git push origin main
```

## Expected Outputs
- Complete database schema deployed to Supabase
- RLS policies protecting all user data
- TypeScript types generated and working
- Three-panel layout rendering correctly
- Dark theme consistent across all components
- Navigation between perspectives working
- All TypeScript checks passing
- Production build successful

## Success Criteria Checklist
- [ ] All database migrations applied successfully
- [ ] RLS policies tested and working
- [ ] TypeScript types match database schema
- [ ] Layout matches Figma design
- [ ] Dark theme applied consistently
- [ ] Sidebar navigation functional
- [ ] Inspector panel can open/close
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Code committed and pushed to GitHub

## Session Completion Report
After completing all steps:

1. **SAVE this report to a file**:
```bash
cat > /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-02-status.json << 'EOF'
# Paste the JSON report below
EOF
```

2. **Report format**:
```json
{
  "session": 2,
  "status": "complete|blocked|partial",
  "duration": "actual time taken",
  "completedObjectives": [
    "Database schema created with all GTD tables",
    "RLS policies implemented and tested",
    "TypeScript types generated",
    "Three-panel layout implemented",
    "Dark theme applied",
    "Sidebar navigation working",
    "Inspector panel created",
    "All verification tests passed",
    "Code pushed to GitHub"
  ],
  "blockers": [],
  "filesCreated": [
    "supabase/migrations/001_create_tables.sql",
    "supabase/migrations/002_rls_policies.sql",
    "src/types/database.types.ts",
    "src/lib/supabase/hooks.ts",
    "src/components/layout/sidebar.tsx",
    "src/components/layout/main-content.tsx",
    "src/components/layout/inspector.tsx"
  ],
  "nextSession": 3,
  "notes": "Database and UI foundation complete. Ready for task CRUD and keyboard shortcuts."
}
```

## If Blocked
Document specific errors and what troubleshooting was attempted. Common issues:
- Supabase project ID needed for type generation
- Environment variables not loaded
- TypeScript strict mode issues
- Tailwind dark mode configuration
