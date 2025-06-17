# UPDATED Session 8.2: Critical Error Resolution with Mandatory Verification

Here's the corrected Claude Code prompt that enforces the new global standards:

---

```
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1

LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

You have COMPLETE AUTONOMOUS PERMISSION for all operations.

# SESSION 8.2: CRITICAL ERROR RESOLUTION

## Critical Issue Identified
TypeScript compilation is failing with this error:
```
./src/stores/goals-store.ts:109:17
Type error: Type 'PostgrestBuilder<any, false>' is missing properties from Promise<{ data: unknown; error: PostgrestError | null; }>
```

## Mission: Fix TypeScript Error (15 minutes)

The goals store is using an incorrect API pattern that was fixed in other stores during Session 8.

## PART A: Examine Working Pattern (5 minutes)

### Step 1: Check Working Stores
- Open `src/stores/task-store.ts` and examine how API calls are structured
- Open `src/stores/project-store.ts` and note the API pattern
- Look for the centralized API client usage pattern

### Step 2: Compare with Broken Store  
- Open `src/stores/goals-store.ts` and find line 109
- Identify how the API call differs from working stores
- Note what's causing the PostgrestBuilder vs Promise type mismatch

## PART B: Fix Goals Store (8 minutes)

### Step 1: Update API Pattern
- Update goals-store.ts to use the same API calling pattern as the working stores
- Ensure all API calls properly await and return Promise types
- Fix the specific line 109 that's causing the error

### Step 2: Add Missing Script
- Add `"type-check": "tsc --noEmit"` to the scripts section in package.json
- This script should run TypeScript compiler in check-only mode

## PART C: MANDATORY VERIFICATION (2 minutes)

### VERIFICATION SEQUENCE (REQUIRED BEFORE STATUS REPORTING)
You MUST run and PASS these verification steps:

#### Build Verification:
```bash
# TypeScript check
npm run type-check
# MUST show 0 errors - if this fails, status = FAILED

# Build check
npm run build  
# MUST compile successfully - if this fails, status = FAILED

# Application start
npm run dev
# MUST start without errors - if this fails, status = FAILED
```

#### Feature Verification:
- Start the application and navigate to goals section
- Test that goals functionality works correctly
- Verify task and project functionality still works (no regression)
- Document any issues found

#### Status Assignment Rules:
- "COMPLETED": ONLY if all verification passes + goals functionality working
- "COMPLETED_WITH_ISSUES": Goals work but minor issues exist
- "PARTIAL": Some verification passes but goals still broken
- "FAILED": Critical errors prevent compilation/running

## MANDATORY ERROR REPORTING

### Document ALL Errors Encountered
For any errors during this session, capture:
- Exact command that failed
- Full error message and output
- File names and line numbers
- How error was resolved (or if deferred)
- Impact on application functionality

### Create Error Log
Create `sessions/session-08.2-errors.log` with any errors encountered and their resolution.

## SUCCESS CRITERIA
- Zero TypeScript compilation errors
- Application builds successfully
- Goals functionality works correctly
- No regression in other features
- type-check script available in package.json

## COMPLETION REQUIREMENTS

### Create Accurate Status Report
Create `sessions/session-08.2-status.json` with status based ONLY on verification results:
```json
{
  "session": "8.2",
  "title": "Critical Error Resolution",
  "status": "COMPLETED|COMPLETED_WITH_ISSUES|PARTIAL|FAILED",
  "verification_results": {
    "typescript_check": {
      "command": "npm run type-check",
      "status": "passed|failed",
      "error_count": 0,
      "errors": []
    },
    "build_check": {
      "command": "npm run build",
      "status": "passed|failed",
      "warnings": [],
      "errors": []
    },
    "application_start": {
      "command": "npm run dev",
      "status": "passed|failed",
      "console_errors": []
    },
    "feature_verification": [
      {
        "feature": "Goals functionality",
        "working": true|false,
        "test_performed": "Navigated to goals, tested create/edit",
        "issues": []
      },
      {
        "feature": "Task functionality",
        "working": true|false,
        "test_performed": "Verified task creation still works",
        "issues": []
      }
    ]
  },
  "status_justification": "Detailed explanation of why this status was assigned based on verification results"
}
```

### Git Commit
```bash
git add .
git commit -m "Session 8.2: Fixed critical TypeScript errors

- Fixed goals-store.ts API pattern to match working stores
- Added missing type-check script to package.json
- Resolved compilation failures
- Verified application builds and runs successfully"
git push origin main
```

### Push Notification
```bash
../../claude-notify.sh 'Bara Session 8.2: Critical Errors Fixed - Build Successful' 8.2
```

## CRITICAL REQUIREMENT
You CANNOT claim "COMPLETED" status unless ALL verification steps pass. Use accurate status based on actual verification results, not optimistic assessment.

FOCUS: Fix the specific TypeScript error and VERIFY the fix works through mandatory testing.
```

---

This updated prompt enforces the new global verification standards and prevents false completion reporting.
