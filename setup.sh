#!/bin/bash

# Bara-v1 Setup Script
echo "🚀 Setting up Bara-v1 Development Environment..."

# Create Next.js project
echo "📦 Creating Next.js project..."
npx create-next-app@latest . --typescript --tailwind --app --use-npm --src-dir

# Install dependencies
echo "📚 Installing dependencies..."
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install @radix-ui/themes @radix-ui/react-icons
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form zod
npm install crypto-js yjs y-indexeddb
npm install date-fns
npm install -D @types/crypto-js

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p src/components/{layout,tasks,projects,ui,modals}
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/lib/{supabase,import,ai,context,utils}
mkdir -p src/app/{auth,inbox,projects,library,travel,financial,api}
mkdir -p src/types
mkdir -p public/icons

# Create environment file
echo "🔐 Creating environment file..."
cat > .env.local << EOL
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
ANTHROPIC_API_KEY=your_claude_api_key

# Optional Services
OPENAI_API_KEY=your_openai_api_key_for_embeddings
MAPBOX_ACCESS_TOKEN=your_mapbox_token
EOL

# Create .env.example
cp .env.local .env.example

# Create Supabase config
echo "⚡ Creating Supabase config..."
cat > supabase/config.toml << EOL
# Supabase Config
[project]
id = "bara-v1"

[api]
enabled = true
port = 54321

[db]
port = 54322

[studio]
enabled = true
port = 54323
EOL

# Create initial database schema
echo "🗄️ Creating database schema..."
cat > supabase/migrations/001_initial_schema.sql << 'EOL'
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  omnifocus_imported BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('sequential', 'parallel')) DEFAULT 'parallel',
  status TEXT CHECK (status IN ('active', 'on-hold', 'completed', 'dropped')) DEFAULT 'active',
  parent_id UUID REFERENCES projects(id),
  notes TEXT,
  review_interval INTERVAL,
  next_review TIMESTAMPTZ,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  project_id UUID REFERENCES projects(id),
  status TEXT CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  flagged BOOLEAN DEFAULT FALSE,
  defer_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  estimated_duration INTERVAL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- For subtasks
  parent_task_id UUID REFERENCES tasks(id),
  task_order INTEGER DEFAULT 0
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  parent_id UUID REFERENCES tags(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Task tags junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Perspectives/Views
CREATE TABLE perspectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  filters JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_built_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE perspectives ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own task tags" ON task_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = task_tags.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own perspectives" ON perspectives
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_defer_date ON tasks(defer_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOL

# Initialize Supabase
echo "🚀 Initializing Supabase..."
npx supabase init

# Create README
echo "📝 Creating README..."
cat > README.md << EOL
# Bara-v1

Personal productivity suite with GTD methodology, AI intelligence, and comprehensive life management features.

## Features
- 📥 GTD-based task management
- 🤖 AI-powered assistance via Claude
- 📚 Theological library with comparison
- ✈️ Travel planning with points optimization
- 💰 Financial tracking with QuickBooks integration
- 📍 Context-aware features

## Getting Started

1. **Set up Supabase**
   - Create account at https://app.supabase.com
   - Create new project
   - Copy project URL and anon key to \`.env.local\`

2. **Run database migrations**
   \`\`\`bash
   npx supabase db push
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser**
   Navigate to http://localhost:3000

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Zustand (State Management)
- React Query (Data Fetching)
- Radix UI (Components)

## Project Structure
\`\`\`
src/
├── app/          # Next.js app router pages
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utilities and configurations
├── stores/       # Zustand stores
└── types/        # TypeScript type definitions
\`\`\`

## Development
See [QUICK_START.md](./QUICK_START.md) for detailed development guide.
EOL

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
