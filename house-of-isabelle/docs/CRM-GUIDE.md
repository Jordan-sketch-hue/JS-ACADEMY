# House of Isabelle — CRM Guide

## Overview

The CRM lives at `/admin/customers` and is backed by the `hi_customers` table in Supabase project `ibtadbwtrxglujkzqofs`.

---

## Customer Segments

| Segment | Discount | Min Order | Notes |
|---|---|---|---|
| `retail` | 0% | None | Default for all new customers |
| `stylist` | 15% | None | Verified hair stylists |
| `wholesale` | 25% | J$5,000 | Bulk buyers / distributors |

Discounts are applied **server-side** in `/api/payments/fygaro`. Never trust client-submitted prices.

To upgrade a customer to `stylist` or `wholesale`:
1. Go to `/admin/customers/[id]`
2. Change **Segment** dropdown
3. For `stylist`: toggle **Verified Stylist** on
4. Save — discount applies on their next checkout

---

## Customer Tags

Free-text tags for grouping. Examples:
- `vip` — high-spend repeat buyers
- `influencer` — content creators
- `wholesale-kgn` — wholesale buyers in Kingston
- `returner` — bought again after 90+ days

---

## CRM Metrics Auto-Updated

The following fields are updated automatically via the Fygaro webhook:

| Field | Trigger |
|---|---|
| `total_spent_jmd` | Every confirmed order |
| `order_count` | Every confirmed order |
| `last_order_at` | Every confirmed order |

---

## Admin Notes

Leave notes on any customer via `/admin/customers/[id]`. Notes are stored in `hi_admin_notes` and are never shown to the customer.

---

## Marketing Consents

Customers are added to `hi_marketing_consents` when they opt in at checkout. Only send promo emails to customers where `marketing_consent = true`.

The `/admin/marketing` page (future) will let you send promo blasts via Resend to consented customers.

---

## Appointment Booking

Salon appointments are booked at `/book` and stored in `hi_appointments`. Admin view is at `/admin/appointments`.

Status flow: `pending` → `confirmed` → `completed` (or `cancelled` / `no_show`)

Owner is notified via WhatsApp on each new booking.

---

## Order Management

Orders are at `/admin/orders`. Status flow:

```
pending_payment → paid → processing → shipped → delivered
                       ↘ cancelled / refunded
```

Only the Fygaro webhook moves an order from `pending_payment` to `paid`.

---

## Google Shopping

The shopping feed at `/api/products?format=google-shopping-feed` exports all active products as an RSS/XML Google Merchant feed. Resubmit after major product changes.

---

## Abandoned Cart Recovery

The Vercel Cron at `/api/cart/abandon` runs hourly. It:
1. Finds carts abandoned 1–24 hours ago with an email
2. Skips carts that already received a reminder in the last 24 hours
3. Sends a Resend email with a restore link

No manual action required.
