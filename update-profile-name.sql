-- Fix for existing users: Update full_name from email
-- This will populate the full_name column for all users who don't have it set

UPDATE profiles 
SET full_name = CASE
    -- Extract username from email and capitalize properly
    WHEN full_name IS NULL OR full_name = '' THEN
        INITCAP(
            REPLACE(
                REPLACE(
                    REPLACE(
                        SPLIT_PART(email, '@', 1), -- Get part before @
                        '.', ' '  -- Replace dots with spaces
                    ),
                    '_', ' '  -- Replace underscores with spaces
                ),
                '-', ' '  -- Replace hyphens with spaces
            )
        )
    ELSE full_name
END
WHERE full_name IS NULL OR full_name = '';

-- Examples of what this does:
-- awais.mushtaq@gmail.com → Awais Mushtaq
-- john_doe@example.com → John Doe
-- admin-user@test.com → Admin User

-- To manually set your own name instead:
-- UPDATE profiles 
-- SET full_name = 'Your Full Name'
-- WHERE email = 'your.email@example.com';
