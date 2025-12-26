-- SQL to create profile for existing user who signed up but doesn't have a profile
-- Run this in Supabase SQL Editor

-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL_HERE';

-- Then create the profile using that ID
-- Replace 'YOUR_USER_ID' and 'YOUR_EMAIL' with actual values from above query

INSERT INTO profiles (id, email, credits, tier)
VALUES (
  'YOUR_USER_ID'::uuid,  -- Replace with actual user ID from above
  'YOUR_EMAIL',           -- Replace with your email
  1000,                   -- Starting credits
  'free'                  -- Default tier
)
ON CONFLICT (id) DO NOTHING;

-- Verify it was created
SELECT * FROM profiles WHERE email = 'YOUR_EMAIL_HERE';
