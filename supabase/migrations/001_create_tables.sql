-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE task_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE project_type AS ENUM ('sequential', 'parallel', 'single-actions');
CREATE TYPE repeat_unit AS ENUM ('days', 'weeks', 'months', 'years');
CREATE TYPE energy_level AS ENUM ('low', 'medium', 'high');

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  note TEXT,
  type project_type DEFAULT 'parallel',
  status task_status DEFAULT 'active',
  parent_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  review_interval_days INTEGER,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status task_status DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  defer_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  repeat_interval INTEGER,
  repeat_unit repeat_unit,
  estimated_minutes INTEGER,
  energy_required energy_level,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table (contexts)
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  icon TEXT,
  parent_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Task-Tag junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Perspectives table
CREATE TABLE perspectives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  filter_rules JSONB NOT NULL DEFAULT '{}',
  sort_rules JSONB NOT NULL DEFAULT '[]',
  position INTEGER DEFAULT 0,
  is_built_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_defer_date ON tasks(defer_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_parent_id ON projects(parent_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);