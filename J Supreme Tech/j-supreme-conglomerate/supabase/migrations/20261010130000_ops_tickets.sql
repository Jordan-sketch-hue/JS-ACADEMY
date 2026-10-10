-- Ops tickets: cross-channel client issue tracker.
-- Created by WhatsApp bot (ticket.mjs), Angel IG sync (ops-ticket.ts),
-- and Ferguson Law email inbound (route.ts).

create table if not exists ops_tickets (
  id           text        primary key,              -- "t_" + sha256 prefix
  source       text        not null,                 -- "whatsapp" | "instagram" | "email"
  source_key   text        not null unique,          -- dedup key (upsert target)
  client_name  text,
  contact      text,                                 -- phone or email
  channel      text        not null,
  category     text        not null default 'inquiry',
  priority     text        not null default 'normal',
  summary      text,
  body_text    text,
  action_needed text,
  sla_hours    int         not null default 24,
  due_at       timestamptz,
  gate         text        not null default 'approval',
  is_scam      boolean     not null default false,
  state        text        not null default 'triaged',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index for the "find open ticket from same contact in last 48h" query in ticket.mjs
create index if not exists ops_tickets_contact_state_idx
  on ops_tickets (contact, state, updated_at desc);

-- Service role only — Jordan reads via the conglomerate UI (server-side, service key).
alter table ops_tickets enable row level security;

create policy "service role only" on ops_tickets
  using (false);
