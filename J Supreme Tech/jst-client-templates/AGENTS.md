# JST Client Templates — Agent Documentation
**Last updated:** 2026-10-30  
**Project:** `jst-client-templates` → LIVE at `jst-client-templates.vercel.app`  
**Supabase:** `ibtadbwtrxglujkzqofs` — ALWAYS this project, NEVER `ciggiwpztuxkmbaccrlp`

---

## ARCHITECTURE OVERVIEW

### Database Tables
- `ct_clients` — one row per client shop. Key cols: `id, slug, name, category, active, accent, accent_fg, hero_url, hero_url_mobile, phone, whatsapp, address, logo_url`
- `ct_products` — inventory/menu/service items. Key cols: `id, client_id, name, category (sub-category), sku, price, currency, description, active, image_url`
- `ct_leads` — form submissions, orders, bookings
- `ct_bookings` — appointment bookings (future)

### URL Pattern
All client sites: `/t/[slug]` → `app/t/[slug]/page.tsx`

### Component Files
- `shared/components/sections/ShopGrid.tsx` — product shop grid with cart + checkout modal ✅ BUILT
- `shared/components/sections/MenuGrid.tsx` — food/baker order grid (NO cart, WhatsApp order flow) ✅ BUILT
- `shared/components/sections/ServiceGrid.tsx` — service cards with booking modal → ct_leads ✅ BUILT
- `shared/components/sections/QuoteForm.tsx` — portfolio + budget/timeline form → ct_leads ✅ BUILT
- `shared/components/sections/BookingWidget.tsx` — appointment booking form (pre-existing)
- `shared/components/layout/SiteNav.tsx` — sticky nav with mobile hamburger + dropdowns
- `shared/components/layout/SiteLayout.tsx` — wraps SiteNav + footer (footer phone = #666)

---

## 5 SYSTEM TYPES — CRITICAL DISTINCTION

Every shop maps to one of these. NEVER use the wrong component.

### TYPE A: PRODUCT-SHOP
**Component:** `ShopGrid.tsx`  
**Flow:** Category filter tabs → Product grid → Product detail modal → Cart drawer → Checkout modal → ct_leads  
**Shops (17):** chichaven, velvet-vault, berry-fits, boutique-intuition, clarks-clothes, diamond-couture, everything-cutee, fashionminisadult, kylas-content, surprise-fashion, westside-mandeville, trendy-accessories, gk-family-variety, trust-depot, kidoro-baby-store, luxurious-wholesale-ja (wholesale/MOQ variant), mini-good-girl (wholesale/MOQ variant)

### TYPE B: FOOD-ORDER
**Component:** `MenuGrid.tsx` — **NOT ShopGrid**  
**Flow:** Menu categories → Item cards → Order accumulator → Order form → WhatsApp/delivery  
**ZERO "Add to Cart". ZERO cart drawer. ZERO standard checkout.**  
**Shops (5):** cre8tive-cafe, ginza-yotsumi, tropical-toppingz, keke-the-baker (+ custom cake form), sweet-face-pastries (+ custom cake form)

### TYPE C: SERVICE-BOOK
**Component:** `ServiceGrid.tsx` — **NOT ShopGrid**  
**Flow:** Service cards (name + duration + price) → BookingWidget → Calendar → Confirm  
**ZERO cart. ZERO "Add to Cart". "Book Now" is the only CTA.**  
**Shops (8):** beauty-lounge-sydz, blye-beauty, ruel, sincerely-sparks, buff-n-beam, sg-engine-master, beach-picnic-ja, savvy-apple, wiz-repair

### TYPE D: QUOTE-REQUEST
**Component:** `QuoteForm.tsx` (enhanced multi-step)  
**Flow:** Portfolio/catalog showcase → Multi-step quote form → ct_leads  
**ZERO cart. ZERO booking. "Request a Quote" is the CTA.**  
**Shops (8):** atelier-luxridge, mr-jackson-furniture, rockland-furniture, west-furniture, samkhil, sett-to-go, ecm-graphics, cassie-bar

### TYPE E: FLORIST-HYBRID
**Component:** Both `ShopGrid.tsx` (ready-made items) + custom quote form  
**Shops (1):** bouquets-by-mira

---

## ALL 40 SHOPS — CATEGORY MAP

| Slug | Business | System Type | Product sub-categories (ct_products.category) |
|---|---|---|---|
| chichaven | ChicHaven | PRODUCT-SHOP | Dresses, Tops, Bottoms, Sets, Swimwear, Accessories |
| velvet-vault | Velvet Vault | PRODUCT-SHOP | Dresses, Bags, Jewellery, Sets, Accessories |
| berry-fits | Berry Fits | PRODUCT-SHOP | Leggings, Sports Bras, Sets, Shorts, Tops |
| boutique-intuition | Boutique Intuition | PRODUCT-SHOP | Dresses, Tops, Skirts, Accessories, New Arrivals |
| clarks-clothes | Clarks Clothes | PRODUCT-SHOP | Men, Women, Kids, Accessories |
| diamond-couture | Diamond Couture | PRODUCT-SHOP | Evening Wear, Cocktail, Bridal Party, Accessories |
| everything-cutee | Everything Cutee | PRODUCT-SHOP | Dresses, Sets, Tops, Accessories |
| fashionminisadult | Fashionminisadult | PRODUCT-SHOP | Kids, Adult, Matching Sets, Accessories |
| kylas-content | Kyla's Content | PRODUCT-SHOP | Looks, Sets, Accessories, Trending Now |
| luxurious-wholesale-ja | Luxurious Wholesale | PRODUCT-SHOP (wholesale) | Dresses, Accessories, Clothing, Bundles |
| surprise-fashion | Surprise Fashion | PRODUCT-SHOP | Dresses, Tops, Bottoms, Mystery Box |
| westside-mandeville | Westside Mandeville | PRODUCT-SHOP | Dresses, Casual, Formal, Accessories |
| trendy-accessories | Trendy Accessories | PRODUCT-SHOP | Earrings, Necklaces, Bracelets, Rings, Waist Beads |
| gk-family-variety | GK Family Variety | PRODUCT-SHOP | Household, Food & Drinks, Beauty, Stationery |
| trust-depot | Trust Depot | PRODUCT-SHOP | Hardware, Household, Tools, Cleaning |
| mini-good-girl | Mini Good Girl | PRODUCT-SHOP (wholesale) | Snacks, Beverages, Household, Beauty |
| kidoro-baby-store | Kidoro Baby Store | PRODUCT-SHOP | Clothing, Feeding, Toys, Bedding, Bath & Care |
| cre8tive-cafe | Cre8tive Cafe | FOOD-ORDER | Pizzas, Pasta, Sides, Desserts, Drinks |
| ginza-yotsumi | Ginza Yotsumi | FOOD-ORDER | Ramen, Sushi, Bento, Starters, Drinks |
| tropical-toppingz | Tropical Toppingz | FOOD-ORDER | Bowls, Smoothies, Juices, Toppings, Shots |
| keke-the-baker | Keke the Baker | FOOD-ORDER (custom) | Custom Cakes, Cupcakes, Cookies, Tray Bakes, Seasonal |
| sweet-face-pastries | Sweet Face Pastries | FOOD-ORDER (custom) | Cakes, Cupcakes, Pastries, Cookies, Drinks |
| cassie-bar | Cassie Bar Supplies | PRODUCT-SHOP | Drinkware, Packaging, Bar Tools, Napkins & Decor |
| beauty-lounge-sydz | Beauty Lounge | SERVICE-BOOK | Hair, Nails, Lashes, Skincare |
| blye-beauty | Blye Beauty | SERVICE-BOOK | Makeup, Lashes, Brows, Nails |
| ruel | Nail Art by Ruel | SERVICE-BOOK | Gel Manicure, Nail Art, Acrylic Set, Builder Gel |
| sincerely-sparks | Sincerely Sparks | SERVICE-BOOK | Lash Sets, Brow Lamination, Lash Lift, Skincare |
| buff-n-beam | Buff N Beam | SERVICE-BOOK | Exterior Detail, Interior Detail, Paint Correction, Ceramic Coating |
| sg-engine-master | SG Engine Master | SERVICE-BOOK + QUOTE | Oil Change, Brake Service, Diagnostics, Tune-Up |
| beach-picnic-ja | Beach Picnic JA | SERVICE-BOOK | Basic Picnic, Standard, Luxury, Bespoke |
| savvy-apple | Savvy Apple | SERVICE-BOOK | Screen Replacement, Battery, Charging Port, Software, Data Recovery |
| wiz-repair | Wiz Repair | SERVICE-BOOK | Screen, Battery, Port, Software, Data Recovery |
| atelier-luxridge | Atelier Luxridge | QUOTE-REQUEST | Living Room, Bedroom, Dining, Office, Outdoor |
| mr-jackson-furniture | Mr. Jackson Furniture | QUOTE-REQUEST | Sofas, Beds, Dining Sets, Storage, Accent Pieces |
| rockland-furniture | Rockland Furniture | QUOTE-REQUEST | Living Room, Bedroom, Dining, Office, Clearance |
| west-furniture | West Furniture | QUOTE-REQUEST + SERVICE | Sofas, Beds, Dining, Office + Interior Design |
| samkhil | Samkhil Ltd | QUOTE-REQUEST | Pendants, Chandeliers, Wall Lights, LED Strips, Outdoor |
| sett-to-go | Sett To Go | QUOTE-REQUEST | Gift Boxes, Mailer Boxes, Shopping Bags, Labels, Ribbon |
| ecm-graphics | ECM Graphics | QUOTE-REQUEST | Logo Design, Flyers, Business Cards, Banners, Social Media |
| bouquets-by-mira | Bouquets by Mira | FLORIST-HYBRID | Bouquets, Roses, Sunflowers, Gift Bundles, Custom |

---

## CATEGORY BROWSING — CORE CONCEPT

**Categories are NOT products.** "Dresses" is a category. "Coral Wrap Maxi Dress — JMD 4,500" is a product.

The shop flow must be:
1. User lands on shop section → sees CATEGORY TILES (Dresses | Tops | Bottoms | Sets | Swimwear)
2. User clicks a category → grid FILTERS to show only products in that category
3. Each product card has: image, name, price, "Add to Cart" button
4. Cart drawer slides in → checkout modal

ShopGrid filter tabs are implemented as state — `activeCategory` controls which products render. "All" shows everything.

Nav dropdowns reinforce this: "Shop" nav item has children: "Dresses", "Tops", "Bottoms" etc., each linking to `#shop` with a query param or scroll behavior.

---

## FIXED (session 2026-10-30)

1. ✅ `page.tsx` patched: SELECT `category`, removed `shopProducts.length > 0` guard, added routing to MenuGrid/ServiceGrid/QuoteForm
2. ✅ All 270+ products seeded across 40 shops — every shop has ≥8 products
3. ✅ All products have `category` set in DB (sub-category, not client category)
4. ✅ ShopGrid, MenuGrid, ServiceGrid, QuoteForm — all 4 commerce components built
5. ✅ Admin panel: `/t/[slug]/admin` (products CRUD), `/t/[slug]/admin/orders`, `/t/[slug]/admin/bookings`
6. ✅ API routes: `/api/admin/products` (GET/POST/PATCH/DELETE), `/api/admin/leads` (GET/PATCH)
7. ✅ `/api/submit-lead` route created — Supabase insert + notify stubs
8. ✅ ShopGrid: 3-option checkout — WhatsApp (live), WiPay (coming soon), HandyPay (coming soon)
9. ✅ ServiceGrid: WhatsApp follow-up button after booking confirmed
10. ✅ `lib/notify.ts` — Resend + WhatsApp Cloud API stubs, graceful no-op when keys absent

### Env vars to activate notifications (set in Vercel)
- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM_EMAIL` — verified sender address
- `WA_PHONE_NUMBER_ID` — WhatsApp Cloud API phone number ID
- `WA_ACCESS_TOKEN` — WhatsApp Cloud API permanent token
- `WA_NOTIFY_PHONE` — owner's WA number in E.164 (e.g. 18761234567)

## STILL OPEN

1. `image_url = NULL` on all products → emoji placeholders shown (Higgsfield/Ideogram images needed)
2. `SiteNav.tsx` has no dropdown support — no "Shop → Dresses" sub-nav
3. Full checkout (WiPay/HandyPay HMAC integration)
4. Booking calendar with slot selection (BookingWidget upgrade)
5. Category pages `/t/[slug]/shop/[category]`
6. Wholesale MOQ layout for luxurious-wholesale-ja, mini-good-girl
7. SEO metadata, GA4, Core Web Vitals

---

## IMAGE RULES — GLOBAL, NEVER BREAK

- NO TEXT in image → **Higgsfield Soul V2** ONLY
- Text baked into image → **Ideogram** ONLY
- NEVER use: Kling / Seedance / Flux / Recraft
- ALL hero subjects = Afro-Caribbean / Black / mixed — NEVER white or light-skinned
- Compress ALL images < 200KB WebP before deploy
- Higgsfield hallucination: avoid props that "should" have text (shopping bags with logos, signage, price tags)
- Higgsfield API: `POST https://api.higgsfield.ai/higgsfield-ai/soul/v2/standard`
- Auth header: `Key ce333b0c-cdf3-48c9-8c09-b4d07c1820d9:eb0c1356f4e81211b32af7a099ec90e43e97cad2d0ec304c5196e1ee880dbbd9`

---

## MASTER TASK LIST (26 tasks)

| # | Task | Status |
|---|---|---|
| 1 | Mobile portrait heroes (all 11 categories) | ✅ DONE |
| 2 | Fix ShopGrid: category type + filter tabs + Coming Soon state | ✅ DONE |
| 3 | Fix page.tsx: fetch category, remove length guard, route to correct component | ✅ DONE |
| 4 | Fix SiteNav: dropdown support | PENDING |
| 5 | Build MenuGrid.tsx for food/baker shops | ✅ DONE |
| 6 | Build ServiceGrid.tsx for beauty/auto/tech shops | ✅ DONE |
| 7 | Build QuoteForm.tsx for 8 quote-request shops | ✅ DONE |
| 8 | DB: set category on all 65+ existing products | ✅ DONE |
| 9 | DB: insert 8 products per shop for all 28 empty shops | ✅ DONE |
| 10 | DB: insert menu items for 5 food/baker shops | ✅ DONE |
| 11 | DB: insert service cards for 8 service shops | ✅ DONE |
| 12 | Admin panel /t/[slug]/admin — product CRUD, orders, bookings | ✅ DONE |
| 13 | API routes /api/admin/products + /api/admin/leads | ✅ DONE |
| 13b | /api/submit-lead route (Supabase insert + notify stubs) | ✅ DONE |
| 14 | Higgsfield: product images (fashion, variety, accessories) | PENDING |
| 15 | Higgsfield: food images | PENDING |
| 16 | Higgsfield: beauty service portfolio images | PENDING |
| 17 | Compress all images <200KB WebP, update image_url in DB | PENDING |
| 18 | SiteNav dropdown support | PENDING |
| 19 | Product detail modal (gallery, variants) | PENDING |
| 20 | Full checkout — WiPay/HandyPay HMAC | PARTIAL — WhatsApp live; WiPay/HandyPay stubbed "Coming Soon" |
| 21 | Booking calendar — slots, staff, confirm emails | PENDING |
| 22 | Custom cake order form (keke-the-baker, sweet-face-pastries) | PENDING |
| 23 | Wholesale MOQ layout (luxurious-wholesale-ja, mini-good-girl) | PENDING |
| 24 | Category pages /t/[slug]/shop/[category] | PENDING |
| 25 | Resend email automations (order, booking, quote) | PARTIAL — stubs live in lib/notify.ts, activate with RESEND_API_KEY |
| 26 | WhatsApp Cloud API notifications | PARTIAL — stubs live in lib/notify.ts, activate with WA_* env vars |
| 27 | SEO metadata, GA4, Core Web Vitals, WCAG 2.2 AA | PENDING |
