/**
 * Marketing Command Center — Brand Playbooks.
 *
 * The strategy layer. For each campaign we author a full marketing plan:
 * market breakdown, audiences, competitive wedge, a RANKED channel strategy
 * ("best place to market"), content pillars, funnel, budget split, KPIs and a
 * 30/60/90-day execution roadmap.
 *
 * This is hand-authored and keyed by campaign `slug`, so it merges into
 * `getMarketingData()` alongside the assets without the staging pipeline ever
 * touching it. To add a brand: append a BrandPlan with a matching slug.
 *
 * NOTE on numbers: budgets and KPI targets are realistic *starting* suggestions
 * for a small Jamaican business — tune them to your real spend and baselines.
 */

export type ChannelPriority = "primary" | "secondary" | "test";

export type Audience = {
  name: string;
  who: string;
  /** What's actually keeping them up at night / why they buy. */
  pains: string[];
  /** Where this segment already spends attention. */
  where: string;
  /** The one message that lands for them. */
  message: string;
};

export type Competitor = {
  name: string;
  type: string;
  /** What they're genuinely good at — respect the threat. */
  strength: string;
  /** Our angle of attack — where we win against them. */
  ourWedge: string;
};

export type ChannelPlay = {
  channel: string;
  priority: ChannelPriority;
  /** Why this channel, for THIS brand — not generic. */
  why: string;
  cadence: string;
  /** Concrete things to actually post / do. */
  tactics: string[];
};

export type ContentPillar = {
  name: string;
  /** Share of the content calendar, e.g. "40%". */
  share: string;
  why: string;
  examples: string[];
};

export type FunnelStage = {
  stage: "Awareness" | "Consideration" | "Conversion" | "Loyalty";
  goal: string;
  plays: string[];
  metric: string;
};

export type BudgetSlice = { label: string; pct: number; note?: string };

export type Kpi = { label: string; target: string; horizon: string };

export type RoadmapPhase = {
  window: string; // e.g. "Days 0–30"
  theme: string;
  actions: string[];
  outcome: string;
};

export type BrandPlan = {
  campaign: string; // slug → CAMPAIGNS
  /** One-line positioning statement. */
  positioning: string;
  /** The single metric that defines growth for this brand. */
  northStar: string;
  /** The headline offer / price anchor. */
  offer: string;
  market: {
    size: string;
    geography: string;
    demandDrivers: string[];
    seasonality: string;
  };
  audiences: Audience[];
  competitors: Competitor[];
  /** Ranked — channels[0] is the single best place to market. */
  channels: ChannelPlay[];
  pillars: ContentPillar[];
  funnel: FunnelStage[];
  budget: {
    monthly: string;
    currency: "JMD" | "USD";
    split: BudgetSlice[];
  };
  kpis: Kpi[];
  roadmap: RoadmapPhase[];
  /** Do-this-week, no-budget moves. */
  quickWins: string[];
};

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------
export const BRAND_PLANS: BrandPlan[] = [
  // ───────────────────────────── J Supreme Tech ──────────────────────────────
  {
    campaign: "j-supreme-tech",
    positioning:
      "The remote-first creative-technology studio that gives founders a website, app, social presence and brand — built fast, owned fully, and paid for online.",
    northStar: "Paid project starts per month (quotes that convert to a card payment)",
    offer:
      "Four services — Websites, Apps, Social Media Management, Brand & Design — from J$25,000 / US$169. Managed social runs monthly: Starter J$30k/$199 · Plus J$55k/$349 · Elite J$80k/$499 (billed bi-weekly, ad spend separate). Quote → approve → pay online by card → we start the same day.",
    market: {
      size:
        "Two pools under one studio: (1) Jamaican SMBs going digital — thousands of IG/WhatsApp shops with no real website or app; (2) the global diaspora founder market paying USD for remote build teams. Web/app work is crowded but fragmented — trust, speed and price decide it.",
      geography:
        "Anchored in Jamaica (Kingston) for local SMBs; remote-first worldwide for the diaspora & beyond (USD).",
      demandDrivers: [
        "SMBs needing a credible online home + online payments to compete",
        "Founders wanting an app without a $30k native budget (the PWA angle)",
        "Businesses needing ongoing social media management, not one-off posts",
        "Diaspora entrepreneurs hiring remote build teams and paying in USD",
      ],
      seasonality:
        "Steady year-round; bumps at New-Year (new businesses/resolutions), back-to-school (Aug–Sep), and Q4 as businesses prep for Christmas trade. Social retainers smooth the curve.",
    },
    audiences: [
      {
        name: "The Jamaican SMB owner",
        who: "Shop, salon, trade or service business running on Instagram/WhatsApp with no real website.",
        pains: ["No credible online home", "Loses customers who Google them first", "Assumes a site/app is too expensive"],
        where: "Instagram, WhatsApp, Facebook, Google.",
        message: "Customers Google you before they call. Give them a fast site that takes the booking — and the card payment.",
      },
      {
        name: "The diaspora / overseas founder",
        who: "Caribbean founder abroad launching a brand, wanting a remote team that ships and that they can pay by card.",
        pains: ["Hard to find a trustworthy remote builder", "Native apps quoted at $30k+", "Wants to own the code, not be locked in"],
        where: "Instagram, TikTok, LinkedIn, referrals.",
        message: "App-store power without the price. You own everything. Approve & pay online — we start the same day.",
      },
      {
        name: "The growing brand",
        who: "Already trading; needs the next system (booking, store, CRM) or real, consistent social.",
        pains: ["Outgrown a DIY site", "No time to post consistently", "Disconnected tools"],
        where: "Instagram, Google, referrals, LinkedIn.",
        message: "We design the system and run your social — you run the business.",
      },
    ],
    competitors: [
      { name: "Freelancers (Fiverr/Upwork)", type: "Cheap individual builders", strength: "Low price, huge supply.", ourWedge: "A studio that ships real, owned systems + ongoing social — not a one-off gig that ghosts you." },
      { name: "DIY builders (Wix/Squarespace/Shopify)", type: "Self-serve platforms", strength: "Cheap, instant, familiar.", ourWedge: "Done-for-you, custom, faster-loading, you own the code — plus apps & social they can't deliver." },
      { name: "Local web/marketing agencies", type: "Established JA agencies", strength: "Reputation, local presence.", ourWedge: "Sharper pricing, faster delivery, four services under one roof, pay-online convenience, no lock-in." },
    ],
    channels: [
      {
        channel: "Instagram + TikTok (Reels)",
        priority: "primary",
        why: "A studio's work is inherently visual. Build-in-public clips, before/after site reveals and client wins prove the product and show all four services at once.",
        cadence: "4–5 posts/wk: build/reveal Reels, one service deep-dive, a client win, daily Stories.",
        tactics: ["Before/after website reveal Reels", "‘Built this in 7 days’ time-lapses", "Pin the four-service hero + the handover trilogy", "Repost client launches for free social proof"],
      },
      {
        channel: "Google Business Profile + SEO",
        priority: "primary",
        why: "‘Web designer Jamaica / app developer’ searches are ready-to-buy intent. Capture them with a ranked site + a complete profile.",
        cadence: "Weekly post; reply to every review; keep the portfolio fresh.",
        tactics: ["Rank jsupremetech.online for ‘web design Jamaica’", "A service page per offering", "Collect a review from every client", "Case-study pages that show results"],
      },
      {
        channel: "WhatsApp Business",
        priority: "primary",
        why: "Where the quote → approve → pay-by-card conversation actually closes. It is the storefront and the entry to checkout.",
        cadence: "Always-on; a package catalog; broadcast a monthly case study.",
        tactics: ["Package catalog with prices", "Click-to-WhatsApp on every post + bio", "Quote template that ends in an online pay link", "Quick replies for FAQs"],
      },
      {
        channel: "Referrals + portfolio loop",
        priority: "secondary",
        why: "Every live client site is a billboard. A ‘Built by J Supreme Tech’ footer link compounds into inbound.",
        cadence: "Footer credit on every ship; one featured case study a month; referral credit.",
        tactics: ["‘Built by J Supreme Tech → site’ footer link on every build", "Referral credit for client-to-client intros", "Monthly case-study post"],
      },
      {
        channel: "LinkedIn",
        priority: "test",
        why: "For higher-ticket platform/enterprise builds and diaspora founders who buy in USD.",
        cadence: "2–3 posts/wk: build lessons, case studies, ‘why own your code’.",
        tactics: ["Founder-story + build-lesson posts", "Direct outreach to diaspora founders", "Enterprise case studies"],
      },
    ],
    pillars: [
      { name: "Proof of work (build & reveal)", share: "40%", why: "Showing real builds is the most persuasive content a studio has.", examples: ["Before/after site reveals", "Build time-lapses", "Client launch reposts", "Case studies"] },
      { name: "Educate the four services", share: "25%", why: "Most followers don't know you do all four — teach the menu.", examples: ["Website vs web app vs native", "‘Why you need social management’", "Brand-kit explainers", "Transparent pricing"] },
      { name: "Convert (pay online)", share: "20%", why: "Point attention at the money action — quote, approve, pay by card.", examples: ["The payments post", "Package flyers", "‘Pay online, we start today’", "CTA stories"] },
      { name: "Trust & brand", share: "15%", why: "Ownership terms + the mono brand identity close deals.", examples: ["‘You own everything’", "No lock-in / unlimited revisions", "Team & process", "The handover trilogy"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Founders see the work and learn you do all four services.", plays: ["Build/reveal Reels", "Google ranking", "Portfolio footer links"], metric: "Reach / profile visits" },
      { stage: "Consideration", goal: "They trust you ship real, owned systems.", plays: ["Case studies", "‘You own everything’", "Reviews"], metric: "Site visits → WhatsApp starts" },
      { stage: "Conversion", goal: "Quote → approve → pay online by card.", plays: ["Package flyers", "The payments post", "A clear quote → pay link"], metric: "Quotes sent → paid starts" },
      { stage: "Loyalty", goal: "Recurring social retainer + the next system.", plays: ["Social-management retainer", "Upsell app/CRM", "Referral credit"], metric: "Retainer clients / repeat builds" },
    ],
    budget: {
      monthly: "US$300 – US$900 (≈ J$45,000 – J$140,000)",
      currency: "USD",
      split: [
        { label: "IG/TikTok boosts (best reveals + the payments post)", pct: 40 },
        { label: "Google Search ads (‘web design Jamaica’, ‘app developer’)", pct: 25 },
        { label: "Content production (screen-capture, editing)", pct: 20 },
        { label: "Referral credit + case-study incentives", pct: 15 },
      ],
    },
    kpis: [
      { label: "Paid project starts / month", target: "4 → 12", horizon: "90 days" },
      { label: "Qualified quotes sent / month", target: "20+", horizon: "60 days" },
      { label: "Quote → paid conversion", target: "≥ 35%", horizon: "90 days" },
      { label: "Active social-management retainers", target: "3 → 10", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Foundation & funnel", actions: ["Pin the four-service hero + the handover trilogy", "Complete Google Business Profile + a WhatsApp package catalog", "Put the payments creative + a ‘card payments accepted’ line on the site quote flow", "Start a build-in-public Reel habit"], outcome: "A credible, searchable presence with a clear pay-online path." },
      { window: "Days 31–60", theme: "Proof & reach", actions: ["Publish 2 case studies with results", "Boost the authority + payments posts", "DM 10 SMBs a free 15-minute website audit", "Add a ‘Built by J Supreme Tech’ footer link to every client site"], outcome: "Inbound from proof; the portfolio loop starts compounding." },
      { window: "Days 61–90", theme: "Recurring revenue", actions: ["Push the social-management retainer hard", "Launch a client-to-client referral credit", "Retarget site visitors who got a quote but didn't pay", "Test LinkedIn for enterprise/diaspora leads"], outcome: "Recurring retainer revenue + a repeatable conversion engine." },
    ],
    quickWins: [
      "Pin the four-service hero + the 3-post handover trilogy to the top of your grid.",
      "Add a click-to-WhatsApp button + a ‘card payments accepted’ line to the bio and site.",
      "Post the payments creative: ‘Approve & pay online — we start the same day.’",
      "DM 10 IG/WhatsApp businesses a free 15-minute website audit.",
      "Put ‘Built by J Supreme Tech → jsupremetech.online’ in the footer of every client site you ship.",
    ],
  },

  // ─────────────────────────────── BP Couriers ───────────────────────────────
  {
    campaign: "bp-couriers",
    positioning:
      "The islandwide courier that Jamaica's online sellers trust for same-day delivery — book in the app, track every parcel.",
    northStar: "Weekly active business senders (sellers who book ≥1 delivery/week)",
    offer: "Same-day & next-day islandwide pickup and delivery, in-app booking + live tracking.",
    market: {
      size:
        "Jamaica's social-commerce boom (Instagram/WhatsApp shops) created a fast-growing last-mile gap. Thousands of small sellers ship daily but rely on informal 'bike men' with no tracking.",
      geography:
        "Anchored in the Kingston/St. Andrew corridor; live lanes to Montego Bay, Ocho Rios, Mandeville and Negril. Inter-parish is the premium lane.",
      demandDrivers: [
        "IG/WhatsApp sellers needing reliable, trackable delivery to keep buyers",
        "Buyers expecting 'order today, get it today' like overseas",
        "SMBs wanting scheduled B2B runs (documents, restocks)",
      ],
      seasonality:
        "Peaks: Christmas (Nov–Dec), back-to-school (Aug), Valentine's & Mother's Day. Dips: post-holiday Jan. Plan boosts around the peaks.",
    },
    audiences: [
      {
        name: "The IG/WhatsApp seller",
        who: "Solo entrepreneurs selling clothing, hair, food, accessories from a phone.",
        pains: ["Unreliable bike men", "No tracking → angry buyers", "Losing sales to 'how soon can I get it?'"],
        where: "Instagram & WhatsApp all day; TikTok at night.",
        message: "Deliver like a big brand — trackable, islandwide, same day. Your buyers stop asking 'where's my order?'",
      },
      {
        name: "The everyday sender",
        who: "Individuals sending a parcel/document to family or a buyer in another parish.",
        pains: ["Can't leave work to send things", "Don't trust 'a man on the road'", "Unsure of cost"],
        where: "Facebook, WhatsApp, Google ('courier near me').",
        message: "One pickup, islandwide reach, a price you see up front. We come to you.",
      },
      {
        name: "The SMB / office",
        who: "Pharmacies, law offices, restaurants needing scheduled or on-demand runs.",
        pains: ["Staff doing deliveries instead of their job", "No proof of delivery"],
        where: "Referrals, Google, LinkedIn.",
        message: "Outsource your runs. Scheduled pickups, proof of delivery, one monthly invoice.",
      },
    ],
    competitors: [
      {
        name: "Knutsford Express (courier arm)",
        type: "Established depot-based courier",
        strength: "Trusted brand, national depot network.",
        ourWedge: "Door-to-door, app-booked, same-day — no driving to a depot.",
      },
      {
        name: "ZipMail / Tara Couriers",
        type: "Local courier services",
        strength: "Known names, business accounts.",
        ourWedge: "In-app live tracking + seller-friendly pricing and onboarding.",
      },
      {
        name: "Informal 'bike man'",
        type: "Default for most small sellers",
        strength: "Cheap, fast, personal.",
        ourWedge: "Reliability + tracking + a brand the seller can show buyers — without losing speed.",
      },
    ],
    channels: [
      {
        channel: "Instagram (Reels + Stories)",
        priority: "primary",
        why: "Your sellers and their buyers already live here. Delivery content is visual proof and travels.",
        cadence: "4–5 posts/wk: 3 Reels (delivery POV, before/after of a seller's order out the door), daily Stories.",
        tactics: [
          "Reels: 'A day of islandwide deliveries' POV",
          "Repost seller shops you deliver for (free social proof both ways)",
          "Story polls: 'Which parish should we feature next?'",
          "Pin the FAST→RELIABLE→ISLANDWIDE grid trilogy to the top row",
        ],
      },
      {
        channel: "WhatsApp Business",
        priority: "primary",
        why: "Booking, quotes and status updates happen here. It's your storefront and support desk in one.",
        cadence: "Always-on. Broadcast list update weekly to repeat senders.",
        tactics: ["Catalog with lanes + pricing", "Quick-reply templates for quotes", "Click-to-WhatsApp button in every IG bio/post"],
      },
      {
        channel: "Google Business Profile + local SEO",
        priority: "primary",
        why: "Captures high-intent 'courier near me / islandwide delivery Jamaica' searches — buyers ready now.",
        cadence: "Weekly photo post; reply to every review within 24h.",
        tactics: ["Complete profile with service areas", "Ask every happy customer for a review", "Service-area pages on bpcouriers.online"],
      },
      {
        channel: "TikTok",
        priority: "secondary",
        why: "Cheapest organic reach in Jamaica right now; delivery/logistics POV content performs.",
        cadence: "3 short clips/wk, repurpose IG Reels.",
        tactics: ["'Get it there same day' challenge clips", "Behind-the-scenes sorting/dispatch", "Duet seller unboxings"],
      },
      {
        channel: "Seller partnerships / referrals",
        priority: "secondary",
        why: "Your best growth loop — every seller you serve is a billboard to other sellers.",
        cadence: "Onboard 5 new seller accounts/mo; monthly shout-out swap.",
        tactics: ["Referral credit for sellers who refer sellers", "Co-branded 'Delivered by BP' sticker on parcels", "Feature a 'Seller of the Month'"],
      },
    ],
    pillars: [
      { name: "Proof in motion", share: "40%", why: "Show real islandwide deliveries — reliability is the product.", examples: ["Delivery POV Reels", "Live tracking screen-recordings", "On-time stat cards"] },
      { name: "Seller spotlight", share: "30%", why: "Make sellers the hero → they reshare → you reach their buyers.", examples: ["'We deliver for @shop' features", "Seller testimonials", "Order-out-the-door clips"] },
      { name: "Educate & reassure", share: "20%", why: "Answer the friction questions that stop a first booking.", examples: ["'How to book in 30s'", "Lanes & pricing explainer", "Proof-of-delivery how-to"] },
      { name: "Brand & culture", share: "10%", why: "Jamaican pride + the FAST/RELIABLE/ISLANDWIDE identity.", examples: ["Parish features", "Team", "The grid-puzzle trilogy"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Sellers know BP exists and looks reliable.", plays: ["Reels reach", "Seller reshares", "TikTok"], metric: "Reach / new followers" },
      { stage: "Consideration", goal: "They believe the tracking + same-day promise.", plays: ["Tracking demos", "Reviews", "GBP"], metric: "Profile visits → WhatsApp clicks" },
      { stage: "Conversion", goal: "First booking.", plays: ["First-delivery offer", "Click-to-WhatsApp", "Easy in-app booking"], metric: "First-time senders" },
      { stage: "Loyalty", goal: "Become their default courier.", plays: ["Business accounts", "Referral credit", "Seller of the Month"], metric: "Weekly active senders / repeat rate" },
    ],
    budget: {
      monthly: "J$40,000 – J$90,000",
      currency: "JMD",
      split: [
        { label: "IG/TikTok boosts (peaks + best Reels)", pct: 40 },
        { label: "Seller partnerships & referral credit", pct: 25 },
        { label: "Content production (props, edits)", pct: 15 },
        { label: "Local SEO / Google Business", pct: 10 },
        { label: "First-delivery incentives", pct: 10 },
      ],
    },
    kpis: [
      { label: "Weekly active business senders", target: "25 → 75", horizon: "90 days" },
      { label: "First-time senders / month", target: "40+", horizon: "60 days" },
      { label: "Repeat rate", target: "≥ 50%", horizon: "90 days" },
      { label: "Google reviews (4.5★+)", target: "30+", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Foundation & proof", actions: ["Lock IG grid + pin the trilogy", "Complete Google Business Profile + WhatsApp catalog", "Onboard first 10 seller accounts", "Start a daily delivery-Reel habit"], outcome: "A credible, searchable presence and first social proof." },
      { window: "Days 31–60", theme: "Seller flywheel", actions: ["Launch referral credit", "Weekly seller spotlight + reshare swaps", "Boost top 2 Reels", "Collect 15+ reviews"], outcome: "Sellers start referring sellers; bookings compound." },
      { window: "Days 61–90", theme: "Lock the default", actions: ["Launch business-account tier (monthly invoice + scheduled runs)", "Seasonal peak boost plan", "Retarget profile visitors who didn't book"], outcome: "Recurring B2B revenue + repeat-rate ≥ 50%." },
    ],
    quickWins: [
      "Add a click-to-WhatsApp button to the IG bio and every post caption.",
      "Pin the FAST / RELIABLE / ISLANDWIDE trilogy as your top grid row.",
      "DM 10 IG shops you already deliver for and ask to be tagged as their courier.",
      "Ask your last 10 happy customers for a Google review (send the direct link).",
    ],
  },

  // ─────────────────────────────── Ship 2 Door JA ────────────────────────────
  {
    campaign: "ship2door",
    positioning:
      "Your free U.S. address — shop America online and we deliver it to your door in Jamaica, with a real person on WhatsApp the whole way.",
    northStar: "Active shippers per month (customers with ≥1 package in transit)",
    offer: "A FREE U.S. shipping address (no signup fee) + islandwide doorstep delivery + a loyalty punch card.",
    market: {
      size:
        "Massive and proven — Jamaicans shop Amazon, SHEIN, fashion and electronics constantly but can't ship direct. Package-forwarding is a mature, competitive category with established national players.",
      geography:
        "Islandwide demand; your edge is the western corridor — Icon Mall, Fairview (Montego Bay area) pickup — plus doorstep delivery everywhere.",
      demandDrivers: [
        "Better selection & prices on U.S. sites than local retail",
        "SHEIN/Amazon culture among 18–40s",
        "Resellers importing stock to flip locally",
      ],
      seasonality:
        "Huge spikes: Black Friday/Cyber Monday (Nov), Christmas, back-to-school (Aug), Valentine's. Build campaigns AROUND these — they are the whole game.",
    },
    audiences: [
      {
        name: "The online shopper (18–35)",
        who: "Fashion/beauty buyers shopping SHEIN, Fashion Nova, Amazon from their phone.",
        pains: ["'Store doesn't ship to Jamaica'", "Scared of hidden fees", "Want it fast and cheap"],
        where: "Instagram, TikTok.",
        message: "Get a free U.S. address in minutes. Shop like you live in Miami — we bring it home.",
      },
      {
        name: "The reseller",
        who: "Small sellers importing stock (sneakers, hair, gadgets) to resell in JA.",
        pains: ["Need predictable shipping cost to price stock", "Consolidation to save money", "Reliability for restocks"],
        where: "Instagram, WhatsApp, Facebook buy/sell groups.",
        message: "Import your stock with one trusted partner. Consolidate, save, and restock on time.",
      },
      {
        name: "The diaspora & family sender",
        who: "Older shoppers and overseas family buying for relatives in JA.",
        pains: ["Want it simple", "Trust matters more than price", "Prefer to talk to a person"],
        where: "Facebook, WhatsApp.",
        message: "A real person handles your package and answers on WhatsApp. No app gymnastics.",
      },
    ],
    competitors: [
      { name: "MailPac", type: "Market leader (publicly listed)", strength: "Scale, brand, retail network.", ourWedge: "Free address (no fees), personal WhatsApp service, western-corridor pickup." },
      { name: "SkyBox", type: "Major forwarder", strength: "Wide footprint, app.", ourWedge: "Loyalty punch card + human touch; MoBay-area convenience." },
      { name: "Aeropost / ShipMe", type: "Established forwarders", strength: "Recognized, multi-channel.", ourWedge: "Lean pricing + responsiveness; treat every shopper like a regular." },
    ],
    channels: [
      {
        channel: "Instagram (Reels + Stories)",
        priority: "primary",
        why: "Where the SHEIN/Amazon shopper lives. 'How to shop U.S.' + haul content converts directly.",
        cadence: "5 posts/wk: 3 Reels (haul reveals, 'how to get a free address'), daily deal Stories.",
        tactics: ["Unboxing/haul Reels", "'Stores that DO ship now via us' carousels", "Countdown Stories to Black Friday", "Customer haul reposts"],
      },
      {
        channel: "TikTok",
        priority: "primary",
        why: "Best organic reach in JA + native to haul/shopping culture; 'how to shop American sites' is evergreen viral.",
        cadence: "4–5 clips/wk; repurpose IG + react to trending hauls.",
        tactics: ["'Shop SHEIN from Jamaica' tutorials", "Delivery reveals", "Price-comparison clips (US vs local)"],
      },
      {
        channel: "WhatsApp Business",
        priority: "primary",
        why: "Where signup, package status and trust are won. Your differentiator is the human reply.",
        cadence: "Always-on; weekly broadcast of deals + 'who has a package landing'.",
        tactics: ["Auto-reply with the free-address signup steps", "Status updates per package", "Broadcast seasonal deals"],
      },
      {
        channel: "Facebook + buy/sell groups",
        priority: "secondary",
        why: "Reaches diaspora, older shoppers and resellers who organize in JA shopping groups.",
        cadence: "3 posts/wk + active in relevant groups.",
        tactics: ["Post in 'Jamaica online shopping' groups", "FB Marketplace presence", "Testimonials for trust"],
      },
      {
        channel: "Google ('package forwarding Jamaica')",
        priority: "secondary",
        why: "Captures buyers actively comparing forwarders — high intent.",
        cadence: "Always-on profile; consider search ads at peaks.",
        tactics: ["Optimize site for 'free US address Jamaica'", "Google Business Profile for the MoBay pickup", "Collect reviews"],
      },
    ],
    pillars: [
      { name: "How-to / unlock", share: "35%", why: "Remove the 'they don't ship here' barrier — the core job-to-be-done.", examples: ["'Get a free US address' walkthrough", "'How to checkout on SHEIN'", "Customs/fees explained simply"] },
      { name: "Deals & hauls", share: "30%", why: "Desire + urgency drive signups, especially seasonally.", examples: ["Black Friday countdowns", "Customer hauls", "'What I shipped this week'"] },
      { name: "Trust & proof", share: "20%", why: "Forwarding is trust-led — show real packages, real people.", examples: ["Delivery reveals", "Testimonials", "Meet-the-team"] },
      { name: "Loyalty & community", share: "15%", why: "Punch card + repeat behavior = your moat.", examples: ["Punch-card progress", "Birthday/Christmas free-ship reminders", "Regulars spotlight"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Shoppers learn they CAN shop US sites.", plays: ["TikTok how-tos", "IG Reels hauls"], metric: "Reach / saves" },
      { stage: "Consideration", goal: "Believe it's free, easy, trustworthy.", plays: ["Free-address explainer", "Testimonials", "WhatsApp Q&A"], metric: "Link clicks / WhatsApp starts" },
      { stage: "Conversion", goal: "Sign up + first shipment.", plays: ["Free-address CTA", "Seasonal urgency", "Reseller onboarding"], metric: "New signups → first package" },
      { stage: "Loyalty", goal: "Repeat shipping + punch-card completion.", plays: ["Punch card", "Broadcast deals", "Birthday/Christmas free ship"], metric: "Active shippers/mo / repeat rate" },
    ],
    budget: {
      monthly: "J$60,000 – J$150,000 (load toward Nov–Dec)",
      currency: "JMD",
      split: [
        { label: "IG/TikTok boosts (heavy at seasonal peaks)", pct: 45 },
        { label: "Creator hauls / partnerships", pct: 20 },
        { label: "Content production", pct: 15 },
        { label: "Google + FB groups", pct: 10 },
        { label: "Loyalty / referral incentives", pct: 10 },
      ],
    },
    kpis: [
      { label: "New signups / month", target: "150+", horizon: "60 days" },
      { label: "Active shippers / month", target: "200 → 500", horizon: "90 days" },
      { label: "Signup → first-package rate", target: "≥ 45%", horizon: "60 days" },
      { label: "Repeat shipper rate", target: "≥ 40%", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Own the 'how-to'", actions: ["Pin a 'get your free US address' Reel + highlight", "Run the 5-part Launch Drop sequence", "Set WhatsApp auto-reply with signup steps", "List in 5 JA shopping FB groups"], outcome: "Clear, repeatable signup path with social proof." },
      { window: "Days 31–60", theme: "Hauls & resellers", actions: ["Partner with 3 micro-creators for hauls", "Launch reseller onboarding", "Push punch-card content", "Optimize site for 'free US address Jamaica'"], outcome: "Steady signups + first reseller accounts." },
      { window: "Days 61–90", theme: "Seasonal blitz", actions: ["Black Friday/Christmas countdown campaign", "Heavy boost on best haul Reels", "Birthday/Christmas free-ship reminders to punch-card holders"], outcome: "Peak-season signup surge + loyalty completion." },
    ],
    quickWins: [
      "Pin one 'How to get your FREE U.S. address' Reel to the top of the grid.",
      "Set a WhatsApp greeting that auto-sends the 3-step signup.",
      "Post your offer in 5 'Jamaica online shopping' Facebook groups.",
      "Start a Black Friday countdown NOW — it's the single biggest signup window.",
    ],
  },

  // ─────────────────────────────── Aboo Tours ────────────────────────────────
  {
    campaign: "aboo-tours",
    positioning:
      "Experience Jamaica end-to-end — airport transfer, guided tours and executive black-car, all from one trusted operator.",
    northStar: "Booked trips per month (OTA + direct combined)",
    offer: "Private tours, airport transfers and executive/security transport across Jamaica.",
    market: {
      size:
        "Tourism is Jamaica's #1 industry — millions of stopover + cruise visitors a year, plus a steady diaspora-return market. Demand is largely intent-driven and concentrated on Online Travel Agencies (OTAs).",
      geography:
        "Montego Bay, Negril, Ocho Rios (+ Falmouth cruise) for leisure; Kingston for business/executive. Airport-transfer demand clusters around MBJ (Sangster) and KIN (Norman Manley).",
      demandDrivers: [
        "Stopover tourists pre-booking transfers & tours before they fly",
        "Cruise passengers booking shore excursions",
        "Business travelers & VIPs needing executive transport",
        "Diaspora visiting home and booking day-trips",
      ],
      seasonality:
        "Winter high season (Dec–Apr) is peak; spring break (Mar) and summer (Jul–Aug) secondary. Cruise calls follow ship schedules. Front-load OTA presence before high season.",
    },
    audiences: [
      {
        name: "The U.S./UK leisure tourist",
        who: "Couples & families on a Jamaica vacation, planning 2–8 weeks out.",
        pains: ["Safe, reliable transport from a stranger", "Don't want to over-plan", "Want authentic, not touristy"],
        where: "Viator/GetYourGuide/TripAdvisor, Google, Instagram inspiration.",
        message: "One operator handles your whole trip — airport to tours — so you just enjoy Jamaica.",
      },
      {
        name: "The business / executive traveler",
        who: "Professionals, delegations, VIPs needing discreet, on-time transport.",
        pains: ["Punctuality", "Professionalism & discretion", "Security"],
        where: "Google, LinkedIn, hotel concierge, referrals.",
        message: "Executive black-car and security transport. On time, professional, discreet.",
      },
      {
        name: "The cruise passenger",
        who: "Day-visitors at Ocho Rios/Falmouth wanting a private shore excursion.",
        pains: ["Must be back before the ship leaves", "Limited time", "Trust"],
        where: "Viator/cruise-excursion marketplaces, TripAdvisor.",
        message: "Private shore excursions timed to your ship — see more, stress-free.",
      },
    ],
    competitors: [
      { name: "Juta Tours", type: "Large established DMC", strength: "Scale, airport presence, contracts.", ourWedge: "Personal, end-to-end service + executive tier; responsive to direct bookers." },
      { name: "Island Routes / Chukka", type: "Premium branded excursions", strength: "Big marketing, Sandals tie-ins.", ourWedge: "Flexible private trips + lower price for the same quality; you talk to the operator." },
      { name: "OTA-listed independents", type: "Other Viator/GYG operators", strength: "Same shelf as you, review counts.", ourWedge: "Bundle (transfer+tour+exec), 5-star service push, faster response → better reviews." },
    ],
    channels: [
      {
        channel: "OTAs — Viator / GetYourGuide / TripAdvisor",
        priority: "primary",
        why: "THE demand engine for tours. Travelers search and BOOK here with intent. Viator feeds TripAdvisor automatically. This is your #1 acquisition channel — not social.",
        cadence: "Keep all listings live, priced (grossed-up for commission), with your own photos; reply to every review fast.",
        tactics: ["List every product (9-sheet kit you already have)", "Win reviews aggressively — ranking is review-led", "Optimize titles for 'Montego Bay airport transfer', 'Negril private tour'", "Keep a 100% response rate"],
      },
      {
        channel: "Google (Search + Business Profile)",
        priority: "primary",
        why: "High-intent 'Montego Bay airport transfer', 'Jamaica private tour' searches — and execs search Google, not IG.",
        cadence: "Always-on profile + reviews; search ads on transfer/exec keywords in high season.",
        tactics: ["Google Business Profile with photos + reviews", "Service pages on abootours.com", "Search ads on airport-transfer & executive keywords"],
      },
      {
        channel: "Instagram + TikTok (cinematic)",
        priority: "secondary",
        why: "Inspiration & trust, not direct booking. The cinematic island reel is brand + retarget fuel.",
        cadence: "3–4 posts/wk: the hero reel + guest moments + destination eye-candy.",
        tactics: ["Pin the cinematic fly-through reel", "Guest experience clips & testimonials", "Destination Reels (Dunn's River, Negril cliffs)", "Retarget site visitors"],
      },
      {
        channel: "Hotel / villa / concierge partnerships",
        priority: "secondary",
        why: "Concierges and villa hosts are a steady, high-trust referral pipe for transfers and tours.",
        cadence: "Outreach to 5 properties/mo; leave rate cards & QR codes.",
        tactics: ["Commission deal with villa hosts", "QR-code rate cards at front desks", "Reliable on-time service → repeat referrals"],
      },
    ],
    pillars: [
      { name: "Destination desire", share: "35%", why: "Make people want to BE in Jamaica — top-of-funnel pull.", examples: ["Cinematic fly-through reel", "Dunn's River / Negril / Blue Hole clips", "Sunset & vibes"] },
      { name: "End-to-end proof", share: "30%", why: "Show the whole journey handled — the core differentiator.", examples: ["Airport → transfer → tour → exec car carousel", "Guest day-in-the-life", "On-time pickup moments"] },
      { name: "Trust & reviews", share: "20%", why: "Tours are bought on trust + ratings; surface them everywhere.", examples: ["5-star review cards", "Guest testimonials", "Driver/guide intros"] },
      { name: "Executive & security", share: "15%", why: "Distinct high-margin B2B service needs its own visible story.", examples: ["Black-car features", "Security service explainer", "Corporate testimonials"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Be discoverable while travelers plan.", plays: ["OTA listings ranked", "Google profile", "Destination Reels"], metric: "OTA impressions / search rank" },
      { stage: "Consideration", goal: "Win the comparison on the OTA shelf.", plays: ["Reviews", "Great photos", "Fast Q&A response"], metric: "Listing views → add-to-cart" },
      { stage: "Conversion", goal: "Booked trip (OTA or direct).", plays: ["Competitive grossed-up pricing", "Bundles", "Easy direct WhatsApp/booking"], metric: "Bookings / conversion rate" },
      { stage: "Loyalty", goal: "Reviews, referrals, repeat & concierge pipeline.", plays: ["Post-trip review ask", "Concierge partnerships", "Diaspora repeat offers"], metric: "Review rate / referral bookings" },
    ],
    budget: {
      monthly: "US$400 – US$1,200 (front-loaded for Dec–Apr high season)",
      currency: "USD",
      split: [
        { label: "OTA commissions & promoted placement", pct: 40, note: "Commission is your main 'ad spend' — price for it." },
        { label: "Google Search ads (transfer/exec keywords)", pct: 25 },
        { label: "IG/TikTok content + boosts", pct: 20 },
        { label: "Pro photo/video (own photos required by OTAs)", pct: 15 },
      ],
    },
    kpis: [
      { label: "Booked trips / month", target: "30 → 80", horizon: "90 days" },
      { label: "OTA review rating", target: "≥ 4.8★ (50+ reviews)", horizon: "90 days" },
      { label: "OTA listing → booking rate", target: "≥ 4%", horizon: "60 days" },
      { label: "Direct (non-OTA) booking share", target: "≥ 25%", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Own the OTA shelf", actions: ["List all products on Viator/GetYourGuide (+TripAdvisor auto)", "Add your own photos, gross-up pricing", "Set 100% review-response habit", "Complete Google Business Profile"], outcome: "Discoverable and bookable where intent lives." },
      { window: "Days 31–60", theme: "Rank via reviews + Google", actions: ["Post-trip review ask on every booking", "Launch Google Search ads on transfer/exec", "Pin cinematic reel + run as retarget ad", "Outreach to 5 villas/hotels"], outcome: "Rising OTA rank + a direct + concierge pipeline." },
      { window: "Days 61–90", theme: "Diversify off-OTA", actions: ["Push direct-booking offers to past guests", "Build executive/security as its own funnel", "High-season inventory & pricing plan"], outcome: "Higher-margin direct + exec bookings; less OTA dependence." },
    ],
    quickWins: [
      "Make sure EVERY product is live on Viator with your own photos — it auto-lists to TripAdvisor.",
      "Reply to every single OTA review within 24h — ranking is review-driven.",
      "Pin the cinematic island reel and add a 'Book direct on WhatsApp' link in bio.",
      "Add a Google Business Profile for airport-transfer 'near me' intent.",
    ],
  },

  // ─────────────────────────── The Language Cradle ───────────────────────────
  {
    campaign: "language-cradle",
    positioning:
      "Languages taught, worlds opened — learn a language with IBLC, or let GlobalVoice speak it for you with certified translation & live interpretation.",
    northStar: "Monthly enrolments + GlobalVoice service contracts",
    offer: "Language courses (18 courses), certified translation, live interpretation (GlobalVoice), and China purchasing-agent service.",
    market: {
      size:
        "Two distinct markets under one brand: (1) B2C learners — Jamaican professionals, students and parents; (2) high-value B2B/B2G — law firms, hospitals, government, exporters and embassies needing certified translation & interpretation.",
      geography:
        "Jamaica-wide (Kingston-centric for corporate/legal/medical buyers); diaspora and online learners; exporters dealing with China/LatAm markets.",
      demandDrivers: [
        "Professionals upskilling (Spanish/French/Mandarin) for career & travel",
        "Legal/medical/government need for certified, defensible translation",
        "Exporters & businesses needing live interpretation and China sourcing",
        "Parents investing in kids' language skills",
      ],
      seasonality:
        "Course intakes spike Jan (New-Year resolution) & Aug/Sep (back-to-school). Translation/interpretation demand is steady year-round and deadline-driven.",
    },
    audiences: [
      {
        name: "The upskilling professional",
        who: "Working adults 25–45 learning Spanish/French/Mandarin for career or travel.",
        pains: ["No time for rigid classes", "Want real conversational ability", "Need credible certification"],
        where: "Instagram, Facebook, Google, LinkedIn.",
        message: "Speak it for real — flexible, certified courses built around your schedule.",
      },
      {
        name: "The corporate / legal / medical buyer",
        who: "Law firms, hospitals, agencies, embassies needing certified translation & interpreters.",
        pains: ["Accuracy is legally critical", "Need it certified & on deadline", "Confidentiality"],
        where: "LinkedIn, Google ('certified translation Jamaica'), referrals, direct.",
        message: "Certified, confidential, on-deadline. GlobalVoice handles documents and live interpretation.",
      },
      {
        name: "The exporter / business",
        who: "Companies trading with China/LatAm needing interpretation + sourcing.",
        pains: ["Language barrier kills deals", "Sourcing trust", "Live negotiation support"],
        where: "LinkedIn, JAMPRO/trade networks, referrals.",
        message: "We speak it for you — live interpretation and a China purchasing agent on your side.",
      },
      {
        name: "The parent",
        who: "Parents enrolling children in language programs.",
        pains: ["Quality & safety", "Visible progress", "Value"],
        where: "Facebook, Instagram, word of mouth.",
        message: "Give your child a second language — and a head start for life.",
      },
    ],
    competitors: [
      { name: "Freelance translators / interpreters", type: "Independent professionals", strength: "Cheap, flexible.", ourWedge: "Certified, branded, accountable; capacity + confidentiality of an institution." },
      { name: "Online apps (Duolingo etc.)", type: "Self-serve learning", strength: "Free/cheap, gamified.", ourWedge: "Real conversational fluency, certification, human teachers — outcomes apps can't give." },
      { name: "International schools (Berlitz-style)", type: "Premium chains", strength: "Brand recognition.", ourWedge: "Local trust, IBLC certification, the GlobalVoice service arm, and the China desk." },
    ],
    channels: [
      {
        channel: "LinkedIn + direct B2B outreach",
        priority: "primary",
        why: "The high-value money is corporate/legal/medical translation & interpretation — those buyers are on LinkedIn and won via direct relationships, not IG.",
        cadence: "3 posts/wk (case angles, certification, GlobalVoice) + targeted outreach to firms/agencies.",
        tactics: ["Thought-leadership on certified translation", "Outreach to law firms, hospitals, agencies, JAMPRO exporters", "Case studies (anonymized)", "GlobalVoice service one-pager"],
      },
      {
        channel: "Google (Search + Business Profile)",
        priority: "primary",
        why: "Captures urgent, high-intent 'certified translation Jamaica', 'Spanish classes Kingston' — both markets search Google.",
        cadence: "Always-on; search ads on translation + course keywords.",
        tactics: ["Rank thelanguagecradle.com for 'certified translation Jamaica'", "Google Business Profile + reviews", "Separate landing pages: courses vs GlobalVoice"],
      },
      {
        channel: "Instagram + Facebook",
        priority: "secondary",
        why: "Best for B2C course enrolment, parents and brand — emotional, visual, community-led.",
        cadence: "4 posts/wk: student wins, mini-lessons, intake countdowns.",
        tactics: ["'Word/phrase of the day' Reels", "Student testimonials & graduations", "Intake countdowns (Jan/Sep)", "Audience-split ad triads: learners / corporate / GlobalVoice"],
      },
      {
        channel: "Partnerships & referrals",
        priority: "secondary",
        why: "Institutions refer institutions; teachers and alumni are credible recruiters.",
        cadence: "Ongoing; quarterly partner check-ins.",
        tactics: ["Partner with embassies, JAMPRO, professional bodies", "Alumni referral incentive", "Corporate training packages"],
      },
    ],
    pillars: [
      { name: "Learn (course value)", share: "35%", why: "Drive B2C enrolment with tangible progress.", examples: ["Mini-lesson Reels", "Student wins", "Intake countdowns"] },
      { name: "GlobalVoice (the service)", share: "30%", why: "Separate, higher-margin B2B story — 'we speak it for you'.", examples: ["Certified translation explainer", "Interpretation use-cases", "China-desk service"] },
      { name: "Credibility & certification", share: "20%", why: "Trust is the deciding factor for both markets.", examples: ["IBLC certification", "Team/teacher intros", "Anonymized case studies"] },
      { name: "Culture & language love", share: "15%", why: "Brand warmth + shareability.", examples: ["Language/culture facts", "Multilingual moments", "Travel tie-ins"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Both markets know the two offers exist.", plays: ["LinkedIn + IG reach", "Google presence", "Mini-lessons"], metric: "Reach / impressions" },
      { stage: "Consideration", goal: "Trust the certification & outcomes.", plays: ["Case studies", "Testimonials", "Service one-pager"], metric: "Site visits / inquiry forms" },
      { stage: "Conversion", goal: "Enrolment or signed service contract.", plays: ["Intake CTA", "Direct B2B proposals", "Landing pages"], metric: "Enrolments / contracts" },
      { stage: "Loyalty", goal: "Re-enrolment, retainers, referrals.", plays: ["Next-level courses", "Corporate retainers", "Alumni referrals"], metric: "Repeat + referral revenue" },
    ],
    budget: {
      monthly: "J$70,000 – J$160,000",
      currency: "JMD",
      split: [
        { label: "Google Search ads (translation + courses)", pct: 30 },
        { label: "LinkedIn / B2B outreach & content", pct: 25 },
        { label: "IG/FB course-enrolment ads", pct: 25 },
        { label: "Content production", pct: 10 },
        { label: "Partnerships & referral incentives", pct: 10 },
      ],
    },
    kpis: [
      { label: "Course enrolments / month", target: "25 → 60", horizon: "90 days" },
      { label: "GlobalVoice contracts / month", target: "4 → 12", horizon: "90 days" },
      { label: "Qualified B2B leads / month", target: "20+", horizon: "60 days" },
      { label: "Inquiry → enrolment rate", target: "≥ 30%", horizon: "60 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Split the two stories", actions: ["Separate landing pages: Courses vs GlobalVoice", "Launch LinkedIn B2B content + outreach list", "Google Business Profile + 'certified translation' SEO", "Run audience-split ad triads"], outcome: "Each market sees the right offer; B2B pipeline starts." },
      { window: "Days 31–60", theme: "Pipeline + proof", actions: ["Direct proposals to 20 firms/agencies", "Publish 2 anonymized case studies", "Intake countdown campaign", "Alumni referral incentive"], outcome: "Signed service contracts + a full intake." },
      { window: "Days 61–90", theme: "Retainers & scale", actions: ["Pitch corporate training packages", "Build interpreter on-call roster story", "Push China-desk service to exporters"], outcome: "Recurring B2B retainers + diversified revenue." },
    ],
    quickWins: [
      "Split your link-in-bio: one path for 'Learn a language', one for 'Need a translator/interpreter'.",
      "Post one GlobalVoice service explainer on LinkedIn and tag relevant local firms.",
      "Claim/optimize Google Business Profile for 'certified translation Jamaica'.",
      "DM 10 law firms or agencies a one-line GlobalVoice intro this week.",
    ],
  },

  // ─────────────────────── 876 Luxury Car Wash & Detailing ────────────────────
  {
    campaign: "876-car-wash",
    positioning:
      "Showroom shine, 876 style — Jamaica's premium hand wash & detailing, with a monthly Wash Club that turns a clean car into a habit.",
    northStar: "Active Wash Club members (recurring monthly revenue)",
    offer: "Premium hand wash & full detailing + the J$9,000/mo Wash Club + birthday/VIP punch cards.",
    market: {
      size:
        "Local, location-based and discretionary. Car-proud professionals and businesses pay a premium for detailing. The real prize is recurring revenue via membership, not one-off washes.",
      geography:
        "Single-location catchment (drive-time radius) + mobile/fleet potential. Hyper-local — your map pin and reviews matter more than national reach.",
      demandDrivers: [
        "Pride in a clean car among professionals",
        "Time-poor owners who'd rather pay than wash",
        "Dealers & fleets needing reliable detailing",
        "Resale prep (detailing before selling)",
      ],
      seasonality:
        "Steady year-round; bumps before holidays/events (Christmas, weddings, car shows) and after heavy rains. Promote membership as the smooth-out for slow weeks.",
    },
    audiences: [
      {
        name: "The car-proud professional",
        who: "25–50 with a car they love, disposable income, image-conscious.",
        pains: ["No time to wash properly", "Local washes scratch/skimp", "Want it to look NEW"],
        where: "Instagram, TikTok, Google ('car detailing near me').",
        message: "Showroom shine without lifting a finger. Hand wash + detail done right.",
      },
      {
        name: "The Wash Club prospect",
        who: "Regulars who'd happily pay monthly for convenience + savings.",
        pains: ["Hate the per-wash decision", "Want a routine", "Love a deal"],
        where: "Instagram, WhatsApp, in-person.",
        message: "A wash a week for the price of three. Join the Wash Club — never drive dirty again.",
      },
      {
        name: "The dealer / fleet",
        who: "Car dealers and businesses needing volume detailing.",
        pains: ["Need cars sale-ready fast", "Consistent quality", "Reliable scheduling"],
        where: "Referrals, Google, direct, WhatsApp.",
        message: "Sale-ready detailing on schedule. Volume rates for dealers & fleets.",
      },
    ],
    competitors: [
      { name: "Gas-station / corner washes", type: "Cheap, fast washes", strength: "Convenience, low price.", ourWedge: "Premium hand wash + true detailing — quality they can't match; show the before/after." },
      { name: "Mobile detailers", type: "Come-to-you independents", strength: "Convenience.", ourWedge: "Consistent location quality, membership, and a brand with reviews + loyalty." },
      { name: "Other detail shops", type: "Direct premium competitors", strength: "Similar service.", ourWedge: "The Wash Club recurring model + punch-card loyalty + stronger content/reviews." },
    ],
    channels: [
      {
        channel: "Instagram (Reels) + TikTok",
        priority: "primary",
        why: "Detailing is the most visual service there is — before/after and 'satisfying clean' content is built to go viral and is your #1 reach driver.",
        cadence: "5 Reels/wk: before/after, satisfying detail close-ups, transformations.",
        tactics: ["Before/after split Reels", "ASMR/satisfying detailing clips", "'Worst car we've cleaned' hooks", "Wash Club math explainer", "Customer reaction reveals"],
      },
      {
        channel: "Google Business Profile + local SEO",
        priority: "primary",
        why: "Location-based business → 'car detailing near me' + reviews decide who gets called. This is non-negotiable for local.",
        cadence: "Weekly photo post; reply to every review; keep hours/photos current.",
        tactics: ["Fully optimized GBP with before/after photos", "Ask every customer for a review", "Local keywords on any landing page", "Map pin accuracy"],
      },
      {
        channel: "WhatsApp Business",
        priority: "primary",
        why: "Booking, membership signup and reminders live here.",
        cadence: "Always-on; reminder broadcasts to members + punch-card holders.",
        tactics: ["Booking via WhatsApp", "Wash Club signup flow", "Punch-card + birthday reminders", "Slot availability posts"],
      },
      {
        channel: "Dealer / fleet partnerships",
        priority: "secondary",
        why: "Volume B2B smooths revenue between consumer peaks.",
        cadence: "Outreach to 3–5 dealers/mo.",
        tactics: ["Volume rate card for dealers", "Consistent turnaround promise", "On-site detailing option"],
      },
      {
        channel: "Levar Shipping cross-promo",
        priority: "test",
        why: "Same owner → a planted sister-brand reveal taps an existing audience for cheap reach.",
        cadence: "Occasional reveal posts + shared highlight cover.",
        tactics: ["Subtle 'you might also know…' reveal", "Shared audience shout-outs", "Bundle/loyalty crossover"],
      },
    ],
    pillars: [
      { name: "Before / after transformation", share: "45%", why: "The single most shareable, conversion-driving content for detailing.", examples: ["Split before/after Reels", "Time-lapse details", "Reaction reveals"] },
      { name: "Satisfying process", share: "25%", why: "'Oddly satisfying' clips earn huge organic reach.", examples: ["ASMR foam/clean", "Close-up detail work", "Tools & technique"] },
      { name: "Wash Club & loyalty", share: "20%", why: "Convert viewers into recurring members — the north star.", examples: ["Wash Club math", "Member perks", "Punch-card progress"] },
      { name: "Trust & local", share: "10%", why: "Reviews + community cement the local default.", examples: ["Customer reviews", "Team", "876 pride / Levar reveal"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Reach local car owners with wow content.", plays: ["Before/after Reels", "TikTok satisfying clips"], metric: "Reach / shares / saves" },
      { stage: "Consideration", goal: "Become the obvious quality choice nearby.", plays: ["Google reviews", "GBP photos", "Testimonials"], metric: "Profile views → WhatsApp/calls" },
      { stage: "Conversion", goal: "First booking.", plays: ["WhatsApp booking", "First-visit offer", "Easy slots"], metric: "First-time bookings" },
      { stage: "Loyalty", goal: "Wash Club + punch-card retention.", plays: ["Wash Club signup", "Punch card", "Birthday/VIP perks"], metric: "Active members / repeat rate" },
    ],
    budget: {
      monthly: "J$30,000 – J$70,000",
      currency: "JMD",
      split: [
        { label: "IG/TikTok boosts (best before/afters)", pct: 45 },
        { label: "Content production (good camera/lighting)", pct: 20 },
        { label: "Local SEO / Google Business", pct: 15 },
        { label: "Wash Club launch incentives", pct: 12 },
        { label: "Dealer/fleet outreach", pct: 8 },
      ],
    },
    kpis: [
      { label: "Active Wash Club members", target: "15 → 60", horizon: "90 days" },
      { label: "Monthly recurring revenue (club)", target: "J$135k → J$540k", horizon: "90 days" },
      { label: "First-time bookings / month", target: "40+", horizon: "60 days" },
      { label: "Google reviews (4.7★+)", target: "40+", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Become a content machine", actions: ["Film every job (before/after + satisfying)", "Post 5 Reels/wk", "Optimize Google Business Profile + start review asks", "Set WhatsApp booking + Wash Club signup flow"], outcome: "A steady viral-leaning feed + searchable local presence." },
      { window: "Days 31–60", theme: "Launch the Wash Club hard", actions: ["Wash Club launch campaign + math content", "First-visit → club upsell", "Boost top 2 before/after Reels", "Reach 25+ Google reviews"], outcome: "First wave of recurring members." },
      { window: "Days 61–90", theme: "Recurring + B2B", actions: ["Dealer/fleet outreach with rate card", "Punch-card + birthday retention pushes", "Test Levar Shipping cross-promo"], outcome: "Stable MRR + a B2B revenue lane." },
    ],
    quickWins: [
      "Film EVERY car before & after — that's your entire content engine, for free.",
      "Post one 'Wash Club: a wash a week for the price of three' explainer this week.",
      "Optimize Google Business Profile with before/after photos and ask 10 customers for reviews.",
      "Add a WhatsApp 'Book / Join the Wash Club' button to your IG bio.",
    ],
  },

  // ───────────────────────────── Supreme Suite (SaaS) ─────────────────────────
  {
    campaign: "supreme-suite",
    positioning:
      "The white-label SaaS arm of J Supreme Tech — 13 ready-made business systems (CRM + branded website + AI staff) that any courier, mover, salon, school or restaurant can launch under their OWN brand in minutes, free for 3 days.",
    northStar: "Activated trials per week (workspace created AND ≥3 actions taken) → paid conversions",
    offer:
      "3-day free trial on every system, no card. Then Starter from US$29–89/mo by vertical · Pro ≈2.2× (adds AI chatbot + voice agent + loyalty) · Scale ≈4× (custom domain, migration done-for-you). Custom CRM builds quoted via J Supreme Tech. JMD billing available locally.",
    market: {
      size:
        "Every appointment- or job-based SMB that runs on WhatsApp + a notebook: thousands of couriers, movers, salons/nail techs, tour operators, private academies and restaurants in Jamaica alone — and the same shape of business across the Caribbean & diaspora. Global vertical-SaaS players (Jobber, Vagaro, Fresha, ServiceTitan) prove the spend exists; nobody serves the JA/Caribbean operator in their context, currency and channels.",
      geography:
        "Launch: Jamaica (Kingston→islandwide). Phase 2: wider Caribbean + diaspora founders in US/UK/CA paying USD.",
      demandDrivers: [
        "Missed-money pain: unanswered calls, forgotten bookings, no-shows, COD chaos",
        "Customers now expect online booking + card payment even from one-person shops",
        "AI receptionist novelty — 24/7 answering is a visible, demo-able wow",
        "Owning a branded app/website = status + trust ('big company energy') for small operators",
        "3-day trial + no card removes every excuse to try",
      ],
      seasonality:
        "Year-round; spikes at New Year (fresh-start systems), Sep back-to-school (academies), Oct–Dec (couriers/restaurants gearing for Christmas trade). Trials are impulse-friendly — market continuously.",
    },
    audiences: [
      {
        name: "The WhatsApp-run operator",
        who: "Courier, mover, nail tech or tour guide doing real volume from a phone — bookings in voice notes, money tracked in a notebook.",
        pains: ["Double-bookings and forgotten jobs", "Looks small next to branded competitors", "No idea which week actually made money"],
        where: "Instagram Reels, WhatsApp statuses, TikTok.",
        message: "Your business, running like a machine — by tonight. Upload your logo, it feels like yours because it is. Free for 3 days.",
      },
      {
        name: "The growth-stage owner (2–10 staff)",
        who: "Salon with 4 chairs, courier with 3 riders, academy with 80 students — systems are now the bottleneck.",
        pains: ["Staff coordination chaos", "No-shows eating revenue", "Reports = guesswork at month end"],
        where: "Instagram, Google search, Facebook groups, referrals from accountants.",
        message: "A dispatch desk, deposit-first booking and live dashboards — pre-built for your exact trade, branded as you.",
      },
      {
        name: "The agency / reseller",
        who: "Marketers, web designers and consultants who keep getting asked for 'a system' and have nothing to sell.",
        pains: ["Clients ask for CRMs they can't build", "One-off projects, no recurring revenue"],
        where: "LinkedIn, X, design/dev communities.",
        message: "White-label Supreme Suite under your agency, earn recurring on every client — we build, you brand.",
      },
    ],
    competitors: [
      { name: "Global vertical SaaS (Jobber, Vagaro, Fresha, Booksy)", type: "Mature per-vertical platforms", strength: "Deep features, app stores, brand trust.", ourWedge: "They sell USD-priced generic software with zero JA context. We arrive branded as THE CLIENT's business, in their currency and WhatsApp-first reality, with a human (J Supreme) behind it — plus verticals they ignore (islandwide couriers, barrel-shipping, CSEC academies)." },
      { name: "Spreadsheets + WhatsApp", type: "The real incumbent", strength: "Free, familiar, zero learning curve.", ourWedge: "The 3-day trial IS the wedge — demo data preloaded, AI assistant answering live; the upgrade is felt in 10 minutes, not promised." },
      { name: "Local custom-dev shops", type: "Bespoke builders", strength: "Fully custom, local presence.", ourWedge: "They quote J$500k and 3 months; we hand over a branded, working system today — and J Supreme Tech still sells full custom on top for those who outgrow it." },
    ],
    channels: [
      { channel: "Instagram (Reels + Stories)", priority: "primary", why: "Our buyers ARE the IG hustle economy — and the product demos visually: logo upload → whole app re-skins is a natural 15-second reel.", cadence: "4 reels + daily stories/wk", tactics: ["'Make it feel like mine' transformation reels (logo → branded app)", "Vertical-a-week spotlight (salon week, courier week…)", "AI voice agent answering a real call on camera", "Trial-countdown stories with the /start link"] },
      { channel: "WhatsApp (status + direct)", priority: "primary", why: "Zero-friction for this market; the trial link travels person-to-person and closes 1-on-1.", cadence: "Status 3×/wk + same-day reply SLA", tactics: ["Status: 20-sec screen recordings per system", "Broadcast list for trial-day-2 check-ins", "Voice-note walkthroughs (speak their language, literally)"] },
      { channel: "Live demos via the platform itself", priority: "primary", why: "demo-* workspaces are instant, seeded and shareable — the product is its own landing page; /status builds 'it actually works' trust.", cadence: "Every post links a live demo", tactics: ["Send prospects straight to /app/demo-salon (no signup)", "QR codes on flyers → live demo of THEIR vertical", "Screen-share the /status self-check in sales calls as the trust close"] },
      { channel: "TikTok", priority: "secondary", why: "The 'small business glow-up' format performs; diaspora reach is free distribution.", cadence: "3 reposted reels/wk", tactics: ["Before/after: notebook → branded dashboard", "POV: your nail tech sends a real booking link", "Duet bait: 'rate my client's new system'"] },
      { channel: "Direct field sales (Kingston)", priority: "secondary", why: "High-trust market; one plaza visit can land 5 trials in an afternoon.", cadence: "1 field day/wk", tactics: ["Walk salons/courier desks with an iPad demo of THEIR vertical pre-branded with their IG logo", "Leave the QR flyer; follow up on WhatsApp same evening"] },
      { channel: "Google Business + SEO", priority: "test", why: "'booking system for salon Jamaica' style queries are low-volume but pure intent.", cadence: "1 landing/“vs” article per vertical/mo", tactics: ["Per-system landing pages already exist — index them", "'Supreme Suite vs pen-and-paper' cost-of-chaos calculator post"] },
    ],
    pillars: [
      { name: "Transformation (make it feel like mine)", share: "35%", why: "The logo-upload re-skin is the signature demo — emotional ownership sells.", examples: ["15-sec reel: WhatsApp chaos → branded pipeline", "Client logo dropped in live on camera", "Installed desktop app with THEIR icon"] },
      { name: "Vertical spotlights", share: "25%", why: "Each trade needs to see ITSELF — salon content recruits salons, courier content recruits couriers.", examples: ["'Built for nail techs' deposit-first walkthrough", "Courier COD reconciliation in 30 seconds", "School term: applications → tuition → report cards"] },
      { name: "AI staff at work", share: "20%", why: "The chatbot booking a client at 1 a.m. and the voice agent answering aloud are shareable wow-moments no local competitor can match.", examples: ["Voice agent answers a live call on camera", "Chat slot-fill captures a booking → inbox ping", "'It booked 4 appointments while I slept' testimonial"] },
      { name: "Proof & receipts", share: "20%", why: "Skeptical market — show, don't claim: live /status checks, real dashboards, trial-to-paid stories.", examples: ["Running the public self-check on camera (40/40 green)", "Week-1 dashboard of a real trial business", "Founder story: why we built it for JA operators"] },
    ],
    funnel: [
      { stage: "Awareness", goal: "Operators see their OWN trade running branded", plays: ["Vertical reels + TikTok glow-ups", "WhatsApp status demos", "Field-day plaza demos"], metric: "Reel views + profile taps" },
      { stage: "Consideration", goal: "They touch a live demo", plays: ["demo-* workspace links everywhere", "AI agent live test on their phone", "/status trust close"], metric: "Demo workspace opens" },
      { stage: "Conversion", goal: "Trial started + activated, then paid", plays: ["/start in bio + QR", "Day-2 WhatsApp check-in with a tip", "Expiry-day 'your data is waiting' nudge"], metric: "Trials → paid %" },
      { stage: "Loyalty", goal: "Tenants renew, upgrade, refer", plays: ["Add-on upsells (AI voice, loyalty, dashboards)", "Reseller program for agencies", "'Powered by Supreme Suite' footer = built-in referral loop"], metric: "MRR retention + referrals" },
    ],
    budget: {
      monthly: "J$60,000 (~US$380)",
      currency: "JMD",
      split: [
        { label: "IG/TikTok boosted reels (vertical-targeted)", pct: 45, note: "Boost only reels that already perform organically" },
        { label: "Field days + printed QR flyers", pct: 20 },
        { label: "WhatsApp Business tools + numbers", pct: 10 },
        { label: "Creator collabs (1 micro-influencer/mo per vertical)", pct: 15 },
        { label: "Reserve / experiments", pct: 10 },
      ],
    },
    kpis: [
      { label: "Trials started", target: "40/mo by day 60", horizon: "60 days" },
      { label: "Trial activation (≥3 actions)", target: "60% of trials", horizon: "rolling" },
      { label: "Trial → paid conversion", target: "20% by day 90", horizon: "90 days" },
      { label: "Paying workspaces (MRR base)", target: "25 by day 90 (~US$1.2k+ MRR)", horizon: "90 days" },
      { label: "Demo workspace opens", target: "300/mo", horizon: "rolling" },
      { label: "Reseller partners signed", target: "3 agencies", horizon: "90 days" },
    ],
    roadmap: [
      { window: "Days 0–30", theme: "Launch loud, prove it works", actions: ["Publish the 10-post launch grid + stories from this campaign", "Reel: logo-upload transformation for 3 verticals", "20 hand-picked operators get white-glove trial onboarding on WhatsApp", "Run the /status self-check publicly in a story"], outcome: "First 30 trials, 5 paying, social proof bank started." },
      { window: "Days 31–60", theme: "Vertical-a-week engine", actions: ["Weekly vertical spotlight (salon → courier → academy → restaurant)", "Boost the best-performing reel per vertical", "First field day per parish hub (Kingston, Portmore, MoBay)", "Launch day-2/day-3 trial nurture sequence"], outcome: "40 trials/mo run-rate; conversion playbook measured per vertical." },
      { window: "Days 61–90", theme: "Recurring + leverage", actions: ["Agency reseller pitch deck + 3 partner signings", "Add-on upsell push (AI voice + loyalty) to actives", "Case-study reels from real tenants (their brand, their numbers)", "Decide vertical #14 from demo-open data"], outcome: "US$1.2k+ MRR, repeatable per-vertical CAC, reseller channel live." },
    ],
    quickWins: [
      "Put /start and one demo link (app/demo-salon) in every bio TODAY.",
      "Record the 15-sec 'logo in → whole app re-skins' reel — it's the brand in one clip.",
      "WhatsApp 10 operators you already know a personalized demo link tonight.",
      "Run the public /status check on camera — 'every page, checked live' is a post nobody else can make.",
    ],
  },
];

export function getBrandPlan(slug: string): BrandPlan | undefined {
  return BRAND_PLANS.find((p) => p.campaign === slug);
}
