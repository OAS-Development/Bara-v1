-- CRITICAL SECURITY MIGRATION: Convert to single-user system
-- This migration restricts ALL access to a single authorized user

-- IMPORTANT: Set your user ID here before running this migration
-- You can find your user ID in Supabase Dashboard > Authentication > Users
DO $$
DECLARE
  owner_id UUID := 'ada65fa0-9670-4369-98ee-630a80a38dc8'; -- Your user ID
BEGIN
  -- Validate that owner_id is set
  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'CRITICAL: You must set owner_id to your user UUID before running this migration';
  END IF;

  -- Drop all existing policies
  DROP POLICY IF EXISTS "Users can view own projects" ON projects;
  DROP POLICY IF EXISTS "Users can create own projects" ON projects;
  DROP POLICY IF EXISTS "Users can update own projects" ON projects;
  DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

  DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can create own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
  DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

  DROP POLICY IF EXISTS "Users can view own tags" ON tags;
  DROP POLICY IF EXISTS "Users can create own tags" ON tags;
  DROP POLICY IF EXISTS "Users can update own tags" ON tags;
  DROP POLICY IF EXISTS "Users can delete own tags" ON tags;

  DROP POLICY IF EXISTS "Users can view own task tags" ON task_tags;
  DROP POLICY IF EXISTS "Users can create own task tags" ON task_tags;
  DROP POLICY IF EXISTS "Users can delete own task tags" ON task_tags;

  DROP POLICY IF EXISTS "Users can view own perspectives" ON perspectives;
  DROP POLICY IF EXISTS "Users can create own perspectives" ON perspectives;
  DROP POLICY IF EXISTS "Users can update own perspectives" ON perspectives;
  DROP POLICY IF EXISTS "Users can delete own perspectives" ON perspectives;

  -- Create new single-user policies
  -- Projects
  EXECUTE format('CREATE POLICY "Only owner can view projects" ON projects
    FOR SELECT USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can update projects" ON projects
    FOR UPDATE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can delete projects" ON projects
    FOR DELETE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);

  -- Tasks
  EXECUTE format('CREATE POLICY "Only owner can view tasks" ON tasks
    FOR SELECT USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can create tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can update tasks" ON tasks
    FOR UPDATE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can delete tasks" ON tasks
    FOR DELETE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);

  -- Tags
  EXECUTE format('CREATE POLICY "Only owner can view tags" ON tags
    FOR SELECT USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can create tags" ON tags
    FOR INSERT WITH CHECK (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can update tags" ON tags
    FOR UPDATE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can delete tags" ON tags
    FOR DELETE USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);

  -- Task-Tags
  EXECUTE format('CREATE POLICY "Only owner can view task tags" ON task_tags
    FOR SELECT USING (EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = %L AND auth.uid() = %L
    ))', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can create task tags" ON task_tags
    FOR INSERT WITH CHECK (EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = %L AND auth.uid() = %L
    ))', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can delete task tags" ON task_tags
    FOR DELETE USING (EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = %L AND auth.uid() = %L
    ))', owner_id, owner_id);

  -- Perspectives
  EXECUTE format('CREATE POLICY "Only owner can view perspectives" ON perspectives
    FOR SELECT USING (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can create perspectives" ON perspectives
    FOR INSERT WITH CHECK (auth.uid() = %L AND user_id = %L)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can update perspectives" ON perspectives
    FOR UPDATE USING (auth.uid() = %L AND user_id = %L AND NOT is_built_in)', owner_id, owner_id);
  
  EXECUTE format('CREATE POLICY "Only owner can delete perspectives" ON perspectives
    FOR DELETE USING (auth.uid() = %L AND user_id = %L AND NOT is_built_in)', owner_id, owner_id);

  -- Add check constraints to prevent other users
  EXECUTE format('ALTER TABLE projects ADD CONSTRAINT owner_only_projects CHECK (user_id = %L)', owner_id);
  EXECUTE format('ALTER TABLE tasks ADD CONSTRAINT owner_only_tasks CHECK (user_id = %L)', owner_id);
  EXECUTE format('ALTER TABLE tags ADD CONSTRAINT owner_only_tags CHECK (user_id = %L)', owner_id);
  EXECUTE format('ALTER TABLE perspectives ADD CONSTRAINT owner_only_perspectives CHECK (user_id = %L)', owner_id);

END $$;

-- Create security audit table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  attempted_user_id UUID,
  attempted_email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security table
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Only the system can write to security events (no user access)
CREATE POLICY "No user access to security events" ON security_events
  FOR ALL USING (false);

-- Create index for performance
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX idx_security_events_type ON security_events(event_type);

-- Add comment explaining the single-user nature
COMMENT ON SCHEMA public IS 'Bara - Personal productivity system. Single-user access only.';