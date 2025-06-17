-- Session 6: Life Management Suite
-- Part A: Health & Wellness Tracking

-- Health metrics table
CREATE TABLE health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  metric_type TEXT NOT NULL, -- weight, sleep_hours, steps, heart_rate, blood_pressure, etc
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT health_metrics_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Habits table
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL, -- daily, weekly, monthly
  target_count INTEGER DEFAULT 1,
  color TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT habits_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Habit tracking
CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part B: Financial Management

-- Financial accounts
CREATE TABLE financial_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- checking, savings, credit, investment, loan
  balance DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  institution TEXT,
  account_number_last4 TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT financial_accounts_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Transactions
CREATE TABLE financial_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES financial_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL, -- income, expense, transfer
  category TEXT,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL, -- monthly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT budgets_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Part C: Goals & Milestones

-- Long-term goals
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- health, finance, career, personal, relationships, learning
  target_date DATE,
  status TEXT DEFAULT 'active', -- active, paused, completed, abandoned
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT goals_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Goal milestones
CREATE TABLE goal_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part D: Journaling & Reflection

-- Journal entries (with client-side encryption)
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content_encrypted TEXT NOT NULL, -- Client-side encrypted content
  mood TEXT, -- happy, neutral, sad, anxious, excited, angry, calm
  tags TEXT[],
  entry_date DATE NOT NULL,
  weather TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT journal_entries_owner CHECK (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8')
);

-- Create indexes for performance
CREATE INDEX idx_health_metrics_user_type ON health_metrics(user_id, metric_type);
CREATE INDEX idx_health_metrics_recorded ON health_metrics(recorded_at DESC);
CREATE INDEX idx_habits_user_active ON habits(user_id, active);
CREATE INDEX idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completed_at DESC);
CREATE INDEX idx_financial_accounts_user ON financial_accounts(user_id);
CREATE INDEX idx_financial_transactions_account ON financial_transactions(account_id);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date DESC);
CREATE INDEX idx_budgets_user_active ON budgets(user_id, active);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_goal_milestones_goal ON goal_milestones(goal_id);
CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, entry_date DESC);
CREATE INDEX idx_journal_entries_tags ON journal_entries USING GIN(tags);

-- Add RLS policies
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies (single-user system)
CREATE POLICY "Single user health metrics" ON health_metrics
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');

CREATE POLICY "Single user habits" ON habits
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');

CREATE POLICY "Single user habit completions" ON habit_completions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_completions.habit_id 
      AND habits.user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8'
    )
  );

CREATE POLICY "Single user financial accounts" ON financial_accounts
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');

CREATE POLICY "Single user financial transactions" ON financial_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM financial_accounts 
      WHERE financial_accounts.id = financial_transactions.account_id 
      AND financial_accounts.user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8'
    )
  );

CREATE POLICY "Single user budgets" ON budgets
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');

CREATE POLICY "Single user goals" ON goals
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');

CREATE POLICY "Single user goal milestones" ON goal_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_milestones.goal_id 
      AND goals.user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8'
    )
  );

CREATE POLICY "Single user journal entries" ON journal_entries
  FOR ALL USING (user_id = 'ada65fa0-9670-4369-98ee-630a80a38dc8');