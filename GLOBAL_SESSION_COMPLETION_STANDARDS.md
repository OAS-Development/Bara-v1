# GLOBAL SESSION COMPLETION STANDARDS
# UNIVERSAL STANDARD - ALL PROJECTS - ALL SESSIONS

## MANDATORY FOR ALL PROJECTS USING TWO-ACTOR MODEL

This document establishes **non-negotiable standards** for session completion that apply to:
- All programming languages (Python, JavaScript, Go, Rust, etc.)
- All project types (web apps, CLIs, APIs, desktop apps, etc.)  
- All domains (productivity, games, utilities, business apps, etc.)
- All complexity levels (simple scripts to enterprise applications)

## UNIVERSAL VERIFICATION REQUIREMENTS

### Build/Compilation Verification (Language-Specific)

#### JavaScript/TypeScript/Node.js Projects:
```bash
# TypeScript check
npm run type-check || npx tsc --noEmit
# RESULT: 0 errors required

# Build check  
npm run build
# RESULT: Successful compilation required

# Application start
npm run dev || npm start
# RESULT: Application must start without errors
```

#### Python Projects:
```bash
# Type check (if using mypy)
mypy . || python -m mypy .
# RESULT: 0 type errors required

# Syntax/Import check
python -m py_compile src/**/*.py
# RESULT: All files must compile

# Application start
python main.py || python -m src
# RESULT: Application must start without errors
```

#### Go Projects:
```bash
# Build check
go build ./...
# RESULT: Must compile successfully

# Test check
go test ./...
# RESULT: All tests must pass

# Application start  
go run main.go
# RESULT: Application must start without errors
```

#### Rust Projects:
```bash
# Build check
cargo build
# RESULT: Must compile successfully

# Test check
cargo test
# RESULT: All tests must pass

# Application start
cargo run
# RESULT: Application must start without errors
```

### Universal Functional Verification

#### For ALL Projects (Language-Agnostic):
1. **Core Functionality Test**: Each session objective must be tested and working
2. **Regression Prevention**: Existing functionality must continue working
3. **Error Handling**: Application must handle invalid inputs gracefully
4. **Resource Cleanup**: No memory leaks, file handles, or connections left open

### Universal Status Assignment

#### ✅ "COMPLETED" Status Requirements (All Languages):
- [ ] Zero compilation/build errors
- [ ] All tests pass (if tests exist)
- [ ] Application starts without errors
- [ ] All session objectives functionally working
- [ ] No regression in existing functionality
- [ ] No critical or high-severity issues

#### ⚠️ "COMPLETED_WITH_ISSUES" Status:
- [ ] All objectives work but minor issues exist
- [ ] Application builds and runs successfully
- [ ] Only low-priority or cosmetic issues remain

#### 🔄 "PARTIAL" Status:
- [ ] Some objectives completed, others blocked
- [ ] Application builds/runs (possibly with workarounds)
- [ ] Clear documentation of what works vs doesn't

#### ❌ "FAILED" Status:
- [ ] Compilation/build failures
- [ ] Application cannot start
- [ ] Critical functionality broken
- [ ] Primary objectives not achievable

## MANDATORY ERROR DOCUMENTATION

### Universal Error Capture Format
```json
{
  "session_verification": {
    "language_specific_checks": {
      "compilation": {
        "command": "[build command]",
        "status": "passed|failed",
        "error_count": 0,
        "errors": ["Full error messages"]
      },
      "tests": {
        "command": "[test command]", 
        "status": "passed|failed|skipped",
        "passed": 0,
        "failed": 0,
        "errors": ["Test failures"]
      }
    },
    "functional_verification": [
      {
        "objective": "Objective description",
        "status": "working|partial|broken",
        "test_performed": "How it was tested",
        "issues": ["Any problems found"]
      }
    ],
    "regression_check": {
      "existing_features_tested": ["List of features tested"],
      "regressions_found": ["Any broken existing functionality"],
      "overall_status": "no_regressions|minor_issues|major_issues"
    }
  }
}
```

### Error Severity Classification (Universal)
- **CRITICAL**: Prevents compilation, build, or application start
- **HIGH**: Core functionality broken, major features non-functional
- **MEDIUM**: Important features affected, workarounds available
- **LOW**: Minor issues, cosmetic problems, non-blocking warnings

## IMPLEMENTATION ENFORCEMENT

### For Claude Desktop (Planning):
- **MUST** include verification requirements in ALL session plans
- **MUST** specify clear, testable success criteria
- **MUST** review session reports for accuracy vs claims
- **MUST** escalate false positive completions immediately

### For Claude Code (Implementation):
- **MUST** run verification sequence before claiming completion
- **MUST** capture all errors with full context and commands
- **MUST** test functional objectives, not just assume they work
- **MUST** use evidence-based status assignment
- **CANNOT** claim "COMPLETED" without passing verification

### Violation Response Protocol:
1. **Immediate**: Correct false completion with follow-up session
2. **Analysis**: Determine why verification was skipped or failed
3. **Prevention**: Update prompts/processes to prevent recurrence
4. **Audit**: Review other recent sessions for similar issues

## PROJECT-SPECIFIC ADAPTATIONS

### Web Applications:
- Browser console must be error-free on startup
- Core user flows must be tested manually
- API endpoints must respond correctly
- Database connections must work

### CLI Applications:
- Help/usage commands must work
- Core functionality must execute successfully
- Error messages must be user-friendly
- Exit codes must be appropriate

### APIs/Services:
- Server must start without errors
- Health check endpoints must respond
- Core API endpoints must function
- Database/external service connections must work

### Desktop Applications:
- Application must launch successfully
- Core UI functionality must work
- File operations must complete correctly
- Platform-specific features must be tested

## GLOBAL ROLLOUT REQUIREMENTS

### Immediate Implementation:
- Apply to ALL active projects immediately
- Update ALL session templates with verification requirements
- Audit recent sessions for compliance
- Retrain processes to prevent false completions

### Quality Assurance:
- Random audits of session completion accuracy
- Tracking of verification compliance across projects
- Continuous improvement of verification processes
- Cross-project learning from verification failures

### Success Metrics:
- **Zero false positive completions** across all projects
- **100% verification compliance** before status assignment
- **Accurate status reporting** that reflects actual functionality
- **Reduced debugging time** due to better session quality

This standard ensures that **"COMPLETED" means functionally complete** across all programming languages, project types, and complexity levels in the two-actor development model.
