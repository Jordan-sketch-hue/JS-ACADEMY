# House of Isabelle — Setup & Deployment Guide

## Prerequisites

| Requirement | Notes |
|---|---|
| Node 20+ | `node --version` |
| Vercel CLI | `npm i -g vercel` |
| Supabase project | `ibtadbwtrxglujkzqofs` (ALWAYS this one) |
| Fygaro merchant account | [app.fygaro.com](https://app.fygaro.com) |
| Resend account | [resend.com](https://resend.com) |
| Meta Business Suite | For Pixel + Conversions API |
| Google Analytics 4 | GA4 property |

---

## 1. Clone & Install

```bash
# From the jst-client-templates worktree
cd house-of-isabelle
npm install
```

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in every value.

```bash
cp .env.example .env.local
```

### Supabase Keys
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → project `ibtadbwtrxglujkzqofs`
2. Settings → API
3. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Fygaro Keys
1. Log into [app.fygaro.com](https://app.fygaro.com)
2. Settings → API Keys
3. Copy **Merchant ID** → `FYGARO_MERCHANT_ID`
4. Copy **Secret Key** → `FYGARO_SECRET_KEY`
5. Create a **Webhook Secret** → `FYGARO_WEBHOOK_SECRET`
6. Register webhook URL: `https://houseofisabelle.com/api/webhooks/fygaro`

### Resend
1. [resend.com](https://resend.com) → API Keys → Create key
2. Add and verify domain `houseofisabelle.com`
3. Copy key → `RESEND_API_KEY`

### WhatsApp Cloud API
1. [developers.facebook.com](https://developers.facebook.com) → WhatsApp → Getting Started
2. Copy **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
3. Generate **Access Token** → `WHATSAPP_ACCESS_TOKEN`
4. Set `WHATSAPP_OWNER_PHONE` to store owner's number in E.164 (e.g. `18761234567`)

### Meta Pixel + Conversions API
1. Meta Events Manager → Create pixel
2. Copy **Pixel ID** → `NEXT_PUBLIC_META_PIXEL_ID`
3. Conversions API → Generate access token → `META_CONVERSIONS_API_TOKEN`

### Google Analytics 4
1. GA4 → Admin → Data Streams → Web stream
2. Copy **Measurement ID** → `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
3. Admin → Measurement Protocol API secrets → Create secret → `GA4_API_SECRET`

---

## 3. Run Supabase Migration

```bash
# Apply schema to project ibtadbwtrxglujkzqofs
npx supabase db push --db-url "postgresql://postgres:[YOUR_DB_PASSWORD]@db.ibtadbwtrxglujkzqofs.supabase.co:5432/postgres"
```

Or paste `supabase/migrations/001_initial.sql` directly into the Supabase SQL editor.

---

## 4. Seed Products (Optional)

```bash
npm run seed
```

This creates the 8 default hair categories and sample products.

---

## 5. Local Development

```bash
npm run dev
# → http://localhost:3000
```

---

## 6. Deploy to Vercel (CLI only — NEVER Vercel UI)

```bash
# First deploy
vercel deploy --prod

# After every change
vercel deploy --prod

# Alias to custom domain
vercel alias set [deployment-url] houseofisabelle.com
```

### Add Environment Variables to Vercel

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add FYGARO_SECRET_KEY production
vercel env add FYGARO_WEBHOOK_SECRET production
vercel env add META_CONVERSIONS_API_TOKEN production
vercel env add GA4_API_SECRET production
vercel env add RESEND_API_KEY production
vercel env add WHATSAPP_ACCESS_TOKEN production
vercel env add ADMIN_SECRET production
vercel env add CRON_SECRET production
```

---

## 7. Register Fygaro Webhook

After deploying, register the webhook URL in Fygaro:
```
https://houseofisabelle.com/api/webhooks/fygaro
```

Events to subscribe: `payment.completed`, `payment.failed`

---

## 8. Google Shopping Feed

The shopping feed is available at:
```
https://houseofisabelle.com/api/products?format=google-shopping-feed
```

Submit this URL in [Google Merchant Center](https://merchants.google.com) → Products → Feeds.

---

## Pre-Launch Checklist

- [ ] Supabase migration applied
- [ ] All 15 env vars set in Vercel
- [ ] Fygaro webhook registered + tested
- [ ] Resend domain verified
- [ ] Meta Pixel firing on test purchase
- [ ] GA4 receiving server-side Purchase events
- [ ] WhatsApp test message sent to owner
- [ ] Google Shopping feed submitted
- [ ] Admin auth cookie set
- [ ] RLS policies reviewed in Supabase
