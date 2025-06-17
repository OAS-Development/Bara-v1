# Enhanced Error Reporting Protocol
# MANDATORY for all future sessions

## Required Error Capture

### During Session Execution
Claude Code MUST capture and report:

#### 1. All Command Errors
```bash
# Every command that fails must be logged with:
- Command that failed
- Full error output
- How it was resolved (or if it wasn't)
- Impact on session objectives
```

#### 2. Build/Compilation Errors  
```bash
# TypeScript, ESLint, build errors must include:
- File names with errors
- Line numbers and error messages
- Whether errors were fixed or deferred
- Workarounds applied
```

#### 3. Runtime Errors
```bash
# Browser console errors, failed API calls:
- Error messages and stack traces
- Which features are affected
- User impact assessment
- Resolution status
```

### Status Report Requirements

#### Mandatory Error Section
```json
{
  "errors_encountered": [
    {
      "type": "typescript|build|runtime|database",
      "severity": "critical|high|medium|low",
      "description": "Detailed error description",
      "command_or_location": "npm run build | src/file.ts:line",
      "full_error_message": "Complete error output",
      "resolution": "fixed|deferred|workaround|unresolved",
      "impact": "Description of what's affected"
    }
  ],
  "unresolved_errors": [
    "List of any errors that could not be fixed"
  ],
  "error_impact_assessment": "Overall impact on application functionality"
}
```

#### Session Status Accuracy
- "COMPLETED" only if NO critical/high errors remain
- "COMPLETED_WITH_ISSUES" if medium/low errors remain  
- "PARTIAL" if objectives completed but errors prevent full functionality
- "FAILED" if critical errors prevent basic functionality

### Error Persistence Requirements

#### 1. Session Error Log
Create `sessions/session-X.X-errors.log` with:
```
[TIMESTAMP] COMMAND_ERROR: npm run build
Error: Type 'undefined' is not assignable to type 'string'
Location: src/stores/finance-store.ts:45
Resolution: Added null check
Status: FIXED

[TIMESTAMP] RUNTIME_ERROR: Failed to fetch
API call to /api/tasks failed
Impact: Task creation not working
Resolution: DEFERRED - needs investigation
Status: UNRESOLVED
```

#### 2. Current Issues Tracker
Update `CURRENT_ISSUES.md` after every session:
```markdown
# Active Issues (Post-Session 8.1)

## Critical Issues
- None

## High Priority Issues  
- [Issue description]
- Impact: [What's affected]
- Session: [When introduced]

## Medium Priority Issues
- [Issue description]
```

### Immediate Action Required

Since we lost the Session 8.1 error details, we need to:

#### 1. Verify Current Application State
```bash
cd /Volumes/DevDrive/ClaudeProjects/active/Bara-v1
npm run type-check    # Check for TypeScript errors
npm run build         # Check for build errors  
npm run dev           # Check if app starts
```

#### 2. Test Critical Functionality
- Can you create tasks?
- Do finance components work?
- Are review components functional?
- Any console errors in browser?

#### 3. Document Current State
Create accurate assessment of what's actually working vs broken.
