-- Migration: Add evaluation_config to prompt_versions
-- This column stores evaluation judge configurations (JSON validator, tone, custom rubric, etc.)

ALTER TABLE prompt_versions 
ADD COLUMN IF NOT EXISTS evaluation_config JSONB DEFAULT '{}'::jsonb;

-- Add grading_feedback to test_results for AI judge output
ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS grading_feedback TEXT;

-- Add label column if missing (for version naming)
ALTER TABLE prompt_versions 
ADD COLUMN IF NOT EXISTS label TEXT;

-- Backfill existing rows with empty config
UPDATE prompt_versions 
SET evaluation_config = '{}'::jsonb 
WHERE evaluation_config IS NULL;
