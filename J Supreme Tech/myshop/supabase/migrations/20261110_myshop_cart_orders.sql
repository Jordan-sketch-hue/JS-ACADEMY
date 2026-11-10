-- myshop_cart_items: persisted cart per session
create table if not exists myshop_cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     text not null,
  product_id  uuid not null references myshop_products(id) on delete cascade,
  name        text not null,
  price_jmd   integer not null,
  image_url   text,
  quantity    integer not null default 1,
  created_at  timestamptz not null default now()
);

create index if not exists myshop_cart_items_cart_id_idx on myshop_cart_items(cart_id);

alter table myshop_cart_items enable row level security;

create policy "cart owner full access" on myshop_cart_items
  for all using (true) with check (true);

-- myshop_orders: created server-side on HandyPay checkout
create table if not exists myshop_orders (
  id                   uuid primary key default gen_random_uuid(),
  cart_id              text not null,
  total_jmd            integer not null,
  status               text not null default 'pending' check (status in ('pending','paid','failed')),
  handypay_session_id  text,
  created_at           timestamptz not null default now()
);

create index if not exists myshop_orders_cart_id_idx on myshop_orders(cart_id);
create index if not exists myshop_orders_handypay_session_id_idx on myshop_orders(handypay_session_id);

alter table myshop_orders enable row level security;

create policy "service role only" on myshop_orders
  for all using (auth.role() = 'service_role');
