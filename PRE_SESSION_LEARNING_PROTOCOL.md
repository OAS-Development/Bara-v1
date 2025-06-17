# Pre-Session Learning Protocol
# MANDATORY process before planning any session

## Step 1: Read Learning Database
```bash
# REQUIRED: Read these files before ANY session planning
read_file("sessions_learning_db.json")  
read_file("sessions/session-[LAST]-status.json")
read_file("CURRENT_STATE.md")
```

## Step 2: Apply Learning Patterns

### Context Usage Analysis
```javascript
// Pseudo-code for context prediction
const lastSession = getLastSessionData()
const sessionType = determineSessionType() // quality|feature|maintenance

let contextMultiplier = 1.0
if (sessionType === 'quality') {
  contextMultiplier = 2.1 // From Session 8 learning
} else if (sessionType === 'feature') {
  contextMultiplier = 1.2
}

if (lastSession.auto_compressed > 0) {
  contextMultiplier *= 1.5 // Additional penalty
}

const recommendedDuration = Math.min(
  baseDuration * contextMultiplier,
  sessionType === 'quality' ? 75 : 90  // Hard caps from learning
)
```

### Scope Validation
```javascript
// Check against historical patterns
const scopeRisk = assessScopeRisk({
  sessionType,
  previousAutoCompress: lastSession.auto_compressed,
  componentCount: estimateComponentCount(),
  databaseWork: includesDatabaseWork()
})

if (scopeRisk === 'HIGH') {
  recommendScope = 'REDUCE_50%'
} else if (scopeRisk === 'MEDIUM') {
  recommendScope = 'REDUCE_25%' 
}
```

### Actor Discipline Check
```javascript
// Automated validation before sending prompt
function validatePrompt(prompt) {
  const violations = []
  
  if (prompt.includes('import {') || prompt.includes('export const')) {
    violations.push('CODE_GENERATION_DETECTED')
  }
  
  if (!prompt.includes('cd /Volumes/DevDrive')) {
    violations.push('MISSING_PROJECT_PATH')
  }
  
  if (!prompt.includes('claude-notify.sh')) {
    violations.push('MISSING_NOTIFICATION')
  }
  
  return violations
}
```

## Step 3: Learning-Informed Session Plan

### Template with Learning Applied
```markdown
# Session X.X: [Title]

## Learning Analysis Applied
- **Previous Session Context**: X% (auto-compressed: Y times)
- **Session Type**: [quality|feature|maintenance] 
- **Context Multiplier**: X.X (from learning database)
- **Recommended Duration**: X minutes (capped at Y for quality)
- **Scope Risk**: [LOW|MEDIUM|HIGH] based on patterns

## Adjusted Objectives
[Scope reduced/maintained based on learning analysis]

## Context Prediction
- **Estimated Usage**: X% (based on session type multiplier)
- **Risk Factors**: [database work, quality session, post-auto-compress]
- **Mitigation**: [specific adjustments made]

## Actor Discipline Checklist
- [ ] No code generation in prompt
- [ ] Complete instructions only
- [ ] Project path included
- [ ] Push notification included
- [ ] Autonomous permissions stated
```

## Step 4: Post-Session Learning Update

### Required after each session
```bash
# Update learning database with new data
update_sessions_learning_db({
  session: X,
  planned_context: "Y%",
  actual_context: "Z%", 
  auto_compressed: N,
  scope_accuracy: "accurate|over|under",
  new_learnings: ["specific insights"],
  violations: ["any mistakes made"]
})
```

## Implementation for Session 8.1

Let me apply this learning protocol RIGHT NOW for Session 8.1:

### Learning Analysis
- **Session 8**: Quality session, auto-compressed 3x (~300% context)
- **Session Type 8.1**: Quality follow-up (post-quality)
- **Context Multiplier**: 0.6 (post-quality reduction) 
- **Risk Factors**: HIGH (post auto-compress, quality type)
- **Recommended Duration**: 45 minutes maximum

### Scope Risk Assessment
- **Previous auto-compress**: 3x = CRITICAL risk
- **Session type**: Quality follow-up = HIGH risk
- **Overall assessment**: REDUCE scope by 50-75%

### Learning-Informed 8.1 Plan
- **Focus**: Single primary objective only (database types)
- **Duration**: 45 minutes (not 60 as I initially planned)
- **Deferred**: All security work to separate session
- **Success criteria**: Minimal but essential

This protocol ensures I actually USE the learning instead of just documenting it.
