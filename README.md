<div align="center">

# Orvion Labs

### AI prompt management and regression testing platform.

![Next.js](https://img.shields.io/badge/Next.js-16-111111?style=flat-square&logo=nextdotjs)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-111111?style=flat-square&logo=supabase)
![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-111111?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-Prompt%20Testing-111111?style=flat-square&logo=openai)

</div>

Orvion Labs helps teams manage prompt projects, version system prompts, run test suites, stream results in real time, and track AI output quality over time. It is built around durable background execution so larger AI test runs do not depend on a single request-response cycle.

## At a Glance

| Area | Details |
|---|---|
| Product type | SaaS-style AI reliability platform |
| Users | AI product teams, prompt engineers, builders testing model behavior |
| Backend | Supabase, PostgreSQL, Realtime, Inngest jobs |
| AI layer | OpenAI API powered prompt/test execution |
| Showcase value | Async AI workflows, realtime UX, database-backed product design |

## What It Proves

| Capability | Example in this project |
|---|---|
| AI regression testing | Prompt versions, test suites, test cases, and result tracking |
| Durable async execution | Inngest-backed background runs for larger evaluations |
| Realtime product UX | Supabase Realtime result streaming and dashboard updates |
| SaaS architecture | Accounts, projects, profiles, credits, settings, and audit surfaces |
| AI reliability thinking | Playground, evaluations, version history, and measurable prompt behavior |

## Product Surface

- Prompt projects with versioned system prompts.
- Test cases for validating AI behavior.
- Background test execution through Inngest.
- Real-time result streaming through Supabase.
- Credit-aware run execution and atomic credit deduction.
- Playground workflow for testing prompt changes.
- Account, profile, audit, and project management surfaces.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Background jobs | Inngest |
| Database | Supabase, PostgreSQL |
| Realtime | Supabase Realtime |
| AI | OpenAI API |
| UI | Tailwind CSS, Radix UI, Framer Motion |

## Project Map

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

## Portfolio Note

This repository demonstrates product engineering around AI reliability, async execution, realtime UX, and database-backed workflow design.
