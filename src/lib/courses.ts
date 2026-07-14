export type Level = 'Beginner' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'Marketing' | 'Technology' | 'Trading' | 'Business' | 'Design' | 'Mindset' | 'Creative' | 'Cross Cultures' | 'Need to Know'

export interface Section {
  title: string
  content: string
  keyPoints?: string[]
}

export interface Course {
  id: string
  track: Track
  title: string
  subtitle: string
  duration: string
  level: Level
  xp: number
  sections: Section[]
}

export const COURSES: Course[] = [
  // ── MARKETING ──────────────────────────────────────────────────────────
  {
    id: 'marketing-1',
    track: 'Marketing',
    title: 'Paid media attribution: knowing what actually works',
    subtitle: 'Multi-touch models, UTM architecture & Meta Ads audit',
    duration: '15 m',
    level: 'PhD',
    xp: 180,
    sections: [
      {
        title: 'Why attribution is broken by default',
        content: 'Most ad platforms claim 100% of conversions. Meta says it drove the sale. Google says it drove the sale. Your email tool says it drove the sale. They\'re all lying — not maliciously, but by design. Each platform uses last-click within its own window and ignores every touchpoint that happened outside its walls. You need a model that\'s platform-agnostic.',
        keyPoints: [
          'Last-click attribution ignores the journey',
          'Platform-native attribution is always self-serving',
          'The truth lives in your own data warehouse',
        ],
      },
      {
        title: 'Multi-touch attribution models explained',
        content: 'Linear attribution splits credit equally across all touchpoints. Time-decay gives more credit to touchpoints closer to conversion. Position-based (U-shaped) gives 40% to first touch, 40% to last touch, and 20% to everything in between. Data-driven attribution (only available with sufficient volume) uses ML to assign weights based on actual conversion probability. For most businesses, position-based is the most practical starting point.',
        keyPoints: [
          'Linear: equal credit, great for awareness measurement',
          'Time-decay: favors conversion-proximate channels',
          'Position-based: best balance for most businesses',
          'Data-driven: requires 800+ conversions/month',
        ],
      },
      {
        title: 'UTM architecture that actually tells you something',
        content: 'UTM parameters are your source of truth. The standard structure: utm_source (the platform), utm_medium (the channel type), utm_campaign (campaign name), utm_content (creative variant), utm_term (keyword or audience). The most common mistake: inconsistent naming. "meta" vs "facebook" vs "fb" in utm_source gives you three different line items for the same channel. Build a UTM naming convention doc and enforce it religiously.',
        keyPoints: [
          'utm_source: facebook, google, email, tiktok',
          'utm_medium: cpc, social, email, organic',
          'utm_campaign: match your campaign naming in-platform',
          'Consistency > perfection — pick conventions and stick to them',
        ],
      },
      {
        title: 'The Meta Ads audit framework',
        content: 'Start with account structure: are campaigns organized by objective or by audience? Neither is wrong, but mixing both creates confusion. Check your attribution window — Meta defaults to 7-day click, 1-day view. That view-through attribution inflates numbers significantly. For e-commerce, 7-day click only is more honest. Look at frequency: anything above 3.5 on a cold audience is burning budget. Finally, check your cost caps vs bid caps — cost caps stabilize CPAs at scale, bid caps control auction prices but can starve delivery.',
        keyPoints: [
          'Set attribution window to 7-day click only for honest data',
          'Frequency > 3.5 on cold audiences = ad fatigue',
          'Cost caps > bid caps for most scaling scenarios',
          'Audit creative: winning ads should get 80% of budget',
        ],
      },
    ],
  },
  {
    id: 'marketing-2',
    track: 'Marketing',
    title: 'Content strategy: building a content machine without burning out',
    subtitle: 'Content pillars, repurposing frameworks & sustainable posting cadence',
    duration: '13 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'The three-pillar content framework',
        content: 'Every sustainable content strategy rests on three types of content: educational (teaches your audience something valuable), entertaining (builds connection and emotional resonance), and promotional (drives action). The ratio that works: 70% educational, 20% entertaining, 10% promotional. Most brands get this backwards, posting 70% promotional and wondering why engagement tanks.',
        keyPoints: [
          '70/20/10: educational / entertaining / promotional',
          'Educational content builds long-term trust',
          'Promotional content only works on a warm audience',
        ],
      },
      {
        title: 'The repurposing pyramid',
        content: 'Create once, distribute everywhere. Start with a long-form anchor piece — a blog post, podcast episode, or YouTube video. From that anchor, extract 3-5 key insights for LinkedIn/Twitter posts. Pull quotes for Instagram carousels. Create a short-form video summary for Reels/TikTok. Write an email newsletter expanding on the best section. One piece of content becomes 10+ distribution touchpoints.',
        keyPoints: [
          'Anchor content: long-form, 1x/week',
          'Mid-form: LinkedIn posts, email — 3x/week',
          'Short-form: Reels, Stories — 5x/week',
          'Each layer feeds the next',
        ],
      },
    ],
  },
  {
    id: 'marketing-3',
    track: 'Marketing',
    title: 'Email sequences that convert: the 7-touch framework',
    subtitle: 'Welcome flows, nurture sequences, re-engagement & the science of timing',
    duration: '14 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The psychology of email timing',
        content: 'The first 48 hours after someone subscribes are the highest-engagement window you will ever have with them. Open rates on welcome emails average 50-60% — 4x the average campaign. Most brands waste this window with a generic "Welcome to our newsletter" email. Instead, use it to deliver immediate value, establish your voice, set expectations for future emails, and ask a question that starts a conversation.',
        keyPoints: [
          'Email 1 (0h): Welcome + immediate value delivery',
          'Email 2 (24h): Story that builds connection',
          'Email 3 (48h): Your best resource or tip',
          'Email 4 (72h): Social proof + soft CTA',
        ],
      },
    ],
  },
  {
    id: 'marketing-4',
    track: 'Marketing',
    title: 'Social proof architecture: building trust at scale',
    subtitle: 'Testimonial systems, case study frameworks & the hierarchy of credibility signals',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The credibility hierarchy',
        content: 'Not all social proof is equal. At the bottom: vanity metrics (follower counts, "100+ clients"). In the middle: testimonials and reviews. At the top: case studies with specific results, media mentions, and peer endorsements from recognized names. Most brands invest heavily in the bottom tier and wonder why conversion rates stay flat. The higher you go on the hierarchy, the more specific and verifiable the proof must be.',
        keyPoints: [
          'Tier 1 (weakest): Follower counts, client counts',
          'Tier 2: Star ratings, generic testimonials',
          'Tier 3: Specific result testimonials ("we grew 43%")',
          'Tier 4 (strongest): Video case studies, media coverage, peer endorsements',
        ],
      },
    ],
  },
  {
    id: 'marketing-5',
    track: 'Marketing',
    title: 'PR closure: getting a yes from media, press & partners',
    subtitle: 'Pitching journalists, closing brand deals & following up without burning relationships',
    duration: '13 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'What journalists actually want',
        content: 'Journalists are not your marketing channel. They are storytellers serving an audience. Your pitch succeeds when your story serves their audience, not when it promotes your brand. The formula: tie your story to a news hook (trending topic, season, cultural moment), lead with the reader benefit (not your company name), offer exclusive data or access that makes their story better, and make it effortless — provide the headline, the quotes, the images.',
        keyPoints: [
          'News hook first, company name last',
          'Lead with what their readers gain',
          'Exclusive data = significantly higher pickup rate',
          'Pre-write the story for them',
        ],
      },
    ],
  },
  // ── TECHNOLOGY ─────────────────────────────────────────────────────────
  {
    id: 'tech-1',
    track: 'Technology',
    title: 'AI agent architecture: patterns that actually ship',
    subtitle: 'Tool calling, memory layers, orchestration loops from first principles',
    duration: '14 m',
    level: 'Next-Gen AI',
    xp: 200,
    sections: [
      {
        title: 'The anatomy of an AI agent',
        content: 'An agent is just an LLM in a loop with access to tools. The loop: the model receives a task, decides whether to call a tool or respond directly, executes the tool if needed, observes the result, and repeats until the task is done. What makes it powerful: the model can plan, execute, adapt, and recover from errors — all without human intervention. What makes it fragile: context window limits, tool failures, and the model losing track of the original goal.',
        keyPoints: [
          'Agent = LLM + tools + loop',
          'The loop runs until the model decides it\'s done',
          'Tool results go back into context',
          'Failure modes: context overflow, tool errors, goal drift',
        ],
      },
      {
        title: 'Memory architecture: the four layers',
        content: 'In-context memory: what\'s currently in the prompt window. External memory: a vector database the agent can retrieve from. Episodic memory: logs of past conversations and actions. Procedural memory: the system prompt containing instructions and personality. Most production agents use all four. The critical design decision: what goes in context vs. what gets retrieved — too much in context = expensive and slow, too little = the agent loses coherence.',
        keyPoints: [
          'In-context: immediate task state',
          'External (vector DB): long-term knowledge retrieval',
          'Episodic: conversation history',
          'Procedural: system prompt / instructions',
        ],
      },
    ],
  },
  {
    id: 'tech-2',
    track: 'Technology',
    title: 'Database design: the schema decisions that haunt you later',
    subtitle: 'Normalization, indexing strategy & schema evolution patterns',
    duration: '13 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'When to normalize and when not to',
        content: 'Third normal form (3NF) eliminates redundancy and protects data integrity. It\'s the right choice for transactional systems where data accuracy is critical. But read-heavy applications often benefit from denormalization — duplicating data to avoid joins. The modern answer: normalize your source of truth (OLTP), denormalize your read layer (OLAP or materialized views). Don\'t try to serve both workloads with the same schema.',
        keyPoints: [
          '3NF for writes: eliminates update anomalies',
          'Denormalize for reads: faster queries, simpler logic',
          'Materialized views: the middle ground',
          'OLTP vs OLAP: different schemas, different purposes',
        ],
      },
    ],
  },
  {
    id: 'tech-3',
    track: 'Technology',
    title: 'Next.js App Router: the patterns that matter in production',
    subtitle: 'Server components, data fetching, caching & the async cookies upgrade',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'Server components: the mental model',
        content: 'Server components run on the server and never hydrate on the client. They can be async, access databases directly, read environment variables, and import large dependencies without affecting bundle size. Client components are marked with "use client" and run on both server (for SSR) and client (for interactivity). The default in App Router is server — you opt into client. This is the opposite of Pages Router thinking.',
        keyPoints: [
          'Default = server component (no JS in browser)',
          '"use client" opts into client-side hydration',
          'Server components can\'t use hooks or browser APIs',
          'Client components can\'t be async at the top level',
        ],
      },
    ],
  },
  {
    id: 'tech-4',
    track: 'Technology',
    title: 'Supabase RLS: securing your data like a senior engineer',
    subtitle: 'Row Level Security policies, auth.uid() patterns & the common holes that expose production data',
    duration: '15 m',
    level: 'PhD',
    xp: 180,
    sections: [
      {
        title: 'How RLS actually works',
        content: 'Row Level Security is a PostgreSQL feature that filters rows before they reach your application. When RLS is enabled on a table, every query automatically gets a WHERE clause appended based on your policies. The key function is auth.uid() — Supabase injects the authenticated user\'s ID into the PostgreSQL session so your policies can reference it. Without RLS enabled, anyone with your anon key can read all rows in all tables.',
        keyPoints: [
          'RLS adds automatic WHERE clauses to every query',
          'auth.uid() returns the logged-in user\'s ID',
          'Policies are AND-ed together — all must pass',
          'Service role key bypasses RLS — never expose it client-side',
        ],
      },
    ],
  },
  {
    id: 'tech-5',
    track: 'Technology',
    title: 'Webhooks & event-driven architecture: building reactive systems',
    subtitle: 'Webhook security, idempotency, retry logic & the event patterns behind scalable automations',
    duration: '15 m',
    level: 'PhD',
    xp: 180,
    sections: [
      {
        title: 'The webhook reliability problem',
        content: 'Webhooks are push notifications from external services. They\'re simple in concept and surprisingly tricky in practice. The core problems: (1) delivery is not guaranteed — the sender will retry, so your handler must be idempotent; (2) order is not guaranteed — events can arrive out of sequence; (3) verification is critical — anyone can POST to your webhook endpoint, so you must verify the signature. Stripe\'s webhook model is the gold standard — study it.',
        keyPoints: [
          'Idempotency: processing the same event twice must produce the same result',
          'Return 200 immediately, process async — avoid timeouts',
          'Verify HMAC signatures before processing anything',
          'Store event IDs to deduplicate retries',
        ],
      },
    ],
  },
  // ── TRADING ────────────────────────────────────────────────────────────
  {
    id: 'trading-1',
    track: 'Trading',
    title: 'SMC order blocks: entry precision on volatility indices',
    subtitle: 'BOS confirmation, OB validation & position sizing under V75',
    duration: '12 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'What makes a valid order block',
        content: 'An order block is the last candle before a significant move. On V75 (Volatility 75 Index), which moves 24/7 with no gaps, order blocks are cleaner than on forex or equity markets — there\'s no overnight noise to pollute the structure. A bullish OB is the last bearish candle before a strong upward move that creates a Break of Structure (BOS). A bearish OB is the last bullish candle before a strong downward move. The key validation: the OB must have caused a BOS on the same timeframe.',
        keyPoints: [
          'OB = last opposing candle before a BOS',
          'V75 has no gaps — cleaner structure than forex',
          'Validate on the same timeframe as your entry',
          'If the OB has been retested and held once, it\'s stronger',
        ],
      },
    ],
  },
  {
    id: 'trading-2',
    track: 'Trading',
    title: 'Risk management: the only strategy that keeps you in the game',
    subtitle: 'Kelly Criterion, drawdown math & the psychology of losses',
    duration: '13 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The math of ruin',
        content: 'Ruin is not losing all your money — ruin is drawdown so severe that psychological recovery becomes impossible. Most traders blow up not because their edge is negative but because their position sizing is wrong. The Kelly Criterion gives the mathematically optimal bet size: f = (bp - q) / b, where b is the odds received, p is the probability of winning, and q is the probability of losing. Most professional traders use half-Kelly to account for edge uncertainty.',
        keyPoints: [
          'Kelly formula: f* = (bp - q) / b',
          'Half-Kelly is the practical standard',
          'A 50% drawdown requires a 100% return to recover',
          'Max drawdown tolerance determines max position size',
        ],
      },
    ],
  },
  {
    id: 'trading-3',
    track: 'Trading',
    title: 'Fair value gaps: entering on imbalance, not impulse',
    subtitle: 'FVG identification, confluence stacking & filtering low-quality gaps on V75',
    duration: '12 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'FVG mechanics on V75',
        content: 'A Fair Value Gap is a three-candle pattern where the wicks of the first and third candle don\'t overlap, leaving a "gap" in price that the market will often return to fill. On V75, FVGs form frequently due to the instrument\'s synthetic nature — it\'s designed to have consistent volatility. The highest-probability FVGs are those that form in the direction of the higher-timeframe trend, on a significant liquidity sweep.',
        keyPoints: [
          'FVG = gap between candle 1 wick and candle 3 wick',
          'Price tends to return to fill imbalances',
          'V75 FVGs are frequent — filter aggressively',
          'Only trade FVGs aligned with HTF bias',
        ],
      },
    ],
  },
  {
    id: 'trading-4',
    track: 'Trading',
    title: 'Liquidity sweeps: trading the manipulation, not the move',
    subtitle: 'Equal highs/lows, stop hunts, the sweep-and-reverse pattern & session timing on V75',
    duration: '14 m',
    level: 'PhD',
    xp: 180,
    sections: [
      {
        title: 'Why liquidity exists at equal highs and lows',
        content: 'Retail traders cluster their stop losses at obvious levels — equal highs, equal lows, round numbers, swing highs/lows. This creates a predictable pool of pending orders that institutions and large participants can sweep to fill their own positions. On V75, the algorithm-driven nature of the instrument means these sweeps are mechanical and highly consistent. The setup: wait for price to sweep an obvious level, wait for the reversal candle (often a strong engulfing), then enter in the opposite direction.',
        keyPoints: [
          'Equal highs/lows = stop loss clusters',
          'The sweep is the trigger, not the entry',
          'Wait for a rejection candle after the sweep',
          'V75 session opens (00:00, 08:00, 16:00 UTC) have highest sweep probability',
        ],
      },
    ],
  },
  {
    id: 'trading-5',
    track: 'Trading',
    title: 'Trade journaling & performance review: the edge nobody talks about',
    subtitle: 'Journal structure, pattern analysis, the weekly review process & measuring your actual edge',
    duration: '12 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'What your journal must capture',
        content: 'Most trade journals capture the outcome (profit/loss) but not the inputs that produced it. A useful journal captures: the setup type, the timeframe, the session, the risk-to-reward ratio at entry, the reason you took the trade, the emotional state at entry, whether you followed your rules, and a screenshot. The goal is to have enough data to answer: which setups have positive expectancy, which sessions perform best, and where am I deviating from my rules?',
        keyPoints: [
          'Capture setup type, not just result',
          'Record emotional state — patterns emerge over time',
          'Screenshot every trade before and after',
          'Weekly review: 1h minimum, no exceptions',
        ],
      },
    ],
  },
  // ── BUSINESS ───────────────────────────────────────────────────────────
  {
    id: 'business-1',
    track: 'Business',
    title: 'Pricing strategy: capturing the value you actually create',
    subtitle: 'Value-based pricing, anchoring & packaging architecture',
    duration: '12 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'Why cost-plus pricing destroys value',
        content: 'Cost-plus pricing (cost × markup = price) anchors your price to your costs rather than to the value you create. If you help a client generate $500,000 in revenue, charging $5,000 because your cost was $2,500 means you\'re capturing 1% of the value you created. Value-based pricing asks: what is the outcome worth to the buyer? Then price as a fraction of that outcome. The discomfort with this model is that it requires you to have deep clarity on the value you deliver.',
        keyPoints: [
          'Cost-plus: price anchored to your costs (weak)',
          'Value-based: price anchored to client outcome (strong)',
          'Research your client\'s ROI before setting prices',
          '10-30% of delivered value is a reasonable capture rate',
        ],
      },
    ],
  },
  {
    id: 'business-2',
    track: 'Business',
    title: 'Sales systems: closing without pressure',
    subtitle: 'Consultative selling, pipeline architecture & follow-up sequences that convert',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The consultative selling framework',
        content: 'Pressure selling creates buyers remorse and churn. Consultative selling creates conviction and retention. The framework: lead with questions that uncover pain (not features), listen to understand the cost of inaction, present only the solution that fits their actual problem, handle objections by exploring them rather than deflecting, and close by asking for a decision. The most powerful close: "Based on everything you\'ve told me, does this solve your problem?" is more effective than any script.',
        keyPoints: [
          'Questions first, pitch second — always',
          'Quantify the cost of their current problem',
          'Objections = requests for more information',
          'The close is a logical conclusion, not a technique',
        ],
      },
    ],
  },
  {
    id: 'business-3',
    track: 'Business',
    title: 'Operations: running a business without being the business',
    subtitle: 'SOPs, delegation frameworks & building a machine that works without you',
    duration: '12 m',
    level: 'PhD',
    xp: 150,
    sections: [
      {
        title: 'The SOP that actually gets followed',
        content: 'Most SOPs fail because they\'re too long, too vague, or created by people who don\'t do the work. An effective SOP has four components: the outcome (what does done look like?), the steps (numbered, specific, actionable), the decision tree (what happens when X goes wrong?), and the checklist (the minimum viable version someone can follow under pressure). Document processes while doing them, not after. The best person to write an SOP is the person currently executing the process.',
        keyPoints: [
          'Outcome first: define done before defining steps',
          'Video > text for complex visual processes',
          'Decision trees handle the 20% edge cases that cause 80% of errors',
          'Review SOPs quarterly — they decay as the business evolves',
        ],
      },
    ],
  },
  {
    id: 'business-4',
    track: 'Business',
    title: 'Financial modeling: building a simple forecast that guides decisions',
    subtitle: 'Revenue projections, scenario planning & the metrics operators actually need to track',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The operator\'s metric stack',
        content: 'Vanity metrics (followers, page views, app downloads) feel good and tell you nothing. Operators track metrics that connect directly to decisions. The minimum viable stack: Monthly Recurring Revenue (MRR) and its growth rate, Customer Acquisition Cost (CAC) by channel, Customer Lifetime Value (LTV), LTV:CAC ratio (must be > 3:1), churn rate, and gross margin. Every other metric is downstream of these. If you can\'t explain how a metric connects to one of these six, you probably don\'t need to track it.',
        keyPoints: [
          'MRR growth rate > MRR absolute value',
          'LTV:CAC > 3:1 is the minimum viable unit economics',
          'Churn is the silent killer — track weekly, not monthly',
          'Gross margin determines how much you can afford to spend on growth',
        ],
      },
    ],
  },
  {
    id: 'business-5',
    track: 'Business',
    title: 'Client retention: the economics of keeping what you have',
    subtitle: 'Churn signals, retention plays, upsell architecture & the lifetime value math that changes your strategy',
    duration: '12 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'The retention math most businesses ignore',
        content: 'A 5% improvement in retention rate increases profits by 25-95% (Bain & Company research). Why? Because retained clients don\'t have acquisition costs, they spend more over time, they refer new clients, and they\'re more forgiving of price increases. The math is brutal in reverse: at 5% monthly churn, you lose 46% of your customer base every year. At 2% monthly churn, you lose 21%. The difference between "fine" and "great" retention is 60% less revenue lost annually.',
        keyPoints: [
          '5% monthly churn = 46% annual customer base loss',
          'Retention investment has 5-25x ROI vs acquisition',
          'NPS surveys identify at-risk clients before they churn',
          'QBRs (Quarterly Business Reviews) are the highest-leverage retention tool for B2B',
        ],
      },
    ],
  },
  // ── DESIGN ─────────────────────────────────────────────────────────────
  {
    id: 'design-1',
    track: 'Design',
    title: 'Brand systems: beyond the logo',
    subtitle: 'Visual identity architecture, design tokens & brand governance',
    duration: '11 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'What a brand system actually contains',
        content: 'A logo is a mark. A brand system is the complete visual language — every decision about color, type, spacing, imagery, iconography, tone, and motion that governs how an organization appears in the world. The components: logo system (primary, secondary, favicon), color palette (primary, secondary, semantic, neutral), typography system (display, body, mono, size scale), spacing system (base unit, scale), component library, imagery style guide, and voice/tone guidelines. Without all of these, every piece of new design starts from scratch.',
        keyPoints: [
          'Logos are 10% of a brand system',
          'Design tokens are the implementation layer — connect design to code',
          'A brand system without governance decays within 6 months',
          'System > rules > individual creativity',
        ],
      },
    ],
  },
  {
    id: 'design-2',
    track: 'Design',
    title: 'Layout grids & white space: the invisible structure',
    subtitle: 'Grid systems, spatial hierarchy & the design decisions behind compositions that breathe',
    duration: '12 m',
    level: 'PhD',
    xp: 150,
    sections: [
      {
        title: 'The 8-point grid system',
        content: 'The 8-point grid is the industry standard for UI design because 8 divides cleanly into common screen widths and aligns with standard icon sizes (16, 24, 32, 48, 64px). Every spacing decision — padding, margins, gap between elements — is a multiple of 8. This creates visual rhythm and consistency without having to think about every individual spacing decision. Some systems use a 4-point base (more granular) or a 12-column grid overlay for macro layout decisions.',
        keyPoints: [
          '8pt base: all spacing is a multiple of 8',
          '4pt for fine details, 8pt for components, 24-48pt for sections',
          'White space is not empty — it\'s active contrast',
          'Consistent spacing creates perceived quality',
        ],
      },
    ],
  },
  {
    id: 'design-3',
    track: 'Design',
    title: 'Typography in practice: type decisions that carry brands',
    subtitle: 'Type pairing, hierarchy systems, responsive type & the rules behind premium editorial looks',
    duration: '12 m',
    level: 'PhD',
    xp: 150,
    sections: [
      {
        title: 'The hierarchy system',
        content: 'Typography hierarchy is not about size alone — it\'s about contrast. Contrast in size, weight, style (italic/roman), and spacing. A strong hierarchy has 4-5 distinct levels: display (hero headlines), heading (section titles), subheading (card titles), body (reading text), and caption (metadata, labels). The mistake most designers make: varying only size. A small-but-bold caption can have more visual weight than a large-but-light display headline.',
        keyPoints: [
          'Hierarchy = contrast, not just size',
          'Vary weight and style, not just size',
          'Body text: 16-18px minimum for reading comfort',
          'Line-height: 1.4-1.6 for body, 1.1-1.2 for display',
        ],
      },
    ],
  },
  {
    id: 'design-4',
    track: 'Design',
    title: 'Color theory in practice: building palettes that work',
    subtitle: 'Color psychology, palette construction, contrast ratios & the 60-30-10 rule applied',
    duration: '11 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'The 60-30-10 rule',
        content: 'The 60-30-10 rule is the simplest palette framework: 60% dominant color (usually neutral — white, off-white, dark), 30% secondary color (brand color, used for sections, cards), 10% accent color (used for buttons, highlights, key moments). This ratio prevents visual chaos while allowing personality. The trap: beginners increase the accent color percentage because it feels exciting. But accent colors lose meaning when they\'re everywhere.',
        keyPoints: [
          '60% dominant: your canvas color',
          '30% secondary: structural color for sections and cards',
          '10% accent: CTAs, highlights, key moments only',
          'Accessibility: WCAG AA requires 4.5:1 contrast ratio for body text',
        ],
      },
    ],
  },
  {
    id: 'design-5',
    track: 'Design',
    title: 'Motion & animation: when to use it and how to brief it',
    subtitle: 'Animation principles, motion language, GSAP vs CSS, and the brief that gets the right result',
    duration: '11 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'The 12 principles of animation applied to UI',
        content: 'Disney\'s 12 animation principles (squash & stretch, anticipation, staging, etc.) translate directly to UI animation. The most relevant: timing and spacing (faster = snappier, slower = premium), follow-through (elements slightly overshoot and settle), and staging (the eye should never have to hunt for what just changed). The golden rule: every animation should communicate something — state change, hierarchy, direction, or relationship. Animation for decoration is noise.',
        keyPoints: [
          'Timing: 100-200ms for micro-interactions, 300-500ms for page transitions',
          'Easing: ease-out for elements entering, ease-in for elements leaving',
          'GSAP for complex sequences, CSS transitions for simple states',
          'Always provide a reduced-motion alternative',
        ],
      },
    ],
  },
  // ── MINDSET ────────────────────────────────────────────────────────────
  {
    id: 'mindset-1',
    track: 'Mindset',
    title: 'Decision-making under uncertainty: the operator\'s edge',
    subtitle: 'Probabilistic thinking, second-order effects & decision logs',
    duration: '10 m',
    level: 'PhD',
    xp: 120,
    sections: [
      {
        title: 'Thinking in probabilities, not certainties',
        content: 'Most people make decisions by asking "will this work?" — a binary question. Operators ask "what\'s the probability distribution of outcomes, and what\'s my expected value across that distribution?" A decision with a 40% chance of +$100,000 and 60% chance of -$10,000 has an expected value of +$34,000. It will feel wrong most of the time (you lose 60% of the time) but it\'s mathematically correct to take it repeatedly. Training yourself to think in probabilities is the single most useful cognitive upgrade available.',
        keyPoints: [
          'EV = Σ (probability × outcome) across all scenarios',
          'Good decisions can have bad outcomes — they\'re still good decisions',
          'Document your predictions and review them — calibration improves with feedback',
          'Second-order: "and then what?" asked 3 times catches most blind spots',
        ],
      },
    ],
  },
  {
    id: 'mindset-2',
    track: 'Mindset',
    title: 'Deep work: the operating system for high output',
    subtitle: 'Attention architecture, cognitive load theory & the focus protocols that separate operators from everyone else',
    duration: '11 m',
    level: 'PhD',
    xp: 140,
    sections: [
      {
        title: 'The cognitive load crisis',
        content: 'The average knowledge worker checks email/Slack every 6 minutes. Every context switch costs 15-20 minutes of recovery time. That means a worker checking 50 times per day loses 12+ hours to context-switching overhead — on an 8-hour day, they\'re operating at negative productivity in terms of deep work capacity. Cal Newport\'s research: 4 hours of genuine deep work per day is the maximum most professionals can sustain, and most get less than 1 hour.',
        keyPoints: [
          'Context switching: 15-20min recovery per switch',
          'Notifications are not free — they\'re enormously expensive',
          'Time-blocking: schedule deep work like client meetings',
          'The most important work should happen in your first 90 minutes',
        ],
      },
    ],
  },
  {
    id: 'mindset-3',
    track: 'Mindset',
    title: 'Energy management: the operating system beneath productivity',
    subtitle: 'Ultradian rhythms, recovery protocols & why output quality depends on biology, not willpower',
    duration: '10 m',
    level: 'Masters',
    xp: 130,
    sections: [
      {
        title: 'Ultradian rhythms: your 90-minute cycles',
        content: 'The human brain operates in 90-minute ultradian cycles — roughly 90 minutes of peak alertness followed by a 20-minute trough. During the trough, the brain is signaling for rest through yawning, loss of focus, and restlessness. Most people override this signal with caffeine and willpower, degrading the quality of subsequent cycles. The high-performance protocol: work in 90-minute blocks, take genuine 20-minute breaks (not scrolling — actual rest), and use the trough periods for low-cognitive tasks.',
        keyPoints: [
          '90-minute peak → 20-minute trough: the basic cycle',
          'Overriding troughs degrades subsequent peak quality',
          'Sleep is the master recovery protocol — nothing else competes',
          'Caffeine delays fatigue — it doesn\'t eliminate it',
        ],
      },
    ],
  },
  {
    id: 'mindset-4',
    track: 'Mindset',
    title: 'Identity-based habits: building systems that stick',
    subtitle: 'James Clear\'s framework, habit stacking, environmental design & breaking bad defaults',
    duration: '10 m',
    level: 'Masters',
    xp: 120,
    sections: [
      {
        title: 'Identity before behavior',
        content: 'Most habit systems focus on outcomes (lose 20 pounds) or behaviors (exercise daily). James Clear\'s insight: identity-based habits are more durable because you\'re changing who you are, not just what you do. Instead of "I want to read more," the shift is "I am a reader." Every book you read is evidence confirming that identity. Every skipped day is a vote against it. The practical question for any habit: "What type of person would do this naturally, and how do I become that person?"',
        keyPoints: [
          'Outcome → behavior → identity: most people work backwards',
          'Identity → behavior → outcome: the durable sequence',
          'Every action is a vote for or against your desired identity',
          'Habit stacking: "After I [current habit], I will [new habit]"',
        ],
      },
    ],
  },
  {
    id: 'mindset-5',
    track: 'Mindset',
    title: 'Resilience: the operating system for long games',
    subtitle: 'Antifragility, the stress-recovery cycle, reframing setbacks & building mental durability as a skill',
    duration: '11 m',
    level: 'PhD',
    xp: 140,
    sections: [
      {
        title: 'Antifragility: beyond resilience',
        content: 'Nassim Taleb\'s concept: fragile things break under stress, resilient things survive stress, antifragile things improve because of stress. The antifragile operator doesn\'t just recover from setbacks — they extract information from them that makes the next version of themselves stronger. The practical application: post-mortems on failures (what did this teach me?), seeking discomfort deliberately (small doses of stress build capacity), and avoiding catastrophic risks while welcoming the kind of stress that has a defined downside.',
        keyPoints: [
          'Fragile → Resilient → Antifragile: a spectrum',
          'Stress + recovery = growth (same as physical training)',
          'Post-mortems: every failure contains a lesson if you look for it',
          'Barbell strategy: avoid catastrophic risk, seek upside exposure',
        ],
      },
    ],
  },
  // ── CREATIVE ───────────────────────────────────────────────────────────
  {
    id: 'creative-1',
    track: 'Creative',
    title: 'Photography, editing & videography: speak the language',
    subtitle: 'The vocabulary, jargon & briefing techniques that make creatives execute exactly what you see in your head',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'The language gap between clients and creatives',
        content: 'When a client says "make it pop," a photographer hears a thousand different things. The language gap between clients and creatives is responsible for more wasted shoots and revision cycles than any technical failure. Bridging the gap requires learning the vocabulary: aperture (controls depth of field), shutter speed (controls motion blur), ISO (controls sensor sensitivity, also noise). But more importantly: mood references ("I want the feel of a late-afternoon summer market") communicate faster than technical specs.',
        keyPoints: [
          'Shot types: ECU, CU, MS, WS, EWS — learn these',
          'Mood boards: 5-10 reference images communicate better than 500 words',
          'Golden hour: the 30 minutes after sunrise and before sunset',
          'Hero shot, supporting shots, detail shots — brief each separately',
        ],
      },
    ],
  },
  {
    id: 'creative-2',
    track: 'Creative',
    title: 'Video editing: pacing, cuts & the invisible craft',
    subtitle: 'Cut theory, J/L cuts, music sync, colour workflow & exporting for every platform',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'The invisible cut',
        content: 'Great editing is invisible — the viewer feels the story without noticing the craft. The J-cut: audio from the next scene begins before the video cuts, pulling the viewer forward. The L-cut: video cuts to the next scene while audio from the previous scene continues, giving a sense of continuity. Both create flow that straight cuts can\'t achieve. Match cuts (cutting between two visually similar compositions) and action cuts (cutting mid-motion) create seamless momentum.',
        keyPoints: [
          'J-cut: hear the next scene before you see it',
          'L-cut: see the next scene while hearing the previous',
          'Match cut: visual rhyme between two scenes',
          'Cut on action: the most natural invisible cut',
        ],
      },
    ],
  },
  {
    id: 'creative-3',
    track: 'Creative',
    title: 'Brand photography: directing shots that are actually usable',
    subtitle: 'Art direction frameworks, prop strategy, location scouting & getting scroll-stopping hero images',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The shoot brief that saves the day',
        content: 'A shoot without a brief is a guess. A shoot with a brief is a plan. The components of a useful brief: deliverables (exactly what images/formats you need), brand guidelines (colors, tone, do\'s and don\'ts), reference images (5-10 images that capture the feel), shot list (specific shots with composition notes), talent direction (poses, expressions, actions), and usage rights (where these images will appear, for how long). Give this brief to the photographer at least 72 hours before the shoot.',
        keyPoints: [
          'Shot list: number them, note the minimum must-haves vs nice-to-haves',
          'Reference images: not "I want this exact thing" but "I want this feeling"',
          'Leave 20% of shoot time for the photographer to explore',
          'Negative space: always request some shots with room for copy overlay',
        ],
      },
    ],
  },
  {
    id: 'creative-4',
    track: 'Creative',
    title: 'Reels & short-form video: the formula behind retention',
    subtitle: 'Hook science, pacing structure, caption strategy & the brief that produces scroll-stopping content',
    duration: '14 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The hook formula',
        content: 'You have 1.7 seconds to stop the scroll before the algorithm\'s attention data decides your video isn\'t worth promoting. The hook must do three things: create a pattern interrupt (something visually or audibly unexpected), establish a reason to keep watching (curiosity gap, promise, or conflict), and be relevant to the target viewer. The most powerful hooks use what psychologists call the "open loop" — a question or statement that can only be resolved by watching to the end. "The mistake 90% of traders make in the first minute of a trade" is a stronger hook than "5 trading tips."',
        keyPoints: [
          '1.7 seconds: the decision window',
          'Pattern interrupt + reason to continue + relevance = hook',
          'Open loops create compulsive completion',
          'First frame must work as a still image — many users have autoplay off',
        ],
      },
    ],
  },
  {
    id: 'creative-5',
    track: 'Creative',
    title: 'Creative direction: running shoots that deliver',
    subtitle: 'Mood boards, on-set direction, post-production briefs & approval workflows that cut revision cycles in half',
    duration: '13 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'On-set direction without being annoying',
        content: 'The creative director\'s job on set is not to micromanage every frame — it\'s to hold the vision and give the creative team room to execute. Effective on-set direction: give direction in feeling and intention ("I want this person to look like they just received the best news of their life") rather than technical instruction ("lift your eyebrows 10%"). Review frames on the monitor, not the camera screen. Call "hold" to check in every 10-15 minutes. Trust the team you hired, but be unambiguous about what\'s not working.',
        keyPoints: [
          'Direction in feelings, not mechanics',
          'The monitor is your tool — use it',
          '"What\'s not working" is more useful than "try this instead"',
          'The best shot usually comes after the talent relaxes — plan for overtime',
        ],
      },
    ],
  },
  // ── CROSS CULTURES ─────────────────────────────────────────────────────
  {
    id: 'culture-1',
    track: 'Cross Cultures',
    title: 'Cross-cultural intelligence: how to navigate any room',
    subtitle: 'Communication styles, cultural dimensions & the mindset shifts that make you effective everywhere',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'High-context vs low-context cultures',
        content: 'Edward Hall\'s distinction: in high-context cultures (Japan, China, Arab world, much of Africa and Latin America), communication relies heavily on implicit understanding — context, relationship, and non-verbal cues carry most of the meaning. In low-context cultures (Germany, Scandinavia, the US, Australia), meaning is explicit, direct, and in the words themselves. The failure mode: a low-context communicator in a high-context environment comes across as rude and blunt. A high-context communicator in a low-context environment seems evasive and unclear.',
        keyPoints: [
          'High-context: meaning is implied, relationships carry information',
          'Low-context: meaning is explicit, in the words',
          'Most of the world is higher-context than the US/Northern Europe',
          'Code-switching between contexts is a learnable skill',
        ],
      },
    ],
  },
  {
    id: 'culture-2',
    track: 'Cross Cultures',
    title: 'Negotiating across cultures: The Culture Map in practice',
    subtitle: 'Erin Meyer\'s eight scales, disagreement styles & closing deals across cultural lines',
    duration: '12 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'Erin Meyer\'s 8 scales',
        content: 'Erin Meyer\'s Culture Map plots cultures on 8 dimensions: Communicating (low vs high context), Evaluating (direct vs indirect negative feedback), Persuading (principles-first vs applications-first), Leading (egalitarian vs hierarchical), Deciding (consensual vs top-down), Trusting (task vs relationship-based), Disagreeing (confrontational vs avoids confrontation), Scheduling (linear vs flexible time). Understanding where your counterpart sits on each scale before a negotiation is the highest-leverage preparation you can do.',
        keyPoints: [
          'The 8 scales are independent — a culture can be hierarchical and egalitarian on different dimensions',
          'Relative positioning matters more than absolute position',
          'Feedback style varies most — prepare carefully before giving negative feedback cross-culturally',
          'Trust-building requirements differ dramatically: some cultures want task results, others want personal relationship first',
        ],
      },
    ],
  },
  {
    id: 'culture-3',
    track: 'Cross Cultures',
    title: 'Global etiquette: customs, taboos & the unwritten rules',
    subtitle: 'Greetings, gifts, dining, dress & religious calendars — the details that open or close doors',
    duration: '11 m',
    level: 'Masters',
    xp: 130,
    sections: [
      {
        title: 'The details that close deals and the ones that kill them',
        content: 'Business cards in Japan: receive with both hands, read it carefully, never write on it, never put it in your back pocket — the card is an extension of the person. Gift-giving in China: never give clocks (associated with death), never give green hats (associated with infidelity), wrap gifts in red. Handshakes in the Middle East: wait for the other party to extend their hand first, especially in mixed-gender situations. These aren\'t trivia — they\'re the difference between a deal and an insult.',
        keyPoints: [
          'Japan: business cards = respect ritual, never rush it',
          'China: avoid clocks, scissors, and umbrellas as gifts',
          'Middle East: left hand is considered unclean — avoid using it',
          'India: head wobble means "yes, I\'m listening" not "no"',
        ],
      },
    ],
  },
  {
    id: 'culture-4',
    track: 'Cross Cultures',
    title: 'Diaspora power: how culture travels & why it matters',
    subtitle: 'Remittances, soft power, code-switching & turning diaspora networks into opportunity',
    duration: '11 m',
    level: 'Masters',
    xp: 130,
    sections: [
      {
        title: 'The economic weight of diaspora',
        content: 'Global remittances exceeded $860 billion in 2023 — more than three times global foreign aid. Diaspora communities are not just cultural bridges; they\'re economic engines. The Jamaican diaspora sends more money home per capita than almost any other. The Indian diaspora in the US has median household income significantly above the national average and drives major technology investment back to India. Understanding diaspora networks means understanding how capital, talent, and culture actually move in the 21st century.',
        keyPoints: [
          '$860B+ in global remittances annually — dwarfs foreign aid',
          'Diaspora networks: trust-based capital flows',
          'Code-switching is a professional superpower',
          'Cultural fluency > language fluency for business outcomes',
        ],
      },
    ],
  },
  {
    id: 'culture-5',
    track: 'Cross Cultures',
    title: 'Leading global & remote teams',
    subtitle: 'Async-first operations, time-zone equity & building one culture across many',
    duration: '12 m',
    level: 'PhD',
    xp: 150,
    sections: [
      {
        title: 'Time-zone equity: the overlooked challenge',
        content: 'Most "global" teams are actually one team with satellite offices. Decisions happen in the headquarters time zone. Async tools are used synchronously (Slack treated as IM). The minority time zones are always the ones joining at 11pm. Genuine time-zone equity requires: rotating meeting times so no single timezone always sacrifices, decisions documented in async formats (Loom, written summaries) so absent team members can engage, and a "default to async" culture where synchronous meetings are the exception, not the default.',
        keyPoints: [
          'Rotate meeting times — no single timezone should always sacrifice',
          'Default to async: document before deciding',
          'Psychological safety requires explicit effort across cultures',
          'Overcommunicate in writing — high-context team members need explicit context in remote settings',
        ],
      },
    ],
  },
  // ── NEED TO KNOW ───────────────────────────────────────────────────────
  {
    id: 'ntk-1',
    track: 'Need to Know',
    title: 'Things every sharp person knows',
    subtitle: 'The essential concepts from law, finance, psychology, science & history that serious people carry',
    duration: '15 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The mental models that run the world',
        content: 'Compound interest: the force that makes early savers wealthy and late borrowers broke. Supply and demand: the price mechanism that allocates resources without a central authority. Opportunity cost: every choice is also a rejection of every alternative. Regression to the mean: extreme outcomes are usually followed by less extreme ones. These four concepts explain more about how the world works than 90% of what\'s taught in school.',
        keyPoints: [
          'Compound interest: the most powerful force in finance',
          'Opportunity cost: the price of every decision is what you didn\'t choose',
          'Regression to the mean: extreme outcomes are usually temporary',
          'Incentives: understand incentives and you understand behavior',
        ],
      },
    ],
  },
  {
    id: 'ntk-2',
    track: 'Need to Know',
    title: 'How money actually works',
    subtitle: 'Central banks, interest rates, inflation mechanics & why currencies live or die',
    duration: '14 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The monetary system in plain language',
        content: 'Banks don\'t lend out deposits — they create money through lending. When a bank issues a $100,000 mortgage, it creates $100,000 in new money. The central bank (Federal Reserve, ECB, etc.) controls the money supply by setting the interest rate at which banks borrow from each other overnight. Lower rates = cheaper borrowing = more money created = inflation. Higher rates = more expensive borrowing = less money created = disinflation. The 2020-2022 inflation was the predictable result of $5 trillion in new money creation against a supply-constrained economy.',
        keyPoints: [
          'Banks create money through lending — not lending out deposits',
          'Central banks control rates, not the money printer directly',
          'Inflation = too much money chasing too few goods',
          'Currency value = relative confidence in that country\'s institutions',
        ],
      },
    ],
  },
  {
    id: 'ntk-3',
    track: 'Need to Know',
    title: 'How the world runs: energy, chips & supply chains',
    subtitle: 'Oil, shipping, semiconductors, food systems & the chokepoints that move history',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The chokepoints that run civilization',
        content: 'The Strait of Hormuz: 20% of global oil passes through a 21-mile-wide channel. The Taiwan Strait: 90% of advanced semiconductors (sub-7nm) are manufactured in Taiwan. The Suez and Panama Canals: chokepoints for global shipping, proven in 2021 (Ever Given) and 2024 (drought-reduced capacity). These single points of failure are why geopolitics matters to every business. The COVID supply chain crisis wasn\'t random — it was the predictable result of decades of just-in-time, zero-redundancy supply chains hitting simultaneous stress.',
        keyPoints: [
          'Strait of Hormuz: 20% of global oil',
          'TSMC Taiwan: 90%+ of sub-7nm chips',
          'Just-in-time → just-in-case: the supply chain rethink',
          'Energy security = national security = economic security',
        ],
      },
    ],
  },
  {
    id: 'ntk-4',
    track: 'Need to Know',
    title: 'Health literacy: reading the evidence like a pro',
    subtitle: 'Study quality, risk statistics, sleep & stress fundamentals — and spotting health nonsense',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'The evidence hierarchy',
        content: 'Not all evidence is equal. At the bottom: anecdotes, case reports, expert opinion. In the middle: observational studies (correlation, not causation). At the top: randomized controlled trials (RCTs) and meta-analyses. The health supplement industry thrives in the gap between "this has some research" and "this is proven to work." A single RCT with 50 participants vs a meta-analysis of 50 RCTs with 50,000 participants are not comparable, but they\'ll both be cited as "science shows."',
        keyPoints: [
          'Meta-analysis > RCT > observational study > case report > anecdote',
          'Relative risk vs absolute risk: "50% higher risk" means nothing without the baseline',
          'Correlation ≠ causation — confounding variables are everywhere',
          'Sleep is the single best-evidenced health intervention available',
        ],
      },
    ],
  },
  {
    id: 'ntk-5',
    track: 'Need to Know',
    title: 'Media literacy & information warfare',
    subtitle: 'Propaganda mechanics, algorithmic amplification & the habits that keep you grounded in reality',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'How propaganda actually works',
        content: 'Modern propaganda doesn\'t need to lie — it just needs to select, frame, and repeat. Selecting which facts to cover and which to ignore. Framing how those facts are contextualized (a 0.1% unemployment drop is either "historic progress" or "trivial improvement" depending on the frame). Repetition, the "illusory truth effect" — claims become believable through repeated exposure, regardless of their accuracy. The defense: primary sources over secondary, diverse sources over a single trusted outlet, and deliberate consumption rather than passive scrolling.',
        keyPoints: [
          'Selection + framing + repetition = the propaganda toolkit',
          'Illusory truth effect: repetition increases perceived accuracy',
          'Algorithmic amplification selects for outrage, not accuracy',
          'Primary sources: read the actual study, the actual statement, the actual document',
        ],
      },
    ],
  },
]

export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}

export type TrackGroup = {
  track: Track
  subtitle: string
  icon: string
  courses: Course[]
}

export const TRACK_META: Record<Track, { subtitle: string; icon: string }> = {
  'Marketing': { subtitle: 'Brand strategy, paid growth, content & positioning', icon: '📈' },
  'Technology': { subtitle: 'Full-stack, AI systems, architecture & automation', icon: '⚙️' },
  'Trading': { subtitle: 'SMC, VIX indices, risk models & execution', icon: '📊' },
  'Business': { subtitle: 'Operations, finance, strategy & leadership', icon: '💼' },
  'Design': { subtitle: 'Visual identity, UI/UX & brand systems', icon: '🎨' },
  'Mindset': { subtitle: 'Discipline, focus, decision-making & performance', icon: '🧠' },
  'Creative': { subtitle: 'Photography, videography, editing — vocabulary & direction skills to brief creatives like a pro', icon: '🎬' },
  'Cross Cultures': { subtitle: 'Cultural intelligence, global communication styles & navigating diverse environments', icon: '🌍' },
  'Need to Know': { subtitle: 'Essential concepts across law, finance, science, psychology & the world — the things sharp people just know', icon: '💡' },
}

export function getTrackGroups(): TrackGroup[] {
  const groups = new Map<Track, Course[]>()
  for (const course of COURSES) {
    if (!groups.has(course.track)) groups.set(course.track, [])
    groups.get(course.track)!.push(course)
  }
  return Array.from(groups.entries()).map(([track, courses]) => ({
    track,
    subtitle: TRACK_META[track].subtitle,
    icon: TRACK_META[track].icon,
    courses,
  }))
}

