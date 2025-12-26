-- Cost Breakdown Migration
-- Add cost tracking columns to test_results table

ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS generation_cost integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS judge_cost integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cost integer DEFAULT 0;

-- Create an index for efficient cost queries
CREATE INDEX IF NOT EXISTS idx_test_results_costs 
ON test_results (run_id, total_cost);
