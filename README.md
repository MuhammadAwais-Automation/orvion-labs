# Orvion Labs

AI prompt management and regression testing platform for evaluating prompt behavior over time.

Orvion Labs helps teams create prompt projects, manage prompt versions, run test suites, stream results in real time, and track execution quality. It is built around durable background execution so larger AI test runs do not depend on a single request-response cycle.

## Highlights

- Prompt projects with versioned system prompts
- Test cases for validating AI behavior
- Durable background test execution with Inngest
- Real-time result streaming through Supabase
- Credit-aware run execution and atomic credit deduction
- Playground workflow for testing prompt changes
- Account, profile, and project management surfaces

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Background Jobs | Inngest |
| Database | Supabase, PostgreSQL |
| Realtime | Supabase Realtime |
| AI | OpenAI API |
| UI | Tailwind CSS, Radix UI, Framer Motion |

## Architecture

```text
app/          Next.js routes and server actions
components/   UI components and feature surfaces
hooks/        Client-side hooks
lib/          Supabase, Inngest, AI, and business logic
supabase/     Database migrations and policies
types/        Shared TypeScript types
docs/         Architecture notes
```

## Environment

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

Never commit `.env.local` or production secrets.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Portfolio Context

This project demonstrates SaaS-style product engineering around AI reliability, async execution, realtime UX, and database-backed workflow design.
