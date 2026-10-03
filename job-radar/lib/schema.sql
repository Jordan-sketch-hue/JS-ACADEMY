-- Job Radar schema for Supabase

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  title text not null,
  company text not null,
  location text,
  url text not null,
  description text,
  tags text[] default '{}',
  salary_min int,
  salary_max int,
  currency text,
  job_type text default 'remote', -- remote | hybrid | onsite
  match_score int default 0,       -- 0-100, set by AI matcher
  match_reasons text[] default '{}',
  source text not null,            -- remotive | remoteok | hn-hiring | linkedin-rss
  posted_at timestamptz,
  scraped_at timestamptz default now(),
  applied boolean default false,
  saved boolean default false
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade,
  status text default 'applied', -- applied | interview | offer | rejected | ghosted
  cover_letter text,
  applied_at timestamptz default now(),
  notes text
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- Only show jobs with match_score >= 50 by default
create index if not exists idx_jobs_match on jobs(match_score desc);
create index if not exists idx_jobs_scraped on jobs(scraped_at desc);
create index if not exists idx_jobs_applied on jobs(applied);
