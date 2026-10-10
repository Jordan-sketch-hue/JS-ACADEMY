import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { OutreachMode, Region, SalesBrand, ServiceFocus } from "@/lib/sales/types";

/**
 * Multi-brand Sales Department registry.
 *
 * Each brand is an isolated tenant: its `slug` is reused as `owner_clerk_id`
 * across every sales_* table, so prospects, inbox, suppression list and send log
 * are all per-brand for free (see migration 20260616130000). This file is the
 * single source of truth for who we sell for, how (cold B2B vs opt-in B2C), to
 * whom (ICP), and with what copy.
 *
 * Adding a brand = add one BrandSeed entry + run seedAllBrands(). That's it.
 */

export type BrandTemplate = {
  step: number;
  /** "both" = the brand's cold B2B sequence; "promo" = opt-in B2C campaign. */
  service_focus: Extract<ServiceFocus, "both" | "promo">;
  subject: string;
  body_md: string;
};

export type BrandSeed = {
  // ---- sales_brands (identity / mode / ICP) ----
  slug: string;
  name: string;
  tagline: string;
  mode: OutreachMode;
  accent_color: string;
  logo_url?: string | null;
  offering: string;
  value_props: string[];
  cta_label: string;
  cta_url: string;
  icp_locations: Partial<Record<Region, string[]>>;
  icp_industries: string[];
  icp_titles: string[];
  optin_source: string | null;
  // ---- sales_settings (operational) ----
  from_name: string;
  from_email: string;
  reply_to: string;
  bcc_email: string;
  company_name: string;
  postal_address: string;
  site_url: string;
  calendar_url: string | null;
  regions: Region[];
  daily_target: number;
  send_window_start: number;
  send_window_end: number;
  // ---- content ----
  templates: BrandTemplate[];
};

const BCC = "jordanmorrisr@gmail.com"; // Jordan is BCC'd on every send (house rule).

/* ------------------------------------------------------------------ *
 * The roster. Jordan's socially-managed brands + the J Supreme arms.
 * Subdomains follow the go.<domain> convention so cold outreach never
 * touches a brand's transactional/root reputation.
 * ------------------------------------------------------------------ */
export const BRAND_SEEDS: BrandSeed[] = [
  // 1) J SUPREME TECH ------------------------------------------------
  {
    slug: "jsupreme-tech",
    name: "J Supreme Tech",
    tagline: "BUILD · MARKET · SCALE",
    mode: "b2b_cold",
    accent_color: "#111827",
    // Merged: J Supreme Tech now covers BOTH software and growth marketing
    // (J Supreme Marketing folded in 2026-06-16 — no separate marketing domain).
    offering: "custom software, automation and growth marketing",
    value_props: ["Software, apps & automation", "Branding, content & paid social", "One partner to build + grow"],
    cta_label: "Tell me your budget — I'll scope it",
    cta_url: "https://jsupremetech.online/products",
    icp_locations: {
      local: ["Jamaica"],
      caribbean: ["Trinidad and Tobago", "Barbados", "Bahamas", "Saint Lucia"],
      americas: ["United States", "Canada"],
      europe: ["United Kingdom", "Ireland"],
    },
    icp_industries: ["retail", "real estate", "logistics", "healthcare", "professional services", "hospitality"],
    icp_titles: ["Owner", "Founder", "CEO", "Managing Director", "Operations Manager"],
    optin_source: null,
    from_name: "Jordan Morris · J Supreme Tech",
    from_email: "sales@go.jsupremetech.online",
    reply_to: "sales@go.jsupremetech.online",
    bcc_email: BCC,
    company_name: "J Supreme Tech",
    postal_address: "Kingston, Jamaica",
    site_url: "https://jsupremetech.online",
    calendar_url: null,
    regions: ["local", "caribbean", "americas", "europe"],
    daily_target: 50,
    send_window_start: 13,
    send_window_end: 22,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Helping {{company}} build + grow",
        body_md: `Hi {{first_name}},

I'm {{sender_name}} at {{company_name}} — we help businesses in {{country}} on two fronts: we build the tech (web apps, booking systems, portals, automation) and we drive the growth (branding, content and paid social that converts).

For a company like {{company}}, that usually means a system that saves your team hours and a marketing engine pointed at real revenue.

Tell me your budget and your biggest priority and I'll come back with a scoped plan and a fixed price — no obligation.

Worth a short call?`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: a faster {{company}}",
        body_md: `Hi {{first_name}},

Floating this back up in case it got buried. Even a rough budget range tells me whether we're a fit — and if we're not, I'll point you somewhere useful anyway.

Happy to send a couple of examples close to {{industry}} if that's easier than a call.`,
      },
      {
        step: 3, service_focus: "both",
        subject: "Should I close your file, {{first_name}}?",
        body_md: `Hi {{first_name}},

Last note — I won't crowd your inbox. If modernising or automating {{company}} is on the radar this year, reply with a number and I'll take it from there.

If now isn't the time, no problem at all. Wishing you and the team well.`,
      },
    ],
  },

  // 2) J SUPREME MARKETING ------------------------------------------
  {
    slug: "jsupreme-marketing",
    name: "J Supreme Marketing",
    tagline: "BRAND · CONTENT · GROWTH",
    mode: "b2b_cold",
    accent_color: "#E0A82E",
    offering: "branding, content and paid-social growth campaigns",
    value_props: ["Brand & content systems", "Paid social that converts", "Funnels & landing pages"],
    cta_label: "Tell me your monthly budget — I'll send a plan",
    cta_url: "https://jsupremeconglomerate.online",
    icp_locations: {
      local: ["Jamaica"],
      caribbean: ["Trinidad and Tobago", "Barbados", "Bahamas"],
      americas: ["United States", "Canada"],
      europe: ["United Kingdom"],
    },
    icp_industries: ["restaurants", "retail", "real estate", "fitness", "beauty", "hotels", "e-commerce"],
    icp_titles: ["Owner", "Founder", "Marketing Manager", "Managing Director"],
    optin_source: null,
    from_name: "Jordan Morris · J Supreme Marketing",
    from_email: "sales@go.jsupremeconglomerate.online",
    reply_to: "sales@go.jsupremeconglomerate.online",
    bcc_email: BCC,
    company_name: "J Supreme Marketing",
    postal_address: "Kingston, Jamaica",
    site_url: "https://jsupremeconglomerate.online",
    calendar_url: null,
    regions: ["local", "caribbean", "americas", "europe"],
    daily_target: 50,
    send_window_start: 13,
    send_window_end: 22,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Growing {{company}} in {{country}}",
        body_md: `Hi {{first_name}},

I'm {{sender_name}} at {{company_name}} — we run {{service_line}} for businesses in {{country}}, and I had a couple of ideas for {{company}}.

We handle the full stack: brand, content, paid social, and the landing pages/funnels that actually convert the traffic — tailored to your market and your numbers.

Tell me your monthly budget and the one growth goal that matters most this quarter, and I'll send back a campaign plan built around it.

Open to a quick chat?`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: growing {{company}}",
        body_md: `Hi {{first_name}},

Bumping this once. If you share a rough monthly number I'll tell you honestly whether we can move the needle — and exactly how.

Want me to send a sample plan for a business like {{company}}?`,
      },
      {
        step: 3, service_focus: "both",
        subject: "Closing the loop, {{first_name}}",
        body_md: `Hi {{first_name}},

Last one from me. If growth for {{company}} is a priority this year, reply with your budget and I'll build the plan.

If not, all good — wishing the {{company}} team a strong season.`,
      },
    ],
  },

  // 3) BP COURIERS (both) -------------------------------------------
  {
    slug: "bp-couriers",
    name: "BP Couriers",
    tagline: "ISLANDWIDE · SAME-DAY · TRACKED",
    mode: "both",
    accent_color: "#E11D2A",
    offering: "reliable islandwide pickup & delivery for business",
    value_props: ["Same-day, tracked delivery", "Monthly account billing", "Kingston · MoBay · Ocho Rios · more"],
    cta_label: "Get a business rate card",
    cta_url: "https://bpcouriers.online",
    icp_locations: { local: ["Jamaica"] },
    icp_industries: ["e-commerce", "pharmacy", "law firms", "accounting", "retail", "restaurants", "medical", "auto parts", "real estate"],
    icp_titles: ["Owner", "Operations Manager", "Store Manager", "Office Manager", "Admin"],
    optin_source: "Existing BP Couriers customers who opted in to updates",
    from_name: "BP Couriers",
    from_email: "sales@go.bpcouriers.online",
    reply_to: "hello@bpcouriers.online",
    bcc_email: BCC,
    company_name: "BP Couriers",
    postal_address: "Kingston, Jamaica",
    site_url: "https://bpcouriers.online",
    calendar_url: null,
    regions: ["local"],
    daily_target: 40,
    send_window_start: 13,
    send_window_end: 23,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Same-day delivery for {{company}}?",
        body_md: `Hi {{first_name}},

I'm with {{company_name}} — we do {{service_line}}, islandwide and fully tracked. A lot of {{industry}} businesses use us so their team isn't tied up running drops.

We can set {{company}} up with a monthly account: scheduled pickups, same-day where you need it, one invoice at month end.

Want me to send a quick rate card? Just reply and I'll tailor it to your volume.`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: deliveries for {{company}}",
        body_md: `Hi {{first_name}},

Quick bump — even a rough idea of how many drops {{company}} does a week lets me quote a sharp monthly rate.

We cover Kingston, Montego Bay, Ocho Rios, Mandeville and beyond. Happy to start with a trial week.`,
      },
      {
        step: 3, service_focus: "both",
        subject: "Last note on deliveries, {{first_name}}",
        body_md: `Hi {{first_name}},

I'll leave it here. If reliable islandwide delivery would take pressure off your team, reply and we'll set up an account.

Either way, all the best to {{company}}.`,
      },
      {
        step: 1, service_focus: "promo",
        subject: "Need it across the island today? 📦",
        body_md: `Hi {{first_name}},

It's {{company_name}} — fast, tracked delivery anywhere in Jamaica.

Book a pickup in minutes and follow your package the whole way. Same-day available on island routes.

Tap below to send something today — we've got you.`,
      },
      {
        step: 2, service_focus: "promo",
        subject: "Your next delivery, sorted",
        body_md: `Hi {{first_name}},

Whenever you need something moved — documents, parcels, online orders — {{company_name}} runs it islandwide, tracked door to door.

Save us for the next time you're in a rush. Book anytime below.`,
      },
    ],
  },

  // 4) ABOO TOURS (both) --------------------------------------------
  {
    slug: "aboo-tours",
    name: "Aboo Tours",
    tagline: "JAMAICA · TOURS · TRANSFERS",
    mode: "both",
    accent_color: "#CDA349",
    offering: "private Jamaica tours, airport transfers and executive ground transport",
    value_props: ["Licensed, insured drivers", "Private tours & transfers", "Reliable for VIP guests"],
    cta_label: "Partner with us",
    cta_url: "https://abootours.com",
    icp_locations: {
      local: ["Jamaica"],
      americas: ["United States", "Canada"],
      europe: ["United Kingdom", "Ireland"],
    },
    icp_industries: ["hotels", "resorts", "travel agency", "tour operator", "wedding planning", "villa rental", "events"],
    icp_titles: ["Owner", "Concierge Manager", "Guest Experience", "Travel Agent", "Group Coordinator"],
    optin_source: "Past Aboo Tours guests who opted in",
    from_name: "Aboo Tours",
    from_email: "sales@go.abootours.com",
    reply_to: "bookings@abootours.com",
    bcc_email: BCC,
    company_name: "Aboo Tours",
    postal_address: "Montego Bay, Jamaica",
    site_url: "https://abootours.com",
    calendar_url: null,
    regions: ["local", "americas", "europe"],
    daily_target: 35,
    send_window_start: 13,
    send_window_end: 23,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Private Jamaica tours for your guests",
        body_md: `Hi {{first_name}},

I'm with {{company_name}} — we provide {{service_line}} across Jamaica. We work with hotels, villas and travel partners who need their guests handled properly: licensed drivers, clean vehicles, on time, every time.

If {{company}} ever needs reliable tours or transfers for guests, we'd love to be your on-the-ground partner — with commission for referred bookings.

Open to a quick conversation?`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: tours & transfers for {{company}}'s guests",
        body_md: `Hi {{first_name}},

Just floating this back up. We can hold a few priority slots for {{company}}'s guests and handle everything from airport pickup to full-day tours.

Want me to send our partner rates and routes?`,
      },
      {
        step: 3, service_focus: "both",
        subject: "Last note, {{first_name}}",
        body_md: `Hi {{first_name}},

I'll stop here. If you'd like a dependable tours-and-transfers partner in Jamaica, just reply and I'll set it up.

Warm regards from the island. 🌴`,
      },
      {
        step: 1, service_focus: "promo",
        subject: "Your next Jamaica adventure 🌴",
        body_md: `Hi {{first_name}},

It's {{company_name}}. Thinking about getting back out to explore the island?

We run private tours and smooth airport transfers — Dunn's River, Blue Hole, YS Falls, sunset cruises and more, at your pace.

Tap below to see what's on. Book early for the best slots.`,
      },
      {
        step: 2, service_focus: "promo",
        subject: "Planning a trip? Let's drive it 🚐",
        body_md: `Hi {{first_name}},

Whenever you're ready to tour Jamaica again, {{company_name}} has you — private, comfortable and on your schedule.

Lock in your dates below and we'll handle the rest.`,
      },
    ],
  },

  // 5) SHIP 2 DOOR JA (both) ----------------------------------------
  {
    slug: "ship2door",
    name: "Ship 2 Door JA",
    tagline: "U.S. → JAMAICA · DOOR TO DOOR",
    mode: "both",
    accent_color: "#F57C00",
    offering: "a free U.S. shipping address with fast door-to-door delivery to Jamaica",
    value_props: ["FREE U.S. address", "Fast door-to-door to JA", "Pickup at Icon Mall, Fairview"],
    cta_label: "Get your free U.S. address",
    cta_url: "https://ship2doorja.com",
    icp_locations: { local: ["Jamaica"] },
    icp_industries: ["retail", "boutiques", "electronics", "auto parts", "beauty supply", "pharmacy", "online sellers"],
    icp_titles: ["Owner", "Buyer", "Store Manager", "Procurement"],
    optin_source: "Ship 2 Door customers who opted in to updates",
    from_name: "Ship 2 Door JA",
    from_email: "sales@go.ship2doorja.com",
    reply_to: "hello@ship2doorja.com",
    bcc_email: BCC,
    company_name: "Ship 2 Door JA",
    postal_address: "Icon Mall, Fairview, Montego Bay, Jamaica",
    site_url: "https://ship2doorja.com",
    calendar_url: null,
    regions: ["local"],
    daily_target: 35,
    send_window_start: 13,
    send_window_end: 23,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Importing for {{company}}? Cut your U.S. shipping",
        body_md: `Hi {{first_name}},

I'm with {{company_name}} — we give Jamaican businesses {{service_line}}. For a shop like {{company}}, that means cheaper, faster restocks from U.S. suppliers without the customs headache.

We consolidate your packages, handle the shipping, and deliver door to door (or pickup at Icon Mall, Fairview).

Want me to send our business rates? Reply and I'll set you up with a free address to start.`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: faster restocks for {{company}}",
        body_md: `Hi {{first_name}},

Quick bump — a free U.S. address takes two minutes to set up and there's no commitment. You only pay when you ship.

Happy to walk you through how other {{industry}} shops use us to keep stock moving.`,
      },
      {
        step: 1, service_focus: "promo",
        subject: "Your FREE U.S. shipping address 🇺🇸→🇯🇲",
        body_md: `Hi {{first_name}},

It's {{company_name}}. Shop any U.S. store, ship to your free address, and we bring it door to door in Jamaica.

No more "we don't ship to JA." Set up takes minutes — tap below and start shopping today.`,
      },
      {
        step: 2, service_focus: "promo",
        subject: "That cart you've been eyeing? Ship it 📦",
        body_md: `Hi {{first_name}},

Reminder from {{company_name}}: your free U.S. address is ready whenever you are.

Checkout on any U.S. site, we handle the rest — fast, tracked, door to door. Pickup at Icon Mall, Fairview too.`,
      },
    ],
  },

  // 6) THE LANGUAGE CRADLE (both) -----------------------------------
  {
    slug: "language-cradle",
    name: "The Language Cradle",
    tagline: "LANGUAGES · TRANSLATION · INTERPRETING",
    mode: "both",
    accent_color: "#0E7490",
    offering: "certified translation, interpreting and corporate language training",
    value_props: ["Certified translation", "On-site & remote interpreting", "Corporate language training"],
    cta_label: "Request a quote",
    cta_url: "https://thelanguagecradle.com",
    icp_locations: {
      local: ["Jamaica"],
      caribbean: ["Trinidad and Tobago", "Barbados", "Bahamas"],
      americas: ["United States", "Canada"],
      europe: ["United Kingdom"],
    },
    icp_industries: ["law firms", "immigration", "healthcare", "government", "NGO", "import export", "hotels", "education", "BPO"],
    icp_titles: ["HR Manager", "Operations Manager", "Owner", "Office Manager", "Director"],
    optin_source: "Language Cradle learners & enquiries who opted in",
    from_name: "The Language Cradle",
    from_email: "sales@go.thelanguagecradle.com",
    reply_to: "hello@thelanguagecradle.com",
    bcc_email: BCC,
    company_name: "The Language Cradle (IBLC)",
    postal_address: "Kingston, Jamaica",
    site_url: "https://thelanguagecradle.com",
    calendar_url: null,
    regions: ["local", "caribbean", "americas", "europe"],
    daily_target: 40,
    send_window_start: 13,
    send_window_end: 22,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Certified translation for {{company}}",
        body_md: `Hi {{first_name}},

I'm with {{company_name}} — we provide {{service_line}}. Teams in {{industry}} use us for certified document translation, interpreters for meetings or appointments, and language training for staff.

Everything is accurate, confidential, and turned around fast (most documents within 3 business days).

If {{company}} ever needs a language partner, tell me what you're working with and I'll send a quote.`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: translation & interpreting for {{company}}",
        body_md: `Hi {{first_name}},

Bumping this once. Even a single document or one upcoming meeting is a fine place to start — you'll see the quality before committing to anything bigger.

Want a quick quote? Just reply with the languages involved.`,
      },
      {
        step: 1, service_focus: "promo",
        subject: "Speak a new language this term 🌍",
        body_md: `Hi {{first_name}},

It's {{company_name}}. Ready to finally start that language?

Our tutors run friendly, structured classes — Spanish, French, Mandarin, English and more — online or in person, at your pace.

New cohorts are opening now. Tap below to find your level and enrol.`,
      },
      {
        step: 2, service_focus: "promo",
        subject: "Your spot in the next cohort",
        body_md: `Hi {{first_name}},

Quick nudge from {{company_name}} — places in our upcoming classes are filling.

Whether it's for travel, work or family, we'll get you speaking with confidence. Reserve your seat below.`,
      },
    ],
  },

  // 7) 876 LUXURY CAR WASH (both) -----------------------------------
  {
    slug: "876-car-wash",
    name: "876 Luxury Car Wash",
    tagline: "WASH · DETAIL · SHINE",
    mode: "both",
    accent_color: "#1F56A8",
    offering: "premium car washing and detailing",
    value_props: ["Showroom-clean detailing", "Monthly Wash Club", "Fleet & dealership rates"],
    cta_label: "Book a detail",
    cta_url: "https://www.instagram.com/876cardetail",
    icp_locations: { local: ["Jamaica"] },
    icp_industries: ["car dealership", "car rental", "taxi", "transport", "logistics", "real estate", "hotels"],
    icp_titles: ["Owner", "Fleet Manager", "Operations Manager", "General Manager"],
    optin_source: "876 Car Wash customers who opted in",
    from_name: "876 Luxury Car Wash",
    from_email: "sales@go.876cardetail.com",
    reply_to: "hello@876cardetail.com",
    bcc_email: BCC,
    company_name: "876 Luxury Car Wash & Detailing",
    postal_address: "Jamaica",
    site_url: "https://www.instagram.com/876cardetail",
    calendar_url: null,
    regions: ["local"],
    daily_target: 30,
    send_window_start: 13,
    send_window_end: 23,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "Fleet detailing for {{company}}",
        body_md: `Hi {{first_name}},

I'm with {{company_name}} — we do {{service_line}}. For a business like {{company}}, a clean fleet sells: dealership stock that gleams, rentals that feel new, vehicles your customers trust.

We can set up scheduled detailing at volume rates so your vehicles always look their best, with zero hassle for your team.

Want a quick fleet quote? Reply with how many vehicles and I'll sort it.`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: keeping {{company}}'s fleet sharp",
        body_md: `Hi {{first_name}},

Just bumping this. Even a monthly detail on your front-line vehicles makes a real difference to how {{company}} shows up.

Happy to do one vehicle first so you can see the finish.`,
      },
      {
        step: 1, service_focus: "promo",
        subject: "Your car deserves the 876 treatment ✨",
        body_md: `Hi {{first_name}},

It's {{company_name}}. Treat your ride to a proper wash and detail — inside and out, showroom shine.

Ask us about the Monthly Wash Club: keep it clean all month for one flat price.

Tap below to book your slot. 🚗💨`,
      },
      {
        step: 2, service_focus: "promo",
        subject: "Still riding dirty? Let's fix that 🧽",
        body_md: `Hi {{first_name}},

Quick one from {{company_name}} — your next detail is waiting.

Wash, wax, interior, the works. Book below, or join the Wash Club and never think about it again.`,
      },
    ],
  },

  // 8) SUPREME SUITE (the SaaS) -------------------------------------
  {
    slug: "supreme-suite",
    name: "Supreme Suite",
    tagline: "YOUR BUSINESS, SYSTEMISED",
    mode: "b2b_cold",
    accent_color: "#0B5CFF",
    offering: "a ready-made, branded business system — CRM, booking, website and a 24/7 AI assistant",
    value_props: [
      "13 industry systems — live in about a day, not months",
      "Branded website + booking + AI chatbot included",
      "3-day free trial, no card — then one low monthly",
    ],
    cta_label: "Start your 3-day free trial",
    cta_url: "https://supreme-suite.vercel.app/start",
    icp_locations: {
      local: ["Jamaica"],
      caribbean: ["Trinidad and Tobago", "Barbados", "Bahamas", "Saint Lucia"],
      americas: ["United States", "Canada"],
      europe: ["United Kingdom", "Ireland"],
    },
    icp_industries: ["courier", "movers", "warehouse", "property management", "restaurants", "beauty & salon", "tours", "schools", "retail", "professional services"],
    icp_titles: ["Owner", "Founder", "CEO", "Managing Director", "Operations Manager"],
    optin_source: null,
    from_name: "Jordan Morris · Supreme Suite",
    // Verified apex sender → can go live with no new DNS, just flip sending_live.
    from_email: "suite@jsupremeconglomerate.online",
    reply_to: "suite@jsupremeconglomerate.online",
    bcc_email: BCC,
    company_name: "Supreme Suite by J Supreme Tech",
    postal_address: "Kingston, Jamaica",
    site_url: "https://supreme-suite.vercel.app",
    calendar_url: null,
    regions: ["local", "caribbean", "americas", "europe"],
    daily_target: 50,
    send_window_start: 13,
    send_window_end: 22,
    templates: [
      {
        step: 1, service_focus: "both",
        subject: "A ready-made system for {{company}}",
        body_md: `Hi {{first_name}},

I'm {{sender_name}} from Supreme Suite. We give {{industry}} businesses in {{country}} a complete, branded system — CRM, online booking, a public website and a 24/7 AI assistant — live in about a day, not months.

You pick your industry, drop in your logo and colours, and it's yours. There's a 3-day free trial (no card), so you can run {{company}} on it before you decide — then it's one low monthly.

Want me to send your trial link, or set it up with you on a quick call?`,
      },
      {
        step: 2, service_focus: "both",
        subject: "Re: a ready-made system for {{company}}",
        body_md: `Hi {{first_name}},

Floating this back up — spinning up the trial takes about 60 seconds and there's no card needed, so if it's not a fit you lose nothing.

Happy to send a 2-minute look at the {{industry}} version if that's easier than a call.`,
      },
      {
        step: 3, service_focus: "both",
        subject: "Should I close your file, {{first_name}}?",
        body_md: `Hi {{first_name}},

Last note — I won't crowd your inbox. If running {{company}} on one clean system (site, bookings, CRM and an AI assistant) sounds useful this year, just reply "trial" and I'll send your link.

If now isn't the time, no problem at all. Wishing you and the team well.`,
      },
    ],
  },
];

export function brandSeedFor(slug: string): BrandSeed | undefined {
  return BRAND_SEEDS.find((b) => b.slug === slug);
}

/* ------------------------------------------------------------------ *
 * DB access
 * ------------------------------------------------------------------ */

function mapBrand(row: Record<string, unknown>): SalesBrand {
  return {
    slug: String(row.slug ?? ""),
    operator_clerk_id: (row.operator_clerk_id as string) ?? null,
    name: String(row.name ?? ""),
    tagline: String(row.tagline ?? ""),
    mode: (row.mode as OutreachMode) ?? "b2b_cold",
    accent_color: String(row.accent_color ?? "#0b5cff"),
    logo_url: (row.logo_url as string) ?? null,
    offering: String(row.offering ?? ""),
    value_props: Array.isArray(row.value_props) ? (row.value_props as string[]) : [],
    cta_label: String(row.cta_label ?? "Reply to learn more"),
    cta_url: (row.cta_url as string) ?? null,
    icp_locations: (row.icp_locations as Partial<Record<Region, string[]>>) ?? {},
    icp_industries: Array.isArray(row.icp_industries) ? (row.icp_industries as string[]) : [],
    icp_titles: Array.isArray(row.icp_titles) ? (row.icp_titles as string[]) : [],
    optin_source: (row.optin_source as string) ?? null,
    sending_live: Boolean(row.sending_live ?? false),
    active: Boolean(row.active ?? true),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export async function getBrand(slug: string): Promise<SalesBrand | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb.from("sales_brands").select("*").eq("slug", slug).maybeSingle();
  return data ? mapBrand(data as Record<string, unknown>) : null;
}

export async function listBrands(opts: { activeOnly?: boolean } = {}): Promise<SalesBrand[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  let q = sb.from("sales_brands").select("*").order("name", { ascending: true });
  if (opts.activeOnly) q = q.eq("active", true);
  const { data } = await q;
  return ((data ?? []) as Record<string, unknown>[]).map(mapBrand);
}

export async function updateBrand(
  slug: string,
  patch: Partial<SalesBrand>,
): Promise<{ ok: boolean; error?: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "No cloud persistence." };
  const { slug: _s, created_at, updated_at, ...rest } = patch;
  void _s; void created_at; void updated_at;
  const { error } = await sb
    .from("sales_brands")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/* ------------------------------------------------------------------ *
 * Seeding — idempotent. Keeps the registry in sync with code on every
 * run WITHOUT ever resetting a brand's go-live switch or an operator's
 * hand-tuned settings/templates.
 * ------------------------------------------------------------------ */

/** Operational sales_settings row for a brand (keyed by slug as owner). */
function settingsRowFromSeed(seed: BrandSeed, today: string) {
  return {
    owner_clerk_id: seed.slug,
    sending_enabled: true,
    daily_target: seed.daily_target,
    warmup_enabled: true,
    warmup_started_on: today,
    from_name: seed.from_name,
    from_email: seed.from_email,
    reply_to: seed.reply_to,
    bcc_email: seed.bcc_email,
    company_name: seed.company_name,
    postal_address: seed.postal_address,
    regions: seed.regions,
    // Single-offering brands: one cold sequence tagged "both"; promos tagged "promo".
    service_focus: ["both"],
    hunter_daily_cap: 80,
    min_email_confidence: 80,
    calendar_url: seed.calendar_url,
    site_url: seed.site_url,
    signature_html: null,
    send_window_start: seed.send_window_start,
    send_window_end: seed.send_window_end,
    throttle_seconds: 90,
  };
}

/** sales_brands identity row. operator only set when known (never nulled). */
function brandRowFromSeed(seed: BrandSeed, operator: string | null) {
  const row: Record<string, unknown> = {
    slug: seed.slug,
    name: seed.name,
    tagline: seed.tagline,
    mode: seed.mode,
    accent_color: seed.accent_color,
    logo_url: seed.logo_url ?? null,
    offering: seed.offering,
    value_props: seed.value_props,
    cta_label: seed.cta_label,
    cta_url: seed.cta_url,
    icp_locations: seed.icp_locations,
    icp_industries: seed.icp_industries,
    icp_titles: seed.icp_titles,
    optin_source: seed.optin_source,
    updated_at: new Date().toISOString(),
  };
  if (operator) row.operator_clerk_id = operator;
  return row;
}

/**
 * Ensure a brand's operational settings + templates exist — WITHOUT touching the
 * registry identity row. Cheap and idempotent (just existence checks), so it's
 * safe to call on every engine tick / page load.
 */
export async function ensureBrandSeeded(seed: BrandSeed): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  const today = new Date().toISOString().slice(0, 10);

  // Settings — create only if missing (preserve operator tweaks).
  const { data: existing } = await sb
    .from("sales_settings")
    .select("owner_clerk_id")
    .eq("owner_clerk_id", seed.slug)
    .maybeSingle();
  if (!existing) await sb.from("sales_settings").insert(settingsRowFromSeed(seed, today));

  // Templates — seed only if this brand has none yet.
  const { count } = await sb
    .from("sales_templates")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", seed.slug);
  if ((count ?? 0) === 0 && seed.templates.length) {
    await sb.from("sales_templates").insert(
      seed.templates.map((t) => ({
        owner_clerk_id: seed.slug,
        name: `${t.service_focus === "promo" ? "Promo" : "Cold"} — step ${t.step}`,
        step: t.step,
        service_focus: t.service_focus,
        region: "all",
        subject: t.subject,
        body_md: t.body_md,
        is_default: true,
      })),
    );
  }
}

/**
 * Seed (or refresh) one brand from code: registry identity + settings + templates.
 * The registry upsert syncs identity/copy/ICP from BRAND_SEEDS but never resets a
 * brand's sending_live or active flags (those columns aren't in the upsert).
 */
export async function seedBrand(seed: BrandSeed, operator: string | null): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  await sb.from("sales_brands").upsert(brandRowFromSeed(seed, operator), { onConflict: "slug" });
  await ensureBrandSeeded(seed);
}

/** Seed the whole roster. Safe to call repeatedly (e.g. from the seed route). */
export async function seedAllBrands(operator: string | null): Promise<{ seeded: number }> {
  for (const seed of BRAND_SEEDS) await seedBrand(seed, operator);
  return { seeded: BRAND_SEEDS.length };
}
