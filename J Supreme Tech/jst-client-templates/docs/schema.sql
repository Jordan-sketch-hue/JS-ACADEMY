-- JST Client Templates — Supabase Schema
-- Project: ibtadbwtrxglujkzqofs
-- Applied: 2026-10-28
-- HOW TO TEST: check Supabase Table Editor for all ct_* tables listed below

-- CLIENTS — one row per onboarded TikTok business
create table if not exists ct_clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null check (category in (
    'fashion','accessories','furniture','food','beauty',
    'tech-repair','automotive','packaging','variety',
    'lighting','florist','crafts','events'
  )),
  config     jsonb not null default '{}',
  active     boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LEADS — contact form submissions from forward-facing sites
-- HOW TO TEST: submit contact form on any template -> row appears here
create table if not exists ct_leads (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid references ct_clients(id) on delete cascade,
  name       text,
  phone      text,
  email      text,
  message    text,
  source     text default 'contact_form',
  status     text default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz default now()
);

-- ORDERS — fashion, food, variety, packaging, lighting, crafts, florist
-- customer_name / customer_phone / total_amount used by OrdersModule component
create table if not exists ct_orders (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid references ct_clients(id) on delete cascade,
  lead_id        uuid references ct_leads(id),
  customer_name  text,
  customer_phone text,
  total_amount   integer,   -- JMD cents
  status         text default 'pending' check (status in (
    'pending','confirmed','processing','shipped','delivered','cancelled'
  )),
  notes          text,
  created_at     timestamptz default now()
);

-- INVENTORY — fashion, accessories, variety, crafts
create table if not exists ct_inventory (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references ct_clients(id) on delete cascade,
  name        text not null,
  sku         text,
  quantity    integer default 0,
  price_cents integer,
  image_url   text,
  created_at  timestamptz default now()
);

-- APPOINTMENTS — beauty, florist, events
-- client_name / service_type / appointment_date / appointment_time used by AppointmentsModule component
create table if not exists ct_appointments (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid references ct_clients(id) on delete cascade,
  lead_id          uuid references ct_leads(id),
  client_name      text,
  service_type     text,
  appointment_date date,
  appointment_time text,
  status           text default 'pending' check (status in (
    'pending','confirmed','completed','cancelled'
  )),
  notes            text,
  created_at       timestamptz default now()
);

-- JOB CARDS — tech-repair, automotive
-- client_name / device_description / fault_description / estimated_cost used by JobCardsModule component
create table if not exists ct_job_cards (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid references ct_clients(id) on delete cascade,
  lead_id            uuid references ct_leads(id),
  client_name        text,
  device_description text,
  fault_description  text,
  technician         text,
  estimated_cost     integer,   -- JMD cents
  status             text default 'received' check (status in (
    'received','in_progress','awaiting_parts','ready','collected'
  )),
  due_date           date,
  created_at         timestamptz default now()
);

-- MENU ITEMS — food & bakery
create table if not exists ct_menu_items (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid references ct_clients(id) on delete cascade,
  name        text not null,
  description text,
  price_cents integer,
  category    text,
  image_url   text,
  available   boolean default true,
  created_at  timestamptz default now()
);

-- RLS — all tables locked to service role (CRM reads server-side only)
-- Exception: anon INSERT on ct_leads for contact form submissions
alter table ct_clients      enable row level security;
alter table ct_leads        enable row level security;
alter table ct_orders       enable row level security;
alter table ct_inventory    enable row level security;
alter table ct_appointments enable row level security;
alter table ct_job_cards    enable row level security;
alter table ct_menu_items   enable row level security;

create policy "anon can insert leads"
  on ct_leads for insert
  to anon
  with check (true);
