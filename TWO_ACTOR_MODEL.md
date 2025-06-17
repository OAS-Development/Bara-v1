# Bara-v1: Two-Actor Development Model

## Overview
This project uses a two-actor development model with Session-based implementation:

1. **Claude Desktop** (Strategy & Planning)
2. **Claude Code** (Implementation & Verification)

## Key Principles

### 1. Session-Based Development
- **NO weekly milestones** - only Sessions
- Each Session is **~90 minutes** (UPDATED: doubled from 45)
- Combines two related feature sets
- Designed to maximize Claude's context window
- Prevents auto-compaction issues

### 2. Actor Responsibilities

### 2. Actor Responsibilities

#### Claude Desktop (Current Role)
- Architecture and system design
- Creating Session definitions
- Strategic planning
- Documentation
- Post-Session integration
- **CRITICAL**: Context analysis before each session
- **CRITICAL**: Always provide complete Claude Code prompts
- **CRITICAL**: Include project path at top of every prompt
- **CRITICAL**: Include push notification setup in all sessions
- **CRITICAL**: MANDATORY Quality/Stabilization sessions for enterprise-grade applications
- **CRITICAL**: Technical debt management and commercial application standards
- **NEW**: **GLOBAL PROJECT LIFECYCLE MANAGEMENT**
  - **Phase Assessment**: Continuously evaluate project phase (Greenfield vs Iterative)
  - **Quality Trigger Analysis**: Identify when Quality/Stabilization sessions required
  - **Transition Planning**: Manage Phase 1 → Phase 2 transition for all projects
  - **Universal Application**: Apply lifecycle framework to ALL projects regardless of domain

#### Claude Code (Implementation)
- Executes Session definitions
- Writes actual code
- Runs verification in parallel terminal
- Reports back completion status

### 3. Session Workflow

```mermaid
graph LR
    A[Read Previous Session Status] --> B[Analyze Context Usage]
    B --> C[Claude Desktop: Plan Session]
    C --> D[Create Session Document]
    D --> E[Provide Complete Claude Code Prompt]
    E --> F[Claude Code: Execute Session]
    F --> G[Claude Code: Run Verification Steps]
    G --> H[Claude Code: Send Push Notification]
    H --> I[Claude Code: Push to GitHub]
    I --> J[Claude Code: Report Status]
    J --> K[Claude Desktop: Plan Next Session]
```

**CRITICAL REQUIREMENTS**:
1. **Context Analysis**: Always read previous session status before planning
2. **Complete Prompts**: Always provide full Claude Code prompt for copy/paste
3. **Project Path**: Always include cd command at top of prompt
4. **Push Notifications**: Every session ends with notification to user
5. **Verification**: Integrated into session execution steps

### 4. Session Document Structure

Each Session document contains:
- **Metadata**: Session number, title, duration
- **Objectives**: Clear, measurable goals
- **Context**: Current state and dependencies
- **Implementation Steps**: Detailed instructions (including verification)
- **Success Criteria**: Checklist for completion
- **Handoff Format**: Status report structure

### 5. Integrated Verification

Claude Code runs verification as part of the session:
```bash
# Standard verification steps included in each session
npm run dev          # Ensure it runs
npm run build        # Ensure it builds
npm run type-check   # TypeScript validation
npm test            # Run tests if available
```

Verification is no longer a separate step - it's integrated into the implementation flow.

### 6. Session Boundaries

Sessions end when:
- Target time has elapsed (adjusted based on previous context usage)
- Objectives are complete
- Context window is near capacity
- A natural breakpoint is reached
- **IMPORTANT**: Session scope must be pre-adjusted based on previous context analysis

### 7. Communication Protocol

#### Desktop → Code
```json
{
  "session": 1,
  "objectives": [...],
  "context": {...},
  "dependencies": [...]
}
```

#### Code → Desktop  
```json
{
  "session": 1,
  "status": "complete",
  "implemented": [...],
  "verified": true,
  "nextSession": 2
}
```

## Current Project Status

### Completed by Claude Desktop:
- ✅ System architecture
- ✅ Database schema design
- ✅ UI/UX design in Figma
- ✅ Feature specifications
- ✅ Session-based roadmap (18 double sessions)
- ✅ Session 1 definition ready
- ✅ Session restructuring to double sessions

### Ready for Claude Code:
- ✅ Session 1: Project Setup & Authentication (COMPLETE)
- 🔲 Session 2: Database Schema & Layout Components
- 🔲 Session 3: Task System & Keyboard Navigation  
- 🔲 Session 4: Projects & Tags System
- ... (18 total double sessions)

## MANDATORY ENTERPRISE QUALITY STANDARDS (ALL PROJECTS)

### Quality/Stabilization Session Requirements
**Every project MUST include Quality/Stabilization sessions** before being considered production-ready. This is non-negotiable for enterprise-grade applications.

#### Trigger Criteria for Mandatory Quality Session:
**AUTOMATIC TRIGGER - When ANY of these conditions are met:**
- Core feature set is functionally complete
- 5+ feature sessions have been completed
- Application is ready for daily usage
- Before adding advanced features to working foundation
- Technical debt indicators present (TypeScript errors, ESLint warnings, etc.)

#### Enterprise-Grade Quality Standards (MUST ACHIEVE):
```json
{
  "codeQuality": {
    "typeScriptErrors": 0,
    "eslintWarnings": 0,
    "testCoverage": ">80% for critical paths",
    "codeConsistency": "enforced"
  },
  "performance": {
    "lighthouseScore": ">90 all metrics",
    "bundleSize": "optimized",
    "loadTime": "<2s",
    "memoryLeaks": "none detected"
  },
  "security": {
    "vulnerabilities": "zero critical/high",
    "authenticationFlows": "audited",
    "inputValidation": "comprehensive",
    "xssProtection": "verified"
  },
  "userExperience": {
    "errorHandling": "graceful degradation",
    "edgeCases": "handled",
    "loadingStates": "consistent",
    "accessibility": "WCAG compliant"
  },
  "commercialReadiness": {
    "documentation": "complete",
    "errorBoundaries": "comprehensive",
    "monitoring": "implemented",
    "deployment": "production-ready"
  }
}
```

#### Claude Desktop Responsibilities for Quality Assurance:
**As Desktop Actor, I MUST:**
- **Identify Quality Trigger Points**: Recognize when Quality/Stabilization is required
- **Insist on Quality Standards**: Never compromise on enterprise-grade requirements
- **Create Quality Session Plans**: Comprehensive testing and stabilization
- **Verify Quality Standards**: Ensure Claude Code achieves all quality metrics
- **Reject Sub-Standard Work**: Require re-work if quality standards not met
- **Commercial Application Mindset**: Assume all projects will be used by large organizations

#### Why This is Non-Negotiable:
- **Large Organizations**: Will rely on these applications for critical business functions
- **Commercial Viability**: Applications must meet enterprise deployment standards
- **Technical Debt Compounding**: Addressing issues now prevents exponential future costs
- **User Confidence**: Stable applications encourage adoption and daily usage
- **Methodology Reputation**: Our development approach must deliver enterprise-grade results

### Quality Session Types:

#### **Comprehensive Quality & Stabilization Session**
- **When**: After major feature development phases
- **Duration**: 90-120 minutes
- **Focus**: Code quality, testing, performance, security
- **Success Criteria**: All enterprise standards met

#### **Focused Quality Session**
- **When**: Addressing specific quality issues
- **Duration**: 60-90 minutes  
- **Focus**: Targeted improvements (performance, security, etc.)
- **Success Criteria**: Specific metrics achieved

#### **Maintenance Quality Session**
- **When**: Ongoing technical debt management
- **Duration**: 45-60 minutes
- **Focus**: Dependencies, security updates, minor fixes
- **Success Criteria**: Maintenance backlog cleared



### 1. MANDATORY Context Analysis Process
**Before planning ANY session**, Claude Desktop MUST:
```bash
# 1. Read previous session status
read_file("/sessions/session-[N-1]-status.json")

# 2. Analyze ACTUAL context usage (not just reported percentage):
- Auto-compact events: [Number of times]
- Session type: Feature/Quality/Maintenance
- Final context remaining: X%
- CRITICAL: Quality sessions use 1.5x context vs feature sessions

# 3. Apply Session 8 Critical Learning:
- Quality sessions: MAX 60-75 minutes (never 90+)
- If auto-compact triggered: REDUCE scope by 50%
- If quality session planned: Assume 1.5x context usage
- If previous session was quality: SIGNIFICANTLY reduce next scope

# 4. Scope adjustment matrix:
- Auto-compact + Quality session: 45 minutes max
- Auto-compact + Feature session: REDUCE scope by 30%
- Quality session after quality: 45-60 minutes max
- Normal progression: Standard scope
```

### 2. MANDATORY Complete Claude Code Prompts (NO CODE GENERATION)
**Every session planning MUST include**:
- ✅ Project path at the very top of prompt
- ✅ Complete prompt text for copy/paste
- ❌ NEVER reference external scripts like `./launch-session.sh`
- ❌ NEVER say "use the standard prompt"
- ✅ Full autonomous permission statement
- ✅ All implementation steps detailed (as INSTRUCTIONS)
- ✅ Context tracking requirements
- ✅ Push notification command

**CRITICAL: DESKTOP ACTOR NEVER WRITES CODE**
- ❌ NO TypeScript code in prompts
- ❌ NO React components in prompts
- ❌ NO configuration files in prompts
- ✅ ONLY instructions telling Claude Code WHAT to create
- ✅ ONLY descriptions of desired functionality
- ✅ ONLY file paths and structural guidance

**Correct approach**: "Create a validation utility with Zod schemas for tasks"
**WRONG approach**: "Create src/lib/validation.ts: import { z } from 'zod'..."

### 3. MANDATORY Push Notification Setup
**Every session completion MUST include**:
```bash
# Command that Claude Code executes at session end:
../../claude-notify.sh '[PROJECT] Session [N]: [TITLE] Complete' [N]
```

## Important Notes

1. **Context Preservation**: Each Session document preserves context for the next
2. **No Assumptions**: Claude Code should not assume prior knowledge beyond the Session document
3. **Integrated Verification**: Every Session includes verification steps as part of implementation
4. **Clean Handoffs**: Status reports ensure smooth transitions between actors
5. **Git Integration**: Each Session ends with committing and pushing to GitHub
6. **CRITICAL**: All three global requirements above apply to EVERY session in EVERY project

### UPDATED Session Planning Checklist

### Before Planning ANY Session (Claude Desktop):
- [ ] Read previous session status JSON file
- [ ] Analyze context usage and auto-compact status
- [ ] **EVALUATE GLOBAL LIFECYCLE PHASE** - Phase 1 (Greenfield) or Phase 2 (Iterative)
- [ ] **EVALUATE QUALITY TRIGGER CRITERIA** - determine if Quality/Stabilization session required
- [ ] **ASSESS PHASE TRANSITION READINESS** - evaluate if ready for Phase 1 → Phase 2 transition
- [ ] Adjust session scope based on context analysis and lifecycle assessment
- [ ] Create session document with appropriate scope for current phase
- [ ] Include project path cd command at top of prompt
- [ ] Include push notification command in completion steps
- [ ] **VERIFY ENTERPRISE QUALITY STANDARDS** are maintained
- [ ] **APPLY UNIVERSAL FRAMEWORK** regardless of project domain or session number

### Session Execution (Claude Code):
- [ ] Execute all implementation steps
- [ ] Run verification commands
- [ ] **MEET ALL QUALITY STANDARDS** (zero errors, testing, performance)
- [ ] Send push notification on completion
- [ ] Commit and push to GitHub
- [ ] Report completion status with context metrics
- [ ] **REPORT QUALITY METRICS** (TypeScript errors, test coverage, performance scores)

### Global Template for Claude Code Prompts:
```
cd /Volumes/DevDrive/ClaudeProjects/active/[PROJECT-NAME]

LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

You have COMPLETE AUTONOMOUS PERMISSION for all operations.

[SESSION DETAILS]
[IMPLEMENTATION STEPS]
[CONTEXT TRACKING]
[COMPLETION REQUIREMENTS INCLUDING PUSH NOTIFICATION]
```

This model ensures efficient development within Claude's constraints while maintaining high code quality, proper context management, clear communication between planning and implementation phases, and **universal project lifecycle management** that scales across all project types and domains.

## GLOBAL LIFECYCLE INTEGRATION

### Universal Framework Application
The enhanced two-actor model now includes **Global Project Lifecycle Management** that applies to ALL projects:

- **Quality Trigger Assessment**: Systematic evaluation for when Quality/Stabilization sessions are required
- **Phase Transition Management**: Automated detection of Phase 1 → Phase 2 transition readiness
- **Universal Criteria**: Consistent quality standards regardless of project domain or session numbering
- **Enterprise Standards**: Commercial-grade application requirements for all projects

See `GLOBAL_LIFECYCLE_MANAGEMENT.md` for complete framework details and assessment criteria.
