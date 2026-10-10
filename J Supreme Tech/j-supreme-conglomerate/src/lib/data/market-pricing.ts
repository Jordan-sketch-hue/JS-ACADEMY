/**
 * Jamaica competitive pricing intelligence — websites, apps, and social media management.
 *
 * All prices are stored ONCE in JMD; USD is derived from {@link JMD_PER_USD}. Ranges are
 * representative market bands compiled from publicly published Jamaican agency pages and
 * 2025–2026 industry pricing guides (see SOURCES) — they are positioning estimates for
 * sales strategy, not official competitor quotes. Tune any number here and every chart,
 * table, and KPI on the page updates automatically.
 */

/** Approx. exchange rate, May 2026. One place to update when the rate moves. */
export const JMD_PER_USD = 158;

export const PRICING_LAST_REVIEWED = "May 2026";

export type Positioning = "Budget" | "Mid-market" | "Premium" | "You";

export type Competitor = {
  name: string;
  /** 2-letter mark for the avatar chip. */
  initials: string;
  /** Tailwind gradient classes for the avatar chip. */
  accent: string;
  positioning: Positioning;
  /** Typical engagement price band, in JMD. */
  jmdLow: number;
  jmdHigh: number;
  /** Short market-position note. */
  blurb: string;
  /** True for the J Supreme row (highlighted everywhere). */
  isYou?: boolean;
};

export type Tier = {
  name: string;
  jmdLow: number;
  jmdHigh: number;
  detail: string;
};

export type ServiceKey = "websites" | "apps" | "social";

export type ServiceCategory = {
  key: ServiceKey;
  label: string;
  /** Mapped to a lucide icon in the client. */
  iconKey: "globe" | "smartphone" | "megaphone";
  /** Pricing basis shown beside every figure. */
  unit: string;
  tagline: string;
  tiers: Tier[];
  competitors: Competitor[];
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export const SERVICES: ServiceCategory[] = [
  {
    key: "websites",
    label: "Websites",
    iconKey: "globe",
    unit: "per project",
    tagline:
      "Brochure sites to full e-commerce. The crowded core of the Jamaican digital market.",
    tiers: [
      {
        name: "Starter / Brochure",
        jmdLow: 100_000,
        jmdHigh: 250_000,
        detail: "3–5 pages, template-based, contact + basic SEO.",
      },
      {
        name: "Professional / Business",
        jmdLow: 250_000,
        jmdHigh: 750_000,
        detail: "Custom design, blog, booking, integrations.",
      },
      {
        name: "E-commerce / Custom",
        jmdLow: 550_000,
        jmdHigh: 1_500_000,
        detail: "Storefront, payments, inventory, custom build.",
      },
    ],
    competitors: [
      {
        name: "J Supreme Tech",
        initials: "JS",
        accent: "from-violet-500 to-fuchsia-600",
        positioning: "You",
        jmdLow: 150_000,
        jmdHigh: 700_000,
        blurb: "Custom Next.js builds + Vercel hosting. Premium product, mid-market price.",
        isYou: true,
      },
      {
        name: "Ezy Web Pro",
        initials: "EW",
        accent: "from-sky-400 to-blue-600",
        positioning: "Budget",
        jmdLow: 45_000,
        jmdHigh: 300_000,
        blurb: "Template-first, 'from US$100' entry pricing. High volume, low touch.",
      },
      {
        name: "Best Web Design JA",
        initials: "BW",
        accent: "from-emerald-400 to-green-600",
        positioning: "Budget",
        jmdLow: 120_000,
        jmdHigh: 500_000,
        blurb: "SME-focused, WordPress builds with maintenance retainers.",
      },
      {
        name: "Sitepact Jamaica",
        initials: "SP",
        accent: "from-cyan-400 to-teal-600",
        positioning: "Mid-market",
        jmdLow: 150_000,
        jmdHigh: 600_000,
        blurb: "Business sites with content + light SEO bundled.",
      },
      {
        name: "Humbird Media",
        initials: "HM",
        accent: "from-amber-400 to-orange-600",
        positioning: "Mid-market",
        jmdLow: 250_000,
        jmdHigh: 900_000,
        blurb: "Design-led studio, brand + web packaged together.",
      },
      {
        name: "Blitz Web Design",
        initials: "BZ",
        accent: "from-rose-400 to-red-600",
        positioning: "Premium",
        jmdLow: 400_000,
        jmdHigh: 1_500_000,
        blurb: "Custom + e-commerce, larger SME and corporate clients.",
      },
      {
        name: "iCreate Limited",
        initials: "iC",
        accent: "from-indigo-400 to-purple-600",
        positioning: "Premium",
        jmdLow: 500_000,
        jmdHigh: 2_000_000,
        blurb: "Established agency, enterprise & gov't web + branding.",
      },
    ],
  },
  {
    key: "apps",
    label: "Mobile Apps",
    iconKey: "smartphone",
    unit: "per project",
    tagline:
      "Thinner field locally — mostly freelancers and regional agencies. Quote-based, high ticket.",
    tiers: [
      {
        name: "MVP / Single platform",
        jmdLow: 800_000,
        jmdHigh: 2_000_000,
        detail: "One platform, core flows, no heavy integrations.",
      },
      {
        name: "Cross-platform business app",
        jmdLow: 2_000_000,
        jmdHigh: 5_000_000,
        detail: "iOS + Android, auth, API, store submission.",
      },
      {
        name: "Advanced (payments / GPS / realtime)",
        jmdLow: 5_000_000,
        jmdHigh: 10_000_000,
        detail: "Payments, live tracking, push, dashboards.",
      },
    ],
    competitors: [
      {
        name: "J Supreme Tech",
        initials: "JS",
        accent: "from-violet-500 to-fuchsia-600",
        positioning: "You",
        jmdLow: 1_200_000,
        jmdHigh: 4_500_000,
        blurb: "Expo / React Native, App Store + Play Store ship included. Web + app under one roof.",
        isYou: true,
      },
      {
        name: "Freelance developer",
        initials: "FL",
        accent: "from-slate-400 to-slate-600",
        positioning: "Budget",
        jmdLow: 300_000,
        jmdHigh: 1_500_000,
        blurb: "US$15–50/hr local/diaspora. Cheapest, but variable quality & support.",
      },
      {
        name: "Local dev shop",
        initials: "LS",
        accent: "from-sky-400 to-blue-600",
        positioning: "Mid-market",
        jmdLow: 1_500_000,
        jmdHigh: 4_000_000,
        blurb: "Small Kingston studios; bespoke business apps on retainer.",
      },
      {
        name: "Caribbean agency",
        initials: "CA",
        accent: "from-amber-400 to-orange-600",
        positioning: "Premium",
        jmdLow: 3_000_000,
        jmdHigh: 8_000_000,
        blurb: "Regional full-service; fintech / logistics scale projects.",
      },
      {
        name: "Diaspora / offshore agency",
        initials: "DO",
        accent: "from-rose-400 to-red-600",
        positioning: "Premium",
        jmdLow: 4_000_000,
        jmdHigh: 10_000_000,
        blurb: "US/UK-based shops billing at US rates for JA clients.",
      },
    ],
  },
  {
    key: "social",
    label: "Social Media Mgmt",
    iconKey: "megaphone",
    unit: "per month",
    tagline:
      "Monthly retainers. Huge spread between solo freelancers and full-service agencies.",
    tiers: [
      {
        name: "Starter",
        jmdLow: 25_000,
        jmdHigh: 60_000,
        detail: "1–2 platforms, 8–12 posts, basic graphics + report.",
      },
      {
        name: "Growth",
        jmdLow: 60_000,
        jmdHigh: 150_000,
        detail: "3–4 platforms, custom content, community mgmt.",
      },
      {
        name: "Full management",
        jmdLow: 150_000,
        jmdHigh: 400_000,
        detail: "Strategy, paid ads, video, reporting calls.",
      },
    ],
    competitors: [
      {
        name: "J Supreme Tech",
        initials: "JS",
        accent: "from-violet-500 to-fuchsia-600",
        positioning: "You",
        jmdLow: 45_000,
        jmdHigh: 180_000,
        blurb: "Content + AI-accelerated creative, islandwide. Premium output at agency-lite price.",
        isYou: true,
      },
      {
        name: "Freelance manager",
        initials: "FM",
        accent: "from-slate-400 to-slate-600",
        positioning: "Budget",
        jmdLow: 15_000,
        jmdHigh: 60_000,
        blurb: "Solo creators; cheapest, limited capacity & strategy.",
      },
      {
        name: "Boutique marketing agency",
        initials: "BM",
        accent: "from-emerald-400 to-green-600",
        positioning: "Mid-market",
        jmdLow: 50_000,
        jmdHigh: 150_000,
        blurb: "Small JA agencies; content + light ad management.",
      },
      {
        name: "Full-service agency",
        initials: "FS",
        accent: "from-amber-400 to-orange-600",
        positioning: "Premium",
        jmdLow: 120_000,
        jmdHigh: 400_000,
        blurb: "Established firms; strategy, video, paid media teams.",
      },
      {
        name: "Diaspora / US agency",
        initials: "US",
        accent: "from-rose-400 to-red-600",
        positioning: "Premium",
        jmdLow: 200_000,
        jmdHigh: 790_000,
        blurb: "US$500–5,000/mo rates applied to JA clients.",
      },
    ],
  },
];

export const SOURCES: { label: string; url: string }[] = [
  {
    label: "Creative Web Design Jamaica — web dev cost",
    url: "https://cwdesignja.com/2025/02/13/how-much-does-web-development-cost-in-jamaica/",
  },
  {
    label: "Sitepact Jamaica — website cost guide",
    url: "https://sitepactja.com/how-much-does-a-website-cost-in-jamaica/",
  },
  {
    label: "PerfectionGeeks — app dev cost in Jamaica",
    url: "https://www.perfectiongeeks.com/cost-to-build-an-app-in-jamaica",
  },
  {
    label: "Sprout Social — social media management pricing 2026",
    url: "https://sproutsocial.com/insights/social-media-management-cost/",
  },
  {
    label: "Planable — social media pricing 2026",
    url: "https://planable.io/blog/social-media-management-pricing/",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers — derive everything from the data above                    */
/* ------------------------------------------------------------------ */

export const usd = (jmd: number): number => jmd / JMD_PER_USD;

/** Compact JMD, e.g. J$250K / J$1.5M. */
export function fmtJmd(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `J$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `J$${Math.round(n / 1000)}K`;
}

/** Compact USD, e.g. $1.6K / $32K. */
export function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

export const midpoint = (c: Pick<Competitor, "jmdLow" | "jmdHigh">): number =>
  (c.jmdLow + c.jmdHigh) / 2;

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export type ServiceStats = {
  you: Competitor | undefined;
  /** Median of competitor midpoints, excluding J Supreme. */
  marketMedian: number;
  /** Cheapest low / priciest high across competitors (excl. you). */
  marketLow: number;
  marketHigh: number;
  /** Your midpoint vs market median, as a signed fraction (−0.32 = 32% below). */
  vsMedian: number;
};

export function getServiceStats(service: ServiceCategory): ServiceStats {
  const you = service.competitors.find((c) => c.isYou);
  const rivals = service.competitors.filter((c) => !c.isYou);
  const marketMedian = median(rivals.map(midpoint));
  const marketLow = Math.min(...rivals.map((c) => c.jmdLow));
  const marketHigh = Math.max(...rivals.map((c) => c.jmdHigh));
  const vsMedian =
    you && marketMedian ? (midpoint(you) - marketMedian) / marketMedian : 0;
  return { you, marketMedian, marketLow, marketHigh, vsMedian };
}
