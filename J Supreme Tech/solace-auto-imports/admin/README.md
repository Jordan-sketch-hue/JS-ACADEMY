# Solace Backoffice (Admin v2)

Routes (SPA at `/admin/*`):

| Route | Purpose |
|-------|---------|
| `/admin/login` | Email/password sign-in |
| `/admin/dashboard` | Stats overview |
| `/admin/vehicles` | Inventory list + search/filter |
| `/admin/vehicles/new` | Add vehicle |
| `/admin/vehicles/:id/edit` | Edit vehicle |
| `/admin/leads` | Inquiries + notes |
| `/admin/settings` | Banner contact + homepage copy |

Legacy `/admin` redirects to `/admin/login`.

## API contract

All admin routes require `Authorization: Bearer <supabase_access_token>` except public routes.

### Public

| Method | Path | Response |
|--------|------|----------|
| GET | `/api/config` | `{ supabaseUrl, supabaseAnonKey, adminConfigured }` |
| GET | `/api/vehicles` | `{ cars: Vehicle[] }` — excludes `Hidden`; optionally excludes `Sold` if settings.hideSoldOnPublic |
| GET | `/api/settings` | `{ settings: SiteSettings }` |
| POST | `/api/leads` | `{ lead }` — body: `{ name, phone, message, email?, source?, vehicleId?, interest? }` |

### Admin (Bearer required)

| Method | Path | Body / query | Response |
|--------|------|--------------|----------|
| GET | `/api/admin/dashboard` | — | `{ stats: { totalVehicles, availableVehicles, soldVehicles, featuredVehicles, newInquiries, sourcingRequests, openLeads } }` |
| GET | `/api/admin/vehicles` | — | `{ cars: Vehicle[] }` |
| POST | `/api/admin/vehicles` | Vehicle JSON | `{ car: Vehicle }` |
| PUT | `/api/admin/vehicles` | Vehicle JSON (must include `id`) | `{ car: Vehicle }` |
| DELETE | `/api/admin/vehicles?id=` | query `id` | `{ ok: true }` |
| GET | `/api/admin/leads` | — | `{ leads: Lead[] }` |
| PUT | `/api/admin/leads` | `{ id, status?, adminNotes? }` | `{ lead: Lead }` |
| GET | `/api/admin/settings` | — | `{ settings: SiteSettings }` |
| PUT | `/api/admin/settings` | SiteSettings fields | `{ settings }` |
| POST | `/api/admin/upload` | `{ filename, contentType, data: base64 }` | `{ url, path }` |

### JSON field names (camelCase)

**Vehicle:** `id`, `make`, `model`, `year`, `type`, `transmission`, `fuel`, `color`, `mileageKm`, `priceDisplay`, `priceJMD`, `status`, `featured`, `dateAdded`, `images[]`, `condition`, `location`, `description`

**Lead:** `id`, `name`, `phone`, `email`, `interest`, `vehicleId`, `message`, `source`, `status`, `adminNotes`, `createdAt`, `updatedAt`

**SiteSettings:** `phone`, `whatsapp`, `email`, `instagram`, `address`, `heroTitle`, `heroSubtitle`, `heroTagline`, `ctaPrimary`, `ctaSecondary`, `hideSoldOnPublic`

### Error handling (admin JS)

- `401` / `403` → toast + redirect to `/admin/login`
- `500` → toast with server message
- All other errors → toast + inline form status

## Local dev

```powershell
cd "C:\Users\jader\J Supreme Tech\solace-auto-imports"
npx vercel env pull .vercel\.env.production.local --environment=development
npm run dev
```

Open http://localhost:3000/admin/login

Verify:

1. Sign in → dashboard loads stats
2. Add/edit vehicle → appears on http://localhost:3000/inventory
3. Leads from contact/source forms → `/admin/leads`

## Storage

Create Supabase bucket **`vehicle-images`** (public read). Image upload in admin uses `/api/admin/upload`.
