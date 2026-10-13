-- Supreme Suite tenant accounts — created when a client signs up via Clerk.
-- Each row = one paying/trial SaaS customer on the platform.

create table if not exists ss_tenants (
  id              text        primary key default gen_random_uuid()::text,
  clerk_user_id   text        not null unique,  -- Clerk user.id
  email           text,
  full_name       text,
  plan            text        not null default 'trial', -- trial | starter | growth | pro
  status          text        not null default 'active', -- active | suspended | churned
  onboarded_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists ss_tenants_clerk_user_id_idx on ss_tenants(clerk_user_id);
create index if not exists ss_tenants_email_idx         on ss_tenants(email);

-- Service role only — no public reads
alter table ss_tenants enable row level security;

create policy "service role only" on ss_tenants
  using (false);
