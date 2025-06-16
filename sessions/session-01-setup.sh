#!/bin/bash

# Session 1: Project Setup & Authentication
echo "Starting Session 1..."

# 0. Initialize Git Repository
git init
git remote add origin https://github.com/OAS-Development/Bara-v1.git

# 1. Initialize Project
npx create-next-app@latest . --typescript --tailwind --app --use-npm --src-dir --yes

# 2. Install Dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install @radix-ui/themes @radix-ui/react-icons
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form zod
npm install -D @types/node

# Create folder structure
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/signup
mkdir -p src/app/\(dashboard\)/inbox
mkdir -p src/components/auth
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/lib/supabase
mkdir -p src/lib/utils
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/types

echo "Basic setup complete. Claude Code will now create the necessary files..."
