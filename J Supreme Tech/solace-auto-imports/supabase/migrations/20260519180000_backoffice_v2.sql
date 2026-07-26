-- Backoffice v2: settings, lead notes, storage bucket

create table if not exists public.solace_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.solace_leads
  add column if not exists admin_notes text;

alter table public.solace_settings enable row level security;

drop policy if exists "Service role can manage Solace settings" on public.solace_settings;
create policy "Service role can manage Solace settings"
on public.solace_settings
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into public.solace_settings (key, value) values
  ('site', '{
    "phone": "(876) 456-6976",
    "whatsapp": "18764566976",
    "email": "solaceimports@gmail.com",
    "instagram": "https://www.instagram.com/solaceautoimports",
    "address": "Westmoreland, Jamaica",
    "heroTitle": "We Import | We Sell | We Source",
    "heroSubtitle": "Certified Used Car Dealer",
    "heroTagline": "Quality vehicles imported and sourced for Jamaica.",
    "ctaPrimary": "View Inventory",
    "ctaSecondary": "Call Us",
    "hideSoldOnPublic": false
  }'::jsonb)
on conflict (key) do nothing;

-- Storage bucket (run in Supabase Dashboard → Storage if SQL insert fails):
-- Bucket name: vehicle-images, Public: true
-- Policy: service_role full access via API; public read for objects
