-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE perspectives ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- Task-Tags policies
CREATE POLICY "Users can view own task tags" ON task_tags
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own task tags" ON task_tags
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own task tags" ON task_tags
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.user_id = auth.uid()
  ));

-- Perspectives policies
CREATE POLICY "Users can view own perspectives" ON perspectives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own perspectives" ON perspectives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own perspectives" ON perspectives
  FOR UPDATE USING (auth.uid() = user_id AND NOT is_built_in);

CREATE POLICY "Users can delete own perspectives" ON perspectives
  FOR DELETE USING (auth.uid() = user_id AND NOT is_built_in);