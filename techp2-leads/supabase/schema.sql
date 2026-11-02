-- TechP2 Agriculture & Hardware Leads CRM
-- Supabase schema

create extension if not exists "uuid-ossp";

-- Leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Identity
  business_name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  parish text check (parish in ('St. Ann','Portland','St. Mary','St. Thomas','Other')),
  community text,

  -- Classification
  category text not null check (category in ('Agriculture','Hardware','Both')),
  business_type text,  -- farm, nursery, hardware store, co-op, etc.
  size text check (size in ('Small','Medium','Large')),
  annual_spend_estimate text,  -- JMD range

  -- Status
  status text not null default 'New' check (status in (
    'New','Contacted','Interested','Proposal Sent','Negotiating',
    'Converted','Not Interested','Follow Up','Cold'
  )),
  priority text default 'Medium' check (priority in ('High','Medium','Low')),
  source text default 'Field Visit' check (source in (
    'Field Visit','Referral','Cold Call','Email','Text','Online','Other'
  )),

  -- Contact preferences
  preferred_contact text default 'Call' check (preferred_contact in ('Call','Text','Email','WhatsApp','In-Person')),
  best_time text,  -- e.g. "Morning 8-10AM"

  -- Financial
  credit_terms text,  -- e.g. "30 days net"
  payment_method text,  -- Cash, bank transfer, cheque
  price_agreement text,  -- Current pricing arrangement notes

  -- Procurement details
  products_needed text[],  -- array of product categories
  volume_notes text,  -- volume/frequency of orders
  current_supplier text,

  -- Flags
  follow_up_required boolean default false,
  follow_up_date date,
  has_contract boolean default false,
  is_converted boolean default false,

  -- AI summary
  ai_summary text
);

-- Notes per lead
create table if not exists lead_notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  created_at timestamptz default now(),
  note_type text default 'General' check (note_type in (
    'General','Call Log','Site Visit','Email','Text','Meeting',
    'Requirement','Complaint','Follow Up','Contract Note'
  )),
  content text not null,
  created_by text default 'TechP2 Rep'
);

-- Call logs (dedicated)
create table if not exists call_logs (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  created_at timestamptz default now(),
  duration_mins integer,
  outcome text check (outcome in (
    'Answered','No Answer','Voicemail','Busy','Wrong Number','Callback Requested'
  )),
  summary text,
  follow_up_required boolean default false,
  follow_up_date date
);

-- Follow-up tasks
create table if not exists follow_ups (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  created_at timestamptz default now(),
  due_date date not null,
  task_type text check (task_type in (
    'Call','Visit','Email','Send Quote','Send Contract','Deliver Sample','Other'
  )),
  description text,
  completed boolean default false,
  completed_at timestamptz,
  priority text default 'Medium' check (priority in ('High','Medium','Low'))
);

-- Contracts / pricing agreements
create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  created_at timestamptz default now(),
  contract_type text check (contract_type in (
    'Pricing Agreement','Supply Agreement','Distribution Agreement',
    'MOU','Service Agreement','Custom'
  )),
  title text not null,
  status text default 'Draft' check (status in ('Draft','Sent','Signed','Active','Expired','Terminated')),
  start_date date,
  end_date date,
  total_value numeric(12,2),
  currency text default 'JMD',
  payment_terms text,
  delivery_terms text,
  products text[],
  notes text,
  document_url text
);

-- Deliveries
create table if not exists deliveries (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  contract_id uuid references contracts(id),
  created_at timestamptz default now(),
  delivery_date date,
  status text default 'Pending' check (status in (
    'Pending','Scheduled','In Transit','Delivered','Partial','Failed','Cancelled'
  )),
  items text,
  value numeric(12,2),
  currency text default 'JMD',
  notes text,
  proof_url text
);

-- RLS policies
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table call_logs enable row level security;
alter table follow_ups enable row level security;
alter table contracts enable row level security;
alter table deliveries enable row level security;

-- Open read/write for anon (single-user app — add auth later)
create policy "Public access" on leads for all using (true) with check (true);
create policy "Public access" on lead_notes for all using (true) with check (true);
create policy "Public access" on call_logs for all using (true) with check (true);
create policy "Public access" on follow_ups for all using (true) with check (true);
create policy "Public access" on contracts for all using (true) with check (true);
create policy "Public access" on deliveries for all using (true) with check (true);

-- Update trigger
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_updated_at before update on leads
  for each row execute function update_updated_at();

-- Indexes
create index on leads(parish);
create index on leads(status);
create index on leads(category);
create index on leads(follow_up_required) where follow_up_required = true;
create index on follow_ups(due_date) where completed = false;
create index on lead_notes(lead_id);
create index on call_logs(lead_id);
