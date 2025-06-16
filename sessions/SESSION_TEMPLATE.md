# Session Template

## Session Metadata
```json
{
  "session": NUMBER,
  "title": "Session Title",
  "duration": "45 minutes",
  "type": "implementation",
  "project": "Bara-v1",
  "dependencies": [/* previous session numbers */]
}
```

## Claude Code Prompt
Always start sessions with this permissions block:
```
For this session, you have permission to:
- Create all files and directories
- Run all npm/npx commands
- Install all packages
- Modify any files in the project
- Execute git commands
- Run the development server

Please proceed with Session X without asking for individual approvals.
```

## Objectives
1. Clear objective 1
2. Clear objective 2
3. Verify implementation works
4. Push changes to GitHub

## Context
Brief description of where we are in the project and what this session accomplishes.

## Implementation Steps

### 1. First Implementation Step
```bash
# Commands or code
```

### 2. Second Implementation Step
```typescript
// Code implementation
```

[... continue with all implementation steps ...]

### X. Verify Implementation
```bash
# Run development server
npm run dev
# Check functionality in browser
# Stop with Ctrl+C

# Verify build
npm run build

# Run type checking
npx tsc --noEmit

# Run any tests
npm test
```

### X+1. Manual Testing Checklist
- [ ] Test feature 1 works as expected
- [ ] Test feature 2 works as expected
- [ ] Verify no console errors
- [ ] Check responsive design
- [ ] Test error cases

### Final. Commit and Push
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Session X: Brief description of what was done"

# Push to GitHub
git push origin main
```

## Expected Outputs
- List what should exist after this session
- Working features
- New files created
- Tests passing

## Success Criteria Checklist
- [ ] All implementation steps completed
- [ ] Dev server runs without errors
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] All manual tests pass
- [ ] Code committed and pushed to GitHub

## Session Completion Report
After completing all steps and verification, provide this report:

```json
{
  "session": NUMBER,
  "status": "complete|blocked|partial",
  "completedObjectives": [
    // List what was accomplished
  ],
  "blockers": [
    // List any issues encountered
  ],
  "nextSession": NUMBER + 1,
  "notes": "Any important context for next session"
}
```

## If Blocked
If you encounter any blockers:
1. Document the specific error message
2. Note which step failed
3. Include any troubleshooting attempted
4. Report partial completion status
