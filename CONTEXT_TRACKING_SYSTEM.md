# Session Context Tracking System

## Problem
Claude Code shows "% left until auto-compact" but this critical metric isn't captured for session planning optimization.

## Solution
Track context usage in session status reports to dynamically adjust session complexity.

## Implementation

### 1. Update Session Status Format
Add to all session-XX-status.json files:
```json
{
  "session": 5,
  "title": "...",
  "status": "completed",
  "contextMetrics": {
    "startContext": "100%",
    "endContext": "25%",
    "contextUsed": "75%",
    "autoCompactTriggered": false,
    "optimalLoad": "HEAVY|MODERATE|LIGHT"
  }
}
```

### 2. Claude Code Reporting
At the END of each session, Claude Code should report:
```
Context Window Status:
- Started at: 100%
- Ending at: 25% remaining
- Used: 75% of available context
- Auto-compact: Not triggered
- Recommendation: This session size was optimal
```

### 3. Desktop Actor Analysis

#### Context Usage Thresholds:
- **>40% remaining**: Session too small, can increase complexity
- **20-40% remaining**: Optimal session size
- **10-20% remaining**: Session at capacity, maintain size
- **<10% remaining**: Session too large, reduce next time
- **0% / auto-compact**: Critical - session definitely too large

#### Dynamic Session Sizing:
```
IF last session ended with >40% remaining:
  → Increase next session by 20-30% more features
  
IF last session ended with 20-40% remaining:
  → Perfect size, maintain complexity
  
IF last session ended with <20% remaining:
  → Reduce next session by 20% features
  
IF auto-compact triggered:
  → Split next session into two smaller sessions
```

### 4. Historical Tracking

Create `context-usage-analytics.json`:
```json
{
  "sessions": [
    {
      "number": 1,
      "fileCount": 15,
      "lineCount": 1200,
      "contextUsed": "45%",
      "optimal": true
    },
    {
      "number": 2,
      "fileCount": 25,
      "lineCount": 2000,
      "contextUsed": "65%",
      "optimal": true
    },
    {
      "number": 3,
      "fileCount": 30,
      "lineCount": 2500,
      "contextUsed": "80%",
      "optimal": false,
      "recommendation": "reduce_size"
    }
  ],
  "patterns": {
    "averageFilesPerSession": 23,
    "averageLinesPerSession": 1900,
    "optimalContextUsage": "60-75%",
    "maxSafeFiles": 35,
    "maxSafeLines": 2800
  }
}
```

### 5. Predictive Session Planning

Before creating a session, calculate estimated context usage:
```
Estimated Context Usage = 
  (Planned Files × 2%) + 
  (Planned Lines / 100 × 3%) + 
  (Complexity Factor × 10%)
  
If estimate >80%, split the session
```

### 6. Real-time Monitoring Request

In session documents, add:
```markdown
## Context Monitoring
Please report context usage at these checkpoints:
- After Part A: X% remaining
- After Part C: X% remaining  
- At session end: X% remaining
- If <15% at any point: Stop and report
```

## Benefits

1. **Optimal Session Sizes**: No wasted context or failed sessions
2. **Predictable Planning**: Know how much fits in a session
3. **Efficiency**: Pack maximum useful work into each session
4. **Early Warning**: Stop before auto-compact kills progress
5. **Learning System**: Gets better at estimation over time

## Dashboard Integration

Add to project dashboard:
```
Session Context Analytics:
- Average context usage: 68%
- Optimal session size: ~25 files, ~2000 lines
- Sessions at risk: None
- Efficiency score: 94%
- Recommended next session size: MODERATE
```

## Implementation Priority

This should be implemented:
1. Starting with Session 5.5 (Security)
2. Retroactively estimated for Sessions 1-5
3. Required for all future sessions
4. Used to optimize Session 6 planning
