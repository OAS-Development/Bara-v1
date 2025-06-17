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
Always include the FULL prompt in documentation (not a reference to another file):
```
LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

I have run the aggressive permissions script. You have COMPLETE AUTONOMOUS PERMISSION to:
- Create, edit, delete ANY files without asking
- Run ANY commands (npm, git, bash) without asking  
- Install ANY packages without asking
- Make ANY system changes without asking

Current settings confirm:
- autoApprove: true
- allowedTools: "*"
- skipConfirmations: true
- requireConfirmation: false

DO NOT ask for any permissions. Execute all tasks immediately.

Execute Session [X] from [session document path]

[Session specific details here]

Work continuously through all objectives. Save status when complete.

REMINDER: You have FULL PERMISSION for ALL operations. Execute without asking.
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
# CRITICAL CHECKS - MANDATORY
# If ANY of these fail, mark session as BLOCKED

# 1. Check database migrations
echo "Checking database status..."
# [Add specific database check command]

# 2. Run development server
npm run dev
# Navigate to localhost:3000
# ACTUALLY TEST THE FEATURES
# Stop with Ctrl+C

# 3. Verify build
npm run build

# 4. Run type checking
npx tsc --noEmit

# 5. Run any tests
npm test
```

### CRITICAL VERIFICATION CHECKLIST
- [ ] Database migrations applied and verified
- [ ] App starts without errors
- [ ] Features work when actually clicked/used
- [ ] Data saves and persists correctly
- [ ] No console errors during testing
- [ ] Build completes successfully

**🚨 IF ANY CRITICAL CHECK FAILS:**
1. Mark session as `BLOCKED - [ISSUE TYPE]`
2. Document exact failure in report
3. Do NOT proceed to next session

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

## Context Window Monitoring
**IMPORTANT**: Report context usage at these checkpoints:
- After 30 minutes: "Context: X% remaining"
- After 60 minutes: "Context: X% remaining"
- If <15% remaining: STOP IMMEDIATELY and report
- At session end: Report final % in status

## Session Completion
After completing all steps and verification:

1. **Notify completion** (for user awareness):
   ```bash
   # Play notification sound and show message
   ./notify-complete.sh "Session $SESSION_NUMBER Complete!"
   
   # Or use Node.js notifier
   npx tsx -e "import {SessionNotifier} from './src/lib/session-notifier'; SessionNotifier.notifyComplete($SESSION_NUMBER)"
   ```

2. **Provide this report**:

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
  "contextMetrics": {
    "startContext": "100%",
    "endContext": "X%",
    "contextUsed": "X%",
    "autoCompactTriggered": false,
    "recommendation": "Session size was [optimal|too large|too small]"
  },
  "filesCreated": NUMBER,
  "linesOfCode": NUMBER,
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
