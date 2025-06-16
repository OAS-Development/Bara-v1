# Bara-v1 Development: Session-Based Approach

## Development Model
- **Claude Desktop**: Planning, architecture, strategy (what we're doing now)
- **Claude Code**: Implementation in 45-minute Sessions
- **Verification**: Claude Code runs parallel terminal checks after each Session

## Session Structure
Each Session is ~45 minutes, designed to fit within Claude's context window without auto-compaction.

## Phase 1: Foundation (Sessions 1-5)

### Session 1: Project Setup & Authentication
**Duration**: 45 minutes
**Objectives**:
1. Initialize Next.js project with TypeScript
2. Set up Supabase project and authentication
3. Configure environment variables
4. Create basic folder structure

**Verification**: 
- `npm run dev` runs without errors
- Can navigate to localhost:3000
- Supabase connection test passes

### Session 2: Database Schema & RLS
**Duration**: 45 minutes
**Objectives**:
1. Create all GTD tables (projects, tasks, tags)
2. Set up Row Level Security policies
3. Create database types for TypeScript
4. Test basic CRUD operations

**Verification**:
- All migrations run successfully
- RLS policies tested with test user
- TypeScript types generated

### Session 3: Layout Components
**Duration**: 45 minutes
**Objectives**:
1. Create three-panel layout structure
2. Implement Sidebar with perspectives
3. Add dark theme styling
4. Create responsive grid system

**Verification**:
- Layout matches Figma design
- All perspectives visible in sidebar
- Dark theme consistent throughout

### Session 4: Task CRUD Operations
**Duration**: 45 minutes
**Objectives**:
1. Create task creation API
2. Build quick entry component
3. Implement task list display
4. Add task completion toggle

**Verification**:
- Can create new task
- Task persists to database
- Can mark task complete
- UI updates reflect changes

### Session 5: Keyboard Shortcuts & Quick Entry
**Duration**: 45 minutes
**Objectives**:
1. Implement Cmd+N for new task
2. Add ESC to cancel entry
3. Create quick entry modal
4. Add task to inbox by default

**Verification**:
- All shortcuts work as expected
- Modal opens/closes properly
- Tasks save to correct location

## Phase 2: Core GTD Features (Sessions 6-10)

### Session 6: Project Management
**Duration**: 45 minutes
**Objectives**:
1. Create project CRUD operations
2. Implement project picker
3. Add sequential/parallel types
4. Create project view component

### Session 7: Tags/Contexts System  
**Duration**: 45 minutes
**Objectives**:
1. Build tag management interface
2. Create tag assignment to tasks
3. Implement tag filtering
4. Add tag colors and icons

### Session 8: Defer & Due Dates
**Duration**: 45 minutes
**Objectives**:
1. Add date pickers to inspector
2. Implement defer/due logic
3. Create date-based filtering
4. Add overdue indicators

### Session 9: Views & Perspectives
**Duration**: 45 minutes
**Objectives**:
1. Create Today view
2. Build Forecast view
3. Add custom perspective builder
4. Implement view switching

### Session 10: Review System
**Duration**: 45 minutes
**Objectives**:
1. Create review interface
2. Add review intervals to projects
3. Build review prompts
4. Track review completion

## Phase 3: OmniFocus Import (Sessions 11-13)

### Session 11: Import Parser
**Duration**: 45 minutes
**Objectives**:
1. Create file upload interface
2. Parse .ofocus-archive format
3. Extract tasks and projects
4. Preview import data

### Session 12: Import Mapping
**Duration**: 45 minutes
**Objectives**:
1. Map OF contexts to tags
2. Transform project hierarchy
3. Preserve all metadata
4. Handle completed items

### Session 13: Import Execution
**Duration**: 45 minutes
**Objectives**:
1. Execute batch import
2. Show progress indicator
3. Handle errors gracefully
4. Create import report

## Phase 4: Context Engine (Sessions 14-18)

### Session 14: Location Context
**Duration**: 45 minutes
**Objectives**:
1. Implement geolocation API
2. Create location definitions
3. Add location-based filtering
4. Build location UI

### Session 15: Time Context
**Duration**: 45 minutes
**Objectives**:
1. Create time-based rules
2. Implement energy levels
3. Add calendar integration
4. Build time filtering

### Session 16: Device Context
**Duration**: 45 minutes
**Objectives**:
1. Detect device type
2. Adapt UI for mobile
3. Filter tasks by device
4. Optimize for context

### Session 17: AI Natural Language
**Duration**: 45 minutes
**Objectives**:
1. Integrate Claude API
2. Parse natural language input
3. Extract task properties
4. Handle ambiguity

### Session 18: AI Task Suggestions
**Duration**: 45 minutes
**Objectives**:
1. Analyze task patterns
2. Suggest next actions
3. Prioritize by context
4. Learn from feedback

## Session Planning Template

```typescript
interface Session {
  number: number
  title: string
  duration: '45 minutes'
  objectives: string[]
  dependencies: number[] // Previous session numbers
  
  setup: {
    files: string[]
    packages: string[]
    environment: string[]
  }
  
  implementation: {
    components: string[]
    api: string[]
    database: string[]
  }
  
  verification: {
    tests: string[]
    manual: string[]
    terminal: string[] // Commands to run in parallel terminal
  }
}
```

## Communication Between Claude Desktop & Claude Code

### From Desktop to Code (Session Start):
```json
{
  "session": 7,
  "title": "Tags/Contexts System",
  "objectives": [...],
  "context": {
    "previousSessions": [1,2,3,4,5,6],
    "currentState": "Basic CRUD complete",
    "focusAreas": ["Tag UI", "Tag assignment"]
  }
}
```

### From Code to Desktop (Session Complete):
```json
{
  "session": 7,
  "status": "complete",
  "implemented": [...],
  "issues": [...],
  "nextSession": {
    "recommended": 8,
    "prerequisites": []
  }
}
```

## Parallel Terminal Verification

Each Session ends with Claude Code running these checks:
```bash
# Session verification script
npm run lint
npm run type-check
npm test -- --coverage
npm run build
```

This Session-based approach ensures:
1. Manageable chunks that fit in context window
2. Clear handoff between planning and implementation
3. Verification at each step
4. No context loss between Sessions
