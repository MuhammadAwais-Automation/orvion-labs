# Prompt Guard: File Logic Map (DNA Directory)

## 📊 Metadata
- **Created**: 2025-12-24
- **Last Updated**: 2025-12-24
- **Total Files Indexed**: 142
- **Status**: Exhaustive (100% Coverage)

---

## 🛠 1. Root Configuration Files
Global settings and environment parameters.

- **`.env.local`**
  - **Role**: Secure storage for sensitive environment variables.
  - **Logic**: Not committed to Git. Stores Supabase URL, Service Role Key, OpenAI API Key, and Inngest keys.
  - **Interactions**: Next.js Runtime, Inngest Agent, OpenAI SDK.
- **`package.json`**
  - **Role**: Dependency Manifest and Scripts.
  - **Logic**: Defines project version, dependencies (Next.js 15, Supabase, Inngest, Tailwind), and build/dev scripts.
  - **Interactions**: NPM/Node.js, CI/CD pipelines.
- **`middleware.ts`**
  - **Role**: Global request interceptor.
  - **Logic**: Invokes `updateSession` for every request to manage Supabase auth tokens and session persistence.
  - **Interactions**: `lib/supabase/middleware.ts`.
- **`next.config.js`**
  - **Role**: Next.js compiler settings.
  - **Logic**: Configures image domains and experimental features (if any).
  - **Interactions**: Next.js Build Engine.
- **`tailwind.config.js`**
  - **Role**: Design system configuration.
  - **Logic**: Defines the color palette (vibrant, dark mode compatible), typography (Inter), and animations (Magnetic, Code Rain).
  - **Interactions**: Tailwind CSS Compiler.
- **`tsconfig.json`**
  - **Role**: TypeScript compiler rules.
  - **Logic**: Configures path aliases (e.g., `@/*` for `g:\Prompt Guard\*`) and strict type checking.

---

## 📂 2. `app/` (The Application Hub)

### 📁 `app/actions/` (The Muscle: Server Actions)
- **`ai-actions.ts`**
  - **Role**: AI Grading Orchestration.
  - **Logic**: Contains `gradeResult` which performs semantic matching using OpenAI's GPT-4o-mini. Calculates costs and applies domain-agnostic judge rules.
  - **Interactions**: `utils/judge-prompt.ts`, `utils/model-pricing.ts`, Supabase Admin Client.
- **`analytics-actions.ts`**
  - **Role**: Data aggregation and auditing.
  - **Logic**: `getProjectAnalytics` fetches 30 days of test runs and results, aggregating costs, latency, and usage trends for visualizations.
  - **Interactions**: Supabase `test_runs` and `test_results` tables.
- **`project-actions.ts`**
  - **Role**: CRUD operations for projects.
  - **Logic**: Handles creation of projects and their initial "Version 1" prompt auto-generation. Manages revalidation of dashboard paths.
  - **Interactions**: Supabase `projects` and `prompt_versions` tables.
- **`test-case-actions.ts`**
  - **Role**: Management of ground truth inputs.
  - **Logic**: Implements tier-based limits (Free: 5 cases, Pro: 100 cases). Supports individual creation and bulk JSON imports.
  - **Interactions**: Supabase `test_cases` and `profiles` tables.
- **`test-runner-actions.ts`**
  - **Role**: Background execution trigger.
  - **Logic**: `createTestRun` initializes the database record; `runBatchTests` dispatches the `app/test.run.requested` event to Inngest.
  - **Interactions**: `lib/inngest.ts`, Inngest Event Key.
- **`version-actions.ts`**
  - **Role**: Prompt lineage and configuration management.
  - **Logic**: Handles version switching, manual saving of new prompt versions, and updating evaluation config (Judge rules).
  - **Interactions**: Supabase `prompt_versions` and `projects` tables.

### 📁 `app/api/` (External Connectors)
- **`app/api/inngest/route.ts`**
  - **Role**: Inngest API Handshake.
  - **Logic**: Serves GET/POST/PUT requests to register background workers with the Inngest Cloud or local dev server.
  - **Interactions**: `app/inngest/test-runner.ts`, Inngest SDK.

### 📁 `app/inngest/` (Durable Execution)
- **`test-runner.ts`**
  - **Role**: The Core Engine.
  - **Logic**: Durable background loop that executes each test case in a `step.run` block. Handles generation ⮕ grading ⮕ persistence ⮕ credit deduction. Uses `createAdminClient` to bypass RLS.
  - **Interactions**: OpenAI SDK, Supabase Admin Client, `ai-actions.ts`.

### 📁 Routes & Pages
- **`app/layout.tsx`**: Root layout with font injection and `ThemeProvider`.
- **`app/page.tsx`**: The High-Fidelity Landing Page.
- **`app/projects/page.tsx`**: Main project discovery grid (Dashboard).
- **`app/projects/[id]/page.tsx`**: The Project Dashboard with prompt editor and test suite.
- **`app/projects/[id]/analytics/page.tsx`**: Visualization deck for regression stats.
- **`app/projects/[id]/playground/page.tsx`**: Real-time iterative prompt testing environment.
- **`app/auth/callback/route.ts`**: Handles OAuth and Magic Link code exchange for sessions.

---

## 📂 3. `components/` (Interface Layers)

- **`components/ui/`**: 20+ Atomic Shadcn components (Button, Input, Table, etc.).
- **`components/landing/`**: High-WOW components like `InfiniteTestLoop`, `CodeRain`, and `MagneticButton`.
- **`test-runner.tsx`**: The real-time progress orb and result table manager.
- **`project-sidebar.tsx`**: Navigation and context switcher for the internal dashboard.
- **`evaluation-settings.tsx`**: UI for configuring AI Judge rubrics (Tone, Hallucinations).

---

## 📂 4. Shared Infrastructure (`lib/` & `utils/`)

- **`lib/inngest.ts`**: Event schema definition (`app/test.run.requested`).
- **`lib/supabase/client.ts`**: Standard client for browser-side RLS operations.
- **`lib/supabase/admin.ts`**: Elevated client (Service Role) for background worker writes.
- **`utils/judge-prompt.ts`**: Generates the "System Prompt" for the Semantic AI Judge.
- **`utils/model-pricing.ts`**: Pricing constants and `calculateCost` logic for OpenAI models.

---

## 📂 5. Database (`supabase/`)
- **`supabase-schema.sql`**: Definitive PostgreSQL snapshot.
- **`supabase/migrations/`**: Chronological log of DDL changes (RLS policies, triggers, custom RPCs like `deduct_user_credits`).

---
**Summary**: This directory provides a 1:1 map from file path to system behavior. It is the logical legend for the Prompt Guard codebase.
