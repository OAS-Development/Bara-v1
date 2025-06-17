# Session 4: Complete GTD Core (MEGA SESSION)

## Session Metadata
```json
{
  "session": 4,
  "title": "Complete GTD Core - Projects, Tags, Dates, Views, Reviews, Import",
  "duration": "4.5 hours planned (~45 minutes actual)",
  "type": "mega-implementation",
  "combinesSessions": [6, 7, 8, 9, 10, 11],
  "project": "Bara-v1",
  "dependencies": [1, 2, 3]
}
```

## Objectives
This mega-session builds the complete GTD core functionality:

**Part A - Project Management (45 min)**:
1. Create project CRUD operations
2. Implement sequential/parallel/single-action types
3. Build project hierarchy and nesting
4. Create project picker component
5. Add project views and inspector

**Part B - Tags/Contexts System (45 min)**:
1. Build tag management interface
2. Create tag assignment to tasks
3. Implement tag filtering
4. Add tag colors and icons
5. Create tag groups/categories

**Part C - Time Management (45 min)**:
1. Add defer and due dates to tasks
2. Create date pickers for inspector
3. Implement date-based filtering
4. Add overdue indicators
5. Build repeat/recurrence system

**Part D - Views & Perspectives (45 min)**:
1. Create Today view (available + due)
2. Build Forecast view with calendar grid
3. Add custom perspective builder
4. Implement view switching with shortcuts
5. Save perspective preferences

**Part E - Review System (45 min)**:
1. Add review intervals to projects
2. Create review interface
3. Build review workflow
4. Track review completion
5. Create review perspective

**Part F - Import Foundation (45 min)**:
1. Create file upload interface
2. Parse .ofocus-archive format
3. Extract tasks and projects
4. Build import preview
5. Design mapping interface

## Context
Sessions 1-3 complete. We have auth, layout, and basic tasks with keyboard shortcuts. Now building the complete GTD feature set in one comprehensive session.

## Implementation Steps

### Part A: Project Management System

#### 1. Create Project Store
Create `src/stores/project-store.ts`:
- Similar structure to task-store
- Handle project CRUD operations
- Support parent-child relationships
- Track project type (sequential/parallel/single-actions)
- Handle project status and completion

#### 2. Update Database Types
Ensure `src/types/database.types.ts` includes project types from migrations.

#### 3. Create Project Components
Create these components:
- `src/components/projects/project-list.tsx` - Hierarchical project display
- `src/components/projects/project-picker.tsx` - Modal for selecting project
- `src/components/projects/project-form.tsx` - Create/edit project form
- `src/components/projects/project-item.tsx` - Individual project in list

#### 4. Create Projects Page
Create `src/app/(dashboard)/projects/page.tsx`:
- Display project hierarchy
- Allow CRUD operations
- Show task counts per project

#### 5. Update Task Creation
Modify task creation to support project assignment:
- Add project picker to quick entry modal
- Update task store to handle project_id
- Show project name in task list

### Part B: Tags/Contexts System

#### 6. Create Tag Store
Create `src/stores/tag-store.ts`:
- CRUD operations for tags
- Support tag hierarchy (parent tags)
- Handle tag colors and icons

#### 7. Create Tag Components
Create these components:
- `src/components/tags/tag-manager.tsx` - Full tag management interface
- `src/components/tags/tag-picker.tsx` - Multi-select tag picker
- `src/components/tags/tag-chip.tsx` - Individual tag display
- `src/components/tags/tag-filter.tsx` - Filter tasks by tags

#### 8. Create Tags Page
Create `src/app/(dashboard)/tags/page.tsx`:
- Display all tags with hierarchy
- CRUD operations
- Color/icon management

#### 9. Update Task System for Tags
- Add tag picker to task creation/edit
- Display tags on task items
- Implement tag filtering in task list

### Part C: Date & Time Management

#### 10. Create Date Components
Create these components:
- `src/components/dates/date-picker.tsx` - Calendar date picker
- `src/components/dates/defer-due-picker.tsx` - Defer/due date combo
- `src/components/dates/repeat-picker.tsx` - Recurrence rules

#### 11. Update Task Store
Enhance task store to handle:
- Defer dates (task hidden until date)
- Due dates with time
- Overdue status calculations
- Repeat rules and next instance generation

#### 12. Create Date Filters
- Add date-based filtering to task queries
- Show only available tasks (defer date passed)
- Highlight overdue tasks
- Sort by due date when appropriate

### Part D: Views & Perspectives

#### 13. Create View Components
Create these components:
- `src/components/views/today-view.tsx` - Available + due today
- `src/components/views/forecast-view.tsx` - Calendar grid view
- `src/components/views/perspective-builder.tsx` - Custom filter builder
- `src/components/views/view-switcher.tsx` - Quick view switching

#### 14. Create View Pages
- `src/app/(dashboard)/today/page.tsx`
- `src/app/(dashboard)/upcoming/page.tsx`
- `src/app/(dashboard)/anytime/page.tsx`
- `src/app/(dashboard)/someday/page.tsx`

#### 15. Create Perspective Store
Create `src/stores/perspective-store.ts`:
- Save custom perspectives
- Store filter and sort rules
- Handle built-in vs custom perspectives

### Part E: Review System

#### 16. Add Review Fields
Update project store/components to include:
- Review interval (days)
- Last reviewed date
- Next review date calculation

#### 17. Create Review Components
- `src/components/review/review-interface.tsx` - Step through projects
- `src/components/review/review-prompt.tsx` - Individual project review
- `src/components/review/review-stats.tsx` - Review statistics

#### 18. Create Review Page
Create `src/app/(dashboard)/review/page.tsx`:
- Show projects due for review
- Guide through review process
- Update review dates on completion

### Part F: OmniFocus Import Foundation

#### 19. Create Import Components
- `src/components/import/file-upload.tsx` - Drag & drop file upload
- `src/components/import/import-preview.tsx` - Show parsed data
- `src/components/import/import-mapper.tsx` - Map OF to Bara structure

#### 20. Create Import Parser
Create `src/lib/import/omnifocus-parser.ts`:
- Parse .ofocus-archive XML format
- Extract projects, tasks, contexts
- Handle completed items
- Preserve hierarchy and metadata

#### 21. Create Import Page
Create `src/app/(dashboard)/import/page.tsx`:
- File upload interface
- Preview parsed data
- Mapping configuration
- Import execution (placeholder for Session 5)

## Verification Steps

### After Each Part:
1. Test the new functionality works
2. Verify integration with existing features
3. Check TypeScript compilation
4. Test data persistence

### Final Verification:
```bash
# 1. Full functionality test
npm run dev
# Test each new feature:
# - Create projects with hierarchy
# - Assign tasks to projects
# - Create and assign tags
# - Set defer/due dates
# - Create custom perspective
# - Review a project
# - Upload an OF file (parsing only)

# 2. TypeScript check
npx tsc --noEmit

# 3. Build test
npm run build

# 4. Run any tests
npm test
```

### Commit and Push:
```bash
git add .
git commit -m "Session 4: Complete GTD Core - Projects, Tags, Dates, Views, Reviews, Import

- Implemented full project management with types and hierarchy
- Created tag/context system with colors and assignment
- Added date management with defer/due/repeat
- Built multiple views and perspectives
- Created review system with intervals
- Added OmniFocus import foundation
- All features integrated and working together"

git push origin main
```

## Expected Outputs
- Complete project management system
- Full tag/context functionality
- Date-based task management
- Multiple views and perspectives
- Review workflow operational
- Import parser ready
- All integrated with existing task system
- Full TypeScript type safety
- All tests passing

## Success Criteria Checklist
- [ ] Projects: Can create, nest, and assign tasks
- [ ] Tags: Can create, color, and filter by tags
- [ ] Dates: Defer/due dates working with proper filtering
- [ ] Today View: Shows available + due tasks
- [ ] Forecast: Calendar grid displays tasks by date
- [ ] Custom Perspectives: Can create and save filters
- [ ] Reviews: Can review projects and track dates
- [ ] Import: Can parse OF files and preview
- [ ] Integration: All features work together
- [ ] Performance: No lag with many items
- [ ] Build: Production build succeeds
- [ ] Git: All changes committed and pushed

## Session Completion Report
After completing all steps:

Save your report to:
```bash
/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-04-status.json
```

Include:
- Status of each part (A-F)
- Any issues encountered
- Performance observations
- Integration notes
- What's ready for Session 5

## Common Issues to Watch For:
- State management complexity with multiple stores
- Date timezone handling
- Performance with nested projects
- Tag assignment UI complexity
- Perspective filter persistence
- Import file parsing edge cases

## Notes for Implementation:
- Keep components modular and reusable
- Use proper TypeScript types throughout
- Maintain consistent UI patterns from Sessions 1-3
- Ensure all features integrate smoothly
- Focus on performance with large datasets
- Make keyboard shortcuts work across all new features
