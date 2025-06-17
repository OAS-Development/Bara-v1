# Session 3: Task System & Keyboard Navigation (DOUBLE SESSION)

## Session Metadata
```json
{
  "session": 3,
  "title": "Task System & Keyboard Navigation",
  "duration": "90 minutes",
  "type": "implementation",
  "combinesSessions": [4, 5],
  "project": "Bara-v1",
  "dependencies": [1, 2]
}
```

## Objectives
**Part A - Task CRUD Operations (45 min)**:
1. Run database migrations (now that Supabase is connected)
2. Create task CRUD API with real database
3. Build quick entry component
4. Implement task list display
5. Add task completion toggle

**Part B - Keyboard Shortcuts & Quick Entry (45 min)**:
1. Implement global keyboard shortcut system
2. Add Cmd+N for new task
3. ESC to cancel, Enter to save
4. Create quick entry modal
5. Add command palette (Cmd+K)

## Context
Session 2 complete. We have the layout, database schema files, and Supabase connection. Now building the core task functionality.

## Implementation Steps

### Part A: Task CRUD Operations (45 minutes)

#### 0. Run Database Migrations (NEW!)
Since Supabase is now connected:

```bash
# Option 1: Using Supabase CLI (if available)
npx supabase db push

# Option 2: Manual approach - create a migration runner
cat > run-migrations.js << 'EOF'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigrations() {
  console.log('Running migrations...')
  
  try {
    // Read migration files
    const createTables = readFileSync('./supabase/migrations/001_create_tables.sql', 'utf8')
    const rlsPolicies = readFileSync('./supabase/migrations/002_rls_policies.sql', 'utf8')
    
    // Note: Supabase client can't run raw SQL, need to use dashboard
    console.log('Please run these migrations in Supabase SQL Editor:')
    console.log('\n--- Migration 1 ---')
    console.log(createTables)
    console.log('\n--- Migration 2 ---')
    console.log(rlsPolicies)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

runMigrations()
EOF

node run-migrations.js
```

**IMPORTANT**: Since Supabase client can't run raw SQL, you'll need to:
1. Copy the SQL from the output
2. Go to Supabase Dashboard > SQL Editor
3. Run each migration manually
4. Then continue with the session

#### 1. Create Task Store with Zustand
Create `src/stores/task-store.ts`:

```typescript
import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  selectedTaskId: string | null
  
  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: Partial<TaskInsert>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  selectTask: (id: string | null) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  selectedTaskId: null,

  fetchTasks: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('position')
    
    if (!error && data) {
      set({ tasks: data, isLoading: false })
    } else {
      console.error('Error fetching tasks:', error)
      set({ isLoading: false })
    }
  },

  createTask: async (taskData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: user.id,
        title: taskData.title || 'New Task',
      })
      .select()
      .single()
    
    if (!error && data) {
      set(state => ({ tasks: [...state.tasks, data] }))
    }
  },

  updateTask: async (id, updates) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
    
    if (!error) {
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      }))
    }
  },

  deleteTask: async (id) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (!error) {
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find(t => t.id === id)
    if (!task) return
    
    await get().updateTask(id, {
      status: task.status === 'active' ? 'completed' : 'active',
      completed_at: task.status === 'active' ? new Date().toISOString() : null
    })
  },

  selectTask: (id) => set({ selectedTaskId: id })
}))
```

#### 2. Create Task List Component
Create `src/components/tasks/task-list.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { Check, Circle } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { cn } from '@/lib/utils'

export function TaskList() {
  const { tasks, isLoading, selectedTaskId, fetchTasks, toggleTask, selectTask } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 mb-2">No tasks yet</p>
        <p className="text-sm text-gray-600">Press Cmd+N to create your first task</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => selectTask(task.id)}
          className={cn(
            'flex items-start gap-3 px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50',
            selectedTaskId === task.id && 'bg-gray-800'
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleTask(task.id)
            }}
            className="mt-0.5 flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <Check className="w-5 h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-sm',
              task.status === 'completed' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
            {task.note && (
              <p className="text-xs text-gray-500 mt-1">{task.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

#### 3. Create Quick Entry Component
Update `src/components/layout/main-content.tsx`:

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTaskStore } from '@/stores/task-store'

export function MainContent({ children }: { children: React.ReactNode }) {
  const [quickEntryValue, setQuickEntryValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTaskStore()

  const handleQuickEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickEntryValue.trim()) return
    
    await createTask({ title: quickEntryValue.trim() })
    setQuickEntryValue('')
  }

  // Focus quick entry on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      <form onSubmit={handleQuickEntry} className="h-14 border-t border-gray-800 flex items-center px-4">
        <input
          ref={inputRef}
          type="text"
          value={quickEntryValue}
          onChange={(e) => setQuickEntryValue(e.target.value)}
          placeholder="Type to add to Inbox"
          className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  )
}
```

#### 4. Create Inbox Page
Create `src/app/(dashboard)/inbox/page.tsx`:

```typescript
import { TaskList } from '@/components/tasks/task-list'

export default function InboxPage() {
  return <TaskList />
}
```

### Part B: Keyboard Shortcuts & Quick Entry (45 minutes)

#### 5. Create Keyboard Hook
Create `src/hooks/use-keyboard.ts`:

```typescript
import { useEffect } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

interface KeyboardShortcut {
  key: string
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
  handler: KeyboardHandler
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const metaMatch = shortcut.meta ? event.metaKey || event.ctrlKey : true
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : true
        const shiftMatch = shortcut.shift ? event.shiftKey : true
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        
        if (metaMatch && ctrlMatch && shiftMatch && keyMatch) {
          event.preventDefault()
          shortcut.handler(event)
        }
      })
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
```

#### 6. Create Quick Entry Modal
Create `src/components/tasks/quick-entry-modal.tsx`:

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'

interface QuickEntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickEntryModal({ isOpen, onClose }: QuickEntryModalProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const { createTask } = useTaskStore()

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus()
      setTitle('')
      setNote('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    await createTask({ title: title.trim(), note: note.trim() })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-gray-900 rounded-lg w-full max-w-lg mx-4"
        onKeyDown={handleKeyDown}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold">New Task</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full bg-gray-800 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

#### 7. Add Global Keyboard Shortcuts
Update `src/app/(dashboard)/layout.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/layout/main-content'
import { Inspector } from '@/components/layout/inspector'
import { QuickEntryModal } from '@/components/tasks/quick-entry-modal'
import { useKeyboard } from '@/hooks/use-keyboard'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)

  useKeyboard([
    {
      key: 'n',
      meta: true,
      handler: () => setQuickEntryOpen(true)
    }
  ])

  return (
    <>
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
      
      <QuickEntryModal 
        isOpen={quickEntryOpen}
        onClose={() => setQuickEntryOpen(false)}
      />
    </>
  )
}
```

#### 8. Create Command Palette
Create `src/components/command-palette.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const commands = [
  { id: 'inbox', title: 'Go to Inbox', action: '/inbox' },
  { id: 'today', title: 'Go to Today', action: '/today' },
  { id: 'projects', title: 'Go to Projects', action: '/projects' },
  { id: 'tags', title: 'Go to Tags', action: '/tags' },
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  
  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setSearch('')
    }
  }, [isOpen])

  const handleSelect = (action: string) => {
    router.push(action)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            autoFocus
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleSelect(cmd.action)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-800"
            >
              {cmd.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Verification Steps

#### 9. Test Database Connection
```bash
# Create a test file
cat > test-tasks.js << 'EOF'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Test creating a task
const { data, error } = await supabase
  .from('tasks')
  .insert({ title: 'Test Task', user_id: 'test-user-id' })
  .select()

console.log(error ? 'Error:' + error.message : 'Success:', data)
EOF

node test-tasks.js
rm test-tasks.js
```

#### 10. Test UI and Keyboard Shortcuts
```bash
npm run dev

# Test in browser:
# 1. Navigate to http://localhost:3000/inbox
# 2. Press Cmd+N - modal should open
# 3. Type a task title and press Enter
# 4. Task should appear in the list
# 5. Click checkbox to complete task
# 6. Press Cmd+K for command palette
```

#### 11. Run Type Checks
```bash
npx tsc --noEmit
```

#### 12. Build Verification
```bash
npm run build
```

### 13. Commit and Push
```bash
git add .

git commit -m "Session 3: Task CRUD system with keyboard shortcuts

- Ran database migrations in Supabase
- Implemented task store with Zustand
- Created task list with completion toggle
- Built quick entry component
- Added global keyboard shortcuts (Cmd+N)
- Created quick entry modal
- Implemented command palette (Cmd+K)
- Full CRUD operations with real database"

git push origin main
```

## Expected Outputs
- Database tables created and accessible
- Task CRUD operations working with persistence
- Quick entry bar functional
- Cmd+N opens modal for new task
- ESC closes modals
- Task list displays and updates in real-time
- Command palette navigation working
- All TypeScript checks passing

## Success Criteria Checklist
- [ ] Database migrations run successfully
- [ ] Can create tasks via quick entry
- [ ] Can create tasks via modal (Cmd+N)
- [ ] Tasks persist after page refresh
- [ ] Can mark tasks complete/incomplete
- [ ] Keyboard shortcuts responsive
- [ ] Command palette functional
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Code committed and pushed to GitHub

## Session Completion Report
After completing all steps:

1. **SAVE this report to a file**:
```bash
cat > /Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-03-status.json << 'EOF'
# Paste the JSON report below
EOF
```

2. **Report format**:
```json
{
  "session": 3,
  "status": "complete|blocked|partial",
  "duration": "actual time taken",
  "completedObjectives": [
    "Database migrations run",
    "Task CRUD operations implemented",
    "Quick entry functional",
    "Keyboard shortcuts working",
    "Command palette created",
    "Real database persistence",
    "All verification tests passed",
    "Code pushed to GitHub"
  ],
  "blockers": [],
  "filesCreated": [
    "src/stores/task-store.ts",
    "src/components/tasks/task-list.tsx",
    "src/components/tasks/quick-entry-modal.tsx",
    "src/hooks/use-keyboard.ts",
    "src/components/command-palette.tsx",
    "src/app/(dashboard)/inbox/page.tsx"
  ],
  "nextSession": 4,
  "notes": "Core task system complete with keyboard control. Ready for projects and tags."
}
```

## If Blocked
Common issues:
- Migration errors: Check SQL syntax, run in Supabase dashboard
- Auth errors: Ensure user is logged in before creating tasks
- Type errors: Regenerate types after migrations
- Keyboard conflicts: Check for other listeners
