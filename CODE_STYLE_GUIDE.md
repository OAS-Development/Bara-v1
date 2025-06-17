# Bara v1 Code Style Guide

## Overview
This document outlines the coding standards and patterns used throughout the Bara v1 codebase. All code should follow these conventions for consistency and maintainability.

## TypeScript

### Type Imports
- Always use `import type` for type-only imports
- Group type imports separately from value imports

```typescript
// ✅ Good
import type { Database } from '@/types/database.types'
import type { Task, Project } from '@/types'
import { useTaskStore } from '@/stores/task-store'

// ❌ Bad
import { Database } from '@/types/database.types'
import { Task, useTaskStore } from '@/stores/task-store'
```

### Type Definitions
- Define types at the top of files after imports
- Use interfaces for object shapes that might be extended
- Use type aliases for unions, intersections, and utility types

```typescript
// Database row types
type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']

// Extended types
interface TaskWithTags extends Task {
  tags?: string[]
}

// Store state interfaces
interface TaskStore {
  tasks: TaskWithTags[]
  isLoading: boolean
  error: ApiError | null
}
```

## API Calls

### Use Centralized API Client
All Supabase queries must go through the centralized API client:

```typescript
// ✅ Good
import { api, isApiError } from '@/lib/api/client'

const result = await api.query(
  () => api.client.from('tasks').select('*'),
  { errorContext: 'Failed to fetch tasks' }
)

if (isApiError(result)) {
  set({ error: result.error })
  return
}

// ❌ Bad
const { data, error } = await supabase.from('tasks').select('*')
if (error) throw error
```

### Mutations with Feedback
Use `api.mutate` for operations that should show success messages:

```typescript
const result = await api.mutate(
  () => api.client.from('tasks').insert(data),
  { 
    successMessage: 'Task created successfully',
    errorContext: 'Failed to create task' 
  }
)
```

## Error Handling

### Store Error State
- All stores must have an `error` property of type `ApiError | null`
- All stores must have a `clearError` method
- Never use `console.error` directly

```typescript
interface StoreState {
  error: ApiError | null
  // ... other state
  clearError: () => void
}
```

### Component Error Boundaries
Wrap critical UI sections with error boundaries:

```typescript
import { AsyncErrorBoundary } from '@/components/error-boundary'

export default function CriticalPage() {
  return (
    <AsyncErrorBoundary>
      <PageContent />
    </AsyncErrorBoundary>
  )
}
```

## React Patterns

### Hooks Dependencies
Always include all dependencies in useEffect, useCallback, and useMemo:

```typescript
// ✅ Good
useEffect(() => {
  fetchData()
}, [fetchData]) // Include all dependencies

// ❌ Bad
useEffect(() => {
  fetchData()
}, []) // Missing dependency
```

### Component Structure
1. Imports (types first, then values)
2. Type definitions
3. Component function
4. Hooks in order: useState, useEffect, custom hooks
5. Event handlers
6. Render logic

## State Management

### Zustand Store Pattern
```typescript
import { create } from 'zustand'
import { api, isApiError, type ApiError } from '@/lib/api/client'

interface StoreState {
  // State
  items: Item[]
  isLoading: boolean
  error: ApiError | null
  
  // Actions
  fetchItems: () => Promise<void>
  createItem: (data: ItemCreateData) => Promise<void>
  clearError: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  items: [],
  isLoading: false,
  error: null,
  
  // Actions with consistent error handling
  fetchItems: async () => {
    set({ isLoading: true, error: null })
    
    const result = await api.query(
      () => api.client.from('items').select('*'),
      { errorContext: 'Failed to fetch items' }
    )
    
    if (isApiError(result)) {
      set({ error: result.error, isLoading: false })
      return
    }
    
    set({ items: result.data, isLoading: false })
  },
  
  clearError: () => set({ error: null })
}))
```

## UI Components

### Toast Notifications
- Use `sonner` for all toast notifications
- Do not use `react-hot-toast`
- Let the API client handle error toasts automatically

```typescript
// ✅ Good
import { toast } from 'sonner'
toast.success('Operation completed')

// ❌ Bad
import toast from 'react-hot-toast'
```

### Loading States
Always show loading indicators during async operations:

```typescript
if (loading) {
  return <LoadingSpinner />
}
```

### Empty States
Handle empty data gracefully:

```typescript
if (!items.length) {
  return <EmptyState message="No items found" />
}
```

## File Organization

### Directory Structure
```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # Base UI components
│   └── [feature]/   # Feature-specific components
├── lib/             # Utilities and helpers
│   ├── api/         # API client and helpers
│   ├── supabase/    # Supabase configuration
│   └── utils.ts     # General utilities
├── stores/          # Zustand stores
└── types/           # TypeScript type definitions
```

### Naming Conventions
- Components: PascalCase (e.g., `TaskList.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types/Interfaces: PascalCase (e.g., `TaskWithTags`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

## Code Formatting

### Prettier Configuration
All code is automatically formatted with Prettier using these settings:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
```

### Import Order
1. React/Next imports
2. Third-party libraries
3. Local type imports
4. Local value imports
5. Styles

## Security

### Never Expose Secrets
- Never log sensitive data
- Never commit API keys or secrets
- Use environment variables for configuration

### Input Validation
- Validate all user inputs
- Use Zod schemas for form validation
- Sanitize data before database operations

## Performance

### Memoization
Use React.memo, useMemo, and useCallback appropriately:

```typescript
// Memoize expensive computations
const sortedTasks = useMemo(
  () => tasks.sort((a, b) => a.order - b.order),
  [tasks]
)

// Memoize callbacks passed to children
const handleClick = useCallback((id: string) => {
  // Handle click
}, [])
```

### Code Splitting
- Use dynamic imports for large components
- Lazy load routes and heavy features

## Testing

### Test File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.spec.ts` or `*.spec.tsx`

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
  
  it('should handle user interactions', () => {
    // Test implementation
  })
})
```

## Comments

### When to Comment
- Complex business logic
- Non-obvious implementations
- TODO items with ticket references
- Type definitions that need clarification

### Comment Style
```typescript
// Single line comment for brief explanations

/**
 * Multi-line comment for functions and complex logic
 * @param userId - The ID of the user
 * @returns User data with computed fields
 */
```

## Git Commits

### Conventional Commits
Use conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

### Commit Messages
```
feat: add task filtering by project

fix: resolve timezone issue in due date picker

refactor: extract api client to centralized module
```