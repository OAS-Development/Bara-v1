# Git Configuration for Bara-v1

## Repository Information
- **GitHub URL**: https://github.com/OAS-Development/Bara-v1
- **Organization**: OAS-Development
- **Repository Name**: Bara-v1

## Initial Setup (Session 1)
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/OAS-Development/Bara-v1.git

# First commit and push
git add .
git commit -m "Session 1: Project setup and authentication"
git branch -M main
git push -u origin main
```

## Session Commit Convention
Each session should be committed with a descriptive message:
```bash
git add .
git commit -m "Session X: Brief description of what was accomplished"
git push
```

Examples:
- `git commit -m "Session 1: Project setup and authentication"`
- `git commit -m "Session 2: Database schema and RLS policies"`
- `git commit -m "Session 3: Layout components and dark theme"`

## Branching Strategy (Optional)
For experimental features or major changes:
```bash
# Create feature branch
git checkout -b feature/library-integration

# Push feature branch
git push -u origin feature/library-integration

# Merge back to main when ready
git checkout main
git merge feature/library-integration
```

## Common Commands
```bash
# Check status
git status

# View commit history
git log --oneline

# Pull latest changes
git pull origin main

# Discard local changes
git checkout -- .

# Create a tag for milestones
git tag -a v0.1.0 -m "Phase 1 complete: Core GTD features"
git push origin v0.1.0
```

## .gitignore Essentials
Make sure these are in your .gitignore:
```
# Dependencies
node_modules/

# Environment variables
.env.local
.env*.local

# Next.js
.next/
out/

# Production
build/
dist/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Supabase
supabase/.branches
supabase/.temp
```

## Protecting Sensitive Data
- Never commit `.env.local` or any file with API keys
- Use environment variables for all sensitive configuration
- Review changes before committing: `git diff --staged`
