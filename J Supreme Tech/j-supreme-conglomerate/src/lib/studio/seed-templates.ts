import type { StudioTemplate, StudioFields } from "@/lib/studio/types";

// J Supreme Tech brand tokens (mono frame + electric-blue accent).
const DARK = {
  bg: "#0B0B0C",
  ink: "#FFFFFF",
  muted: "#9A9AA2",
  accent: "#2D6BFF",
  accent2: "#7C5CFF",
  brand: "J SUPREME TECH",
};
const LIGHT = {
  bg: "#F5F5F3",
  ink: "#0B0B0C",
  muted: "#5C5C63",
  accent: "#2D6BFF",
  accent2: "#7C5CFF",
  brand: "J SUPREME TECH",
};

const CONTACT = "(658) 218-2282 · global.jsuprememarketing@gmail.com";

function tpl(
  key: string,
  name: string,
  layout: StudioTemplate["layout"],
  ratio: string,
  fields: StudioFields,
): StudioTemplate {
  return { id: key, key, name, category: "service-ad", layout, ratio, fields, isBuiltin: true };
}

/**
 * The J Supreme Tech "Custom Platforms" offer set — the kinds of builds Jordan
 * sells (websites, custom CRMs, back-offices, AI chatbots) with his proven
 * verticals (ecommerce, courier) as proof. Every value here is editable in the
 * Studio; these are just strong starting points.
 */
export const SEED_TEMPLATES: StudioTemplate[] = [
  tpl("hero", "Hero · The offer", "hero", "1080x1080", {
    ...DARK,
    eyebrow: "CUSTOM SOFTWARE STUDIO",
    headline: "We build the software your business runs on.",
    subhead:
      "Websites, custom CRMs, back-offices & AI chatbots — designed, built and launched end-to-end.",
    bullets: ["Websites", "Custom CRMs", "AI back-office", "Mobile apps"],
    ctaLabel: "Book a build call",
    contact: CONTACT,
    badge: "Now booking",
    mock: "dashboard",
  }),

  tpl("websites", "Websites that convert", "feature", "1080x1080", {
    ...LIGHT,
    eyebrow: "WEBSITES",
    headline: "Websites that sell while you sleep.",
    subhead: "Fast, branded sites wired to take bookings, payments and leads on day one.",
    bullets: [
      "Booking & checkout built in",
      "SEO + analytics from launch",
      "Custom domain & email",
      "Edit it yourself in the CMS",
    ],
    ctaLabel: "See a demo",
    contact: CONTACT,
    badge: "From concept to live",
    mock: "browser",
  }),

  tpl("custom-crm", "Custom CRM", "feature", "1080x1080", {
    ...LIGHT,
    eyebrow: "CUSTOM CRM",
    headline: "One CRM for every lead, customer & deal.",
    subhead: "Stop running the business in your head and a dozen WhatsApp chats.",
    bullets: [
      "Pipelines, quotes & invoices",
      "Customer history in one place",
      "Staff roles & permissions",
      "Dashboards that show the money",
    ],
    ctaLabel: "Map my workflow",
    contact: CONTACT,
    badge: "Built around your ops",
    mock: "dashboard",
  }),

  tpl("ecommerce", "Ecommerce stores", "feature", "1080x1080", {
    ...LIGHT,
    eyebrow: "ECOMMERCE",
    headline: "Online stores, fully managed.",
    subhead: "Storefront, inventory and order ops in one system you actually control.",
    bullets: [
      "Products, variants & inventory",
      "Orders, shipping & coupons",
      "Customer accounts & reviews",
      "Sales analytics & admin",
    ],
    ctaLabel: "Launch my store",
    contact: CONTACT,
    badge: "Retail · wholesale · DTC",
    mock: "store",
  }),

  tpl("courier", "Courier & logistics", "feature", "1080x1080", {
    ...LIGHT,
    eyebrow: "COURIER & LOGISTICS",
    headline: "Built for couriers & logistics.",
    subhead: "Bookings to proof-of-delivery — the whole operation on one platform.",
    bullets: [
      "Bookings, dispatch & tracking",
      "Driver app + proof of delivery",
      "Warehouse & package intake",
      "Billing, statements & reports",
    ],
    ctaLabel: "Run a pilot",
    contact: CONTACT,
    badge: "Proven on live fleets",
    mock: "courier",
  }),

  tpl("ai-chatbot", "AI back-office chatbot", "feature", "1080x1080", {
    ...DARK,
    eyebrow: "AI BACK-OFFICE",
    headline: "Your 24/7 AI front desk & ops copilot.",
    subhead: "An assistant that answers customers and runs the busywork — day and night.",
    bullets: [
      "Answers FAQs & captures leads",
      "Books jobs & looks up status",
      "Drafts quotes & follow-ups",
      "Trained on your business",
    ],
    ctaLabel: "Meet your assistant",
    contact: CONTACT,
    badge: "Always on",
    mock: "phoneChat",
  }),

  tpl("cta", "Closing · Let's build", "cta", "1080x1080", {
    ...DARK,
    eyebrow: "J SUPREME TECH",
    headline: "Now booking custom builds.",
    subhead:
      "Websites · Custom CRMs · Back-offices · AI chatbots. Tell us what you run — we'll architect it.",
    bullets: [],
    ctaLabel: "Start your build",
    contact: CONTACT,
    badge: "Limited slots",
    mock: "none",
  }),
];

export function seedById(key: string): StudioTemplate | undefined {
  return SEED_TEMPLATES.find((t) => t.key === key);
}
