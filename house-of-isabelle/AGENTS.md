# House of Isabelle — Agent Documentation

## System Overview

**Client:** House of Isabelle (Beauty / Hair Products + Salon Services)
**Stack:** Next.js 15 · Supabase (ibtadbwtrxglujkzqofs) · Vercel · Fygaro / WiPay payments
**Template category:** beauty (ShopGrid + ServiceGrid hybrid)
**Live URL:** TBD (deploy to `house-of-isabelle.vercel.app`, then alias to client domain)

This document is the authoritative reference for any Claude agent working on this project.
Read it fully before editing any file.

---

## Repository Layout

```
house-of-isabelle/
├── AGENTS.md                   ← THIS FILE
├── README.md                   ← Quick-start for new devs
├── .env.example                ← All required env vars (never commit real values)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql     ← Full schema (run once per environment)
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (Meta Pixel + GA4 script injection)
│   │   ├── page.tsx            ← Storefront homepage
│   │   ├── products/
│   │   │   ├── page.tsx        ← Catalog with category filter
│   │   │   └── [slug]/page.tsx ← PDP: texture / length / colour / qty variants
│   │   ├── cart/page.tsx       ← Cart drawer (also persisted in Supabase hi_carts)
│   │   ├── checkout/page.tsx   ← Fygaro payment initiation + delivery selector
│   │   ├── account/page.tsx    ← Customer profile / order history
│   │   ├── services/page.tsx   ← Salon service booking
│   │   ├── admin/
│   │   │   ├── layout.tsx      ← Admin auth guard
│   │   │   ├── page.tsx        ← Dashboard: revenue / orders / conversions
│   │   │   ├── products/page.tsx      ← Product CRUD + variant management
│   │   │   ├── orders/page.tsx        ← Order manager + status updates
│   │   │   ├── customers/page.tsx     ← CRM: profiles / segments / notes
│   │   │   ├── appointments/page.tsx  ← Booking calendar + slot management
│   │   │   ├── marketing/page.tsx     ← Email lists + abandoned cart queue
│   │   │   └── analytics/page.tsx     ← Sales / conversion / traffic charts
│   │   └── api/
│   │       ├── products/route.ts       ← GET (catalog) · POST/PATCH/DELETE (admin)
│   │       ├── orders/route.ts         ← GET / PATCH status
│   │       ├── customers/route.ts      ← GET / PATCH (CRM updates)
│   │       ├── cart/route.ts           ← GET / PUT cart (upsert by session_id)
│   │       ├── cart/abandon/route.ts   ← Cron: flag carts >1h + fire Resend reminder
│   │       ├── appointments/route.ts   ← GET / POST bookings
│   │       ├── payments/fygaro/route.ts   ← Initiate Fygaro checkout
│   │       ├── webhooks/fygaro/route.ts   ← HMAC-SHA256 verified; marks order paid
│   │       └── marketing/
│   │           ├── email/route.ts         ← Resend: order confirm / reminder / promo
│   │           └── pixel/route.ts         ← Server-side Meta Conversions API
│   ├── lib/
│   │   ├── supabase.ts         ← Supabase client (anon + service role)
│   │   ├── fygaro.ts           ← Payment initiation + signature verification
│   │   ├── resend.ts           ← Email automation: order / abandoned cart / promo
│   │   ├── whatsapp.ts         ← WhatsApp Cloud API: order alerts + customer msgs
│   │   ├── analytics.ts        ← Meta Pixel (client) + Conversions API (server) + GA4
│   │   └── google-shopping.ts  ← Product feed generation for Google Merchant Center
│   └── types/
│       └── index.ts            ← All shared TypeScript types
├── docs/
│   ├── SETUP.md                ← Step-by-step env + deployment instructions
│   ├── API-INTEGRATIONS.md     ← All third-party API credentials + usage notes
│   └── CRM-GUIDE.md            ← How to use the admin CRM day-to-day
└── scripts/
    └── seed-products.ts        ← Seeds sample hair product catalog into Supabase
```

---

## Supabase Tables

All tables are prefixed `hi_` (House of Isabelle). Supabase project: `ibtadbwtrxglujkzqofs`.

| Table | Purpose |
|---|---|
| `hi_products` | Products with variant matrix (texture / length / colour / qty) |
| `hi_product_variants` | Individual SKU rows (each texture+length+colour combination) |
| `hi_product_categories` | Straight, Body Wave, Burmese Curly, Coloured Hair, Tape-ins, Crochet |
| `hi_customers` | CRM: retail / stylist / wholesale customer profiles |
| `hi_orders` | Orders with delivery method and payment status |
| `hi_order_items` | Line items referencing product_variant_id |
| `hi_carts` | Active carts (session_id based; used for abandoned cart tracking) |
| `hi_cart_items` | Items in active carts |
| `hi_appointments` | Salon service bookings |
| `hi_services` | Salon service catalog (cut, install, treatment, etc.) |
| `hi_marketing_consents` | Email opt-ins with source tracking |
| `hi_email_log` | Record of every Resend send (deduplication + audit) |
| `hi_abandoned_cart_log` | Tracks which carts got reminder emails (prevents duplicate sends) |
| `hi_analytics_events` | Server-side Conversions API events (Meta + GA4) |
| `hi_wholesale_tiers` | Discount structures for stylist / wholesale accounts |
| `hi_admin_notes` | CRM notes attached to customers or orders |

---

## Product Variant System

Hair products have three variant dimensions:

```
texture:  Straight | Body Wave | Burmese Curly | Coloured Hair | Tape-in | Crochet
length:   8" | 10" | 12" | 14" | 16" | 18" | 20" | 22" | 24" | 26" | 28" | 30"
colour:   Natural Black | 1B | #2 | #4 | #27 | #30 | #613 | Ombre | Custom
```

Each `hi_product_variants` row holds a unique (product_id, texture, length, colour) combination
with its own price, stock level, and SKU. The PDP (`/products/[slug]`) renders three dropdowns
wired to `hi_product_variants`; selecting a combination updates price + stock display.

---

## Payment Flow (Fygaro)

```
Customer checkout
  → POST /api/payments/fygaro
      · Creates hi_order (status: pending_payment)
      · Builds Fygaro payment_link request with HMAC-SHA256 signature
      · Returns {redirect_url}
  → Customer completes payment on Fygaro
  → Fygaro POSTs to /api/webhooks/fygaro
      · Verifies HMAC-SHA256 signature (FYGARO_WEBHOOK_SECRET)
      · Updates hi_order status → paid
      · Decrements hi_product_variants.stock
      · Fires order confirmation email (Resend)
      · Sends WhatsApp alert to store owner
      · Fires Meta Purchase event (Conversions API)
      · Fires GA4 purchase event (Measurement Protocol)
```

**Critical:** NEVER mark an order paid without verifying the Fygaro HMAC. See `src/lib/fygaro.ts`.

---

## Delivery Options

Three options stored in `hi_orders.delivery_method`:

| Value | Label | Notes |
|---|---|---|
| `islandwide` | Islandwide Delivery | Fixed JMD rate configured in env `DELIVERY_ISLANDWIDE_RATE` |
| `knutsford` | Knutsford Express | Customer provides branch; fixed JMD rate `DELIVERY_KNUTSFORD_RATE` |
| `pickup` | In-Store Pickup | No delivery charge; store address shown at checkout |

---

## Customer Segments (CRM)

`hi_customers.segment` enum:

| Segment | Description | Discount |
|---|---|---|
| `retail` | Standard customer | Full price |
| `stylist` | Licensed stylist (verified manually) | 15% — stored in `hi_wholesale_tiers` |
| `wholesale` | Bulk buyer (invoice-based) | 25% — stored in `hi_wholesale_tiers` |

Segment is set manually by admin in `/admin/customers`. Discount is applied at checkout
via `hi_wholesale_tiers` lookup on the authenticated customer's segment.

---

## Abandoned Cart Flow

```
Cron: POST /api/cart/abandon (run every hour via Vercel Cron)
  · Queries hi_carts WHERE updated_at < now() - interval '1 hour' AND status = 'active'
  · For each cart: check hi_abandoned_cart_log (skip if already emailed in last 24h)
  · Fire Resend "abandoned cart" email template
  · Insert row into hi_abandoned_cart_log
  · Update hi_carts.status = 'abandoned'
```

---

## Marketing Integrations

### Meta Pixel + Conversions API
- Client-side: `fbq()` calls for PageView, ViewContent, AddToCart (via `src/lib/analytics.ts`)
- Server-side: Conversions API for Purchase event (deduplication via event_id)
- Pixel ID: stored in `NEXT_PUBLIC_META_PIXEL_ID`
- Access Token: stored in `META_CONVERSIONS_API_TOKEN`

### Google Analytics 4 + Google Shopping
- GA4 Measurement ID: `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
- GA4 API Secret: `GA4_API_SECRET`
- Shopping feed: GET `/api/products?format=google-shopping-feed` returns RSS XML
- Submit feed URL to Google Merchant Center: `https://{domain}/api/products?format=google-shopping-feed`

### Resend Email Automations
- Order confirmation: fired from Fygaro webhook
- Abandoned cart reminder: fired from cron job (24h cooldown)
- Promotional blast: manual from `/admin/marketing`
- From address: `orders@{client_domain}` (must be verified in Resend)

### WhatsApp (Cloud API)
- New order alert → store owner phone (`WHATSAPP_OWNER_PHONE`)
- Customer support link on storefront (wa.me deep link)
- Do NOT use Railway bot for outbound orders — direct Cloud API only

---

## Environment Variables

See `.env.example` for the full list. Required for production:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ibtadbwtrxglujkzqofs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Fygaro
FYGARO_MERCHANT_ID=...
FYGARO_SECRET_KEY=...
FYGARO_WEBHOOK_SECRET=...
FYGARO_BASE_URL=https://app.fygaro.com

# Delivery rates (JMD cents)
DELIVERY_ISLANDWIDE_RATE=150000
DELIVERY_KNUTSFORD_RATE=80000

# Meta
NEXT_PUBLIC_META_PIXEL_ID=...
META_CONVERSIONS_API_TOKEN=...

# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=...

# Resend
RESEND_API_KEY=...
RESEND_FROM_EMAIL=orders@houseofisabelle.com

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_OWNER_PHONE=1876XXXXXXX

# App
NEXT_PUBLIC_SITE_URL=https://houseofisabelle.com
ADMIN_SECRET=...
```

---

## Admin Authentication

`/admin/*` is protected by a simple `ADMIN_SECRET` check stored in a cookie.
This is a low-friction pattern used across JST client templates.
For production clients, upgrade to Clerk or Supabase Auth.

Upgrade path: add Clerk `@clerk/nextjs` and move admin guard to middleware.

---

## Deployment SOP

1. `git pull origin main` before every edit
2. Add all env vars in Vercel dashboard (never `.env.local` commit)
3. `vercel --prod` from CLI — NEVER use Vercel UI deploy / AI scaffold
4. After deploy: alias to `house-of-isabelle.vercel.app`
5. After DNS confirmed: alias to client custom domain

---

## CRM Day-to-Day (Quick Reference)

| Task | Location |
|---|---|
| View all orders | `/admin/orders` |
| Mark order shipped | `/admin/orders` → click order → update status |
| View customer profile | `/admin/customers` → search by name/phone |
| Add CRM note | `/admin/customers` → customer row → Notes tab |
| Upgrade customer to stylist/wholesale | `/admin/customers` → Segment dropdown |
| View abandoned carts | `/admin/marketing` → Abandoned Carts tab |
| Send manual email blast | `/admin/marketing` → Email Blast tab |
| View analytics | `/admin/analytics` |
| Manage booking slots | `/admin/appointments` |

---

## Open Items (pick up here)

- [ ] Seed `hi_products` and `hi_product_variants` with Isabelle's actual catalog
- [ ] Configure Fygaro merchant account and get webhook URL registered
- [ ] Verify `orders@houseofisabelle.com` sender domain in Resend
- [ ] Set `NEXT_PUBLIC_META_PIXEL_ID` from Isabelle's Meta Business Manager
- [ ] Submit Google Shopping feed URL to Google Merchant Center
- [ ] Set Vercel Cron for `/api/cart/abandon` (hourly)
- [ ] Configure custom domain in Vercel + Namecheap DNS
- [ ] Run `scripts/seed-products.ts` after schema migration
- [ ] Upgrade admin auth to Clerk when client goes live

---

## Audit Checklist (before launch)

- [ ] All `hi_*` Supabase tables have RLS enabled
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NEVER in `NEXT_PUBLIC_*` vars
- [ ] Fygaro webhook HMAC verified before any order state change
- [ ] Meta Pixel deduplication: event_id matches Conversions API send
- [ ] `ADMIN_SECRET` cookie is HttpOnly + Secure + SameSite=Lax
- [ ] All product images are compressed (<200KB per JST Media Compression SOP)
- [ ] Google Shopping feed URL returns valid RSS/XML
- [ ] Abandoned cart cron tested end-to-end in staging
- [ ] `hi_customers.segment` can only be set server-side (not client-writable)
- [ ] `hi_wholesale_tiers` applied server-side at checkout — never trust client price
