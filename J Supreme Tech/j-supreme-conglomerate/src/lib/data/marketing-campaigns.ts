/**
 * Marketing Command Center — curated layer.
 *
 * Campaign brand metadata + storytelling series + the per-asset narrative overlay
 * (hooks, sequence/continuation, teaser→payoff roles, easter eggs). This is the
 * hand-authored half; it merges with GENERATED_ASSETS (machine facts) in
 * `getMarketingData()`. Editing creatives never touches this file, and re-staging
 * never touches the story work here.
 */
import type {
  AssetNarrative,
  Campaign,
  ChannelId,
  MarketingAsset,
  Series,
} from "./marketing-types";
import { GENERATED_ASSETS } from "./marketing-assets.generated";
import { getBrandPlan } from "./marketing-plans";

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------
export const CAMPAIGNS: Campaign[] = [
  {
    slug: "j-supreme-tech",
    name: "J Supreme Tech",
    brand: "from-neutral-700 via-neutral-900 to-black",
    accent: "#141414",
    logo: "/brands/j-supreme-tech.webp",
    tagline: "We design the system. You run the business.",
    site: "jsupremetech.online",
    blurb:
      "The house brand — websites, apps, social media management & design for founders worldwide. The funnel ends in one action: quote → approve → pay online by card.",
  },
  {
    slug: "supreme-suite",
    name: "Supreme Suite",
    // 2026-06-13 "Spotlight" rebrand: drop the all-black look for a vibrant
    // multi-system spectrum. Each product is spotlighted in its own accent on a
    // bright, product-forward canvas.
    brand: "from-violet-600 via-fuchsia-500 to-sky-500",
    accent: "#6d28d9",
    tagline: "One system: branded website + back-office + AI staff. From J$4,500/mo.",
    site: "supreme-suite.vercel.app",
    blurb:
      "J Supreme Tech's SaaS arm — 13 white-label business systems (courier, movers, salon, school, restaurant, property, warehouse, tours, appointments, loyalty, dashboards, AI chatbot & voice). Every system ships as three tools in one — a branded customer website, a full back-office CRM, and AI staff — set up for your trade in minutes. Lowest-cost way to run a business online in JA: flat JMD pricing from J$4,500/mo, no per-seat fees, 3-day free trial on everything.",
  },
  {
    slug: "bp-couriers",
    name: "BP Couriers",
    brand: "from-orange-500 to-red-600",
    accent: "#F1502F",
    tagline: "Fast. Reliable. Islandwide.",
    handle: "@bpcouriers",
    site: "bpcouriers.online",
    blurb: "Islandwide Jamaican courier + delivery app — Kingston, MoBay, Ocho Rios, Mandeville, Negril.",
  },
  {
    slug: "ship2door",
    name: "Ship 2 Door JA",
    brand: "from-sky-500 to-blue-700",
    accent: "#1E73BE",
    tagline: "Your U.S. address. Delivered to your door.",
    handle: "@ship.2doorja",
    site: "ship2doorja.com",
    blurb: "USA → Jamaica package forwarding — a free U.S. address and islandwide doorstep delivery.",
  },
  {
    slug: "aboo-tours",
    name: "Aboo Tours",
    brand: "from-amber-400 to-yellow-600",
    accent: "#C99A2E",
    tagline: "Experience Jamaica — end to end.",
    handle: "@abootours",
    site: "abootours.com",
    blurb: "Tours, airport transfers, and executive black-car service across Jamaica.",
  },
  {
    slug: "language-cradle",
    name: "The Language Cradle",
    brand: "from-red-600 via-yellow-500 to-green-600",
    accent: "#E11D2A",
    logo: "/brands/language-cradle.webp",
    tagline: "Languages taught. Worlds opened.",
    handle: "@thelanguagecradle",
    site: "thelanguagecradle.com",
    blurb: "Flagship IBLC language school — courses, certified translation & GlobalVoice interpretation.",
  },
  {
    slug: "876-car-wash",
    name: "876 Luxury Car Wash",
    brand: "from-blue-700 to-indigo-800",
    accent: "#1F56A8",
    tagline: "Showroom shine — 876 style.",
    handle: "@876cardetail",
    site: undefined,
    blurb: "Premium hand wash, detailing, and the monthly Wash Club in the 876.",
  },
];

// ---------------------------------------------------------------------------
// Storytelling series — the continuation threads that tie posts together.
// ---------------------------------------------------------------------------
export const SERIES: Series[] = [
  {
    id: "jst-system-handover",
    campaign: "j-supreme-tech",
    name: "The Handover (grid trilogy)",
    premise:
      "A three-post trilogy — WE DESIGN THE SYSTEM. → YOU RUN THE BUSINESS. → PAY ONLINE. WE BUILD. — three dark panels that lock into one billboard across your top grid row. The brand promise lands on the money action: paying online.",
    cadence: "Post 3 days running, left-to-right, then pin the row. Never break the order or the billboard splits.",
  },
  {
    id: "jst-four-services",
    campaign: "j-supreme-tech",
    name: "Four Services, One Team",
    premise:
      "Rotate the menu so every follower learns you do all four — Websites, Apps, Social Media Management, Brand & Design — each with a 'from' price and a clear next step. The overview pins; the four deep-dives drip weekly.",
    cadence: "Pin the four-service hero; drop one service deep-dive per week (lead with the cheapest rung — Design — to open the door).",
  },
  {
    id: "jst-pay-online",
    campaign: "j-supreme-tech",
    name: "Pay Online (the conversion hook)",
    premise:
      "The whole machine points at one action. Tease the friction (slow quotes, bank queues), then pay it off: approve your quote and pay securely by card — we start the same day. This is your strongest boost candidate.",
    cadence: "Boost the payments post to warm audiences (profile visitors, site visitors); run the CTA story with a link sticker.",
  },
  {
    id: "jst-proof",
    campaign: "j-supreme-tech",
    name: "Proof & Ownership",
    premise:
      "Authority for a studio is live work + trust. Show the portfolio wall ('real systems, shipped & scaling') and the founder-friendly terms (you own everything, no lock-in, unlimited revisions) that close the deal.",
    cadence: "Evergreen — rotate a portfolio post and an 'own everything' post fortnightly; pair with a fresh case study.",
  },
  {
    id: "jst-services-showcase",
    campaign: "j-supreme-tech",
    name: "Services Showcase (devices + carousel)",
    premise:
      "The 'show, don't tell' set: the three crafts — Apps, Websites, Graphic Design — demoed on a real laptop (a live website) and phone (a movers/warehouse dispatch app), with the ready-made monthly systems as the second act. Ships as single posts (custom-led + a subscription-led cut on a Supreme Suite dashboard) and a 5-slide swipe carousel (hero → website → app → pricing → CTA).",
    cadence:
      "Pin the portrait showcase as the profile's anchor. Post the 5-slide carousel weekly for swipe depth; rotate the SaaS-led cut to retarget price-sensitive / ready-made buyers. Story cuts to status + a link sticker → jsupremetech.online.",
  },
  // — Supreme Suite: "Spotlight" rebrand (2026-06-13) ————————————————————————
  // Five series replace the six earlier overlapping sets. Bright, product-forward,
  // each system in its own colour; spine = website + back-office + AI staff (3-in-1).
  {
    id: "ss-spotlight",
    campaign: "supreme-suite",
    name: "Spotlight — one system on display",
    premise:
      "The core of the rebrand: each post puts ONE industry's actual system on a bright, branded screen — booking calendar, dispatch board, table map, maintenance pipeline — then pays it off with the 3-in-1 promise (website + back-office + AI staff) and a footer that cross-sells the rest of the suite. No black screens; every product wears its own colour. The anchor lists all 13 industries; each vertical deep-dive (feed + reel) shows a buyer their own business running.",
    cadence:
      "Pin the anchor feed first so the full menu is one tap away. Then drip one vertical every 2 days; post its reel as a Reel on alternating days. Boost the vertical that matches your audience (salon → ss-spot-salon; courier → ss-spot-courier). Run the anchor + hook stories as paid Story ads to broad JA + diaspora owners 18–45 → /start.",
  },
  {
    id: "ss-three-in-one",
    campaign: "supreme-suite",
    name: "3-in-1 — website + back-office + AI",
    premise:
      "The differentiator wedge. Most owners pay for a website, a CRM and (maybe) a chatbot separately — or skip them entirely. Supreme Suite ships all three as one system, one login, one bill. This series hammers the 'three tools in one' idea so the low price feels like a bargain before it's even shown.",
    cadence: "Evergreen. Run the '3-in-1' story and the 'website + back-office + AI' hook whenever a cold audience needs the value framed. Pair with any bundle post — the bundle proves the savings the 3-in-1 promises.",
  },
  {
    id: "ss-pain-hooks",
    campaign: "supreme-suite",
    name: "Pain Hooks (scroll-stoppers)",
    premise:
      "Top-of-funnel scroll-stoppers. Each opens on a pain the owner feels in their gut — business living in the DMs, no-shows eating the week, 'where's my order?' calls all day — with a tilted peek of the product and one hard number. They qualify the audience and tee up the demo and bundle posts that follow.",
    cadence: "Lead a week with a pain hook (1 dms / 2 no-shows / 3 where's-my-order), then follow 1–2 days later with the matching product demo (salon / appointments / courier). Cold traffic stops on the pain; warm traffic converts on the demo.",
  },
  {
    id: "ss-stacks",
    campaign: "supreme-suite",
    name: "Stacks — systems that talk",
    premise:
      "Combo posts that show two or three systems working as one flow: booking → AI receptionist → loyalty, or operations CRM → live dashboard → AI voice. The point is nothing is bolted on — it's one platform, so the pieces hand off automatically. Answers 'do these actually connect?' with a visual yes.",
    cadence: "Run after a single-system demo has landed, to upsell the buyer who already gets the basic product. Best as carousels — one card per system. Pair directly with the matching bundle (booking stack → Booking Bundle; ops stack → Operations Bundle).",
  },
  {
    id: "ss-bundles",
    campaign: "supreme-suite",
    name: "Bundles & Pricing (the low-end wedge)",
    premise:
      "The conversion + price-leadership series. Positions Supreme Suite as the lowest-cost way to run a business online in JA: flat JMD pricing from J$4,500/mo (~J$150/day), bundles that save ~40% vs buying the tools separately, no per-seat fees, and a 3-day free trial on everything. The flyer is the all-systems menu; the trial story is the endcap CTA.",
    cadence: "Retarget profile + site visitors with the bundle that matches their vertical (Booking Bundle for service brands, Operations Bundle for logistics, Full Suite for multi-branch). Run the trial-CTA story same-week as any bundle. DM/print the flyer for plaza days; use it as the QR anchor → /start.",
  },
  {
    id: "islandwide-promise",
    campaign: "bp-couriers",
    name: "The Islandwide Promise (grid puzzle)",
    premise:
      "A three-post trilogy — FAST. → RELIABLE. → ISLANDWIDE. — that locks into one full-bleed billboard across the top row of your grid. Each panel stands alone, but together they spell the promise.",
    cadence: "Post 3 days running, top-left to right. Then pin the row — never break it.",
  },
  {
    id: "bp-app-launch",
    campaign: "bp-couriers",
    name: "App Launch — 'No store needed'",
    premise:
      "The install-without-an-app-store hook. Tease the friction ('no store?'), then pay it off with the one-tap install + first islandwide delivery.",
    cadence: "Teaser story → feed reel → retarget ad.",
  },
  {
    id: "s2d-launch-drop",
    campaign: "ship2door",
    name: "Launch Drop (5-part)",
    premise:
      "A five-beat opening run: we're live → how it works → why us → rewards → the real hook (a FREE U.S. address). Each post answers the question the last one raised.",
    cadence: "One beat every 2–3 days; story-tease each the morning it drops.",
  },
  {
    id: "s2d-new-lanes",
    campaign: "ship2door",
    name: "New Lanes (continuation)",
    premise:
      "After launch, keep the story moving: every new capability is an 'episode 6, 7, 8…' — Ship from China, more pickup stores — so followers feel the brand growing.",
    cadence: "Drop a new lane whenever capability expands; always call back to the launch.",
  },
  {
    id: "aboo-cinematic",
    campaign: "aboo-tours",
    name: "Cinematic Reel",
    premise:
      "The hero 9:16 island fly-through. Open on motion, land on the logo. Pin to the feed and run the same cut as a Reels ad.",
    cadence: "Pin to grid + boost as a Reel; cut 6s and 15s teasers from it for stories.",
  },
  {
    id: "aboo-end-to-end",
    campaign: "aboo-tours",
    name: "End-to-End Trip",
    premise:
      "Airport → transfer → tour → executive car. Walk one guest's whole journey so the booker sees there's nothing left to arrange.",
    cadence: "Carousel for feed; break each leg into a story frame.",
  },
  {
    id: "876-wash-club",
    campaign: "876-car-wash",
    name: "The Wash Club",
    premise:
      "Turn one-off washes into a monthly ritual. Show the math (a wash a week for the price of three), then the VIP perks.",
    cadence: "Offer post → member perk story → punch-card reminder.",
  },
  {
    id: "876-levar-shipping",
    campaign: "876-car-wash",
    name: "Levar Shipping (sister-brand easter egg)",
    premise:
      "A planted cross-brand reveal — the same owner runs Levar Shipping. Drop it as a subtle 'you might also know…' so sharp followers connect the two.",
    cadence: "One reveal post; reuse the emblem as a highlight cover.",
  },
  {
    id: "lc-global-voice",
    campaign: "language-cradle",
    name: "GlobalVoice (translation & interpretation)",
    premise:
      "Separate the school (learn a language) from the service (we speak it for you). GlobalVoice = certified translation + live interpretation, sold to corporate buyers.",
    cadence: "Audience-split ad triads: App learners / Corporate / GlobalVoice.",
  },
];

// ---------------------------------------------------------------------------
// Narrative overlay. Each rule's `match` is tested (case-insensitively) against
// the asset id and its source path; the FIRST matching rule wins. Author from
// most-specific to most-general.
// ---------------------------------------------------------------------------
const NARRATIVE: { match: string; campaign?: string; n: AssetNarrative }[] = [
  // — J Supreme Tech (house brand) ——————————————————————————————————————
  // campaign-scoped: these only apply to j-supreme-tech assets, so generic
  // tokens ("services", "payments") can't bleed onto a client's asset.
  {
    match: "trilogy-1", campaign: "j-supreme-tech",
    n: { series: "jst-system-handover", sequence: 1, role: "teaser", retitle: "We design the system", hook: "Panel 1 of 3: WE DESIGN THE SYSTEM." },
  },
  {
    match: "trilogy-2", campaign: "j-supreme-tech",
    n: { series: "jst-system-handover", sequence: 2, role: "episode", retitle: "You run the business", hook: "Panel 2: YOU RUN THE BUSINESS. — the handover." },
  },
  {
    match: "trilogy-3", campaign: "j-supreme-tech",
    n: {
      series: "jst-system-handover", sequence: 3, role: "payoff", retitle: "Pay online. We build.",
      hook: "Panel 3: PAY ONLINE. WE BUILD. — the brand line lands on the money action.",
      easterEgg: "The 3 dark panels lock into one billboard across your top grid row. Never break the order or the picture splits.",
    },
  },
  { match: "web-packages", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Website packages", hook: "A website that works while you sleep — Launch $349 · Business $699 · Enterprise $999." } },
  { match: "app-bundles", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Web + app bundles", hook: "App-store power without the price — PWA $549, native $999, bundle & save." } },
  { match: "services-global", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "evergreen", retitle: "Win online — four services (USD)", hook: "The full menu for diaspora founders. Pin it to the top of the grid." } },
  { match: "services-local", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "evergreen", retitle: "Win online — four services (JMD)", hook: "The full menu for Jamaican businesses. Pin it to the top of the grid." } },
  { match: "social-global", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Social media management (USD)", hook: "The recurring-revenue retainer — content + strategy that grows a following." } },
  { match: "social-local", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Social media management (JMD)", hook: "The recurring-revenue retainer — content + strategy that grows a following." } },
  { match: "design-global", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Brand & design (USD)", hook: "The cheapest way in — logos, kits & ads. Open the door, then upsell a site." } },
  { match: "design-local", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "episode", retitle: "Brand & design (JMD)", hook: "The cheapest way in — logos, kits & ads. Open the door, then upsell a site." } },
  { match: "flyer-packages-global", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "evergreen", retitle: "Packages one-pager (USD)", hook: "The all-in-one — DM it, print it, or boost as a single-image ad." } },
  { match: "flyer-packages-local", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "evergreen", retitle: "Packages one-pager (JMD)", hook: "The all-in-one — DM it, print it, or hand it out." } },
  { match: "flyer-bundles", campaign: "j-supreme-tech", n: { series: "jst-four-services", role: "evergreen", retitle: "App bundles one-pager", hook: "Lead with this for the app-curious — web vs native, bundle & save." } },
  { match: "payments", campaign: "j-supreme-tech", n: { series: "jst-pay-online", role: "payoff", retitle: "Pay online by card", hook: "Approve & pay by card — we start the same day. Your strongest boost candidate." } },
  { match: "story-cta", campaign: "j-supreme-tech", n: { series: "jst-pay-online", role: "evergreen", retitle: "Book a free strategy call", hook: "Story CTA — add a link sticker to jsupremetech.online." } },
  { match: "portfolio", campaign: "j-supreme-tech", n: { series: "jst-proof", role: "evergreen", retitle: "Real systems, shipped & scaling", hook: "The social-proof wall — live work, Jamaica to the world." } },
  { match: "own-everything", campaign: "j-supreme-tech", n: { series: "jst-proof", role: "episode", retitle: "You own everything — no lock-in", hook: "The trust closer: ownership, no lock-in, unlimited revisions." } },
  { match: "growth-plan", campaign: "j-supreme-tech", n: { role: "evergreen", retitle: "J Supreme Tech — Growth Plan 2026", hook: "The strategy doc — the offer ladder, funnel and 90-day roadmap. Read before you post." } },
  { match: "services-showcase", campaign: "j-supreme-tech", n: { series: "jst-services-showcase", role: "evergreen", retitle: "Apps · Websites · Design (device demo)", hook: "Three crafts, one studio — shown on a laptop (your site) and phone (a dispatch app). Pin the portrait as the anchor." } },
  { match: "saas-led", campaign: "j-supreme-tech", n: { series: "jst-services-showcase", role: "episode", retitle: "Ready-made systems — live in days", hook: "The subscription-led cut: booking, dispatch & CRM on a monthly plan from $29, with custom build as the upsell." } },
  { match: "carousel", campaign: "j-supreme-tech", n: { series: "jst-services-showcase", role: "episode", retitle: "Services carousel (swipe)", hook: "5-slide swipe: hero → website → app → pricing → CTA. The whole pitch in one post." } },
  // — Supreme Suite "Spotlight" (2026-06-13). Match the specific ss-spot-* id
  //   fragments — never bare "suite"/"booking"/"operations" (those would bleed).
  //   Anchor ————————————————————————————————————————————————————————————————
  { match: "ss-spot-anchor-feed",   campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 0, role: "evergreen", retitle: "Whatever you run, there's a system", hook: "PIN THIS. All 13 industries in one bright frame + the 3-in-1 promise (website + back-office + AI). The clearest 'do you serve me?' post — anyone who runs any of these stops scrolling. Drop it before any vertical post." } },
  { match: "ss-spot-anchor-reel",   campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 0, role: "episode",   retitle: "Anchor reel — your business, branded", hook: "15s Reel: hook → 'running it across DMs?' → a live system slams in → 3-in-1 → trial CTA. Post as a Reel for top-of-feed reach; loops well." } },
  { match: "ss-spot-anchor-story",  campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 0, role: "evergreen", retitle: "One platform. Every business. (story)", hook: "Paid Story version of the anchor — broad JA + diaspora owners 18–45. Reads cleanly at story speed. Link sticker → /start." } },
  //   Pain hooks (scroll-stoppers) ————————————————————————————————————————————
  { match: "ss-spot-hook-1-dms",        campaign: "supreme-suite", n: { series: "ss-pain-hooks", sequence: 1, role: "teaser", retitle: "Your business is living in your DMs", hook: "PAIN HOOK — post first. The ~J$22,000/week lost-bookings number makes it sting. Caption: 'If this is you, the fix is one link — 3-day free trial, no card.' Follow 1–2 days later with the salon demo." } },
  { match: "ss-spot-hook-2-noshows",    campaign: "supreme-suite", n: { series: "ss-pain-hooks", sequence: 2, role: "teaser", retitle: "No-shows ate your week again", hook: "Pain hook for booking verticals — deposit-first + auto-reminders cut no-shows 71%. Follow with the appointments demo. Boost to salons, clinics, studios." } },
  { match: "ss-spot-hook-3-wheres-my",  campaign: "supreme-suite", n: { series: "ss-pain-hooks", sequence: 3, role: "teaser", retitle: "Stop answering 'where's my order?' all day", hook: "Pain hook for operations/logistics — live tracking + AI updates replace 40+ calls a day. Follow with the courier demo. Boost to courier/freight founders." } },
  //   3-in-1 differentiator ——————————————————————————————————————————————————
  { match: "ss-spot-hook-4-three-tools", campaign: "supreme-suite", n: { series: "ss-three-in-one", role: "episode", retitle: "A website. A back-office. AI staff.", hook: "The honest pitch — most owners pay for these separately or skip them. Supreme Suite ships all three as one. The wedge that makes the low price feel cheap. Boost to cold traffic." } },
  { match: "ss-spot-story-3in1",        campaign: "supreme-suite", n: { series: "ss-three-in-one", role: "payoff", retitle: "Three tools. One system. (story)", hook: "Vertical 3-in-1 explainer — run right after the 3-in-1 hook as a nurture story. Link sticker → /start." } },
  { match: "ss-spot-story-hook",        campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 0, role: "teaser", retitle: "Your whole business. One login. (story)", hook: "Story scroll-stopper with a live system inside the frame. Run as a paid Story ad to broad owners. Link sticker → /start." } },
  //   Product demos (one system on display, each in its own colour) ————————————
  { match: "ss-spot-salon-feed",        campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 1, role: "episode", retitle: "Salon & beauty — your booking system", hook: "BOOST for the salon vertical. Live chair schedule fills the frame, deposit-first, 0 no-shows. Caption: 'Keisha's in the chair, Sandra's deposit is paid — and you didn't touch your phone. 3-day free trial, no card.'" } },
  { match: "ss-spot-salon-reel",        campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 1, role: "episode", channel: "feed", retitle: "Salon demo reel", hook: "Reel: 'Still booking in your DMs?' → salon dashboard reveal → deposit-first booking → 3-in-1 → trial CTA. Post Mon–Wed for reach." } },
  { match: "ss-spot-courier-feed",      campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 2, role: "episode", retitle: "Courier & delivery — live dispatch board", hook: "Boost to JA logistics/courier founders. 34 active, 8 drivers, 62 delivered — one live board. 'Every driver, every parcel, one tab.'" } },
  { match: "ss-spot-courier-reel",      campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 2, role: "episode", channel: "feed", retitle: "Courier demo reel", hook: "Reel: 'Still dispatching on WhatsApp threads?' → dispatch board reveal → AI saves 42 mins → CTA. Forward-bait for courier operators." } },
  { match: "ss-spot-restaurant-feed",   campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 3, role: "episode", retitle: "Restaurant & catering — live tables", hook: "Boost to restaurant + catering owners. 12/18 tables seated, J$84,600 today. 'Table 1 on mains, Table 4 wants the bill — all on one screen.'" } },
  { match: "ss-spot-restaurant-reel",   campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 3, role: "episode", channel: "feed", retitle: "Restaurant demo reel", hook: "Reel opens on the visceral pain — 'Table 3 has waited 20 minutes to order' → table map reveal → AI host takes reservations → CTA." } },
  { match: "ss-spot-property-feed",     campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 4, role: "episode", retitle: "Property management — rent + repairs", hook: "Boost to landlords/property managers. 92% rent in, 7 open jobs, emergency flagged. 'Rent in on time, repairs done right.'" } },
  { match: "ss-spot-tours-feed",        campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 5, role: "episode", retitle: "Tours & experiences — bookings + balances", hook: "Boost to tour operators/transfers. J$487K tracked, deposits + balances visible. 'From first inquiry to five-star review.'" } },
  { match: "ss-spot-appointments-feed", campaign: "supreme-suite", n: { series: "ss-spotlight", sequence: 6, role: "episode", retitle: "Appointments & clinics — self-booking", hook: "Boost to clinics/consultants/coaches. Self-serve calendar, no-shows down 71%. 'Fill the calendar. Cut the no-shows.'" } },
  //   Stacks (combos) —————————————————————————————————————————————————————————
  { match: "ss-spot-combo-booking-stack", campaign: "supreme-suite", n: { series: "ss-stacks", sequence: 1, role: "episode", retitle: "Booking + AI + Loyalty, as one", hook: "Combo carousel — booking → AI confirms → loyalty rewards, no hand-offs. Upsell after the salon/appointments demo. Pair with the Booking Bundle." } },
  { match: "ss-spot-combo-ops-stack",      campaign: "supreme-suite", n: { series: "ss-stacks", sequence: 2, role: "episode", retitle: "Run the operation. See the numbers.", hook: "Combo carousel — operations CRM → live dashboard → AI voice. Upsell after the courier demo. Pair with the Operations Bundle." } },
  //   Bundles & pricing (low-end wedge) ———————————————————————————————————————
  { match: "ss-spot-bundle-operations",  campaign: "supreme-suite", n: { series: "ss-bundles", sequence: 1, role: "episode", retitle: "Operations Bundle — J$8,900/mo", hook: "MOST POPULAR. CRM + branded website + AI voice/chat + dashboard, ~40% cheaper than separate. Retarget logistics/field-service visitors. Pair with the ops-stack combo." } },
  { match: "ss-spot-bundle-booking",     campaign: "supreme-suite", n: { series: "ss-bundles", sequence: 2, role: "episode", retitle: "Booking Bundle — J$7,900/mo", hook: "Best for service brands. Booking CRM + website + AI receptionist + loyalty, ~42% off vs separate. Retarget salon/clinic/tours visitors." } },
  { match: "ss-spot-bundle-full-suite",  campaign: "supreme-suite", n: { series: "ss-bundles", sequence: 3, role: "payoff", retitle: "The Full Suite — J$14,900/mo", hook: "Everything unlocked — all 13 systems, every AI agent, custom domain, done-for-you setup, unlimited users. The 'go all in' offer for multi-branch operators." } },
  { match: "ss-spot-story-trial-cta",    campaign: "supreme-suite", n: { series: "ss-bundles", sequence: 0, role: "payoff", retitle: "3 days free. No card. (story)", hook: "THE conversion story — pick industry → upload logo → live & branded. Run same-week as any bundle. Link sticker → supreme-suite.vercel.app/start." } },
  { match: "ss-spot-flyer-all-systems",  campaign: "supreme-suite", n: { series: "ss-bundles", sequence: 0, role: "evergreen", channel: "ad", retitle: "One platform. 13 systems. (flyer)", hook: "The all-systems menu one-pager with low-end pricing (from J$4,500/mo · ~J$150/day). DM to prospects, print for plaza days, QR → /start." } },
  // — BP grid puzzle ————————————————————————————————————————————————
  {
    match: "post-1-fast",
    n: {
      series: "islandwide-promise",
      sequence: 1,
      role: "teaser",
      status: "posted",
      hook: "Panel 1 of 3. One word, full-bleed: FAST.",
      easterEgg:
        "Posts 1–3 line up into a single billboard across your top grid row — never break the row or the picture splits.",
    },
  },
  {
    match: "post-2-reliable",
    n: {
      series: "islandwide-promise",
      sequence: 2,
      role: "episode",
      hook: "Panel 2: RELIABLE. — stack the proof (on-time %, live tracking).",
    },
  },
  {
    match: "post-3-islandwide",
    n: {
      series: "islandwide-promise",
      sequence: 3,
      role: "payoff",
      hook: "Panel 3: the map lights up. ISLANDWIDE. — CTA to book.",
      easterEgg: "The map pin sits on your real HQ parish — a wink for locals.",
    },
  },
  // — Ship2Door launch drop —————————————————————————————————————————
  {
    match: "post-1-launch",
    n: { series: "s2d-launch-drop", sequence: 1, role: "teaser", status: "posted", hook: "We're live. Your U.S. address is open." },
  },
  {
    match: "post-2-how-it-works",
    n: { series: "s2d-launch-drop", sequence: 2, role: "episode", hook: "Three steps: get your address → shop U.S. → we deliver." },
  },
  {
    match: "post-3-why",
    n: { series: "s2d-launch-drop", sequence: 3, role: "episode", hook: "Why us — speed, care, and a real person on WhatsApp." },
  },
  {
    match: "post-4-rewards",
    n: {
      series: "s2d-launch-drop",
      sequence: 4,
      role: "episode",
      hook: "Loyalty pays. Introduce the punch card.",
      easterEgg: "Punch card: 7 → birthday-month free ship (≤20lb), 10 → Christmas free ship (≤17lb).",
    },
  },
  {
    match: "post-5-free-address",
    n: {
      series: "s2d-launch-drop",
      sequence: 5,
      role: "payoff",
      hook: "The real hook, restated: a FREE U.S. address. No % gimmick — the address IS the offer.",
      easterEgg: "This slot used to be a 10%-off post — the free-address angle replaced it. Don't re-introduce the discount.",
    },
  },
  { match: "ship-from-china", n: { series: "s2d-new-lanes", sequence: 1, role: "episode", hook: "New lane unlocked: ship from China too." } },
  { match: "stores-post", n: { series: "s2d-new-lanes", sequence: 2, role: "episode", hook: "More pickup points — now at additional stores." } },
  { match: "stores-story", n: { series: "s2d-new-lanes", sequence: 2, role: "episode", hook: "Story tease: new pickup stores live." } },
  // — Aboo ——————————————————————————————————————————————————————————
  { match: "aboo-tours-feed-reel", n: { series: "aboo-cinematic", role: "payoff", hook: "60-second island fly-through. Pin it + boost as a Reel." } },
  { match: "end-to-end", n: { series: "aboo-end-to-end", role: "episode", hook: "One guest, whole journey — airport to executive car." } },
  // — 876 ———————————————————————————————————————————————————————————
  { match: "wash-club", n: { series: "876-wash-club", role: "evergreen", hook: "A wash a week for the price of three. Join the club." } },
  { match: "subscription", n: { series: "876-wash-club", role: "evergreen", hook: "Monthly membership — the recurring-revenue play." } },
  { match: "levar", n: { series: "876-levar-shipping", role: "teaser", hook: "Sister-brand reveal: same owner runs Levar Shipping.", easterEgg: "Cross-brand callback — plant it subtly so followers connect 876 ↔ Levar Shipping." } },
  // — Language Cradle ————————————————————————————————————————————————
  { match: "ad-gv", n: { series: "lc-global-voice", role: "evergreen", hook: "GlobalVoice ad — sell the service (we speak it for you), not the class." } },
  { match: "globalvoice", n: { series: "lc-global-voice", role: "evergreen", hook: "GlobalVoice — certified translation + live interpretation." } },
];

function narrativeFor(id: string, src: string, campaign: string): AssetNarrative | undefined {
  const hay = `${id} ${src}`.toLowerCase();
  for (const rule of NARRATIVE) {
    if (rule.campaign && rule.campaign !== campaign) continue; // scoped rules stay in their lane
    if (hay.includes(rule.match.toLowerCase())) return rule.n;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Merge generated facts + narrative into render-ready assets.
// ---------------------------------------------------------------------------
export function getMarketingData() {
  const assets: MarketingAsset[] = GENERATED_ASSETS.map((g) => {
    const narrative = narrativeFor(g.id, g.src, g.campaign);
    return {
      ...g,
      narrative,
      resolvedTitle: narrative?.retitle ?? g.title,
      resolvedChannel: (narrative?.channel ?? g.channel) as ChannelId,
    };
  });

  const campaigns = CAMPAIGNS.map((c) => {
    const own = assets.filter((a) => a.campaign === c.slug);
    const counts = own.reduce(
      (m, a) => ((m[a.resolvedChannel] = (m[a.resolvedChannel] || 0) + 1), m),
      {} as Record<ChannelId, number>,
    );
    return {
      ...c,
      assets: own,
      counts,
      total: own.length,
      series: SERIES.filter((s) => s.campaign === c.slug),
      plan: getBrandPlan(c.slug),
    };
  });

  return { campaigns, assets, series: SERIES };
}

export type CampaignWithAssets = ReturnType<typeof getMarketingData>["campaigns"][number];
