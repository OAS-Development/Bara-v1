-- Add location field to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS location text;

-- Add location and time-related fields
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS energy_required text CHECK (energy_required IN ('low', 'medium', 'high'));

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_location ON tasks(location) WHERE location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_time_of_day ON tasks(time_of_day) WHERE time_of_day IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_energy_required ON tasks(energy_required) WHERE energy_required IS NOT NULL;