-- Migration: Update test_runs schema to match application code
-- Changes:
-- 1. Add system_prompt and model_config columns
-- 2. Remove deprecated prompt_template column
-- 3. Update status enum

-- Add new columns
ALTER TABLE test_runs 
ADD COLUMN IF NOT EXISTS system_prompt TEXT,
ADD COLUMN IF NOT EXISTS model_config JSONB DEFAULT '{"model": "gpt-4o-mini", "temperature": 0.7}'::jsonb;

-- Copy data from old column to new (if you have existing data)
UPDATE test_runs 
SET system_prompt = prompt_template 
WHERE system_prompt IS NULL AND prompt_template IS NOT NULL;

-- Drop old column (commented out for safety - uncomment after verifying data)
-- ALTER TABLE test_runs DROP COLUMN IF EXISTS prompt_template;

-- Update status constraint to include 'pending'
ALTER TABLE test_runs DROP CONSTRAINT IF EXISTS test_runs_status_check;
ALTER TABLE test_runs ADD CONSTRAINT test_runs_status_check 
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'));

-- Backfill existing rows
UPDATE test_runs 
SET model_config = '{"model": "gpt-4o-mini", "temperature": 0.7}'::jsonb 
WHERE model_config IS NULL;
