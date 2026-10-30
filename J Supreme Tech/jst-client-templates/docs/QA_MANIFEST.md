# QA_MANIFEST — [CLIENT NAME] ([CATEGORY])
<!-- Copy this file into each client project. Fill every section before shipping. -->

## Zero-Tolerance Checklist
- [ ] Zero console errors in browser DevTools
- [ ] Zero placeholder text (no "Lorem ipsum", no "[INSERT NAME]")
- [ ] Zero dead links (all nav, CTA, footer links tested)
- [ ] Zero 404 images

## Navigation
- [ ] Desktop nav: all links route correctly
- [ ] Mobile nav: hamburger opens/closes, all links work
- [ ] Logo links to homepage

## Hero
- [ ] Full-bleed on all breakpoints (320px, 375px, 768px, 1280px)
- [ ] No layout shift on load
- [ ] CTA button works

## Contact Form
- [ ] Submits to Supabase (check ct_leads table)
- [ ] Validation fires on empty required fields
- [ ] Success message shown after submit

## WhatsApp CTA
- [ ] Floating button visible on mobile
- [ ] Opens correct WhatsApp number from config

## Charts (CRM only)
- [ ] Data-populated state: renders correctly
- [ ] Empty state: shows "No data yet" message, not a broken chart

## Auth (CRM only)
- [ ] Login redirects to dashboard
- [ ] Unauthenticated access to /dashboard redirects to /login
- [ ] Logout clears session

## Responsive
- [ ] Tested at 320px (minimum mobile)
- [ ] Tested at 375px (standard mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1280px (desktop)

## SEO
- [ ] <title> set from config.name
- [ ] <meta description> set from config.seo.description
- [ ] Open Graph tags present

## Performance
- [ ] All images <200KB
- [ ] No raw/uncompressed assets committed

## Sign-off
Tested by: ___________  Date: ___________  Approved: ___________


---

## QA PASS — 2026-10-28

### Static analysis results

| Check | Result |
|---|---|
| console.log leaks | ✓ 0 |
| Banned libs (real imports): recharts, @tanstack, d3, chart.js, react-hook-form, zod | ✓ 0 |
| Templates missing SiteLayout | ✓ 0 / 13 |
| Templates missing SiteHero (full-bleed) | ✓ 0 / 13 |
| Templates missing ContactForm | ✓ 0 / 13 |
| CRM pages missing CRMLayout | ✓ 0 / 13 |
| WhatsAppCTA in SiteLayout | ✓ |
| Footer domain color #666 | ✓ |
| SiteHero absolute inset-0 (full-bleed) | ✓ |
| BarChart empty state | ✓ |
| LeadsTable empty state | ✓ |
| ContactForm custom validation (no Zod/RHF) | ✓ |
| GalleryCarousel empty guard | ✓ |
| Dead href="#" links in layouts | ✓ 0 |
| /api/submit-lead route | ✓ |
| .env.local.example | ✓ |
| tsconfig @shared/@tokens aliases | ✓ |

### Notes
- All banned-lib grep hits were inside comment documentation strings, not imports.
- CRM Supabase fetch TODOs are intentional — wired after schema migration.
- AppointmentsModule, JobCardsModule, OrdersModule: all have empty states + search/filter.
- GSAP flag enforced at prop level on florist + events only.
- Browser + Supabase integration tests require running app — out of scope for static QA.

### Next steps
1. Apply docs/schema.sql to Supabase project ibtadbwtrxglujkzqofs
2. Wire each CRM page.tsx to real Supabase fetch via SUPABASE_SERVICE_ROLE_KEY
3. Build operator admin portal (Phase 5)


---

## Phase 5 QA Pass — 2026-10-28

### Operator Admin Portal

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | No banned libs (TanStack/Recharts/Zod/D3) | PASS | grep confirmed zero imports |
| 2 | API keys server-side only | PASS | IDEOGRAM_API_KEY / HIGGSFIELD_API_KEY / SUPABASE_SERVICE_ROLE_KEY — none in client components |
| 3 | Supabase always ibtadbwtrxglujkzqofs | PASS | All server calls use NEXT_PUBLIC_SUPABASE_URL env var |
| 4 | Soft-delete only (no hard deletes) | PASS | DELETE route sets active=false, preserves all rows |
| 5 | anon INSERT on ct_leads | PASS | RLS policy confirmed in migration |
| 6 | No client-side env vars leaking keys | PASS | API routes use process.env on server only |
| 7 | Higgsfield model is Soul V2 | PASS | model: 'soul-v2' in generate-lifestyle/route.ts |
| 8 | Ideogram model is V_2 | PASS | model: 'V_2' in generate-hero/route.ts |
| 9 | ConfigEditor validates before save | PASS | Save disabled when name/category empty |
| 10 | .env.example documents all keys | PASS | 6 keys documented with source URLs |

### Files created
- `shared/components/operator/OperatorLayout.tsx`
- `shared/components/operator/ClientCard.tsx`
- `shared/components/operator/ConfigEditor.tsx`
- `shared/components/operator/ImageGenPanel.tsx`
- `app/api/operator/clients/route.ts`
- `app/api/operator/clients/[id]/route.ts`
- `app/api/operator/generate-hero/route.ts`
- `app/api/operator/generate-lifestyle/route.ts`
- `app/operator/page.tsx`
- `app/operator/clients/new/page.tsx`
- `app/operator/clients/[id]/page.tsx`
- `app/operator/clients/[id]/images/page.tsx`
- `.env.example`
