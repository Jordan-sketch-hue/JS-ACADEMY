-- MYSHOP schema on project ibtadbwtrxglujkzqofs

create table if not exists myshop_products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price_jmd   numeric(10,2) not null,
  image_url   text,
  category    text,
  stock       integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists myshop_orders (
  id                uuid primary key default gen_random_uuid(),
  paypal_order_id   text not null,
  paypal_capture_id text,
  payer_email       text,
  payer_name        text,
  amount_usd        numeric(10,2),
  items             jsonb not null default '[]',
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

-- Indexes
create index if not exists myshop_products_slug_idx on myshop_products (slug);
create index if not exists myshop_products_active_idx on myshop_products (active);
create index if not exists myshop_orders_status_idx on myshop_orders (status);

-- RLS
alter table myshop_products enable row level security;
alter table myshop_orders enable row level security;

-- Products: public read, service-role write
create policy "products_public_read" on myshop_products
  for select using (active = true);

-- Orders: service-role only (no anon reads)
create policy "orders_service_only" on myshop_orders
  using (false);
