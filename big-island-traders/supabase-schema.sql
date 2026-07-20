-- Big Island Traders — Supabase Schema
-- Run this in the Supabase SQL Editor

-- orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  customer_name text,
  customer_email text,
  customer_phone text,
  company text,
  product_name text,
  quantity integer,
  amount_jmd numeric,
  branding boolean default false,
  payment_method text default 'bank_transfer',
  status text default 'pending',
  notes text
);

-- leads (enquiries + bookings)
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  company text,
  email text,
  phone text,
  occasion text,
  budget_range text,
  message text,
  preferred_date text,
  source text default 'website',
  status text default 'new'
);

-- Enable RLS
alter table orders enable row level security;
alter table leads enable row level security;

-- Allow inserts from anon (form submissions)
create policy "Allow anon insert" on orders for insert to anon with check (true);
create policy "Allow anon insert" on leads for insert to anon with check (true);

-- Allow service role to read everything
create policy "Service role full access orders" on orders for all to service_role using (true);
create policy "Service role full access leads" on leads for all to service_role using (true);
