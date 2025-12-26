# Supabase Setup Guide for Prompt Guard

Complete step-by-step guide to configure Supabase for your Prompt Guard application.

## Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js installed locally
- Git repository cloned

---

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Project Name:** `Prompt Guard` (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"** and wait for setup (~2 minutes)

---

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**Anon/Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Configure Environment Variables

Create/update `.env.local` file in your project root:

```env
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Config (for AI testing)
OPENAI_API_KEY=sk-your-openai-key-here
```

> [!IMPORTANT]
> Never commit `.env.local` to git. It's already in `.gitignore`.

---

## Step 4: Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_ref

# Run all migrations
supabase db push
```

### Option B: Manual SQL Execution

Go to **SQL Editor** in Supabase Dashboard and run these files **in order**:

1. **Base Schema:** `supabase-schema.sql`
2. **Prompt Versions:** `supabase/migrations/20250127_prompt_versions.sql`
3. **Cost Breakdown:** `supabase/migrations/20250605_add_cost_breakdown.sql`
4. **Profiles Table:** `supabase/migrations/20241213_create_profiles.sql`
5. **Test Runs Update:** `supabase/migrations/20241213_update_test_runs_schema.sql`
6. **Evaluation Config:** `supabase/migrations/20241213_add_evaluation_config.sql`

> [!WARNING]
> Run migrations in the exact order shown above to avoid dependency errors.

---

## Step 5: Verify Database Setup

Run this in **SQL Editor** to check all tables exist:

```sql
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Tables:**
- ✅ `profiles`
- ✅ `projects`
- ✅ `prompt_versions`
- ✅ `test_cases`
- ✅ `test_runs`
- ✅ `test_results`

---

## Step 6: Test Connection

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and try:
1. Sign up for an account
2. Check if profile was auto-created (should have 1000 credits)
3. Create a test project
4. Add a test case

---

## Step 7: Verify RLS Policies

Check Row Level Security is working:

```sql
-- Should show policies for all tables
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Common Issues & Solutions

### Issue: "relation 'profiles' does not exist"
**Solution:** Run migration `20241213_create_profiles.sql`

### Issue: "column 'system_prompt' does not exist in test_runs"
**Solution:** Run migration `20241213_update_test_runs_schema.sql`

### Issue: User sign up works but no profile created
**Solution:** 
1. Check if trigger exists:
   ```sql
   SELECT trigger_name FROM information_schema.triggers 
   WHERE event_object_table = 'users';
   ```
2. If missing, re-run profiles migration

### Issue: "insufficient credits" error
**Solution:** Update user credits manually:
```sql
UPDATE profiles 
SET credits = 10000 
WHERE email = 'your_email@example.com';
```

---

## Database Schema Overview

```
auth.users (Supabase managed)
    ↓
profiles (credits, tier, billing)
    ↓
projects (user's prompt testing projects)
    ↓
├── prompt_versions (version control for prompts)
├── test_cases (input/expected output pairs)
└── test_runs (execution records)
        ↓
    test_results (individual test outcomes with AI judge feedback)
```

---

## Next Steps

1. ✅ Database configured
2. ✅ Environment variables set
3. ✅ Migrations run
4. **Now you can:**
   - Create projects
   - Add test cases
   - Run evaluations
   - View analytics

---

## Support

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Project Issues: Check `app/actions.ts` for server action logic
- Database Schema: See `types/database.ts` for TypeScript interfaces
