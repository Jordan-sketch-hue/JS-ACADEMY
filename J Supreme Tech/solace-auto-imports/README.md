# Solace Auto Imports - Website

Static multi-page website for Solace Auto Imports Limited (Jamaica).
**We Import | We Sell | We Source** - (876) 456-6976

## Quick start

```powershell
cd "C:\Users\jader\J Supreme Tech\solace-auto-imports"
npm run dev
```

Opens at http://localhost:3000 through `vercel dev`, so the serverless API routes work locally.

## Pages

- `index.html` - home: hero, services, featured cars, about, testimonials, CTA
- `inventory.html` - searchable/filterable car gallery
- `services.html` - full breakdown of Import / Sell / Source / Consultation
- `source-vehicle.html` - lead-gen form that sends via WhatsApp or email
- `about.html` - story, why-choose-us, FAQ
- `contact.html` - phone/WhatsApp/email/Instagram and map
- `admin.html` - redirects to `/admin/login` (legacy `/admin` entry)
- `handoff.html` - internal noindex handoff checklist with completed sign-off items
- `404.html` - friendly not-found page

## Add a car to the inventory

1. Drop the car's photos into `images/inventory/`. Use lowercase-hyphen names, for example `axio-2018-front.jpg`.
2. Open `data/cars.json` and add an entry to the `cars` array. Required fields: `id`, `make`, `model`, `year`. Useful extras: `type`, `transmission`, `fuel`, `color`, `mileageKm`, `priceDisplay`, `priceJMD` as a number for price sorting, `status` as `Available`/`Reserved`/`Sold`, `featured`, and `dateAdded` as `YYYY-MM-DD`.
3. Refresh. The inventory page picks it up automatically.

`featured: true` appears on the homepage feature strip. Cars added in the last 14 days get an automatic NEW badge.

## Edit testimonials

Edit the `testimonials` array in `data/cars.json`. Each entry needs `name`, `location`, and `quote`.

## Add brand images

- `images/logo.svg` — circular brand logo (SVG, used site-wide today)
- `images/logo.png` — **optional:** drop the client's PNG here to override SVG (same filename pattern as banner artwork)
- `favicon.svg` — browser tab icon (root + `assets/`)
- `images/about.jpg` — optional showroom/team photo for the About page
- `images/og-image.jpg` — 1200×630 image for social sharing

If the client sends a circular PNG logo from their banner, save it as `images/logo.png`. All pages fall back from `logo.svg` → `logo.png` automatically.

## Update WhatsApp number

The number is centralized in [src/js/whatsapp.js](src/js/whatsapp.js). Change `WA_NUMBER` once and every WhatsApp link updates. Current: `18764566976` → (876) 456-6976.

## Backoffice v2
The backoffice SPA lives at **`/admin/login`** (routes in [admin/README.md](admin/README.md)).

- Dashboard, vehicles CRUD, leads with notes, settings, image upload
- Frontend API client: `admin/js/api.js` (Bearer token on every protected call)
- Run migration: [supabase/migrations/20260519180000_backoffice_v2.sql](supabase/migrations/20260519180000_backoffice_v2.sql)

## Backoffice and database

The backoffice is available at `/admin`. It uses the same Supabase project configured for `j-supreme-conglomerate` through these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SOLACE_ADMIN_EMAILS` — comma-separated client/business operators (e.g. `solaceimports@gmail.com`)
- `SOLACE_ARCHITECT_EMAILS` — comma-separated agency/architect logins (separate inbox from Solace)

Run [supabase/solace_auto_imports.sql](supabase/solace_auto_imports.sql) once in the shared Supabase SQL editor to create the Solace tables, RLS policies, and starter inventory. The API routes use the service role key server-side only; the browser receives only the public URL and anon key.

Provision a backoffice login (sends Supabase invite to that inbox only):

```powershell
node scripts/provision-backoffice-user.mjs your-architect@gmail.com
```

Backoffice features:

- Supabase Auth login and password reset (emails go only to the address typed on `/admin`)
- Allow-list through `SOLACE_ADMIN_EMAILS` + `SOLACE_ARCHITECT_EMAILS`
- Vehicle add/edit/delete
- Featured, status, price, mileage, specs, description, and multiple image URL management
- Inquiry/contact lead storage and status updates
- Public inventory reads from `/api/vehicles` with `data/cars.json` fallback

## Handoff checklist

Open `/handoff` or `handoff.html` before transferring the site. The page includes checked-off sections for frontend review, inventory, backoffice/admin, security, forms, SEO, hosting, database/storage, brand content, client training, delivery items, and client sign-off.

Do not store passwords, API keys, access tokens, or private credential values on the handoff page.

## Features

- WhatsApp floating action button on every page
- WhatsApp + Call buttons on each car card and detail modal
- Database-backed inventory with live search, brand/transmission/fuel/type filters, sort by recency / year / price
- Supabase-backed admin dashboard and lead storage
- Image lightbox modal with arrow-key navigation
- Reveal-on-scroll animations, FAQ accordion, sticky header
- Auto NEW badge for cars under 14 days old
- Mobile-first responsive layout
- SEO: sitemap.xml, robots.txt, Open Graph tags, structured data as AutoDealer
- Vercel-ready: caching, security headers, clean URLs

## Deploy to Vercel

**Option A - Vercel CLI:**

```powershell
cd "C:\Users\jader\J Supreme Tech\solace-auto-imports"
npx vercel --prod
```

First run prompts you to log in via browser. Subsequent deploys are one command.

**Option B - GitHub + Vercel.com:**

1. Create a GitHub repo and push this folder.
2. Visit https://vercel.com/new, import the repo, click Deploy.

Both work. `vercel.json` already configures static hosting with no build step.

## Phase 2 ideas

- Admin upload UI with Supabase Storage and a lightweight admin page
- Form storage backend with a Vercel serverless function to Supabase or an email service
- Financing calculator
- Trade-in valuation tool
- Vehicle comparison tool
