-- Add full_name column to profiles table
-- Run this in Supabase SQL Editor

-- Step 1: Add the column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Step 2: Populate it from existing emails
UPDATE profiles 
SET full_name = INITCAP(
    REPLACE(
        REPLACE(
            REPLACE(
                SPLIT_PART(email, '@', 1),
                '.', ' '
            ),
            '_', ' '
        ),
        '-', ' '
    )
)
WHERE full_name IS NULL OR full_name = '';

-- Step 3: Verify the changes
SELECT id, email, full_name, tier, credits 
FROM profiles 
LIMIT 10;
