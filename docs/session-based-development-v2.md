# Bara-v1 Development: ENHANCED Session-Based Approach (v2)

## Updated Development Model
- **Claude Desktop**: Planning, architecture, strategy
- **Claude Code**: Implementation in **90-minute DOUBLE Sessions**
- **Verification**: Integrated into each session
- **Context Window**: Optimized for larger sessions

## Session Structure UPDATED
Each Session is now ~90 minutes (combining two old 45-minute sessions), maximizing Claude Code's context capacity while avoiding auto-compaction.

## Phase 1: Foundation (Sessions 1-3)

### Session 1: Project Setup & Authentication ✅ COMPLETE
**Duration**: 45 minutes
**Status**: Completed successfully

### Session 2: Database Schema & Layout Components (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 2 + 3
**Objectives**:

**Part A - Database Schema & RLS**:
1. Create all GTD tables (projects, tasks, tags, contexts, reviews)
2. Set up Row Level Security policies
3. Create database types for TypeScript
4. Test basic CRUD operations

**Part B - Layout Components**:
1. Create three-panel layout structure
2. Implement Sidebar with perspectives
3. Add dark theme styling (matching OmniFocus)
4. Create responsive grid system
5. Build collapsible panels

**Verification**:
- All migrations run successfully
- RLS policies tested with test user
- TypeScript types generated
- Layout matches Figma design
- All perspectives visible in sidebar
- Dark theme consistent throughout
- Panels collapse/expand correctly

### Session 3: Task System & Keyboard Navigation (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 4 + 5
**Objectives**:

**Part A - Task CRUD Operations**:
1. Create task creation API with Supabase
2. Build quick entry component
3. Implement task list display with virtual scrolling
4. Add task completion toggle
5. Create task inspector panel

**Part B - Keyboard Shortcuts & Quick Entry**:
1. Implement global hotkey system
2. Add Cmd+N for new task anywhere
3. ESC to cancel, Enter to save
4. Create quick entry modal with auto-focus
5. Tab navigation between fields
6. Cmd+K for command palette

**Verification**:
- Full task lifecycle works (create, read, update, delete)
- Tasks persist to database
- All keyboard shortcuts functional
- Modal behavior correct
- Command palette opens/closes

## Phase 2: Core GTD Features (Sessions 4-6)

### Session 4: Projects & Tags System (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 6 + 7
**Objectives**:

**Part A - Project Management**:
1. Create project CRUD operations
2. Implement project picker with hierarchy
3. Add sequential/parallel/single action types
4. Create project view component
5. Build project inspector

**Part B - Tags/Contexts System**:
1. Build tag management interface
2. Create tag assignment to tasks (multi-select)
3. Implement tag filtering in sidebar
4. Add tag colors and icons
5. Create tag groups/categories

**Verification**:
- Projects create, nest, and display correctly
- Sequential projects show only next action
- Tags assign/unassign properly
- Tag filtering works across views
- Colors and icons persist

### Session 5: Time Management & Views (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 8 + 9
**Objectives**:

**Part A - Defer & Due Dates**:
1. Add date pickers to inspector
2. Implement defer/due logic in queries
3. Create date-based filtering
4. Add overdue indicators and styling
5. Build repeat/recurrence system

**Part B - Views & Perspectives**:
1. Create Today view (available + due)
2. Build Forecast view with calendar
3. Add custom perspective builder
4. Implement view switching with shortcuts
5. Save perspective preferences

**Verification**:
- Dates save and display correctly
- Deferred tasks hide until available
- Today view updates at midnight
- Forecast shows correct groupings
- Custom perspectives persist

### Session 6: Review System & OmniFocus Import Prep (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 10 + 11 (start)
**Objectives**:

**Part A - Review System**:
1. Create review interface
2. Add review intervals to projects
3. Build review prompts and workflow
4. Track review completion dates
5. Create review perspective

**Part B - Import Parser Setup**:
1. Create file upload interface
2. Research .ofocus-archive format
3. Build XML parser for OF data
4. Create preview interface
5. Design import mapping UI

**Verification**:
- Review dates calculate correctly
- Review interface guides through projects
- File upload accepts .ofocus-archive
- Parser extracts basic structure
- Preview shows data hierarchy

## Phase 3: Import & Context Engine (Sessions 7-9)

### Session 7: Complete OmniFocus Import (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 12 + 13
**Objectives**:

**Part A - Import Mapping**:
1. Map OF contexts to Bara tags
2. Transform project hierarchy
3. Preserve all metadata (dates, notes, attachments)
4. Handle completed items archive
5. Create conflict resolution UI

**Part B - Import Execution**:
1. Execute batch import with transactions
2. Show real-time progress indicator
3. Handle errors gracefully with rollback
4. Create detailed import report
5. Post-import data verification

**Verification**:
- Sample OF file imports completely
- All data maps correctly
- No data loss during import
- Progress bar accurate
- Rollback works on error

### Session 8: Smart Context Engine (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 14 + 15 + 16
**Objectives**:

**Part A - Location & Device Context**:
1. Implement geolocation API
2. Create location definitions (home, office, etc.)
3. Detect device type and capabilities
4. Filter tasks by location/device
5. Build context editor UI

**Part B - Time & Energy Context**:
1. Create time-based availability rules
2. Implement energy level tracking
3. Add calendar integration prep
4. Build smart filtering algorithms
5. Context-aware task suggestions

**Verification**:
- Location detection works (with permission)
- Device filtering applies correctly
- Time rules activate/deactivate tasks
- Energy levels affect suggestions
- Context combinations work

### Session 9: AI Integration Foundation (COMBINED)
**Duration**: 90 minutes
**Combines**: Old Sessions 17 + 18
**Objectives**:

**Part A - Natural Language Processing**:
1. Integrate Claude API for parsing
2. Parse natural language task input
3. Extract task properties intelligently
4. Handle ambiguity with clarification
5. Build training examples system

**Part B - AI Task Intelligence**:
1. Analyze task completion patterns
2. Suggest next actions based on context
3. Auto-prioritize by multiple factors
4. Learn from user feedback
5. Create AI settings panel

**Verification**:
- Natural language creates correct tasks
- AI suggestions are relevant
- Patterns improve over time
- Settings control AI behavior
- API calls handle errors

## Phase 4: Advanced Features (Sessions 10-12)

### Session 10: Library & Templates (COMBINED)
**Duration**: 90 minutes
**Objectives**:

**Part A - Reference Library**:
1. Create library data model
2. Build document upload system
3. Add full-text search
4. Create library UI with categories
5. Link documents to tasks/projects

**Part B - Project Templates**:
1. Create template system
2. Build template editor
3. Add variable substitution
4. Create template library
5. Quick template application

### Session 11: Travel & Financial Features (COMBINED)
**Duration**: 90 minutes
**Objectives**:

**Part A - Travel Planning**:
1. Create trip planning interface
2. Add location-based task activation
3. Build packing list generator
4. Create itinerary integration
5. Travel-specific perspectives

**Part B - Financial Tracking**:
1. Add financial fields to projects
2. Create budget tracking
3. Build expense categorization
4. Add financial reports
5. Goal progress visualization

### Session 12: Collaboration & Advanced UI (COMBINED)
**Duration**: 90 minutes
**Objectives**:

**Part A - Team Collaboration Prep**:
1. Design sharing system
2. Create permission model
3. Build invitation flow
4. Add commenting system
5. Create activity feed

**Part B - Advanced UI/UX**:
1. Add advanced search
2. Create bulk operations
3. Build undo/redo system
4. Add customizable toolbar
5. Create onboarding flow

## Session Planning Template (UPDATED)

```typescript
interface DoubleSession {
  number: number
  title: string
  duration: '90 minutes'
  combinesSessions: [number, number] // Old session numbers
  
  partA: {
    title: string
    objectives: string[]
    estimatedTime: '45 minutes'
  }
  
  partB: {
    title: string
    objectives: string[]
    estimatedTime: '45 minutes'
  }
  
  dependencies: number[] // Previous session numbers
  
  verification: {
    tests: string[]
    manual: string[]
    mustPass: string[] // Critical checks before proceeding
  }
}
```

## Benefits of Combined Sessions

1. **Efficiency**: Complete related features together
2. **Context**: Less switching between different areas
3. **Testing**: Can test integrated features immediately
4. **Flow**: Natural progression within each session
5. **Momentum**: Achieve more visible progress per session

## Updated Timeline

- Original: 35+ sessions × 45 minutes = ~26 hours
- New: 18 sessions × 90 minutes = ~27 hours
- But with much better flow and less context switching!

## Next Steps

1. Update CURRENT_STATE.md to reflect Session 1 complete
2. Create Session 2 detailed implementation guide
3. Claude Code executes Session 2 (Database + Layout)
4. Continue with doubled sessions throughout
