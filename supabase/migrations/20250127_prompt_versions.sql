-- Migration: Create prompt_versions table and update projects table
-- This migration adds versioning support for prompts

-- Step 1: Create prompt_versions table
CREATE TABLE IF NOT EXISTS prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    system_prompt TEXT NOT NULL,
    model_config JSONB NOT NULL DEFAULT '{"model": "gpt-4", "temperature": 0.7}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT false,
    
    -- Ensure version numbers are unique per project
    CONSTRAINT unique_project_version UNIQUE (project_id, version_number)
);

-- Step 2: Add current_version_id to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS current_version_id UUID REFERENCES prompt_versions(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_versions_project_id ON prompt_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_is_active ON prompt_versions(project_id, is_active);

-- Enable Row Level Security
ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for prompt_versions
CREATE POLICY "Users can view their own prompt versions"
    ON prompt_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = prompt_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own prompt versions"
    ON prompt_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = prompt_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own prompt versions"
    ON prompt_versions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = prompt_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own prompt versions"
    ON prompt_versions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = prompt_versions.project_id 
            AND projects.user_id = auth.uid()
        )
    );
