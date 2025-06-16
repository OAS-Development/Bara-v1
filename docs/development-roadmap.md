# Bara-v1 Development Roadmap

## Phase 1: Foundation (Sessions 1-5)

### 1.1 Project Setup
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest bara-v1 --typescript --tailwind --app

# Additional dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install yjs y-webrtc y-indexeddb
npm install @radix-ui/themes class-variance-authority
npm install react-hook-form zod
```

### 1.2 Database Schema
```sql
-- Core GTD tables
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('sequential', 'parallel')),
  status TEXT DEFAULT 'active',
  parent_id UUID REFERENCES projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  notes TEXT,
  project_id UUID REFERENCES projects(id),
  status TEXT DEFAULT 'active',
  defer_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  parent_id UUID REFERENCES tags(id)
);

CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id),
  tag_id UUID REFERENCES tags(id),
  PRIMARY KEY (task_id, tag_id)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
```

### 1.3 Authentication Setup
```typescript
// app/auth/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
```

## Phase 2: Core GTD Features (Sessions 6-10)

### 2.1 Component Architecture
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── MainContent.tsx
│   │   └── Inspector.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── QuickEntry.tsx
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   └── ProjectView.tsx
│   └── ui/
│       └── [Radix UI components]
├── hooks/
│   ├── useTasks.ts
│   ├── useProjects.ts
│   └── useKeyboardShortcuts.ts
├── stores/
│   ├── taskStore.ts
│   └── uiStore.ts
└── lib/
    ├── supabase.ts
    └── encryption.ts
```

### 2.2 Key Features to Implement
1. **Inbox Processing**
   - Quick capture with natural language
   - Keyboard shortcuts (Cmd+N for new task)
   - Drag and drop to projects

2. **Project Management**
   - Sequential vs Parallel projects
   - Nested projects support
   - Project templates

3. **Task Views**
   - Today view
   - Next actions
   - Waiting for
   - Someday/Maybe

## Phase 3: OmniFocus Import (Sessions 11-13)

### 3.1 Import Module
```typescript
// lib/import/omnifocus.ts
interface OmniFocusImporter {
  parseArchive(file: File): Promise<ParsedData>
  transformToBaraFormat(data: ParsedData): BaraData
  importToDatabase(data: BaraData): Promise<ImportResult>
}

// Features:
// - Support .ofocus-archive format
// - Parse TaskPaper format
// - Preserve all metadata
// - Create searchable index
```

### 3.2 Import UI
- Upload interface
- Preview imported data
- Mapping configuration
- Progress tracking

## Phase 4: Context & Intelligence (Sessions 14-18)

### 4.1 Context Engine
```typescript
// lib/context/engine.ts
interface ContextEngine {
  location: LocationContext
  time: TimeContext
  energy: EnergyContext
  calendar: CalendarContext
  
  getCurrentContext(): Context
  filterTasksForContext(tasks: Task[]): Task[]
  suggestNextAction(): Task | null
}
```

### 4.2 Claude Integration
```typescript
// lib/ai/claude.ts
interface ClaudeIntegration {
  parseNaturalLanguage(input: string): ParsedTask
  generateWeeklyReview(tasks: Task[]): Review
  suggestTaskPriorities(context: Context): Priority[]
}
```

## Phase 5: Enhanced Features (Sessions 19-30)

### 5.1 Library Feature
- Document upload (PDF, EPUB)
- Text extraction and indexing
- Primary book designation
- AI comparison interface

### 5.2 Travel Feature
- Trip project creation
- Points optimization display
- Itinerary management
- Travel mode activation

### 5.3 Financial Feature
- Receipt capture interface
- Expense categorization
- Client/project assignment
- QuickBooks export

## Getting Started NOW

### Session 1-3 Sprint:
1. **Day 1-2**: Set up development environment
   ```bash
   # Clone repo
   git clone [your-repo]
   cd bara-v1
   
   # Install dependencies
   npm install
   
   # Set up Supabase
   npx supabase init
   npx supabase start
   ```

2. **Day 3-4**: Create basic layout
   - Implement three-panel structure
   - Dark theme with Tailwind
   - Basic routing

3. **Day 5-7**: Core data model
   - Set up Supabase tables
   - Create API routes
   - Basic CRUD operations

### Development Principles:
1. **Ship early, iterate often**
2. **Start with MVP of each feature**
3. **Maintain OmniFocus keyboard shortcuts**
4. **Test with real data early**
5. **Keep security paramount**

### Tech Decisions:
- **State Management**: Zustand for simplicity
- **Styling**: Tailwind + Radix UI for consistency
- **Data Sync**: Yjs for real-time collaboration
- **Offline**: IndexedDB + Service Workers
- **Testing**: Vitest + React Testing Library

## Next Immediate Steps:

1. **Create GitHub repository**
2. **Set up Supabase project**
3. **Initialize Next.js app**
4. **Implement basic auth**
5. **Create first task CRUD**

Would you like me to:
- Generate the initial project structure?
- Create the Supabase schema SQL?
- Build the first React components?
- Set up the development environment scripts?
