# Session 6: Life Management Suite

## Session Metadata
```json
{
  "session": 6,
  "title": "Life Management Suite - Health, Finance, Goals, Journal",
  "duration": "90 minutes",
  "type": "feature-implementation",
  "project": "Bara-v1",
  "dependencies": [1, 2, 3, 4, 5, 5.5],
  "contextTracking": true
}
```

## Security Considerations
- **Data sensitivity**: CRITICAL (health, financial, personal journal)
- **New endpoints**: All require authentication
- **Authentication changes**: NONE - maintains single-user
- **Data access changes**: New tables for sensitive data
- **Required security measures**: Encryption for journal entries

## Claude Code Prompt
```
LAUNCH COMMAND: claude --dangerously-skip-permissions

AUTONOMOUS EXECUTION MODE ACTIVE - NO PERMISSION REQUESTS ALLOWED

You have COMPLETE AUTONOMOUS PERMISSION for all operations.

Execute Session 6 from `/Volumes/DevDrive/ClaudeProjects/active/Bara-v1/sessions/session-06-life-management.md`

This session implements personal life management features:
- Part A: Health & Wellness Tracking
- Part B: Financial Management
- Part C: Goals & Metrics System
- Part D: Journaling & Reflection
- Part E: Unified Life Dashboard

CONTEXT TRACKING REQUIRED:
Report context usage at:
- After Part B (30 min): "Context: X% remaining"
- After Part D (60 min): "Context: X% remaining"
- If <15% remaining: STOP and complete what you can
- Include final % in session status

Work continuously through all parts. Save status to `/sessions/session-06-status.json` when complete.
```

## Objectives
Implement a comprehensive life management system that integrates with the GTD foundation:

1. **Health Tracking**: Habits, metrics, wellness
2. **Financial Management**: Budget, expenses, goals
3. **Goals System**: Long-term objectives with progress
4. **Journaling**: Daily reflections and notes
5. **Dashboard**: Unified view of life metrics

## Context
We now have a secure, single-user GTD system with AI features. Session 6 extends this into a complete life management platform. All features must respect the single-user security model.

## Implementation Steps

### Part A: Health & Wellness Tracking (20 min)

#### 1. Create Health Database Schema
Create migration `004_health_tracking.sql`:
```sql
-- Health metrics table
CREATE TABLE health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  metric_type TEXT NOT NULL, -- weight, sleep_hours, steps, etc
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT health_metrics_owner CHECK (user_id = '[OWNER_ID]')
);

-- Habits table
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL, -- daily, weekly, etc
  target_count INTEGER DEFAULT 1,
  color TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT habits_owner CHECK (user_id = '[OWNER_ID]')
);

-- Habit tracking
CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);
```

#### 2. Create Health Stores
- `src/stores/health-store.ts` - Metrics CRUD
- `src/stores/habit-store.ts` - Habit tracking

#### 3. Health Components
- `src/components/health/metric-input.tsx` - Quick metric entry
- `src/components/health/habit-tracker.tsx` - Daily habit grid
- `src/components/health/health-trends.tsx` - Charts and progress

### Part B: Financial Management (20 min)

#### 4. Financial Database Schema
Create in same migration:
```sql
-- Financial accounts
CREATE TABLE financial_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- checking, savings, credit, investment
  balance DECIMAL,
  currency TEXT DEFAULT 'USD',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT financial_accounts_owner CHECK (user_id = '[OWNER_ID]')
);

-- Transactions
CREATE TABLE financial_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES financial_accounts(id),
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- income, expense, transfer
  category TEXT,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  period TEXT NOT NULL, -- monthly, yearly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT budgets_owner CHECK (user_id = '[OWNER_ID]')
);
```

#### 5. Financial Components
- `src/stores/finance-store.ts` - Transaction management
- `src/components/finance/transaction-entry.tsx` - Quick add
- `src/components/finance/budget-overview.tsx` - Budget vs actual
- `src/components/finance/account-summary.tsx` - Account balances

### Part C: Goals & Metrics System (20 min)

#### 6. Goals Database Schema
```sql
-- Long-term goals
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- health, finance, career, personal
  target_date DATE,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT goals_owner CHECK (user_id = '[OWNER_ID]')
);

-- Goal milestones
CREATE TABLE goal_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER
);
```

#### 7. Goals Components
- `src/stores/goals-store.ts` - Goals CRUD and progress
- `src/components/goals/goal-card.tsx` - Visual goal display
- `src/components/goals/milestone-tracker.tsx` - Progress steps
- `src/components/goals/goal-progress.tsx` - Charts

### Part D: Journaling & Reflection (15 min)

#### 8. Journal Schema
```sql
-- Journal entries (encrypted)
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content_encrypted TEXT NOT NULL, -- Client-side encrypted
  mood TEXT,
  tags TEXT[],
  entry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT journal_entries_owner CHECK (user_id = '[OWNER_ID]')
);
```

#### 9. Journal Components
- `src/lib/encryption.ts` - Client-side encryption
- `src/stores/journal-store.ts` - Encrypted storage
- `src/components/journal/journal-editor.tsx` - Rich text editor
- `src/components/journal/mood-tracker.tsx` - Mood selection
- `src/components/journal/journal-calendar.tsx` - Entry navigation

### Part E: Unified Life Dashboard (15 min)

#### 10. Dashboard Layout
Create `src/app/(dashboard)/life/page.tsx`:
- Health metrics summary widget
- Financial overview widget
- Goals progress widget
- Recent journal entries
- Habit streaks
- Upcoming milestones

#### 11. Dashboard Components
- `src/components/life/health-widget.tsx`
- `src/components/life/finance-widget.tsx`
- `src/components/life/goals-widget.tsx`
- `src/components/life/journal-widget.tsx`

#### 12. Navigation Update
Add Life section to main navigation with sub-pages:
- `/life` - Dashboard
- `/life/health` - Health tracking
- `/life/finance` - Financial management
- `/life/goals` - Goals tracking
- `/life/journal` - Journal

## Verification Steps

1. Test each feature works:
   - Add health metrics
   - Track habits
   - Enter transactions
   - Create goals
   - Write journal entry

2. Verify security:
   - All new tables have owner checks
   - Journal entries are encrypted
   - No data leaks

3. Check integration:
   - Life dashboard shows all data
   - Navigation works
   - Data persists

## Success Criteria Checklist
- [ ] Health tracking functional
- [ ] Financial management working
- [ ] Goals system operational
- [ ] Journal with encryption
- [ ] Unified dashboard
- [ ] All security maintained
- [ ] Build succeeds
- [ ] No console errors

## Context Window Monitoring
**IMPORTANT**: Report context usage at:
- After Part B (30 min): "Context: X% remaining"
- After Part D (60 min): "Context: X% remaining"
- If <15% remaining: STOP and complete what you can
- Report final % in session status

## Session Completion
1. **Notify completion on Apple Watch**:
   ```bash
   # Note: Use single quotes to avoid bash issues with special characters
   ../../claude-notify.sh 'Life Management Suite Ready' 6
   # This sends: "[Bara-v1] Session 6: Life Management Suite Ready"
   ```

2. **Create status report** in `/sessions/session-06-status.json`:
```json
{
  "session": 6,
  "status": "complete",
  "contextMetrics": {
    "startContext": "100%",
    "endContext": "X%",
    "contextUsed": "X%",
    "autoCompactTriggered": false,
    "recommendation": "optimal|too large|too small"
  },
  "filesCreated": X,
  "linesOfCode": X
}
```

## Notes
- Health data is sensitive - ensure proper security
- Financial data needs decimal precision
- Journal encryption is client-side only
- Consider export functionality for all life data
