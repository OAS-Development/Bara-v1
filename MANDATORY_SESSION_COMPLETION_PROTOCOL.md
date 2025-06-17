# MANDATORY SESSION COMPLETION PROTOCOL
# GLOBAL STANDARD - ALL PROJECTS - ALL SESSIONS

## CRITICAL PRINCIPLE
**NO SESSION CAN BE MARKED "COMPLETED" WITHOUT PASSING ALL VERIFICATION CHECKS**

## MANDATORY VERIFICATION SEQUENCE

### Phase 1: Build Verification (MANDATORY)
Every session MUST run and PASS these commands before claiming completion:

```bash
# TypeScript Check (if applicable)
npm run type-check || tsc --noEmit
# RESULT: MUST be zero errors

# Build Check  
npm run build
# RESULT: MUST compile successfully with no errors

# Lint Check (if applicable)
npm run lint
# RESULT: MUST pass with no errors (warnings acceptable)

# Test Check (if tests exist)
npm test
# RESULT: MUST pass all tests
```

### Phase 2: Application Verification (MANDATORY)
```bash
# Start Application
npm run dev
# RESULT: MUST start without errors

# Browser Check
# - Application must load at localhost:3000
# - No console errors on initial load
# - Core functionality must work
```

### Phase 3: Feature Verification (MANDATORY)
For each objective claimed as "completed":
- Test the specific feature works
- Verify no regression in existing functionality
- Document any limitations or issues

## STATUS DEFINITIONS (MANDATORY)

### ✅ "COMPLETED" Status Requirements
Can ONLY be used when ALL of the following are true:
- [ ] Zero TypeScript/compilation errors
- [ ] Application builds successfully  
- [ ] Application starts without errors
- [ ] All session objectives functionally working
- [ ] No critical or high-severity issues introduced
- [ ] All verification commands pass

### ⚠️ "COMPLETED_WITH_ISSUES" Status
Use when objectives are met but non-critical issues remain:
- [ ] All session objectives completed functionally
- [ ] Application builds and runs
- [ ] Minor warnings or low-priority issues exist
- [ ] Issues documented with severity assessment

### 🔄 "PARTIAL" Status  
Use when some objectives completed but others blocked:
- [ ] Some session objectives completed
- [ ] Application builds and runs (maybe with workarounds)
- [ ] Some features may not work due to blockers
- [ ] Clear documentation of what works vs what doesn't

### ❌ "FAILED" Status
Use when session cannot achieve primary objectives:
- [ ] Critical errors prevent compilation or running
- [ ] Primary session objectives not achievable
- [ ] Application may not work at all
- [ ] Requires immediate follow-up session

## ERROR REPORTING REQUIREMENTS

### Mandatory Error Capture
Claude Code MUST capture and report:

```json
{
  "verification_results": {
    "typescript_check": {
      "command": "npm run type-check",
      "status": "passed|failed",
      "errors": ["Full error messages if any"],
      "error_count": 0
    },
    "build_check": {
      "command": "npm run build", 
      "status": "passed|failed",
      "warnings": ["Any build warnings"],
      "errors": ["Any build errors"]
    },
    "application_start": {
      "command": "npm run dev",
      "status": "passed|failed", 
      "can_access_localhost": true|false,
      "console_errors": ["Any browser console errors"]
    },
    "feature_verification": [
      {
        "feature": "Feature name",
        "working": true|false,
        "issues": ["Any problems found"]
      }
    ]
  },
  "session_status_justification": "Detailed explanation of why status was assigned"
}
```

### Error Severity Assessment
```json
{
  "errors_by_severity": {
    "critical": [
      "Compilation failures",
      "Application won't start", 
      "Core features broken"
    ],
    "high": [
      "Important features not working",
      "Significant functionality impacted"
    ],
    "medium": [
      "Minor features affected",
      "Workarounds available"
    ],
    "low": [
      "Cosmetic issues",
      "Non-blocking warnings"
    ]
  }
}
```

## MANDATORY VERIFICATION CHECKLIST

Claude Code MUST complete this checklist before ANY status reporting:

```markdown
## Pre-Status Verification Checklist

### Build Verification ✓
- [ ] TypeScript compilation: PASSED (0 errors)
- [ ] Application build: PASSED  
- [ ] Linting: PASSED (or warnings only)
- [ ] Tests: PASSED (if applicable)

### Runtime Verification ✓
- [ ] Application starts: YES
- [ ] Localhost accessible: YES
- [ ] No critical console errors: YES
- [ ] Core navigation works: YES

### Feature Verification ✓
For each session objective:
- [ ] Objective 1: WORKING / PARTIAL / NOT WORKING
- [ ] Objective 2: WORKING / PARTIAL / NOT WORKING
- [ ] No regression in existing features: CONFIRMED

### Status Assignment ✓
- [ ] All verification checks passed: YES/NO
- [ ] Status justified by evidence: YES
- [ ] Error details captured: YES (if any)
- [ ] Next steps documented: YES
```

## AUTOMATIC STATUS ASSIGNMENT

### Logic Flow
```javascript
function determineSessionStatus(verificationResults) {
  // CRITICAL failures = FAILED status
  if (verificationResults.typescript_check.status === 'failed' ||
      verificationResults.build_check.status === 'failed' ||
      verificationResults.application_start.status === 'failed') {
    return 'FAILED'
  }
  
  // Check objective completion
  const objectivesWorking = verificationResults.feature_verification
    .filter(f => f.working === true).length
  const totalObjectives = verificationResults.feature_verification.length
  
  // All objectives working + no critical issues = COMPLETED
  if (objectivesWorking === totalObjectives && 
      hasCriticalIssues(verificationResults) === false) {
    return 'COMPLETED'
  }
  
  // Most objectives working but minor issues = COMPLETED_WITH_ISSUES
  if (objectivesWorking === totalObjectives && 
      hasMinorIssues(verificationResults) === true) {
    return 'COMPLETED_WITH_ISSUES'
  }
  
  // Some objectives working = PARTIAL
  if (objectivesWorking > 0) {
    return 'PARTIAL'
  }
  
  // Nothing working = FAILED
  return 'FAILED'
}
```

## IMPLEMENTATION REQUIREMENTS

### For ALL Projects
- This protocol applies to EVERY project using the two-actor model
- No exceptions for "simple" sessions or "quick fixes"
- All verification steps mandatory regardless of session scope

### For Claude Code
- MUST run verification sequence before status reporting
- MUST capture all error details with full context
- MUST use evidence-based status assignment
- MUST document any deviations or issues

### For Claude Desktop  
- MUST include verification requirements in ALL session plans
- MUST specify clear success criteria with measurable outcomes
- MUST review session reports for accuracy
- MUST escalate any false positive reporting

## VIOLATION CONSEQUENCES

### If Claude Code Reports False Completion:
1. **Immediate correction session** required
2. **Root cause analysis** of verification failure
3. **Process improvement** to prevent recurrence
4. **Quality assessment** of other recent sessions

### Prevention Measures:
- **Automated verification scripts** where possible
- **Mandatory checklists** that cannot be skipped
- **Evidence-based reporting** instead of optimistic assessment
- **Cross-verification** of claims vs actual functionality

## GLOBAL ROLLOUT

### Immediate Implementation
- Apply to ALL current projects starting immediately
- Update ALL existing session templates
- Require verification retrofit for any recent sessions with questionable status

### Quality Audit
- Review ALL completed sessions for accurate status reporting
- Identify any other false completions
- Document pattern of verification failures

This protocol ensures that **"COMPLETED" status means actually completed** across all projects and sessions, preventing the critical failure that occurred in Session 8.1.
