# Solace migrations for shared Supabase (ibtadbwtrxglujkzqofs)

These migrations belong in the **j-supreme-conglomerate** monorepo when that repo is checked out locally:

```
j-supreme-conglomerate/supabase/migrations/
  20260519170000_solace_auto_imports.sql
  20260519180000_backoffice_v2.sql
  20260519180100_solace_storage_bucket.sql
```

Copy from this folder:

```
solace-auto-imports/supabase/migrations/
```

## Run order (Supabase SQL Editor or `supabase db push`)

1. `20260519170000_solace_auto_imports.sql` — vehicles + leads tables
2. `20260519180000_backoffice_v2.sql` — settings + lead notes
3. `20260519180100_solace_storage_bucket.sql` — vehicle-images bucket

**Project ref:** `ibtadbwtrxglujkzqofs`  
**Dashboard:** https://supabase.com/dashboard/project/ibtadbwtrxglujkzqofs/sql/new

If j-supreme-conglomerate is not cloned yet:

```powershell
cd C:\Users\jader\J Supreme Tech
gh repo clone jordan-sketch-hue/j-supreme-conglomerate
mkdir j-supreme-conglomerate\supabase\migrations -Force
Copy-Item C:\Users\jader\J Supreme Tech\solace-auto-imports\supabase\migrations\202605*.sql j-supreme-conglomerate\supabase\migrations\
```
