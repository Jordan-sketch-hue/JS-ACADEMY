create table if not exists public.solace_vehicles (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  make text not null,
  model text not null,
  year integer not null,
  type text,
  transmission text,
  fuel text,
  color text,
  mileage_km integer,
  price_display text,
  price_jmd integer,
  status text not null default 'Available',
  featured boolean not null default false,
  date_added date not null default current_date,
  images jsonb not null default '[]'::jsonb,
  condition text,
  location text,
  description text
);

create table if not exists public.solace_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  interest text,
  vehicle_id text,
  message text not null,
  source text not null default 'website',
  status text not null default 'new',
  payload jsonb not null default '{}'::jsonb
);

create index if not exists solace_vehicles_status_idx on public.solace_vehicles (status);
create index if not exists solace_vehicles_featured_idx on public.solace_vehicles (featured);
create index if not exists solace_vehicles_date_added_idx on public.solace_vehicles (date_added desc);
create index if not exists solace_leads_status_idx on public.solace_leads (status);
create index if not exists solace_leads_created_at_idx on public.solace_leads (created_at desc);

create or replace function public.set_solace_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_solace_vehicles_updated_at on public.solace_vehicles;
create trigger set_solace_vehicles_updated_at
before update on public.solace_vehicles
for each row execute function public.set_solace_updated_at();

drop trigger if exists set_solace_leads_updated_at on public.solace_leads;
create trigger set_solace_leads_updated_at
before update on public.solace_leads
for each row execute function public.set_solace_updated_at();

alter table public.solace_vehicles enable row level security;
alter table public.solace_leads enable row level security;

drop policy if exists "Service role can manage Solace vehicles" on public.solace_vehicles;
create policy "Service role can manage Solace vehicles"
on public.solace_vehicles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage Solace leads" on public.solace_leads;
create policy "Service role can manage Solace leads"
on public.solace_leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into public.solace_vehicles (
  id, make, model, year, type, transmission, fuel, color, mileage_km,
  price_display, price_jmd, status, featured, date_added, images, condition, location, description
) values
  (
    'toyota-axio-2018',
    'Toyota',
    'Axio',
    2018,
    'Sedan',
    'Automatic',
    'Petrol',
    'Pearl White',
    45000,
    'Contact for price',
    null,
    'Available',
    true,
    '2026-05-14',
    '[]'::jsonb,
    'Excellent',
    'Kingston',
    'Sample listing. Replace with the actual write-up and add real photo paths to the images array.'
  ),
  (
    'mercedes-gle-2022',
    'Mercedes-Benz',
    'GLE 53 AMG',
    2022,
    'SUV',
    'Automatic',
    'Petrol',
    'Polar White',
    18000,
    'Contact for price',
    null,
    'Available',
    true,
    '2026-05-12',
    '[]'::jsonb,
    'Excellent',
    'Kingston',
    'Sample listing - replace with real photos and details.'
  ),
  (
    'porsche-cayenne-2021',
    'Porsche',
    'Cayenne',
    2021,
    'SUV',
    'Automatic',
    'Petrol',
    'Jet Black',
    32000,
    'Contact for price',
    null,
    'Available',
    true,
    '2026-05-08',
    '[]'::jsonb,
    'Excellent',
    'Kingston',
    'Sample listing - replace with real photos and details.'
  ),
  (
    'toyota-prado-2020',
    'Toyota',
    'Land Cruiser Prado',
    2020,
    'SUV',
    'Automatic',
    'Diesel',
    'Cherry Red',
    60000,
    'Contact for price',
    null,
    'Available',
    false,
    '2026-04-20',
    '[]'::jsonb,
    'Good',
    'Kingston',
    'Sample listing - replace with real photos and details.'
  ),
  (
    'honda-fit-hybrid-2019',
    'Honda',
    'Fit Hybrid',
    2019,
    'Hatchback',
    'Automatic',
    'Hybrid',
    'Silver',
    55000,
    'Contact for price',
    null,
    'Available',
    false,
    '2026-03-30',
    '[]'::jsonb,
    'Good',
    'Kingston',
    'Sample listing - replace with real photos and details.'
  ),
  (
    'nissan-note-2018',
    'Nissan',
    'Note',
    2018,
    'Hatchback',
    'Automatic',
    'Petrol',
    'Champagne',
    72000,
    'Contact for price',
    null,
    'Reserved',
    false,
    '2026-02-12',
    '[]'::jsonb,
    'Good',
    'Kingston',
    'Sample listing - replace with real photos and details.'
  )
on conflict (id) do nothing;
