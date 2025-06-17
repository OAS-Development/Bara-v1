# SQL-Based Session Learning Database
# Enhanced learning through structured data

## Database Schema

### sessions table
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  session_number TEXT NOT NULL,
  project_name TEXT NOT NULL,
  session_type TEXT NOT NULL, -- quality, feature, maintenance
  planned_duration INTEGER,
  actual_duration INTEGER,
  planned_context_pct INTEGER,
  actual_context_pct INTEGER,
  auto_compress_count INTEGER DEFAULT 0,
  scope_accuracy TEXT, -- accurate, overambitious, underambitious
  completed_objectives INTEGER,
  total_objectives INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### session_learnings table  
```sql
CREATE TABLE session_learnings (
  id INTEGER PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  learning_type TEXT NOT NULL, -- context, scope, actor_discipline
  learning_text TEXT NOT NULL,
  confidence_level TEXT, -- high, medium, low
  applied_in_session TEXT, -- which future session applied this learning
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### context_patterns table
```sql
CREATE TABLE context_patterns (
  id INTEGER PRIMARY KEY,
  session_type TEXT NOT NULL,
  avg_context_multiplier REAL,
  auto_compress_rate REAL,
  recommended_max_duration INTEGER,
  sample_size INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### planning_violations table
```sql
CREATE TABLE planning_violations (
  id INTEGER PRIMARY KEY,
  session_number TEXT NOT NULL,
  violation_type TEXT NOT NULL, -- code_generation, missing_context_analysis, incomplete_prompt
  description TEXT,
  corrected BOOLEAN DEFAULT FALSE,
  times_repeated INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Learning Queries

### Context Usage Analysis
```sql
-- Get average context usage by session type
SELECT 
  session_type,
  AVG(actual_context_pct / planned_context_pct) as context_multiplier,
  AVG(auto_compress_count) as avg_auto_compress,
  COUNT(*) as sample_size
FROM sessions 
GROUP BY session_type;

-- Sessions that went over context
SELECT * FROM sessions 
WHERE auto_compress_count > 0 
ORDER BY session_number;

-- Pattern: sessions after auto-compress
SELECT 
  s1.session_number as auto_compress_session,
  s2.session_number as next_session,
  s2.actual_context_pct,
  s2.scope_accuracy
FROM sessions s1
JOIN sessions s2 ON CAST(substr(s1.session_number, 9) AS REAL) + 0.1 = CAST(substr(s2.session_number, 9) AS REAL)
WHERE s1.auto_compress_count > 0;
```

### Scope Accuracy Patterns
```sql
-- Sessions by scope accuracy
SELECT scope_accuracy, COUNT(*), AVG(actual_duration)
FROM sessions 
GROUP BY scope_accuracy;

-- Overambitious session patterns
SELECT session_type, AVG(planned_duration), AVG(actual_duration)
FROM sessions 
WHERE scope_accuracy = 'overambitious'
GROUP BY session_type;
```

### Planning Quality Trends
```sql
-- Planning violation trends
SELECT 
  violation_type,
  COUNT(*) as occurrences,
  MAX(times_repeated) as max_repeats,
  SUM(CASE WHEN corrected = TRUE THEN 1 ELSE 0 END) as corrected_count
FROM planning_violations 
GROUP BY violation_type;

-- Learning application success
SELECT 
  l.learning_type,
  COUNT(*) as learnings_created,
  COUNT(l.applied_in_session) as learnings_applied,
  ROUND(COUNT(l.applied_in_session) * 100.0 / COUNT(*), 2) as application_rate
FROM session_learnings l
GROUP BY l.learning_type;
```

## Database Integration

### Pre-Session Planning Query
```sql
-- Get relevant learning for upcoming session
WITH recent_sessions AS (
  SELECT * FROM sessions 
  ORDER BY id DESC 
  LIMIT 3
),
relevant_patterns AS (
  SELECT * FROM context_patterns 
  WHERE session_type = ? -- planned session type
),
recent_violations AS (
  SELECT * FROM planning_violations 
  WHERE corrected = FALSE
  ORDER BY created_at DESC
)
SELECT * FROM recent_sessions, relevant_patterns, recent_violations;
```

### Post-Session Learning Insert
```sql
-- After each session, insert learnings
INSERT INTO sessions (session_number, session_type, actual_context_pct, auto_compress_count, scope_accuracy)
VALUES (?, ?, ?, ?, ?);

INSERT INTO session_learnings (session_id, learning_type, learning_text, confidence_level)
VALUES (?, ?, ?, ?);

-- Update patterns
UPDATE context_patterns 
SET avg_context_multiplier = (
  SELECT AVG(actual_context_pct / planned_context_pct) 
  FROM sessions 
  WHERE session_type = ?
)
WHERE session_type = ?;
```

## Benefits of SQL Approach

### Advanced Pattern Recognition
- Query all quality sessions to understand patterns
- Analyze context usage trends over time
- Identify which types of work are most context-intensive
- Track learning application success rates

### Predictive Modeling
- Build models based on historical data
- Generate confidence intervals for predictions
- Identify risk factors for session planning
- Suggest optimal session sequencing

### Automated Learning Application
- Query database before each session planning
- Automatically apply relevant learnings
- Flag potential issues before they happen
- Track improvement over time

### Quality Metrics
- Measure planning accuracy improvement
- Track violation reduction over time
- Assess learning retention and application
- Generate planning quality scores

## Implementation Options

### Option 1: SQLite File
- Single file database in project directory
- No external dependencies
- Can be queried with simple SQL
- Portable with project

### Option 2: PostgreSQL Integration
- Use existing Supabase database
- More powerful analytics capabilities
- Could integrate with project data
- Requires database schema additions

### Option 3: Hybrid Approach
- Keep current JSON for simple data
- Add SQLite for learning analytics
- Best of both worlds
- Gradual migration path

## Immediate Action

I recommend starting with **SQLite Option** because:
1. **No infrastructure changes** needed
2. **Immediate pattern recognition** capabilities
3. **Maintains current workflow** while adding intelligence
4. **Can be implemented today** and start collecting data

Would you like me to:
1. Set up the SQLite learning database?
2. Migrate existing session data into it?
3. Create the pre-session learning query system?
4. Build automated planning improvement tools?

This would transform our development platform from static methodology to **intelligent, self-improving system**.
