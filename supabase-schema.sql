-- PromptGuard Database Schema
-- Production-Grade SQL with Row Level Security

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  user_id uuid references auth.users(id) on delete cascade not null,
  openai_api_key text,
  constraint name_length check (char_length(name) >= 1 and char_length(name) <= 255)
);

-- Test Cases table
create table test_cases (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  input_text text not null,
  expected_output text,
  constraint name_length check (char_length(name) >= 1 and char_length(name) <= 255),
  constraint input_length check (char_length(input_text) >= 1)
);

-- Test Runs table
create table test_runs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  status text default 'running' check (status in ('running', 'completed', 'failed', 'cancelled')),
  prompt_template text not null,
  model text default 'gpt-3.5-turbo' not null,
  total_cases integer default 0,
  passed_cases integer default 0,
  failed_cases integer default 0
);

-- Test Results table
create table test_results (
  id uuid default gen_random_uuid() primary key,
  run_id uuid references test_runs(id) on delete cascade not null,
  case_id uuid references test_cases(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  input_used text not null,
  actual_output text,
  expected_output text,
  status text default 'success' check (status in ('success', 'error', 'timeout')),
  latency_ms integer,
  tokens_used integer,
  error_message text
);

-- Create indexes for performance
create index idx_projects_user_id on projects(user_id);
create index idx_test_cases_project_id on test_cases(project_id);
create index idx_test_runs_project_id on test_runs(project_id);
create index idx_test_results_run_id on test_results(run_id);
create index idx_test_results_case_id on test_results(case_id);

-- Enable Row Level Security
alter table projects enable row level security;
alter table test_cases enable row level security;
alter table test_runs enable row level security;
alter table test_results enable row level security;

-- RLS Policies: User-based access control

-- Projects policies
create policy "Users can only access their own projects"
  on projects for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Test Cases policies
create policy "Users can only access test cases of their own projects"
  on test_cases for all
  using (project_id in (select id from projects where user_id = auth.uid()))
  with check (project_id in (select id from projects where user_id = auth.uid()));

-- Test Runs policies
create policy "Users can only access test runs of their own projects"
  on test_runs for all
  using (project_id in (select id from projects where user_id = auth.uid()))
  with check (project_id in (select id from projects where user_id = auth.uid()));

-- Test Results policies
create policy "Users can only access test results of their own runs"
  on test_results for all
  using (run_id in (
    select id from test_runs 
    where project_id in (select id from projects where user_id = auth.uid())
  ))
  with check (run_id in (
    select id from test_runs 
    where project_id in (select id from projects where user_id = auth.uid())
  ));

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();

create trigger update_test_cases_updated_at
  before update on test_cases
  for each row
  execute function update_updated_at_column();

create trigger update_test_runs_updated_at
  before update on test_runs
  for each row
  execute function update_updated_at_column();

create trigger update_test_results_updated_at
  before update on test_results
  for each row
  execute function update_updated_at_column();

-- Additional performance indexes for analytics
create index idx_test_runs_created_at on test_runs(created_at);
create index idx_test_results_created_at on test_results(created_at);
create index idx_test_results_status on test_results(status);

