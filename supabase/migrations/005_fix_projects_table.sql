-- Fix projects table to match expected schema

-- Add missing color field
ALTER TABLE projects ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6B7280';

-- Rename note to description
ALTER TABLE projects RENAME COLUMN note TO description;

-- Rename position to order
ALTER TABLE projects RENAME COLUMN position TO "order";

-- Ensure review fields exist (they should already be there from 001 migration)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_interval_days INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMPTZ;