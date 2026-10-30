<!-- BEGIN:nextjs-agent-rules -->
This is Next.js 16.4.3 — params is a Promise, always await params. "use client" must be first line before imports.
<!-- END:nextjs-agent-rules -->

# JST CLIENT TEMPLATES — AGENT HANDOVER
Last updated: 2026-10-29 (audit pass — all pages verified live)
Live URL: https://jst-client-templates.vercel.app
Supabase: ibtadbwtrxglujkzqofs — ALWAYS this, NEVER ciggiwpztuxkmbaccrlp
Repo: C:\Users\jader\J Supreme Tech\jst-client-templates

---

## EXECUTION STATUS

### COMPLETED (Oct 29 2026)
- [x] Supabase schema — 12 new tables + ct_clients extended
- [x] lib/wipay.ts — createWiPayPayment(), verifyWiPayWebhook(), parseWiPayWebhook()
- [x] lib/notify.ts — sendEmail() via Resend, buildOrderConfirmationEmail(), buildAppointmentConfirmationEmail()
- [x] lib/auth.ts — hashPassword(), createSession(), verifyClientSession(), loginClient()
- [x] lib/documents.ts — generateInvoiceHTML(), generateReceiptHTML()
- [x] middleware.ts — protects /c/[slug]/* with JWT cookie check
- [x] app/login/[slug]/page.tsx — client CRM login page
- [x] app/api/auth/login/route.ts — sets httpOnly ct_session cookie
- [x] app/api/payment/route.ts — WiPay payment initiation
- [x] app/api/webhooks/wipay/route.ts — HMAC-SHA256 verified webhook
- [x] app/api/upload/route.ts — logo upload to ct-logos bucket
- [x] app/api/leads/route.ts — website form → ct_leads
- [x] app/api/provision/staff/route.ts — provision owner login
- [x] shared/components/crm/CustomersModule.tsx
- [x] shared/components/crm/ProductsModule.tsx
- [x] shared/components/crm/QuotesModule.tsx
- [x] shared/components/crm/PaymentsModule.tsx
- [x] shared/components/crm/TasksModule.tsx
- [x] shared/components/crm/ReportsModule.tsx
- [x] shared/components/sections/LeadCaptureForm.tsx
- [x] app/c/[slug]/page.tsx — full nav with all sub-routes
- [x] app/c/[slug]/customers/page.tsx
- [x] app/c/[slug]/products/page.tsx
- [x] app/c/[slug]/quotes/page.tsx
- [x] app/c/[slug]/payments/page.tsx
- [x] app/c/[slug]/tasks/page.tsx
- [x] app/c/[slug]/reports/page.tsx
- [x] app/c/[slug]/settings/page.tsx
- [x] app/c/[slug]/settings/staff/page.tsx
- [x] app/t/[slug]/page.tsx — FULL template: SiteLayout+SiteHero+ServicesGrid+AnimatedStats+GalleryCarousel+Testimonials+BookingWidget+ContactForm; 13-category defaults map; real products from Supabase override defaults
- [x] app/admin/clients/page.tsx — logo upload + custom domain + staff provisioning
- [x] jose + resend npm packages installed
- [x] shared/types/supabase.ts — created (was missing; caused build failure for OrdersModule/AppointmentsModule/JobCardsModule)
- [x] Deployed: dpl_LQYQgx4Esz8YT3UAx9AuosTTDWns (Oct 29 audit pass)
- [x] Deployed: dpl_6zcK7SS61Aq3gUGmKoa3zGvx13RC (Oct 29 — all CRM+website fixes: sidebar nav, correct modules per category, website CTAs+hamburger, TS clean)
- [x] Deployed: dpl_2cWXeNdqTAR6BUitD9CQx1JZ7Diz (Oct 29 — unicode/mojibake fix: all 13 /templates/ pages parse clean; CRM tab switching intact)
- [x] 13 Higgsfield Soul V2 CRM banner images generated + compressed <200KB → public/crm-banners/{category}.jpg
- [x] CRM dashboard banner strip wired into app/c/[slug]/page.tsx (bannerUrl from crm_banner_url or /crm-banners/{category}.jpg fallback)
- [x] ct_clients.crm_banner_url populated for all 3 provisioned clients (ruel, sg-engine-master, west-furniture)
- [x] Deployed: dpl_DkvgM8ZRgbSaJGjDFa3NUMV1FU1y (Oct 29 — CRM banners live)
- [x] Deployed: dpl_4Ztg7eESvSFhTUJRxV2WVdGJSf5b (Oct 29 — /t/[slug] restored: full SiteLayout+all sections+13-category defaults)
- [x] TikTok profile logos downloaded + compressed <40KB → public/logos/{ruel,sg-engine-master,west-furniture}.jpg
- [x] Supabase ct_clients.logo_url updated for all 3 provisioned clients
- [x] SiteNav.tsx fixed: no empty img box when logo_url is null (text fallback)
- [x] Deployed: dpl_Ana2MbLFPQkH3y4nZYVX8rou1xgD (Oct 29 — logos live + SiteNav null-logo fix)
- [x] 31 Higgsfield Soul V2 images generated + compressed <200KB → public/gallery/{beauty,auto,furniture}-{1-6}.jpg + public/services/{beauty-1-3,auto-1-5,furniture-1-5}.jpg
- [x] ServicesGrid.tsx — image?: string field added; card renders photo above text when image is set
- [x] SiteHero.tsx — phone <a> conditionally rendered (no more empty bordered box when phone is null)
- [x] SiteNav.tsx — phone links (desktop + mobile) conditionally rendered
- [x] page.tsx — GALLERY_IMAGES map replaces placeholderGallery for beauty/auto/furniture; service images wired into all 3 active categories
- [x] page.tsx — BookingWidget wrapped in section id="booking" so Book Now scroll works
- [x] Deployed: dpl_6nZ84h8C1mCkwH6FT1VpBq3ZGdqM (Oct 29 — real images + Book Now fix + no empty boxes)
- [x] WhatsAppCTA.tsx — null guard: `if (!number) return null` (prevents wa.me/null link)
- [x] SiteLayout.tsx — footer always shows © 2026 {name} in #666; phone shown above it when available
- [x] Deployed: dpl_Be5NCi797kUeJZorV9mcVEzDSFgv (Oct 29 — WhatsApp null fix + footer copyright)

### REMAINING (next agent)
- [ ] Add SUPABASE_SERVICE_ROLE_KEY, WIPAY_ACCOUNT_NUMBER, WIPAY_API_KEY, RESEND_API_KEY, JWT_SECRET to Vercel env (not yet set — deploy will fail for authenticated routes without these)
- [ ] Create Supabase Storage bucket ct-logos (public, must be done in Supabase dashboard or via SQL)
- [ ] WiPay cart UI on website for fashion/accessories/food/variety (cart state + checkout flow)
- [ ] 13 static /templates/{category} websites — need same hero/products/CTA treatment
- [ ] 13 static /crm/{category} pages — wire in real modules
- [ ] Custom domain mapping (ct_clients.custom_domain → Vercel API)
- [ ] Inventory sub-route /c/[slug]/inventory (ct_product_variants + stock movements)
- [ ] Reports period switching (client-side fetch with period param)

---

## CRITICAL RULES
- "use client" must be ABSOLUTE FIRST LINE — before imports
- params is a Promise — const { slug } = await params
- Tailwind v4 — @source in globals.css, NOT content:[] in config
- PowerShell writes: [System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))
- Deploy: npx vercel --prod --yes from C:\Users\jader\J Supreme Tech\jst-client-templates
- CSS vars: dangerouslySetInnerHTML={{ __html: css }} where css = backtick string assigned first
- NO emojis. ALL backgrounds WHITE (#FFFFFF). Images <200KB.
- Supabase service role key SERVER-SIDE ONLY
- WiPay amounts in JMD CENTS (multiply by 100)

---

## COMPLETE SUPABASE SCHEMA

ct_clients (id, slug, name, category, logo_url, accent, accent_fg, phone, whatsapp, address, headline, subline, currency, active, custom_domain, business_hours, tagline, created_at)
ct_appointments (id, client_id, customer_name, service, phone, scheduled_at, status, notes, created_at)
ct_orders (id, client_id, customer_name, item, quantity, amount, status, notes, created_at)
ct_jobs (id, client_id, customer_name, description, vehicle_device, amount, status, notes, created_at)
ct_leads (id, client_id, name, phone, email, source, status, notes, created_at)
ct_customers (id, client_id, name, phone, email, notes, tags, created_at)
ct_products (id, client_id, name, category, sku, price, currency, description, active, created_at)
ct_product_variants (id, product_id, name, sku, price, stock_qty, attributes_json, created_at)
ct_quotes (id, client_id, customer_id, items_json, total, status, expires_at, notes, created_at)
ct_payments (id, client_id, order_id, amount, currency, method, provider_ref, status, verified_at, created_at)
ct_invoices (id, client_id, order_id, invoice_no, items_json, subtotal, tax, total, status, issued_at, paid_at, created_at)
ct_notifications (id, client_id, type, recipient, template, related_id, status, provider_response, attempts, created_at)
ct_staff (id, client_id, name, email, role, active, created_at)
ct_client_auth (id, client_id, email, password_hash, role, last_login, created_at)
ct_tasks (id, client_id, assigned_to, title, due_at, status, related_id, created_at)
ct_files (id, client_id, related_id, related_type, storage_path, filename, size, created_at)
ct_settings (id, client_id, key, value, updated_at)

---

## ENV VARS NEEDED IN VERCEL
NEXT_PUBLIC_SUPABASE_URL=https://ibtadbwtrxglujkzqofs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>
WIPAY_ACCOUNT_NUMBER=<account number>
WIPAY_API_KEY=<api key>
RESEND_API_KEY=<resend key>
JWT_SECRET=<32+ char random string>
NEXT_PUBLIC_APP_URL=https://jst-client-templates.vercel.app

---

## TIKTOK LEADS (mockup checklist)
@Luxuriouswholesale.ja — 82.4K — variety
@Kylas Content — 15.7K — variety
@TROPICAL TOPPINGZ — 186 — food
@gkfamilyvarietyplug — 10.7K — variety
@29 1/2 good girl wholesale — 9,690 — variety/fashion

---

## DEPLOYMENT
cd "C:\Users\jader\J Supreme Tech\jst-client-templates"
npx vercel --prod --yes