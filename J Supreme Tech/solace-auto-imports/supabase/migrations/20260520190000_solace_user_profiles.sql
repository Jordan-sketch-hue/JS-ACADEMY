-- Solace back-office users: pairs every auth.users row with a role and display name.
-- The bootstrap admin still signs in via SOLACE_ADMIN_EMAILS env allow-list; this table
-- becomes the source of truth as soon as profiles exist.

create type public.solace_user_role as enum ('admin', 'basic');

create table if not exists public.solace_user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role public.solace_user_role not null default 'basic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists solace_user_profiles_role_idx
  on public.solace_user_profiles (role);

create index if not exists solace_user_profiles_email_idx
  on public.solace_user_profiles (lower(email));

alter table public.solace_user_profiles enable row level security;

drop policy if exists "Service role manages solace user profiles" on public.solace_user_profiles;
create policy "Service role manages solace user profiles"
on public.solace_user_profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Keep updated_at fresh on every update
create or replace function public.solace_user_profiles_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists solace_user_profiles_set_updated_at on public.solace_user_profiles;
create trigger solace_user_profiles_set_updated_at
before update on public.solace_user_profiles
for each row execute function public.solace_user_profiles_touch_updated_at();
