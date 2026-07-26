-- Storage bucket for admin vehicle image uploads
-- Supabase project: ibtadbwtrxglujkzqofs

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

drop policy if exists "Public read vehicle images" on storage.objects;
create policy "Public read vehicle images"
on storage.objects for select
using (bucket_id = 'vehicle-images');

drop policy if exists "Service role manage vehicle images" on storage.objects;
create policy "Service role manage vehicle images"
on storage.objects for all
using (bucket_id = 'vehicle-images' and auth.role() = 'service_role')
with check (bucket_id = 'vehicle-images' and auth.role() = 'service_role');
