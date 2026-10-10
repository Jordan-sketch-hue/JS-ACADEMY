-- Web push subscriptions for PWA notifications.
-- One row per device endpoint; deactivated when the push service returns 410/404.

create table if not exists push_subscriptions (
  endpoint   text        primary key,
  subscription jsonb     not null,
  active     boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only the service role should read/write push subscriptions.
alter table push_subscriptions enable row level security;

create policy "service role only" on push_subscriptions
  using (false);  -- blocks all anon/authed access; service role bypasses RLS
