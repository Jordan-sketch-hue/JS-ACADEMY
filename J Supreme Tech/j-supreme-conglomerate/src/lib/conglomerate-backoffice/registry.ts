import type { BackofficeBrand } from "@/lib/conglomerate-backoffice/types";

/** Pinned client + OS back offices — edit URLs when production domains change. */
export const CONGLOMERATE_BACKOFFICE_REGISTRY: BackofficeBrand[] = [
  {
    id: "j-supreme-conglomerate",
    name: "J Supreme Conglomerate",
    websiteUrl: "https://jsupremeconglomerate.online",
    tagline: "Operating system — CRM, pipeline, sites, trading.",
    vercelProjectName: "j-supreme-conglomerate",
    clerkShared: true,
    panels: [
      {
        label: "Mission Control",
        href: "/dashboard",
        auth: "clerk",
        description: "Daily operator dashboard.",
      },
      {
        label: "CRM & pipeline",
        href: "/crm",
        auth: "clerk",
      },
      {
        label: "Vercel sites",
        href: "/sites",
        auth: "clerk",
      },
    ],
  },
  {
    id: "aboo-tours",
    name: "AbooTours",
    websiteUrl: "https://abootours.com",
    tagline: "Tours, transfers, bookings · concierge OS for Jamaica.",
    vercelProjectName: "aboo-tours",
    clerkShared: false,
    provisioningTargets: ["abo-tours"],
    panels: [
      {
        label: "Concierge OS · Admin",
        href: "https://abootours.com/admin",
        auth: "supabase",
        description:
          "Sign in at /admin/login with your operator codes (aboo_user_profiles · role admin). Dispatch, fleet, money, marketing.",
      },
      {
        label: "Public site",
        href: "https://abootours.com",
        auth: "none",
      },
    ],
  },
  {
    id: "bp-couriers",
    name: "BP Couriers",
    websiteUrl: "https://courier-app-gamma.vercel.app",
    tagline: "Courier ops, dispatch, drivers, and customer bookings.",
    vercelProjectName: "courier-app",
    clerkShared: true,
    provisioningTargets: ["bp-courier-payload"],
    panels: [
      {
        label: "Payload CMS / Back office",
        href: "https://courier-app-gamma.vercel.app/admin",
        auth: "payload",
        description: "Content + collections (use architect creds).",
      },
      {
        label: "Dispatch board",
        href: "https://courier-app-gamma.vercel.app/dispatch",
        auth: "clerk",
        description: "Operations dashboard (Clerk SSO from this app).",
      },
      {
        label: "Shipments",
        href: "https://courier-app-gamma.vercel.app/shipments",
        auth: "clerk",
      },
      {
        label: "Drivers",
        href: "https://courier-app-gamma.vercel.app/drivers",
        auth: "clerk",
      },
      {
        label: "Reports",
        href: "https://courier-app-gamma.vercel.app/reports",
        auth: "clerk",
      },
    ],
  },
  {
    id: "language-cradle",
    name: "The Language Cradle",
    websiteUrl: "https://thelanguagecradle.vercel.app",
    tagline: "Language & cultural intelligence institute · IBLC.",
    logo: "/brands/language-cradle.webp",
    vercelProjectName: "thelanguagecradle",
    clerkShared: false,
    provisioningTargets: ["language-cradle"],
    panels: [
      {
        label: "CMS admin",
        href: "https://thelanguagecradle.vercel.app/admin/login",
        auth: "password",
        description:
          "Edit every section of the live site. Uses one shared CMS password (shown here — copy it, then sign in).",
      },
      {
        label: "Public site",
        href: "https://thelanguagecradle.vercel.app",
        auth: "none",
      },
    ],
  },
  {
    id: "solace-auto-imports",
    name: "Solace Auto Imports",
    websiteUrl: "https://solaceautoimportsltd.com",
    tagline: "Vehicle import inventory and lead management.",
    vercelProjectName: "solace-auto-imports",
    clerkShared: false,
    provisioningTargets: ["solace-auto"],
    panels: [
      {
        label: "Dealership Console",
        href: "https://solaceautoimportsltd.com/backoffice.html",
        auth: "supabase",
        description: "Supabase email + password · gated by SOLACE_ADMIN_EMAILS.",
      },
      {
        label: "Legacy admin",
        href: "https://solaceautoimportsltd.com/admin/login",
        auth: "supabase",
        description: "Older /admin entry — same auth.",
      },
      {
        label: "Public site",
        href: "https://solaceautoimportsltd.com",
        auth: "none",
      },
    ],
  },
  {
    id: "the-cleanser-ja",
    name: "The Cleanser JA",
    websiteUrl: "https://the-cleanser-ja.vercel.app",
    tagline: "Herbal wellness e-commerce + admin · Nicole Thompson.",
    vercelProjectName: "the-cleanser-ja",
    clerkShared: false,
    panels: [
      {
        label: "Store admin",
        href: "https://the-cleanser-ja.vercel.app/admin",
        auth: "supabase",
        description:
          "Products, orders, inventory, coupons, blog, analytics & settings.",
      },
      {
        label: "Admin login",
        href: "https://the-cleanser-ja.vercel.app/admin/login",
        auth: "supabase",
      },
      {
        label: "Public store",
        href: "https://the-cleanser-ja.vercel.app",
        auth: "none",
      },
    ],
  },
  {
    id: "the-mover-guy",
    name: "The MoverGuy",
    websiteUrl: "https://themoverguy.online",
    tagline: "Moving & storage ops · jobs, dispatch, storage, agreements, CRM.",
    vercelProjectName: "the-mover-guy",
    clerkShared: false,
    panels: [
      {
        label: "Operations back office",
        href: "https://themoverguy.online/admin",
        auth: "supabase",
        description:
          "Sign in at /login with operator creds (mg_accounts · role admin). Jobs, quotes, storage, agreements, customers, crew.",
      },
      {
        label: "Public site",
        href: "https://themoverguy.online",
        auth: "none",
      },
    ],
  },
  {
    id: "solid-trust-courier",
    name: "Solid Trust Courier",
    websiteUrl: "https://solidtrustservices.com",
    tagline: "Freight forwarding ops · batches, deliveries, customers, signatures.",
    vercelProjectName: "solidtrust-courier",
    clerkShared: false,
    provisioningTargets: ["solid-trust"],
    panels: [
      {
        label: "Admin CRM",
        href: "https://solidtrustservices.com/admin",
        auth: "supabase",
        description:
          "Sign in at /auth/sign-in with your operator codes · Supabase auth + st_staff allowlist (role admin).",
      },
      {
        label: "Public site",
        href: "https://solidtrustservices.com",
        auth: "none",
      },
    ],
  },
  {
    id: "ship2door",
    name: "Ship 2 Door JA",
    websiteUrl: "https://ship2doorja.com",
    tagline: "USA → Jamaica package forwarding · pre-alerts, pickups, ops.",
    vercelProjectName: "ship2doorja",
    clerkShared: false,
    provisioningTargets: ["ship2door"],
    panels: [
      {
        label: "Back office",
        href: "https://ship2doorja.vercel.app/back-office",
        auth: "key",
        description:
          "Opens authenticated via capability key (no login form) — pre-alerts, customers, shipments.",
      },
      {
        label: "Customer portal",
        href: "https://ship2doorja.vercel.app/portal",
        auth: "key",
        description: "Capability-key customer portal preview.",
      },
      {
        label: "Public site",
        href: "https://ship2doorja.com",
        auth: "none",
      },
    ],
  },
];
