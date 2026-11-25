-- =============================================================================
-- Migration: 001_multi_tenant_core
-- Project:   ibtadbwtrxglujkzqofs  (ALWAYS use this project)
-- Purpose:   Multi-tenant core: tenants, RBAC, policies, consent, LP pages
--
-- SAFETY RULES:
--   - All tables are prefixed to avoid collisions with existing tables
--   - RLS is enabled on every table — no row is readable without a matching policy
--   - tenant_policies is APPEND-ONLY (no UPDATE/DELETE granted to app role)
--   - consent_events is INSERT-ONLY
-- =============================================================================

-- ─── Enable UUID extension (idempotent) ──────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. Tenants ───────────────────────────────────────────────────────────────
create table if not exists jst_tenants (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  plan          text not null default 'starter', -- starter | growth | enterprise
  owner_user_id uuid references auth.users(id) on delete set null,
  config        jsonb not null default '{}',
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table jst_tenants enable row level security;

create policy "tenant_owner_all" on jst_tenants
  for all using (owner_user_id = auth.uid());

-- ─── 2. Tenant members (RBAC) ────────────────────────────────────────────────
create table if not exists jst_tenant_members (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references jst_tenants(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'viewer', -- owner | admin | editor | viewer
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table jst_tenant_members enable row level security;

create policy "member_can_read_own_tenant" on jst_tenant_members
  for select using (user_id = auth.uid());

create policy "admin_can_manage_members" on jst_tenant_members
  for all using (
    exists (
      select 1 from jst_tenant_members m
      where m.tenant_id = jst_tenant_members.tenant_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  );

-- Helper function: get current user's tenant_ids
create or replace function jst_my_tenant_ids()
returns setof uuid language sql security definer as $$
  select tenant_id from jst_tenant_members where user_id = auth.uid();
$$;

-- ─── 3. Tenant policies (APPEND-ONLY) ────────────────────────────────────────
create table if not exists tenant_policies (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references jst_tenants(id) on delete cascade,
  policy_type text not null,  -- see PolicyType in policy-engine.ts
  version     text not null,
  content     text not null,
  status      text not null default 'draft', -- draft | pending_review | approved | published | archived
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
  -- NO updated_at — this table is append-only
);

alter table tenant_policies enable row level security;

create policy "tenant_members_read_policies" on tenant_policies
  for select using (tenant_id = any(jst_my_tenant_ids()));

create policy "tenant_editors_insert_policies" on tenant_policies
  for insert with check (
    tenant_id = any(jst_my_tenant_ids())
    and exists (
      select 1 from jst_tenant_members m
      where m.tenant_id = tenant_policies.tenant_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin', 'editor')
    )
  );

-- NO UPDATE or DELETE policy — append-only by design

-- ─── 4. Consent events (INSERT-ONLY) ─────────────────────────────────────────
create table if not exists consent_events (
  id             uuid primary key default uuid_generate_v4(),
  tenant_id      uuid not null references jst_tenants(id) on delete cascade,
  user_id        uuid references auth.users(id),
  policy_type    text not null,
  policy_version text not null,
  consented_at   timestamptz not null default now(),
  ip_address     inet,
  user_agent     text,
  method         text not null default 'checkbox' -- checkbox | click | api
);

alter table consent_events enable row level security;

create policy "tenant_admins_read_consent" on consent_events
  for select using (
    tenant_id = any(jst_my_tenant_ids())
    and exists (
      select 1 from jst_tenant_members m
      where m.tenant_id = consent_events.tenant_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
    )
  );

create policy "anyone_can_record_consent" on consent_events
  for insert with check (true);

-- NO UPDATE or DELETE — consent evidence is immutable

-- ─── 5. Landing pages (lp_pages) ──────────────────────────────────────────────
create table if not exists lp_pages (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references jst_tenants(id) on delete cascade,
  slug        text not null,
  lp_type     text not null default 'lead-gen',
  title       text not null,
  headline    text not null,
  subline     text,
  cta_label   text,
  cta_href    text,
  og_image    text,
  variant     text default 'a',  -- a/b testing
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  config      jsonb not null default '{}',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (tenant_id, slug)
);

alter table lp_pages enable row level security;

create policy "public_read_published_lp" on lp_pages
  for select using (published = true);

create policy "tenant_members_manage_lp" on lp_pages
  for all using (tenant_id = any(jst_my_tenant_ids()));

-- ─── 6. CRM leads table ──────────────────────────────────────────────────────
create table if not exists jst_leads (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references jst_tenants(id) on delete cascade,
  name       text not null,
  email      text,
  phone      text,
  source     text,
  status     text not null default 'new', -- new | contacted | qualified | converted | lost
  score      int default 0,
  interest   text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table jst_leads enable row level security;

create policy "public_insert_lead" on jst_leads
  for insert with check (true);

create policy "tenant_members_manage_leads" on jst_leads
  for all using (tenant_id = any(jst_my_tenant_ids()));

-- ─── 7. Indexes ──────────────────────────────────────────────────────────────
create index if not exists idx_tenant_members_user     on jst_tenant_members(user_id);
create index if not exists idx_tenant_members_tenant   on jst_tenant_members(tenant_id);
create index if not exists idx_tenant_policies_tenant  on tenant_policies(tenant_id);
create index if not exists idx_consent_events_tenant   on consent_events(tenant_id);
create index if not exists idx_lp_pages_slug           on lp_pages(tenant_id, slug);
create index if not exists idx_jst_leads_tenant        on jst_leads(tenant_id);

-- ─── 8. updated_at triggers ──────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace trigger trg_tenants_updated_at
  before update on jst_tenants
  for each row execute function set_updated_at();

create or replace trigger trg_lp_pages_updated_at
  before update on lp_pages
  for each row execute function set_updated_at();

create or replace trigger trg_jst_leads_updated_at
  before update on jst_leads
  for each row execute function set_updated_at();
