export type Level = 'Basic' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'marketing' | 'tech' | 'trading' | 'business' | 'design' | 'mindset'

export interface QuizQuestion {
  q: string
  options: string[]
  correct: number
  explanation: string
}

export interface Course {
  id: string
  track: Track
  title: string
  subtitle: string
  level: Level
  xp: number
  duration: number
  dayOfWeek: number
  weekNumber: number
  content: string
  keyTerms: { term: string; definition: string }[]
  quiz: QuizQuestion[]
  certArea?: string
}

export const TRACKS: Record<Track, { label: string; color: string; bg: string; description: string }> = {
  marketing: { label: 'Marketing', color: '#c9a84c', bg: '#fdf3dc', description: 'Brand strategy, paid growth, content & positioning' },
  tech: { label: 'Technology', color: '#378add', bg: '#e6f1fb', description: 'Full-stack, AI systems, architecture & automation' },
  trading: { label: 'Trading', color: '#2d8a4e', bg: '#e6f4ec', description: 'SMC, VIX indices, risk models & execution' },
  business: { label: 'Business', color: '#9b4dca', bg: '#f3e8fd', description: 'Operations, finance, strategy & leadership' },
  design: { label: 'Design', color: '#e05c2a', bg: '#fdf0ea', description: 'Visual identity, UI/UX & brand systems' },
  mindset: { label: 'Mindset', color: '#555', bg: '#f5f5f3', description: 'Discipline, focus, decision-making & performance' },
}

export const LEVEL_COLORS: Record<Level, { text: string; bg: string }> = {
  Basic: { text: '#555', bg: '#f0f0ee' },
  Masters: { text: '#185fa5', bg: '#e6f1fb' },
  PhD: { text: '#7a5a1a', bg: '#fdf3dc' },
  'Next-Gen AI': { text: '#5c1d8a', bg: '#f3e8fd' },
}

export const COURSES: Course[] = [
  {
    id: 'mkt-w1-d1',
    track: 'marketing',
    title: 'Paid media attribution: knowing what actually works',
    subtitle: 'Multi-touch models, UTM architecture & Meta Ads audit',
    level: 'PhD',
    xp: 180,
    duration: 15,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'Paid Growth',
    keyTerms: [
      { term: 'Multi-touch attribution', definition: 'A method of assigning credit to multiple touchpoints in a customer\'s journey, rather than the first or last click alone.' },
      { term: 'UTM parameters', definition: 'Tracking tags appended to URLs (source, medium, campaign, term, content) that tell analytics where traffic came from.' },
      { term: 'Last-click attribution', definition: 'The default model that gives 100% credit to the final touchpoint before conversion — dangerously misleading for multi-channel brands.' },
      { term: 'ROAS (Return on Ad Spend)', definition: 'Revenue generated per dollar spent on ads. Formula: Revenue ÷ Ad Spend. A 4× ROAS means $4 earned per $1 spent.' },
      { term: 'View-through conversion', definition: 'A conversion that occurs after someone *saw* an ad but didn\'t click it — counted separately in Meta to avoid double-counting.' },
    ],
    content: `## Why attribution is the most misunderstood skill in paid marketing

Most business owners look at Meta Ads Manager and see ROAS. They think that number tells the whole story. It doesn't — and building your entire strategy on last-click attribution is one of the most expensive mistakes in digital marketing.

### The attribution problem explained

When someone buys from you, they rarely did it in one step. They might have:
1. Seen your Instagram Reel (view)
2. Clicked a retargeting ad three days later
3. Googled your brand name
4. Clicked a Google Search ad
5. Then purchased

**Last-click attribution** gives 100% credit to step 5 (Google Search). Your Meta campaign gets zero credit despite being the first touchpoint that created awareness. This leads you to kill your Meta spend and "double down on Google" — then your pipeline dries up in 30 days because you cut awareness.

### Multi-touch attribution models

| Model | How credit is distributed | Best for |
|---|---|---|
| Last click | 100% to final touchpoint | Direct response campaigns only |
| First click | 100% to first touchpoint | Brand awareness measurement |
| Linear | Equal credit to all | Understanding full funnel |
| Time decay | More credit closer to conversion | Short sales cycles |
| Data-driven | ML-based, actual contribution | Large data sets only |

For most growing businesses, **linear or time decay** gives the most honest picture.

### UTM architecture that actually works

A proper UTM structure looks like this:

\`\`\`
https://yoursite.com/product?
utm_source=meta
&utm_medium=paid-social
&utm_campaign=q3-2025-brand-awareness
&utm_content=video-15s-founder-story
&utm_term=cold-audience-25-44
\`\`\`

**Rules:**
- Always lowercase — UTMs are case-sensitive
- Use hyphens not underscores in values
- Be consistent — "meta" not "Meta" not "Facebook"
- Never send paid traffic to a URL without UTMs

### Your weekly Meta Ads audit routine

Run this every Monday morning, takes 20 minutes:

1. **Check attribution window** — Are you on 7-day click, 1-day view? Be consistent week to week.
2. **Compare Meta-reported vs GA4-reported** — If Meta says 50 purchases and GA4 says 20, you have double-counting. Investigate.
3. **Pull Cost Per Result by placement** — Reels vs Stories vs Feed often perform very differently. Kill the worst performer if CPR is 3× the best.
4. **Review frequency** — If your cold audience frequency is above 3.5, you're burning money on fatigued creatives. Rotate.
5. **Check landing page conversion rate** — If CTR is strong but conversion is weak, the problem is the landing page, not the ad.

### The PhD-level move: incrementality testing

The gold standard is running **holdout tests**: withhold ads from a random 10% of your audience and compare conversion rates. If the exposed group converts at the same rate as the holdout, your ads aren't actually driving conversions — you'd be buying customers you'd have gotten organically anyway.

Meta offers this natively via "Conversion Lift Studies." Run one quarterly.

### Practical takeaway

Stop optimizing based on Meta's ROAS number alone. Set up GA4 with proper UTM tagging, run a linear attribution view across all channels, and make budget decisions based on the full-funnel picture — not the last click.`,
    quiz: [
      {
        q: 'You notice Meta Ads Manager shows 80 purchases but GA4 shows only 35. What is the most likely cause?',
        options: [
          'GA4 is broken and should be ignored',
          'Meta is counting view-through conversions and you likely have attribution window overlap with other channels',
          'Your UTM parameters are working correctly',
          'The Meta pixel is not installed properly',
        ],
        correct: 1,
        explanation: 'Meta\'s default attribution window counts view-through conversions (people who saw but didn\'t click your ad) AND 7-day click conversions. When someone converts via Google after seeing a Meta ad, both platforms claim the conversion — causing double-counting. This is why cross-channel attribution is essential.',
      },
      {
        q: 'Which attribution model gives equal credit to every touchpoint in a customer journey?',
        options: ['Last click', 'First click', 'Linear', 'Time decay'],
        correct: 2,
        explanation: 'Linear attribution distributes credit equally across all touchpoints. If a customer had 4 interactions before buying, each gets 25% credit. This is far more honest than last-click for understanding the full funnel.',
      },
      {
        q: 'Your cold audience ad frequency hits 4.2 and CTR drops from 2.1% to 0.8% over 2 weeks. What should you do?',
        options: [
          'Increase your daily budget to reach more people',
          'Rotate creative assets — your audience has seen your ads too many times and is fatiguing',
          'Switch to a broader audience targeting',
          'Lower your bid cap',
        ],
        correct: 1,
        explanation: 'Ad fatigue occurs when the same audience sees your creative too many times. Frequency above 3.5 on cold audiences typically signals creative exhaustion. The fix is new creative assets, not more budget — spending more just accelerates fatigue.',
      },
    ],
  },
  {
    id: 'tech-w1-d1',
    track: 'tech',
    title: 'AI agent architecture: patterns that actually ship',
    subtitle: 'Tool calling, memory layers, orchestration loops from first principles',
    level: 'Next-Gen AI',
    xp: 200,
    duration: 14,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'AI Systems',
    keyTerms: [
      { term: 'Tool calling', definition: 'The mechanism by which an LLM requests execution of external functions (APIs, code, databases) and receives their output to continue reasoning.' },
      { term: 'Agentic loop', definition: 'The cycle of: receive task → reason → call tools → observe results → reason again → repeat until done. The core architecture of all AI agents.' },
      { term: 'Short-term memory', definition: 'The active context window — what the model can "see" right now. Limited to the model\'s context length (e.g. 200k tokens for Claude).' },
      { term: 'Long-term memory', definition: 'External storage (vector DB, SQL, files) that the agent retrieves from on demand. Enables memory beyond the context window.' },
      { term: 'Orchestrator vs. subagent', definition: 'In multi-agent systems, the orchestrator plans and delegates; subagents execute specific tasks. Neither has the full picture — only the orchestrator sees the whole plan.' },
    ],
    content: `## Building AI agents that actually work in production

Everyone is building "AI agents." Most fail in production within a week. The reason isn't the LLM — it's the architecture around it. This module teaches you the patterns that survive contact with the real world.

### The agentic loop

Every AI agent, from the simplest chatbot to a fully autonomous coding agent, runs on the same fundamental loop:

\`\`\`
1. Receive task / user message
2. Reason about what to do next
3. If tool call needed → execute tool → observe result → go to 2
4. If task complete → return final answer
\`\`\`

The key insight: **the model never actually "does" anything**. It only produces text. Every real-world action (sending an email, running code, querying a database) happens through tools that the model calls.

### Tool design: the most important skill

Tool design is underrated. A poorly designed tool is worse than no tool. Rules:

**Name tools like functions, not features.**
- Bad: \`do_email_stuff\`
- Good: \`send_email(to, subject, body, cc?)\`

**One tool, one responsibility.**
Never build a tool that does two things. \`create_and_send_invoice\` should be two tools: \`create_invoice\` and \`send_invoice\`. This gives the agent (and you) more control.

**Always return structured data.**
Tools should return JSON, not prose. The model needs to parse the result, not read it.

**Include error states in the schema.**
\`\`\`typescript
interface ToolResult {
  success: boolean
  data?: unknown
  error?: { code: string; message: string }
}
\`\`\`

### Memory architecture

| Layer | What it is | How long it lasts | Example |
|---|---|---|---|
| In-context | Active messages | This session only | Current conversation |
| External (vector) | Embeddings of past info | Permanent | Past client notes |
| External (SQL) | Structured facts | Permanent | User preferences, orders |
| Cached | Frequently accessed context | Minutes to hours | System prompt, docs |

For most production agents, you need at least two layers:
1. **In-context** for the current task
2. **SQL or vector store** for user-specific memory

Without long-term memory, your agent forgets everything the moment the conversation ends.

### Orchestrator + subagent patterns

For complex tasks, single-agent architectures break down. Use multi-agent patterns:

\`\`\`
User → Orchestrator
         ├── Researcher Agent (web search, summarization)
         ├── Writer Agent (draft generation)
         └── Publisher Agent (post to socials, send emails)
\`\`\`

**Critical rule:** subagents should be stateless and idempotent where possible. The orchestrator holds state. If a subagent crashes, the orchestrator can retry without corruption.

### What breaks in production

1. **Token limit overruns** — Agent loops accumulate context fast. Build context pruning into your loop. Summarize completed steps.
2. **Tool cascades** — Agent calls Tool A, which triggers Tool B, which calls Tool A again. Add a recursion depth limit.
3. **No human-in-the-loop for irreversible actions** — Never let an agent delete, send, or publish without confirmation if the action is irreversible.
4. **Missing observability** — Every tool call should log: timestamp, tool name, inputs, outputs, latency. Without this, debugging production failures is impossible.

### The JST stack for agents

For your projects, the recommended agent stack:
- **Model:** Claude claude-sonnet-4-6 (best reasoning + tool use balance)
- **Orchestration:** Vercel AI SDK with \`useChat\` + server actions
- **Memory:** Supabase (SQL for structured, pgvector for semantic)
- **Tools:** TypeScript functions, strictly typed with Zod
- **Observability:** console.log → Vercel logs in dev; Langfuse in prod

### Practical build

Start with the simplest possible agent and add complexity only when you hit a real limitation. The most common mistake: over-engineering a multi-agent system for a task a single agent with 3 tools could handle.`,
    quiz: [
      {
        q: 'An AI agent is stuck in a loop: it calls Tool A, which returns data that causes it to call Tool A again with slightly different parameters, indefinitely. What architectural safeguard prevents this?',
        options: [
          'Using a better model',
          'Adding a maximum recursion depth / step limit with graceful exit',
          'Removing Tool A from the agent\'s available tools',
          'Increasing the context window',
        ],
        correct: 1,
        explanation: 'Tool cascade loops are a production failure mode. The correct fix is a max step limit — after N tool calls, the agent must return whatever it has or ask for human input. Never rely on the model to self-terminate; enforce limits in your orchestration code.',
      },
      {
        q: 'Which memory layer persists information across multiple separate user sessions?',
        options: [
          'The context window (in-context memory)',
          'The system prompt',
          'External storage (SQL database or vector store)',
          'The model\'s weights',
        ],
        correct: 2,
        explanation: 'In-context memory disappears when the session ends. The model\'s weights don\'t change at inference time. Only external storage (SQL, vector DB, files) survives across sessions. This is why every production agent needs a persistence layer.',
      },
      {
        q: 'You\'re designing a tool for an agent that should create a draft invoice AND email it to the client. How should you structure this?',
        options: [
          'One tool: create_and_email_invoice()',
          'Two tools: create_invoice() and send_email() — single responsibility',
          'No tools needed — let the model write the email in the response',
          'Three tools: draft_invoice(), format_invoice(), send_invoice()',
        ],
        correct: 1,
        explanation: 'Single responsibility per tool. create_invoice() and send_email() can be composed by the agent. This lets the agent (and human reviewers) inspect the invoice before sending, enables retrying just the email step if it fails, and makes each tool reusable independently.',
      },
    ],
  },
  {
    id: 'trd-w1-d1',
    track: 'trading',
    title: 'SMC order blocks: entry precision on volatility indices',
    subtitle: 'BOS confirmation, OB validation & position sizing under V75',
    level: 'Masters',
    xp: 160,
    duration: 12,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'SMC Trading',
    keyTerms: [
      { term: 'Order Block (OB)', definition: 'The last up-candle before a bearish displacement (bearish OB) or last down-candle before a bullish displacement (bullish OB). Represents institutional order concentration.' },
      { term: 'Break of Structure (BOS)', definition: 'Price breaking above a previous swing high (bullish BOS) or below a previous swing low (bearish BOS), confirming a directional move.' },
      { term: 'Change of Character (CHoCH)', definition: 'The first BOS in the opposite direction after a trend — signals a potential reversal, not just a pullback.' },
      { term: 'Displacement', definition: 'A strong, fast price move that leaves an imbalance (FVG) in the market. Created by institutional order flow, not retail participation.' },
      { term: 'Premium / Discount zones', definition: 'Premium = above 50% of a range (sell zone). Discount = below 50% (buy zone). Used to filter entries — only buy in discount, sell in premium.' },
    ],
    content: `## Order blocks: the institutional footprint

Smart Money Concepts (SMC) is built on one core observation: institutional traders leave footprints in price. Order blocks are the most reliable of these footprints.

### What an order block actually represents

When a large institution (bank, hedge fund) wants to buy $500M of an asset, they can't do it at one price without moving the market against themselves. They spread orders across a range. The result: a cluster of orders that, when price returns to that level, gets absorbed — causing reversals.

**Bullish Order Block:** The last bearish (down) candle before a significant bullish move. Why? Institutions accumulated buy orders in that candle range. When price returns, those orders act as support.

**Bearish Order Block:** The last bullish (up) candle before a significant bearish move. The inverse — institutions distributed sell orders there.

### The 4-step OB entry model

\`\`\`
Step 1: Identify higher timeframe bias (HTF)
        4H or Daily — is price bullish or bearish overall?

Step 2: Wait for BOS or CHoCH on execution TF
        15M or 5M — structural confirmation of direction

Step 3: Identify the OB that caused the displacement
        The candle immediately before the BOS move

Step 4: Wait for price to return to OB
        Enter on the first touch or a confirmation candle
\`\`\`

### V75 (Volatility 75 Index) specific considerations

V75 is a synthetic index simulating 75% annualized volatility. Key differences from forex:
- **No manipulation** from central banks or news — purely algorithmic
- **24/7 market** — SMC structures form cleanly without overnight gaps
- **Higher tick speed** — moves happen faster; use slightly wider SL to avoid premature stops
- **No spreads on most brokers** (unlike forex) — your SL/TP levels are exact

**V75 OB characteristics:**
- OBs on 5M and 15M are highly respected — backtesting shows 65-75% reaction rate
- The 1-minute timeframe has too much noise for reliable OB identification
- Prefer OBs that coincide with a Fair Value Gap (FVG) — adds confluence

### Position sizing under high volatility

V75 moves 500-1500 points in a single session. Sizing matters more than entry.

**Rule: Risk only 1-2% of account per trade.**

\`\`\`
Account: $1,000
Risk per trade: 1% = $10
SL distance: 200 points
Lot calculation: $10 / 200 = $0.05 per point
Position size: 0.05 lots (Deriv) = appropriate size
\`\`\`

Never size based on confidence level. Every trade has the same 1-2% risk regardless of how "perfect" the setup looks.

### Filtering bad OBs

Not every OB is tradeable. Discard if:
- The OB candle is very small (no institutional size behind it)
- Price has already visited the OB multiple times (mitigated OB = weaker)
- You're trading against the HTF bias
- OB is in a news/event void window (doesn't apply to V75, but matters for forex)
- The OB has a gap before price returns (quick return = better)

### The entry confirmation

Don't enter at the top of the OB. Wait for:
1. Price to reach OB zone
2. A **rejection candle** (wick rejecting the level, close inside OB) or
3. A **BOS on a lower TF** (5M OB reaction confirmed on 1M BOS)

This reduces entries but dramatically improves your win rate.`,
    quiz: [
      {
        q: 'On V75 5M chart, price makes a strong bullish displacement breaking above a swing high (BOS). You identify the last bearish candle before that move. Price returns to that candle\'s range. What is this zone called and what do you expect?',
        options: [
          'Fair Value Gap — price will continue down through it',
          'Bullish Order Block — expect price to react bullishly from this zone',
          'Change of Character — expect a trend reversal to bearish',
          'Premium zone — you should be looking to sell here',
        ],
        correct: 1,
        explanation: 'The last bearish candle before a bullish displacement is a Bullish Order Block. It represents where institutional buy orders were clustered. When price returns to this zone, those remaining orders absorb selling pressure — creating a bullish reaction. This is your buy zone.',
      },
      {
        q: 'You have a $500 V75 account. Your SL on a trade is 300 points. How many lots should you trade to risk exactly 1%?',
        options: [
          '0.1 lots',
          '0.017 lots (approximately)',
          '0.05 lots',
          '0.5 lots',
        ],
        correct: 1,
        explanation: '1% of $500 = $5 risk. Divide by SL distance: $5 / 300 points = $0.0167 per point ≈ 0.017 lots. This keeps your risk fixed regardless of SL distance. Never adjust risk percentage — adjust lot size instead.',
      },
      {
        q: 'You\'ve identified a perfect bearish OB setup but it\'s against the 4H bullish trend. What should you do?',
        options: [
          'Take the trade — the OB setup is too good to pass',
          'Skip the trade — trading against HTF bias is a low-probability entry',
          'Reduce position size by 50% and take the trade',
          'Wait for a CHoCH on the 4H before entering',
        ],
        correct: 1,
        explanation: 'HTF bias filters low-quality entries. A bearish OB against a bullish 4H trend is fighting institutional order flow. Even if it works occasionally, the risk/reward expectancy is negative over 100 trades. Wait for alignment between your entry TF and the HTF — only trade with the tide.',
      },
    ],
  },
  {
    id: 'biz-w1-d1',
    track: 'business',
    title: 'Pricing strategy: why you\'re leaving money on the table',
    subtitle: 'Value-based pricing, anchoring & packaging architecture',
    level: 'Masters',
    xp: 140,
    duration: 12,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'Business Strategy',
    keyTerms: [
      { term: 'Value-based pricing', definition: 'Setting price based on perceived value to the customer, not your cost to deliver. A $10 product that saves someone $1,000 can legitimately be priced at $500.' },
      { term: 'Price anchoring', definition: 'Presenting a high price first to make subsequent prices feel reasonable by comparison. The first number seen becomes the reference point for judgment.' },
      { term: 'Decoy pricing', definition: 'Adding a third option to make one of the other two look like an obvious better value — guiding customers toward your preferred choice.' },
      { term: 'Price elasticity', definition: 'How much demand changes when price changes. Inelastic = demand barely changes with price (luxury goods). Elastic = demand drops significantly with price increases.' },
    ],
    content: `## Why cost-plus pricing is killing your business

Most small business owners price like this: calculate costs, add 30%, call it a price. This is cost-plus pricing and it's one of the most value-destructive habits in business. It doesn't account for what customers actually value — and it caps your upside by tying price to your efficiency.

### Value-based pricing: the framework

The question is never "what does this cost me to deliver?" It's "what is this worth to the buyer?"

A website that generates 10 additional leads per month, at a $5,000 average client value, creates $50,000/month in potential revenue. Charging $3,000 for that website because "that's what competitors charge" is economically irrational.

**Value conversation formula:**
1. What outcome does your product/service create?
2. What is that outcome worth to the specific buyer?
3. Price at 10-30% of that value (perceived fair split)

### Packaging architecture

Don't sell one thing. Sell three options:

| Tier | Role | Target |
|---|---|---|
| Entry (low price) | Makes premium look reasonable | Price-sensitive prospects |
| Core (target tier) | What you actually want them to buy | Most customers |
| Premium (high price) | Anchor + aspirational | 10-20% of customers |

The entry tier's job is mostly psychological. The premium tier's job is to make the core tier look like a deal. 70% of customers will pick core.

### Anchoring in action

Always present your highest price first — in proposals, on pricing pages, in conversations. The brain anchors to the first number it sees and evaluates everything relative to it.

Example: Presenting $15,000/month before $5,000/month makes $5,000 feel affordable. Starting with $5,000 makes it feel expensive.

### The decoy effect

Add a clearly inferior option at a price close to your best option. Customers will almost always pick the better value.

\`\`\`
Option A: Basic  — $99/month (5 features)
Option B: Pro    — $249/month (12 features)  ← decoy
Option C: Scale  — $279/month (15 features)  ← target

Most customers pick C — only $30 more than B for 3 extra features.
\`\`\`

B exists to make C look like the obvious choice. This is Ariely's "predictably irrational" principle in action.

### Raising prices without losing clients

The #1 fear. Reality: most clients won't leave for a 20-30% price increase if you:
1. Give 30 days notice
2. Explain the value delivered
3. Position it as "investment in better service" not "cost increase"
4. Lock in existing clients at old rates for 90 days (creates goodwill)

Test price increases on new clients first. Only existing clients get the grace period.`,
    quiz: [
      {
        q: 'You deliver a social media service that generates approximately $8,000/month in new business for clients. What is the value-based pricing range for this service?',
        options: [
          '$200-400/month (cost-plus based on 10 hours of work)',
          '$800-2,400/month (10-30% of the $8,000 value created)',
          '$8,000/month (100% of value created)',
          '$4,000/month (50% of value created)',
        ],
        correct: 1,
        explanation: 'Value-based pricing targets 10-30% of the value created. If you generate $8,000/month for a client, charging $800-$2,400/month is economically rational — the client keeps 70-90% of the upside, you capture a fair share of the value you create. Never price on your cost to deliver.',
      },
    ],
  },
  {
    id: 'dsn-w1-d1',
    track: 'design',
    title: 'Brand systems: beyond the logo',
    subtitle: 'Visual identity architecture, design tokens & brand governance',
    level: 'Masters',
    xp: 140,
    duration: 11,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'Brand Design',
    keyTerms: [
      { term: 'Design token', definition: 'A named design decision stored as a variable (color, spacing, typography). Enables consistent design across all touchpoints by referencing a single source of truth.' },
      { term: 'Brand architecture', definition: 'How a company organizes its brands relative to each other — monolithic (one brand), endorsed (parent + sub), or house of brands (multiple independent brands).' },
      { term: 'Visual hierarchy', definition: 'The arrangement of elements to guide the eye through a composition in a specific order. Controlled through size, weight, color, contrast, and white space.' },
    ],
    content: `## Brand systems: the infrastructure of recognition

A logo is not a brand. A brand is the sum of every touchpoint a person has with your business — every email, every Instagram post, every invoice, every customer service interaction. A brand *system* is the architecture that keeps all of those consistent without micromanaging every decision.

### The layers of a brand system

\`\`\`
Foundation         Core values, mission, voice, personality
Identity           Logo, color palette, typography, iconography
Expression         Photography style, illustration, motion, layout
Application        Templates, components, usage guidelines
Governance         Who can change what, approval process
\`\`\`

Most brands build the identity layer and stop. The result: the Instagram looks nothing like the website, which looks nothing like the sales deck, which looks nothing like the packaging.

### Design tokens: the technical backbone

Design tokens are variables that store design decisions:

\`\`\`css
/* Instead of hardcoding everywhere */
color: #c9a84c;

/* You reference a token */
color: var(--color-brand-gold);
\`\`\`

When you decide to update your brand gold from #c9a84c to #d4ae55, you change one token and every touchpoint updates automatically. This is how enterprise brands maintain consistency across 50 products.

### Typography as personality

Type does more work than most designers realize:
- **Serif** = authority, tradition, editorial, luxury
- **Sans-serif** = modern, clean, accessible, tech
- **Monospace** = technical, precise, code-adjacent
- **Display/script** = personality, handcraft, uniqueness

For J Supreme Tech: sans-serif primary (tech, modern) with serif accents for editorial moments (pull quotes, headlines in "The Signal"). This combination signals: "technically capable but editorially sophisticated."

### The 60-30-10 color rule

In any composition:
- **60%** — your dominant/neutral color (usually white or black)
- **30%** — your secondary color (supporting, structural)
- **10%** — your accent (brand color, calls to action)

This is why JST's black-dominant, white-text, gold-accent system works — the gold never overwhelms because it only appears in the 10% role.

### Brand governance: the missing piece

The most sophisticated brand system fails without governance — rules for who can make exceptions and what approval is needed. For a small business:
1. Define what can never change (logo proportions, core colors)
2. Define what requires approval (new brand colors, new typefaces)
3. Define what designers can decide independently (layout variations, illustration style)

Without this, "brand drift" sets in — gradual, invisible erosion of consistency.`,
    quiz: [
      {
        q: 'Your design team is about to update the primary brand color across 6 websites, 3 apps, and 20 social templates. What system ensures this change is consistent and efficient?',
        options: [
          'Update each file manually and compare screenshots',
          'Send a brand memo to all designers with the new hex code',
          'Use design tokens — update one variable and all connected components update automatically',
          'Hire a brand manager to oversee each update',
        ],
        correct: 2,
        explanation: 'Design tokens are the correct solution. A single variable update propagates to every touchpoint that references it. Manual updates across 29+ files guarantees inconsistencies and missed files. Tokens are the technical foundation of scalable brand systems.',
      },
    ],
  },
  {
    id: 'mnd-w1-d1',
    track: 'mindset',
    title: 'Decision-making under uncertainty: the operator\'s edge',
    subtitle: 'Probabilistic thinking, second-order effects & decision logs',
    level: 'PhD',
    xp: 120,
    duration: 10,
    dayOfWeek: 1,
    weekNumber: 1,
    certArea: 'Executive Performance',
    keyTerms: [
      { term: 'Probabilistic thinking', definition: 'Reasoning in terms of likelihoods and ranges rather than binary yes/no certainties. Acknowledges that outcomes exist on a spectrum, not at a single point.' },
      { term: 'Second-order thinking', definition: 'Asking "and then what?" after your initial decision. First-order: fire the underperformer. Second-order: now the rest of the team wonders if they\'re next.' },
      { term: 'Opportunity cost', definition: 'The value of the best alternative you give up when making a choice. Every "yes" is a "no" to everything else you could do with that time, money, and attention.' },
      { term: 'Reversibility test', definition: 'Before a decision, ask: is this reversible? Reversible decisions can be made fast. Irreversible decisions require more deliberation.' },
    ],
    content: `## How operators make better decisions faster

Jeff Bezos called them Type 1 and Type 2 decisions. Type 1: irreversible, high stakes — decide slowly. Type 2: reversible, low stakes — decide fast. Most founders treat everything like Type 1, which is why they're slow. Most operators treat everything like Type 2, which is why they make catastrophic mistakes.

### The reversibility test

Before any significant decision, ask one question: **Can I undo this in 30 days without major damage?**

- Hiring a contractor: Yes → decide fast
- Signing a 2-year lease: No → deliberate carefully
- Running a new ad campaign: Yes → test immediately
- Pivoting your entire business model: No → gather data, seek input

The fastest operators I've studied don't make faster decisions across the board. They've correctly sorted decisions by type and apply different processes to each.

### Probabilistic thinking in practice

Binary thinking: "This campaign will work or it won't."
Probabilistic thinking: "There's a 65% chance this campaign breaks even or better, a 25% chance it delivers 3× ROAS, and a 10% chance it fails completely. Expected value is positive."

This framing allows rational risk-taking. If the downside of failure is tolerable and the expected value is positive — take the bet.

**The premortem technique:** Before launching, spend 10 minutes imagining it has failed completely. Why? You'll identify risks your optimistic brain was filtering out. Fix those before launch, not after.

### Second-order effects

First-order thinkers see immediate consequences. Second-order thinkers ask what happens next.

Example:
- First-order: Drop your price 30% → more customers
- Second-order: More customers → you're overwhelmed → quality drops → bad reviews → customers leave → you're worse off than before

Before any major decision, map at least two orders:
1. What is the immediate effect?
2. What does that cause?
3. What does *that* cause?

### The decision log

One of the highest-ROI habits: keep a running log of significant decisions with:
- Date
- Decision made
- Reasoning at the time
- Outcome (fill in later)

After 6 months, review your log. Pattern: what types of decisions do you get right? Which do you consistently get wrong? This is the fastest path to calibrating your judgment.

Most entrepreneurs are confident their intuition is good. Very few have data to support that belief. The decision log gives you data.

### Opportunity cost is always real

Every "yes" removes something else from the table. When you say yes to a new client project:
- You say no to working on your product
- You say no to rest (energy is finite)
- You say no to strategic thinking time

The question isn't just "is this worth doing?" It's "is this the *best* use of my capacity right now?"`,
    quiz: [
      {
        q: 'You\'re deciding whether to commit to a 12-month software subscription ($4,800) for a tool you haven\'t tested yet. Applying the reversibility test, what is the right approach?',
        options: [
          'Sign immediately if the tool looks good — time is money',
          'Ask for a month-to-month option or free trial first — this is an irreversible financial commitment that deserves deliberation',
          'Avoid the tool entirely — too risky',
          'Sign but negotiate a refund clause',
        ],
        correct: 1,
        explanation: 'A 12-month commitment is relatively irreversible. Applying the Type 2 decision framework: negotiate a trial period, free month, or month-to-month to make the decision reversible before committing to the full year. Converting an irreversible decision into a reversible one is the correct move when possible.',
      },
    ],
  },
  {
    id: 'mkt-w1-d2',
    track: 'marketing',
    title: 'Content strategy: building a content machine without burning out',
    subtitle: 'Content pillars, repurposing frameworks & sustainable posting cadence',
    level: 'Masters',
    xp: 160,
    duration: 13,
    dayOfWeek: 2,
    weekNumber: 1,
    certArea: 'Content Marketing',
    keyTerms: [
      { term: 'Content pillar', definition: 'A broad topic area that all your content maps back to. Typically 3-5 pillars define a brand\'s content universe and ensure strategic focus.' },
      { term: 'Content repurposing', definition: 'Transforming one piece of content into multiple formats (e.g., one blog post → 10 tweets, 3 Instagram carousels, 1 YouTube video, 1 email).' },
      { term: 'Content calendar', definition: 'A scheduled plan that shows what content will be published, on which platform, on which date. Prevents reactive, last-minute content creation.' },
      { term: 'Owned vs. earned vs. paid media', definition: 'Owned = your website, email list, social profiles. Earned = press, shares, word of mouth. Paid = ads. Sustainable brands build strong owned and earned before scaling paid.' },
    ],
    content: `## The content machine: sustainable, strategic, scalable

Most brands approach content like this: "We need to post something today." This reactive approach creates inconsistency, burnout, and zero strategic ROI.

The content machine approach: design the system once, run it repeatedly, improve it quarterly.

### Define your 3-5 content pillars

Content pillars are the recurring themes your brand speaks on. Everything you create maps to one of these.

For JST (example):
1. **Build** — product development, tech behind the scenes, launches
2. **Grow** — marketing tactics, social strategy, client results
3. **Think** — mindset, entrepreneurship, decision-making
4. **Teach** — tutorials, breakdowns, how-to content
5. **Prove** — social proof, case studies, testimonials

Every piece of content should clearly answer: which pillar is this? If it doesn't fit any pillar, it's probably off-brand.

### The content repurposing matrix

Create once, distribute many:

\`\`\`
Flagship piece (long-form)
    └── Blog post (1,500 words)
         ├── Email newsletter (500-word condensed)
         ├── Twitter/X thread (10 tweets)
         ├── Instagram carousel (10 slides)
         ├── LinkedIn post (500 words)
         ├── Instagram Reel script (60s)
         └── YouTube Short (60s)
\`\`\`

One flagship piece of content → 7 pieces of distribution content. Write the blog post once and spend 2 hours reformatting rather than 7 hours creating 7 separate pieces.

### Sustainable cadence by brand stage

| Stage | Social | Email | Blog |
|---|---|---|---|
| 0-1K followers | Daily | Weekly | 2×/month |
| 1K-10K | Daily stories + 3×/week feed | Weekly | Weekly |
| 10K+ | Daily multi-format | 2×/week | 2×/week |

Start lower. Consistency beats volume. A brand that posts 3× a week for 52 weeks beats one that posts 7× for 4 weeks then disappears.

### The weekly content workflow

Monday:
- Review previous week's performance
- Identify top-performing post (repurpose this week)
- Plan 5 posts for the week

Tuesday-Wednesday:
- Create all raw content in one session (batching)
- Film video content if applicable

Thursday:
- Edit, design, write captions
- Schedule everything via Meta Business Suite or Buffer

Friday:
- Review scheduled queue
- Write one long-form piece (blog/newsletter)

### What to measure

Don't measure vanity metrics. Measure:
- **Reach growth rate** (not just follower count)
- **Save rate** (saves ÷ reach) — saves indicate genuine value
- **Email click rate** (not open rate — open rate is unreliable since iOS changes)
- **Referral traffic from content** to your website

If your content isn't driving either audience growth or website traffic, the content isn't working strategically — regardless of likes.`,
    quiz: [
      {
        q: 'You write one in-depth blog post about social media strategy. Using the repurposing matrix, which of the following is the most efficient next step?',
        options: [
          'Write 6 more separate pieces of content from scratch for different platforms',
          'Extract key insights to create a Twitter thread, Instagram carousel, email newsletter, and YouTube Short script — all from the same source material',
          'Post a link to the blog post on all platforms and move on',
          'Wait to see if the blog post performs before creating more content',
        ],
        correct: 1,
        explanation: 'Content repurposing maximizes ROI per piece created. One flagship blog post can yield 4-7 additional content pieces with 2 hours of reformatting vs. 7+ hours creating from scratch. The key is working from the same core ideas and adapting format/length for each platform.',
      },
    ],
  },
  {
    id: 'tech-w1-d2',
    track: 'tech',
    title: 'Database design: the schema decisions that haunt you later',
    subtitle: 'Normalization, indexing strategy & schema evolution patterns',
    level: 'Masters',
    xp: 160,
    duration: 13,
    dayOfWeek: 2,
    weekNumber: 1,
    certArea: 'Backend Engineering',
    keyTerms: [
      { term: 'Normalization', definition: 'Organizing data to reduce redundancy. First Normal Form (no repeating groups), Second (no partial dependencies), Third (no transitive dependencies). Too much normalization can hurt performance.' },
      { term: 'Index', definition: 'A data structure that speeds up lookups on a column at the cost of write speed and storage. Essential for columns used in WHERE, JOIN, and ORDER BY clauses.' },
      { term: 'Foreign key', definition: 'A column that references the primary key of another table, enforcing referential integrity — preventing orphaned records.' },
      { term: 'Schema migration', definition: 'A versioned, trackable change to database structure. Running migrations ensures all environments (dev, staging, prod) stay in sync.' },
    ],
    content: `## The schema decisions that haunt you later

Good schema design is invisible. Bad schema design becomes a tax on every feature you build for years. The decisions you make in week 1 can cost you months of refactoring in year 2.

### The most common schema mistakes

**1. Storing arrays in a single column**

\`\`\`sql
-- Wrong
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tags TEXT  -- "design,tech,marketing"
);

-- Right
CREATE TABLE user_tags (
  user_id UUID REFERENCES users(id),
  tag TEXT,
  PRIMARY KEY (user_id, tag)
);
\`\`\`

Storing comma-separated values in a text column makes queries impossible without string parsing. You can't index it, can't filter efficiently, can't enforce uniqueness.

**2. Not planning for soft deletes**

Hard deletes (DELETE FROM ...) destroy data permanently and break audit trails. Add \`deleted_at TIMESTAMPTZ\` to every user-facing table from day one.

\`\`\`sql
-- Soft delete pattern
ALTER TABLE orders ADD COLUMN deleted_at TIMESTAMPTZ;

-- Your queries always filter:
SELECT * FROM orders WHERE deleted_at IS NULL;
\`\`\`

**3. Skipping timestamps**

Every table should have \`created_at\` and \`updated_at\`. You will need these for analytics, debugging, and rate limiting. Adding them retroactively to a table with millions of rows is painful.

### Indexing strategy

Indexes trade read speed for write overhead and storage. Rules:
- Index every foreign key column (Supabase/Postgres does NOT do this automatically)
- Index every column used in frequent WHERE filters
- Do NOT index columns with low cardinality (boolean flags, status enums with 3 values)
- Composite indexes: column order matters — most selective column first

\`\`\`sql
-- If you frequently query: WHERE user_id = ? AND status = 'active'
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- NOT: CREATE INDEX idx_orders_status_user ON orders(status, user_id)
-- (user_id is more selective — unique per user vs. 3 status values)
\`\`\`

### Schema evolution: migrations over mutations

Never modify production schema by hand in the DB GUI. Always:
1. Write a migration file
2. Test locally
3. Run in staging
4. Run in production

\`\`\`sql
-- migrations/0023_add_course_progress.sql
ALTER TABLE users ADD COLUMN xp_total INTEGER NOT NULL DEFAULT 0;
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ,
  quiz_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_progress_user ON course_progress(user_id);
\`\`\`

### The Supabase-specific additions

If using Supabase (Postgres):
- Enable Row Level Security (RLS) on every table from day one
- Use \`auth.uid()\` in RLS policies — never trust user-supplied IDs
- Use database functions for complex operations (reduces round-trips)
- Supabase Realtime requires \`REPLICA IDENTITY FULL\` on tables — set this intentionally, not accidentally on all tables

### When to denormalize intentionally

Normalization is great for write-heavy systems. For read-heavy analytics, denormalization helps:

\`\`\`sql
-- Normalized: requires 3 JOINs to get order total
-- Denormalized: store total_amount on orders table directly
ALTER TABLE orders ADD COLUMN total_amount NUMERIC(10,2);
\`\`\`

This is a trade-off: you duplicate data, but queries are 10× faster and simpler. Document the decision and the sync mechanism.`,
    quiz: [
      {
        q: 'You\'re building a query filter: "Show all orders where status is \'active\' AND user_id = [specific user]". Which index would be most efficient?',
        options: [
          'CREATE INDEX ON orders(status)',
          'CREATE INDEX ON orders(user_id, status) — user_id first since it\'s more selective',
          'CREATE INDEX ON orders(status, user_id) — status first for faster filtering',
          'No index needed — Postgres handles this automatically',
        ],
        correct: 1,
        explanation: 'Composite index column order: put the most selective column first. user_id is highly selective (one value per user), status has maybe 3-5 values. An index on (user_id, status) can immediately narrow to rows for that specific user, then filter by status — far more efficient than filtering all "active" orders across all users.',
      },
    ],
  },
  {
    id: 'trd-w1-d2',
    track: 'trading',
    title: 'Risk management: the only strategy that keeps you in the game',
    subtitle: 'Kelly Criterion, drawdown math & the psychology of losses',
    level: 'PhD',
    xp: 170,
    duration: 13,
    dayOfWeek: 2,
    weekNumber: 1,
    certArea: 'Risk & Capital Management',
    keyTerms: [
      { term: 'Kelly Criterion', definition: 'A mathematical formula for optimal bet sizing: f = (bp - q) / b, where b = odds, p = win rate, q = loss rate. Tells you the theoretically optimal fraction of capital to risk.' },
      { term: 'Maximum drawdown', definition: 'The largest peak-to-trough decline in account value, expressed as a percentage. A key risk metric — a 50% drawdown requires a 100% gain just to break even.' },
      { term: 'Risk of ruin', definition: 'The probability that a sequence of losses wipes out your trading account. Determined by risk per trade, win rate, and risk/reward ratio.' },
      { term: 'Expectancy', definition: 'Average profit/loss per trade: (Win Rate × Average Win) - (Loss Rate × Average Loss). Must be positive for a strategy to be profitable long-term.' },
    ],
    content: `## Risk management: the real edge

Every trader eventually learns this lesson. Some learn it early from studying. Most learn it the hard way from blowing accounts. The lesson: your entry and exit strategy matters far less than your risk management.

### The mathematics of ruin

If you risk 10% per trade with a 50% win rate and 1:1 risk/reward:

After 5 consecutive losses (which happen with 50% win rate roughly every 32 trades):
- Trade 1: $1,000 → $900 (lost 10%)
- Trade 2: $900 → $810
- Trade 3: $810 → $729
- Trade 4: $729 → $656
- Trade 5: $656 → $590

You've lost 41% of your account. To break even requires a 70% gain.

At 2% risk: after 5 losses you're down 9.6%. Requires 10.6% gain to break even. Survivable.

**Risk of ruin formula (simplified):**
\`\`\`
R = ((1-p) / p) ^ (N/r)
Where: p = win rate, N = account in units, r = risk per trade in units
\`\`\`

The math is unambiguous: small risk per trade is not "leaving money on the table" — it's the only mathematically sound approach.

### Kelly Criterion: optimal sizing

\`\`\`
f* = (bp - q) / b

b = ratio of average win to average loss (e.g., 1.5 for 1:1.5 R:R)
p = win probability (e.g., 0.55 for 55% win rate)
q = 1 - p = loss probability (0.45)

Example: f* = (1.5 × 0.55 - 0.45) / 1.5 = (0.825 - 0.45) / 1.5 = 0.25

Full Kelly says risk 25% of account per trade.
\`\`\`

Full Kelly is theoretically optimal but practically dangerous — it requires perfect knowledge of your real win rate and R:R, which you don't have. Most professional traders use **half-Kelly (12.5%)** or **quarter-Kelly (6.25%)** as safer implementations.

For retail traders on volatility indices: 1-2% is conservative and correct. You trade smaller size with higher frequency.

### Drawdown recovery math

| Drawdown | Recovery needed |
|---|---|
| 10% | 11.1% |
| 20% | 25% |
| 30% | 42.9% |
| 40% | 66.7% |
| 50% | 100% |
| 60% | 150% |

This asymmetry is why drawdown protection is more important than profit maximization. A bad month can undo 6 good months. Never let a drawdown exceed 20% of your peak account value before reducing size or stopping.

### The psychology of losses

Losses hurt approximately 2× more than equivalent gains feel good (Kahneman's loss aversion). This creates predictable trader mistakes:
- **Revenge trading** — taking impulsive trades after a loss to recover quickly. Amplifies losses.
- **Moving SL** — "I'll just give it a bit more room." The loss grows.
- **Not taking SL at all** — "It'll come back." Often results in the worst losses.
- **Averaging down** — adding to a losing position. Works until it catastrophically doesn't.

Rules for psychological safety:
1. Pre-define SL before entry, never during
2. Walk away after 3 losses in a session
3. Journal every trade — the act of writing reduces emotional decision-making
4. Treat daily loss limits as hard stops, not suggestions: if you lose 5% in a day, close the platform

### The expectancy formula in practice

\`\`\`
Strategy: 55% win rate, 1:1.5 risk/reward

Expectancy = (0.55 × 1.5) - (0.45 × 1)
           = 0.825 - 0.45
           = +0.375R per trade

Over 100 trades risking $10 each:
Expected profit = 100 × 0.375 × $10 = $375
\`\`\`

Positive expectancy + consistent execution + proper risk management = inevitable growth over enough trades. The only variable that ruins this: emotional decisions that break your system.`,
    quiz: [
      {
        q: 'A trader has a 45% win rate and 1:2 risk/reward. They risk 2% per trade. What is their expectancy per trade, and is this strategy profitable?',
        options: [
          'Expectancy = -0.1R. Not profitable — win rate too low.',
          'Expectancy = +0.35R. Profitable — the 1:2 R:R compensates for the below-50% win rate.',
          'Expectancy = +0.45R. Profitable.',
          'Cannot determine without knowing account size.',
        ],
        correct: 1,
        explanation: 'Expectancy = (0.45 × 2) - (0.55 × 1) = 0.90 - 0.55 = +0.35R per trade. A strategy can be profitable with a win rate below 50% if the average win is significantly larger than the average loss. At 1:2 R:R, you only need to win 33.3% of trades to break even.',
      },
    ],
  },
]

export function getCoursesByDay(weekNumber: number, dayOfWeek: number): Course[] {
  return COURSES.filter(c => c.weekNumber === weekNumber && c.dayOfWeek === dayOfWeek)
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}

export function getAllTracks(): Track[] {
  return ['marketing', 'tech', 'trading', 'business', 'design', 'mindset']
}

export function getCoursesByTrack(track: Track): Course[] {
  return COURSES.filter(c => c.track === track)
}
