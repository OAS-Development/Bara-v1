# 🚨 CRITICAL CHECKS PROTOCOL - MANDATORY FOR ALL SESSIONS

## ⛔ CRITICAL OVERSIGHT PREVENTION

**NEVER mark a session as "completed" if critical infrastructure is missing!**

## 🤖 NEW: AUTOMATED TESTING REQUIRED

### Every Session MUST Include:
1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test feature workflows  
3. **E2E Tests** - Test full user journeys
4. **Visual Tests** - Catch UI bugs (like white-on-white text)

### Test Commands:
```bash
# These must ALL pass before marking complete:
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:visual   # Visual regression tests
```

## 🔴 CRITICAL BLOCKERS (Session MUST be marked BLOCKED)

### 1. DATABASE MIGRATIONS
- **CHECK**: Are all database migrations applied?
- **VERIFY**: Can the app connect to the database?
- **TEST**: Do CRUD operations actually work?
- **IF FAILED**: Mark session as `BLOCKED - CRITICAL DATABASE MIGRATION FAILURE`

### 2. AUTHENTICATION SYSTEM
- **CHECK**: Is auth properly configured?
- **VERIFY**: Can users actually log in?
- **TEST**: Are protected routes accessible?
- **IF FAILED**: Mark session as `BLOCKED - AUTHENTICATION FAILURE`

### 3. CORE DEPENDENCIES
- **CHECK**: Are all critical packages installed?
- **VERIFY**: Do imports resolve correctly?
- **TEST**: Does the build succeed?
- **IF FAILED**: Mark session as `BLOCKED - DEPENDENCY FAILURE`

## 📋 MANDATORY VERIFICATION CHECKLIST

**Run these checks for EVERY session:**

```bash
# 1. Database Check
npm run db:status         # Check migration status
npm run db:test          # Test connection

# 2. Build Check
npm run build            # Must succeed

# 3. Type Check
npm run type-check       # No errors allowed

# 4. Runtime Check
npm run dev              # App must start
# Navigate to localhost:3000
# Test core functionality

# 5. Integration Check
# Actually click through the features
# Verify data persists
# Check console for errors
```

## 🚦 SEVERITY LEVELS

### CRITICAL (Blocks Everything)
- Database not accessible
- Authentication broken
- Build failures
- Runtime crashes

### HIGH (Blocks Feature)
- Feature crashes on use
- Data loss scenarios
- Security vulnerabilities

### MEDIUM (Degraded Experience)
- Performance issues
- UI/UX problems
- Non-critical warnings

### LOW (Nice to Fix)
- Code style issues
- Minor optimizations
- Documentation gaps

## 📝 BLOCKED SESSION REPORT FORMAT

```json
{
  "session": X,
  "status": "BLOCKED - [CRITICAL ISSUE TYPE]",
  "criticalBlockers": [
    {
      "type": "DATABASE_MIGRATION_FAILURE",
      "description": "Database migrations not applied - all features will fail",
      "impact": "COMPLETE SYSTEM FAILURE",
      "resolution": "Run migrations in Supabase dashboard",
      "discovered": "During verification testing"
    }
  ],
  "completedWork": {
    "description": "Code written but UNTESTABLE due to blockers",
    "files": X,
    "lines": X,
    "status": "CODE COMPLETE - RUNTIME BLOCKED"
  }
}
```

## ⚡ QUICK DECISION TREE

```
Did you test the actual functionality?
├─ NO → STOP! Test it now
└─ YES → Did it work?
    ├─ NO → Mark as BLOCKED
    └─ YES → Did you check the database?
        ├─ NO → STOP! Check it now
        └─ YES → Is data persisting?
            ├─ NO → Mark as BLOCKED
            └─ YES → Safe to mark complete
```

## 🛡️ PREVENTION PROTOCOL

1. **NEVER ASSUME** - Always verify
2. **TEST FIRST** - Before marking complete
3. **DATABASE ALWAYS** - Check migrations every session
4. **CLICK THROUGH** - Actually use the features
5. **DATA PERSISTENCE** - Verify it saves and loads

## 🚨 CRITICAL DIRECTIVE

**If ANY critical check fails:**
1. IMMEDIATELY mark session as BLOCKED
2. Document the exact failure
3. Put blockers at the TOP of the report
4. Specify exact resolution needed
5. Warn that next sessions will fail

## 📋 Copy This Template

For every session completion:

```
CRITICAL CHECKS:
- [ ] Database migrations applied
- [ ] App builds successfully  
- [ ] App runs without errors
- [ ] Features actually work when clicked
- [ ] Data persists and reloads
- [ ] No console errors during testing

STATUS: [COMPLETE/BLOCKED]
BLOCKERS: [None/List critical issues]
```

---

**Remember: It's better to report BLOCKED than to hide critical failures!**
