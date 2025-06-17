# Session 4 Manual Test Checklist

## Prerequisites
1. Dev server running: `npm run dev`
2. Open http://localhost:3000
3. Create a test account or use existing account

## Feature Tests

### ✅ 1. PROJECTS
- [ ] Navigate to Projects page
- [ ] Create a new project "Test Project 1"
  - Set type: Parallel
  - Add description
  - Set review interval: 7 days
- [ ] Create a sub-project under "Test Project 1"
  - Name: "Test Sub-Project"
  - Type: Sequential
- [ ] Edit "Test Project 1"
  - Change description
  - Change review interval to 14 days
- [ ] Verify hierarchy displays correctly with indentation

### ✅ 2. TAGS
- [ ] Navigate to Tags page (or tag management)
- [ ] Create tag "Work" with red color
- [ ] Create tag "Personal" with blue color
- [ ] Create tag "Urgent" with orange color
- [ ] Go to Inbox and create a new task
- [ ] Assign multiple tags to the task
- [ ] Filter tasks by tag (if filter UI exists)

### ✅ 3. DATES
- [ ] Create a task with:
  - Defer date: Today
  - Due date: Tomorrow
- [ ] Create another task with:
  - Defer date: Next week
  - Due date: Next month
- [ ] Navigate to "Today" view
  - Verify first task appears
  - Verify second task doesn't appear
- [ ] Navigate to "Forecast" view
  - Verify calendar shows tasks on correct dates
  - Verify both tasks appear in timeline

### ✅ 4. PERSPECTIVES
- [ ] Navigate to Perspectives section
- [ ] Create new perspective "Work Focus"
  - Filter by tag: Include "Work"
  - Availability: Available only
  - Save the perspective
- [ ] Create another perspective "Urgent Items"
  - Filter by tag: Include "Urgent"
  - Date filter: Has due date
  - Save the perspective
- [ ] Refresh the page (Cmd+R)
- [ ] Verify perspectives still exist and work

### ✅ 5. REVIEWS
- [ ] Navigate to Review page
- [ ] Check review stats display
- [ ] Click "Start Review"
- [ ] If projects need review:
  - Step through review questions
  - Mark at least one project as reviewed
- [ ] Return to Review page
- [ ] Verify stats updated

### ✅ 6. IMPORT
- [ ] Navigate to Import page
- [ ] Create a test CSV file with tasks
- [ ] Upload file (drag & drop or click)
- [ ] Verify preview shows
- [ ] Check mapping options
- [ ] (Don't need to complete import, just verify UI works)

### ✅ 7. DATA PERSISTENCE
- [ ] Refresh browser (Cmd+R)
- [ ] Verify all created data still exists:
  - Projects and sub-projects
  - Tags
  - Tasks with dates
  - Custom perspectives
  - Review status
- [ ] Sign out and sign back in
- [ ] Verify data still persists

## Results

### If ALL tests pass:
1. All features work as expected
2. Data persists correctly
3. No console errors during testing
4. Update session-04-status-BLOCKED.json:
   - Change status from "BLOCKED" to "completed"
   - Remove blocking issues
   - Add completion timestamp

### If ANY tests fail:
1. Document which specific features failed
2. Note any console errors
3. Keep status as "BLOCKED"
4. Add details of failures to blocking_issues

## Console Commands for Verification

Open browser console and run:
```javascript
// Check if tables exist (should see data, not errors)
await (await fetch('/api/debug/tables')).json()
```