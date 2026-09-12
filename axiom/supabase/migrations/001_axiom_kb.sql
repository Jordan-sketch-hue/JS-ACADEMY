-- AXIOM · axiom_kb table + policies
-- Run once on the ibtadbwtrxglujkzqofs project

create table if not exists axiom_kb (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        text not null,          -- 'shared_build' | 'generated_build' | 'error_log' | 'train_entry'
  title       text not null default '',
  body        jsonb not null default '{}'
);

-- index for the most common query patterns
create index if not exists axiom_kb_kind_idx        on axiom_kb (kind);
create index if not exists axiom_kb_created_at_idx  on axiom_kb (created_at desc);

-- RLS: service-role writes, anon reads shared_build only
alter table axiom_kb enable row level security;

create policy "anon_read_shared"
  on axiom_kb for select
  using (kind = 'shared_build');

create policy "service_all"
  on axiom_kb for all
  using     (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
