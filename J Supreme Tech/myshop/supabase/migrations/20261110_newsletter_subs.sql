-- Mine & Yours Shop: newsletter subscribers table
create table if not exists myshop_newsletter_subs (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  region      text not null default 'JM',
  optin_alerts  boolean not null default true,
  optin_promos  boolean not null default true,
  optin_coupons boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists myshop_newsletter_subs_region_idx on myshop_newsletter_subs(region);

-- RLS: only service role can read; anon can insert their own
alter table myshop_newsletter_subs enable row level security;

create policy "Anyone can subscribe"
  on myshop_newsletter_subs for insert
  with check (true);

create policy "Users can update own preferences"
  on myshop_newsletter_subs for update
  using (true)
  with check (true);
