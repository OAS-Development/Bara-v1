# Session 8.2: Critical Error Resolution

## Session Metadata
- **Session Number**: 8.2
- **Title**: Critical Error Resolution  
- **Duration**: 15 minutes (focused fix)
- **Type**: Error Resolution
- **Priority**: CRITICAL (compilation failure)

## Critical Error Identified
```
./src/stores/goals-store.ts:109:17
Type error: Type 'PostgrestBuilder<any, false>' is missing the following properties from type 'Promise<{ data: unknown; error: PostgrestError | null; }>': catch, finally, [Symbol.toStringTag]
```

## Objectives
1. **Fix goals-store.ts TypeScript error** (CRITICAL - prevents build)
2. **Add missing type-check script** to package.json
3. **Verify application compiles and runs** successfully

## Root Cause Analysis
Session 8 created a centralized API client pattern, but goals-store.ts wasn't properly updated to use the new pattern. The API call is returning a PostgrestBuilder instead of a Promise.

## Implementation Plan

### Part A: Fix Goals Store API Call (10 minutes)

#### Step 1: Examine Current Pattern
- Look at working stores (task-store.ts, project-store.ts) 
- Identify the correct API pattern from Session 8
- Compare with broken goals-store.ts pattern

#### Step 2: Fix Goals Store
- Update goals-store.ts to use the same API pattern as working stores
- Ensure all API calls return proper Promise types
- Fix the specific line 109 error

#### Step 3: Add Missing Script
- Add `"type-check": "tsc --noEmit"` to package.json scripts
- Verify script works correctly

### Part B: Verification (5 minutes)

#### Build Test
```bash
npm run type-check  # Should pass with no errors
npm run build       # Should compile successfully  
npm run dev         # Should start without errors
```

#### Functionality Test
- Verify goals functionality works in browser
- Test that other features still work
- Confirm no regression from fix

## Success Criteria
- [ ] Zero TypeScript compilation errors
- [ ] `npm run build` succeeds
- [ ] Application starts and runs
- [ ] Goals functionality works
- [ ] No regression in other features

## Files to Modify
- `src/stores/goals-store.ts` (fix API calls)
- `package.json` (add type-check script)

## Session Completion
- Create error log with full details
- Update status with accurate assessment
- Verify enterprise quality standards maintained
