import type { Course } from '../courses'

export const crashMarketingDegreeCourses: Course[] = [
  {
    id: 'cc-mktg-degree-1',
    track: 'crash',
    title: 'Marketing Strategy & Positioning',
    subtitle: 'The STP model, value propositions, and competitive positioning frameworks every marketer needs.',
    level: 'Masters',
    xp: 130,
    duration: 14,
    module: 1,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'STP Model', definition: 'Segmentation, Targeting, Positioning — the three-step framework for defining who your customer is, which segment to pursue, and how to occupy a distinct place in their mind.' },
      { term: 'Value Proposition', definition: 'A clear statement that explains how your product solves a customer problem, delivers benefits, and why it is better than the alternative. The foundation of all marketing copy.' },
      { term: 'Perceptual Map', definition: 'A two-axis chart plotting brands by attributes (e.g. price vs. quality) to visualize competitive space and identify positioning gaps.' },
      { term: 'Competitive Moat', definition: 'A durable structural advantage — network effects, switching costs, cost advantages, or intangible assets — that makes it hard for competitors to erode your position.' },
      { term: 'Category Design', definition: 'The practice of creating or redefining a market category so that your product becomes the obvious default. Companies that win the category typically capture 76% of the category\'s total market cap.' },
    ],
    content: `## Marketing Strategy & Positioning

### Why Strategy Comes Before Tactics

Most developers and founders jump straight to tactics — which ad platform to use, what to post, how to write copy. This is backwards. Every tactic is an expression of a strategy, and every strategy must begin with positioning. Get positioning wrong and you will waste money on ads that fail to convert, write copy that resonates with no one, and build features that the right customers do not value.

The marketing degree starts here because positioning is the upstream constraint for every downstream decision.

---

### The STP Framework

STP — Segmentation, Targeting, Positioning — is the foundational framework taught in every marketing degree program. It answers three sequential questions:

**1. Segmentation: Who exists in this market?**

A market is not homogeneous. Customers differ by need, behavior, demographics, and willingness to pay. Segmentation is the act of dividing the total addressable market (TAM) into meaningful, distinct groups.

There are four segmentation dimensions:

- **Demographic** — age, income, education, job title, company size (for B2B)
- **Geographic** — region, climate, urban vs. rural, country
- **Psychographic** — values, lifestyle, personality, risk tolerance
- **Behavioral** — usage frequency, purchase occasion, benefit sought, loyalty status

Good segments share three properties: they are **measurable** (you can quantify the size), **accessible** (you can reach them via media or sales), and **actionable** (you can serve them distinctly from other segments).

**2. Targeting: Which segment should we pursue?**

Not every segment is equally attractive. Evaluate each against:

- **Segment size** — is there enough revenue potential?
- **Growth rate** — is the segment expanding or contracting?
- **Competitive intensity** — how many rivals serve this segment well?
- **Fit with capabilities** — can your company serve this segment better than alternatives?
- **Margin potential** — will this segment pay prices that support your cost structure?

The biggest strategic mistake is targeting everyone. "Our product is for everyone" means your positioning is for no one. Narrow targeting feels counterintuitive but produces stronger conversion, better retention, and defensible word-of-mouth.

**3. Positioning: How should we occupy the target segment's mind?**

Positioning is not what you do to your product. It is what you do to the mind of the prospect. Al Ries and Jack Trout defined this in their 1981 book *Positioning*, and it remains the most accurate framing.

A positioning statement follows this template:

> For **[target customer]**, **[brand name]** is the **[frame of reference / category]** that **[key benefit / point of differentiation]** because **[reason to believe]**.

Example: *For independent software developers who need backend infrastructure, Supabase is the open-source Firebase alternative that gives them a full Postgres database with real-time and auth in minutes, because it is built on standard open-source tools they already understand.*

---

### Value Proposition Design

A value proposition is not a tagline. It is a structured analysis of the exchange between your product and your customer. The best framework for building one is the **Value Proposition Canvas** (Osterwalder, 2014), which has two sides:

**Customer Profile:**
- *Jobs to be done* — functional, social, and emotional tasks the customer is trying to accomplish
- *Pains* — obstacles, frustrations, and risks in getting the job done
- *Gains* — outcomes and benefits the customer hopes for

**Value Map:**
- *Products and services* — what you offer
- *Pain relievers* — how your product reduces or eliminates customer pains
- *Gain creators* — how your product delivers outcomes customers want

Fit is achieved when your pain relievers address the most critical pains and your gain creators deliver the most important gains. Most products achieve partial fit — they solve some pains but create new ones (complexity, cost, learning curve). Finding fit is an iterative research process, not a one-time exercise.

---

### Competitive Positioning Frameworks

**Porter's Generic Strategies (1980)**

Michael Porter argued firms must choose between three strategies or risk being "stuck in the middle":

1. **Cost leadership** — compete on lowest price (Walmart, Ryanair)
2. **Differentiation** — compete on unique attributes that justify a premium (Apple, Tesla)
3. **Focus** — serve a narrow niche with either cost or differentiation advantage

**Blue Ocean Strategy**

Kim and Mauborgne (2005) propose that companies escape competition by creating uncontested market space — a "blue ocean" — rather than fighting in a "red ocean" of existing competition. The ERRC grid (Eliminate, Reduce, Raise, Create) forces you to question industry assumptions about what attributes a product must have.

**Perceptual Mapping**

Draw a two-axis chart. Each axis represents an attribute that matters to your target customer (price vs. performance, traditional vs. innovative, simple vs. powerful). Plot competitors. Look for open space with demand — that is your positioning gap.

---

### Positioning Errors to Avoid

- **Underpositioning** — the brand has no clear, distinct position; customers do not know what it stands for
- **Overpositioning** — too narrow; customers think the brand is only for a tiny niche even when it could serve more
- **Confused positioning** — too many messages; the brand stands for different things to different people
- **Repositioning too fast** — brand equity is destroyed by constant pivots; Nike has said "Just Do It" for 35 years

---

### Category Design

The most aggressive positioning strategy is not to fight for share in an existing category but to create a new one. Salesforce did not compete with Siebel as "a better CRM" — it invented the "cloud CRM" category and defined the rules. Uber did not compete with taxis — it created "ridesharing." When you own the category definition, you set the evaluation criteria, and competitors are implicitly judged against your standard.

Category design requires: a problem narrative (the old way is broken), a new category name (clear, memorable, searchable), and a point of view document that educates the market on why the category matters.`,
    quiz: [
      {
        q: 'In the STP framework, what does "Targeting" specifically refer to?',
        options: [
          'Writing ad copy for each audience segment',
          'Evaluating and selecting the most attractive segment(s) to pursue from those identified',
          'Defining your product features to match customer needs',
          'Setting a budget for paid acquisition campaigns'
        ],
        correct: 1,
        explanation: 'Targeting follows segmentation. You have identified distinct groups — now you evaluate each on size, growth, competitive intensity, and strategic fit to decide which to pursue. It is a strategic selection decision, not a creative or budgetary one.'
      },
      {
        q: 'A value proposition is best described as:',
        options: [
          'Your company\'s mission statement',
          'A structured explanation of how your product solves a customer\'s problem better than the alternative',
          'Your price-to-value ratio compared to competitors',
          'The elevator pitch you use with investors'
        ],
        correct: 1,
        explanation: 'A value proposition is customer-facing and problem-centered. It explains the job-to-be-done, the pains it relieves, the gains it creates, and why your product achieves this better than alternatives. It is not a mission statement or an investor pitch.'
      },
      {
        q: 'Which of the following is a "Blue Ocean" move?',
        options: [
          'Cutting your price 10% below the market leader',
          'Adding more features than competitors to win on product breadth',
          'Creating a new market category where no direct competition exists yet',
          'Targeting the largest existing customer segment more aggressively'
        ],
        correct: 2,
        explanation: 'Blue Ocean Strategy (Kim & Mauborgne) is about creating uncontested market space rather than competing in existing categories. Price cuts and feature additions are red ocean moves — they intensify competition rather than escape it.'
      },
      {
        q: 'What is "confused positioning"?',
        options: [
          'When the company does not know its own segment',
          'When the brand sends too many messages, standing for different things to different audiences',
          'When the product is positioned in the wrong price tier',
          'When a company enters a market it does not understand'
        ],
        correct: 1,
        explanation: 'Confused positioning occurs when the brand tries to be everything to everyone and ends up meaning nothing specific to anyone. It is caused by inconsistent messaging, too many product lines with no unifying idea, or constant strategic pivots.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a positioning score calculator. Given a target segment and a set of competitors, calculate a Positioning Attractiveness Score (PAS) for each based on: segment size (0-10), growth rate (0-10), competitive intensity (inverted: 10 = low competition), and company fit (0-10). Return the highest-scoring segment and a recommendation.',
      starterCode: `// Positioning Attractiveness Score Calculator
// Each segment has: size, growth, competition (lower is better), fit

const segments = [
  { name: 'Enterprise SaaS (500+ employees)', size: 7, growth: 8, competition: 3, fit: 6 },
  { name: 'SMB (10-50 employees)',             size: 8, growth: 6, competition: 7, fit: 9 },
  { name: 'Freelancers & Solopreneurs',        size: 9, growth: 9, competition: 8, fit: 7 },
  { name: 'Agency Clients',                    size: 5, growth: 5, competition: 5, fit: 8 },
];

function calcPositioningScore(segment) {
  // TODO: PAS = (size + growth + (10 - competition) + fit) / 4
  // competition is inverted: low competition = high score
}

function findBestSegment(segments) {
  // TODO: map each segment to its PAS score
  // TODO: return the segment with the highest score
  // TODO: also return a simple recommendation string
}

// TODO: log each segment with its score, then log the best one
`,
      solution: `const segments = [
  { name: 'Enterprise SaaS (500+ employees)', size: 7, growth: 8, competition: 3, fit: 6 },
  { name: 'SMB (10-50 employees)',             size: 8, growth: 6, competition: 7, fit: 9 },
  { name: 'Freelancers & Solopreneurs',        size: 9, growth: 9, competition: 8, fit: 7 },
  { name: 'Agency Clients',                    size: 5, growth: 5, competition: 5, fit: 8 },
];

function calcPositioningScore(segment) {
  const { size, growth, competition, fit } = segment;
  return ((size + growth + (10 - competition) + fit) / 4).toFixed(2);
}

function findBestSegment(segments) {
  const scored = segments.map(s => ({ ...s, pas: parseFloat(calcPositioningScore(s)) }));
  scored.sort((a, b) => b.pas - a.pas);
  const best = scored[0];
  return {
    best,
    recommendation: \`Target "\${best.name}" — PAS \${best.pas}/10. Strong fit + favorable competitive intensity.\`
  };
}

segments.forEach(s => {
  console.log(\`\${s.name.padEnd(40)} PAS: \${calcPositioningScore(s)}\`);
});

const { best, recommendation } = findBestSegment(segments);
console.log('\\n--- Best Segment ---');
console.log(recommendation);
`,
    },
  },

  {
    id: 'cc-mktg-degree-2',
    track: 'crash',
    title: 'Consumer Psychology & Behavior',
    subtitle: 'How people actually make buying decisions — cognitive biases, motivation, and the buyer journey.',
    level: 'Masters',
    xp: 135,
    duration: 14,
    module: 2,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Cognitive Bias', definition: 'A systematic pattern of deviation from rational judgment. Marketers leverage biases like anchoring, social proof, and loss aversion to shift perceived value without changing the product.' },
      { term: 'Loss Aversion', definition: 'Kahneman and Tversky\'s finding that the pain of losing $100 is psychologically twice as powerful as the pleasure of gaining $100. Marketing framed around avoiding loss often outperforms equivalent gain-framed messaging.' },
      { term: 'Buyer Journey', definition: 'The active research and decision process a buyer goes through prior to purchase: Awareness → Consideration → Decision. Marketing content must match the information need at each stage.' },
      { term: 'Jobs-to-be-Done (JTBD)', definition: 'A framework (Christensen) that frames purchases as customers "hiring" a product to do a specific job. Understanding the job reveals true competitors and messaging that resonates.' },
      { term: 'Social Proof', definition: 'The tendency to conform to what others are doing when uncertain. Reviews, case studies, user counts, and testimonials all activate social proof and reduce purchase risk perception.' },
      { term: 'Dual Process Theory', definition: 'Kahneman\'s System 1 (fast, emotional, heuristic) and System 2 (slow, deliberate, analytical) model of thinking. Most purchase decisions begin in System 1 and are rationalized by System 2 afterward.' },
    ],
    content: `## Consumer Psychology & Behavior

### How Decisions Are Actually Made

The rational economic model of consumer decision-making — in which buyers gather information, evaluate alternatives, and choose the option that maximizes utility — is descriptively wrong. Decades of behavioral economics research, led by Daniel Kahneman, Amos Tversky, Dan Ariely, and Robert Cialdini, show that humans are predictably irrational. Understanding these predictable irrationalities is the marketing psychologist's competitive advantage.

---

### Dual Process Theory: System 1 and System 2

Kahneman's framework (from *Thinking, Fast and Slow*, 2011) is the most important model in behavioral economics:

**System 1** — fast, automatic, unconscious, associative. It handles most of what we do. It forms first impressions, emotional reactions, and pattern recognition. A logo triggers a mood. A price ending in 9 feels "like a deal." A celebrity endorsement creates an association without explicit reasoning.

**System 2** — slow, deliberate, effortful, logical. It is invoked for hard decisions. Reading a product comparison table, evaluating contract terms, or calculating ROI are System 2 activities.

Most purchase decisions begin in System 1 and are rationalized by System 2 afterward. The implication for marketers: emotional resonance, visual identity, and first impressions are not superficial — they are upstream of all analytical evaluation. If System 1 has already rejected your brand, System 2 rarely overrules it.

---

### Key Cognitive Biases in Marketing

**Anchoring Effect**
The first number seen serves as a reference point for all subsequent evaluations. Show the original price before the sale price. Start pricing with the premium tier. A $99/month plan looks reasonable after the visitor has seen the $299/month Enterprise tier.

**Social Proof**
"Over 50,000 developers trust JST Academy." "Join 12,000 subscribers." Star ratings, user counts, logos of recognizable customers — all of these reduce perceived risk and increase conversion. Social proof is strongest when the reference group matches the buyer's identity.

**Loss Aversion**
Framing a message around avoiding a loss outperforms equivalent gain framing. "Don't lose customers to slow load times" converts better than "Gain faster load times." "You're leaving $2,000 on the table" outperforms "Earn $2,000 more." Kahneman and Tversky quantified this: losses are felt approximately 2x as intensely as equivalent gains.

**Scarcity and Urgency**
Limited availability (only 3 left) and time pressure (offer ends Sunday) activate loss aversion. These must be genuine — false scarcity destroys trust rapidly once discovered.

**The Decoy Effect**
Adding a third, inferior option (the decoy) makes the preferred option look comparatively better. If you offer a $10/month Basic and a $25/month Pro, conversion to Pro increases when you add a $23/month "Advanced" tier with fewer features than Pro. The decoy makes Pro's value obvious by comparison.

**The Peak-End Rule**
People judge an experience by its most intense moment (peak) and its final moment (end), not the average across the experience. A customer who had a 90% great experience but a terrible offboarding remembers the bad offboarding. Optimize the peak and the end of every customer journey.

---

### The Buyer Journey

The buyer journey model maps the stages a prospect moves through before purchase:

**1. Awareness Stage**
The buyer has a problem or pain but may not know solutions exist. Content goal: educate about the problem. Formats: blog posts, social content, podcasts, thought leadership. Metrics: reach, impressions, brand search volume.

**2. Consideration Stage**
The buyer is actively researching categories and alternatives. Content goal: help them evaluate. Formats: comparison guides, webinars, case studies, email nurture sequences, demos. Metrics: email subscribers, demo requests, content engagement time.

**3. Decision Stage**
The buyer is choosing between a short list of vendors. Content goal: remove objections and reduce risk. Formats: free trials, pricing pages, testimonials, implementation guides, ROI calculators. Metrics: trial activations, proposal requests, conversion rate.

Most marketing content is created for awareness but most revenue is lost in decision. Audit your content library: if 80% is awareness content and you have nothing that handles decision-stage objections, that is where to invest.

---

### Jobs-to-be-Done Framework

Clayton Christensen observed that people do not buy products — they "hire" them to make progress in a specific situation. The famous example: people who bought milkshakes on their morning commute were not hiring a milkshake because they were hungry. They were hiring it because it was a one-handed, slow-consumption item that made the commute less boring and kept them full until lunch. The competitor was not other shakes — it was bananas, bagels, and boredom.

JTBD forces you to ask: what situation triggers the hire? What progress is the customer trying to make? What are the functional, emotional, and social dimensions of that progress? What would cause them to "fire" your product?

This framework consistently reveals non-obvious competitors and unlocks messaging that resonates because it names the actual situation the customer is in, rather than describing product features abstractly.

---

### Motivation: Maslow and Beyond

Maslow's hierarchy (physiological → safety → belonging → esteem → self-actualization) is overused and oversimplified, but the core insight remains: people are motivated by different things at different life stages, and effective marketing activates the relevant motivational layer.

Luxury brands activate esteem and identity. Community products activate belonging. Security software activates safety. The mistake is trying to activate self-actualization needs with a product that actually addresses belonging (e.g., a social app marketed as "be your best self" when its actual value is connection).

---

### Cialdini's Six Principles of Influence

Robert Cialdini's *Influence* (1984) identified six principles that reliably shift human behavior:

1. **Reciprocity** — people return favors. Giving value before asking activates this (free content, free trials, free tools).
2. **Commitment and consistency** — once people commit to a small action, they align subsequent behavior with it. Getting a micro-commitment (email signup, free trial) increases full conversion.
3. **Social proof** — covered above.
4. **Authority** — credentials, expertise signals, and institutional affiliations increase trust.
5. **Liking** — people say yes to people and brands they like. Relatability, similarity, and genuine warmth build this.
6. **Scarcity** — covered above.

Understanding these principles does not just help you sell — it helps you recognize when they are being weaponized against you, making you a more critical consumer of marketing.`,
    quiz: [
      {
        q: 'According to Dual Process Theory, why do emotional brand associations matter more than many marketers expect?',
        options: [
          'Emotional ads have higher recall in focus groups',
          'System 1 forms first impressions before System 2 analytical evaluation begins — if System 1 has rejected the brand, rational arguments rarely reverse it',
          'Emotions predict long-term loyalty better than satisfaction scores',
          'Emotional buyers have higher average order values'
        ],
        correct: 1,
        explanation: 'Kahneman\'s model shows that System 1 (fast, emotional) runs before System 2 (deliberate, analytical). Most buying decisions are initiated and often completed by System 1. Marketers who focus only on rational arguments are addressing System 2 while System 1 has already made a judgment.'
      },
      {
        q: 'A pricing page shows three tiers: Basic ($9), Advanced ($23), Pro ($25). The Advanced tier has fewer features than Pro. What psychological effect is this using?',
        options: [
          'Anchoring — the first price sets the reference',
          'The Decoy Effect — the inferior middle option makes Pro look like the obvious value',
          'Loss Aversion — customers fear missing Pro features',
          'Social Proof — the middle tier signals the average customer choice'
        ],
        correct: 1,
        explanation: 'The Decoy Effect uses an asymmetrically inferior third option to make the target option look clearly superior. Advanced ($23, fewer features) makes Pro ($25, more features) appear to be an obvious bargain, increasing Pro conversions significantly.'
      },
      {
        q: 'What does the Jobs-to-be-Done framework reveal that traditional demographic targeting misses?',
        options: [
          'The exact age and income of your customer',
          'The situation that triggers purchase and the functional, emotional, and social progress the customer is trying to make',
          'Which social media platform your customer uses',
          'The customer\'s lifetime value potential'
        ],
        correct: 1,
        explanation: 'JTBD focuses on the triggering situation and the progress desired — not who the customer is demographically. This reveals non-obvious competitors (the milkshake competing with bananas and boredom) and messaging that resonates because it names the customer\'s real situation.'
      },
      {
        q: 'Which of Cialdini\'s six principles does a "free trial, no credit card required" offer primarily activate?',
        options: [
          'Scarcity',
          'Authority',
          'Reciprocity and Commitment — giving free value activates reciprocity; getting the signup activates commitment consistency',
          'Social Proof'
        ],
        correct: 2,
        explanation: 'Free trials activate reciprocity (you gave them value without immediate obligation, creating a psychological debt) and commitment consistency (once signed up, users align subsequent behavior with having chosen your product). This is why free trials convert to paid at higher rates than demo requests alone.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a Buyer Journey Stage Classifier. Given a list of customer touchpoints (actions they took), score each prospect\'s readiness (0-100) and classify them as Awareness, Consideration, or Decision stage. Use weighted signals: visited pricing page (30pts), requested demo (40pts), opened 3+ emails (15pts), read case study (20pts), visited blog (5pts), viewed comparison page (25pts).',
      starterCode: `// Buyer Journey Stage Classifier

const touchpointWeights = {
  visitedPricing:    30,
  requestedDemo:     40,
  opened3Emails:     15,
  readCaseStudy:     20,
  visitedBlog:        5,
  viewedComparison:  25,
};

const prospects = [
  { name: 'Alice',   visitedPricing: true,  requestedDemo: false, opened3Emails: true,  readCaseStudy: false, visitedBlog: true,  viewedComparison: false },
  { name: 'Bob',     visitedPricing: true,  requestedDemo: true,  opened3Emails: true,  readCaseStudy: true,  visitedBlog: false, viewedComparison: true  },
  { name: 'Carol',   visitedPricing: false, requestedDemo: false, opened3Emails: false, readCaseStudy: false, visitedBlog: true,  viewedComparison: false },
  { name: 'David',   visitedPricing: true,  requestedDemo: false, opened3Emails: true,  readCaseStudy: true,  visitedBlog: true,  viewedComparison: true  },
];

function calcReadinessScore(prospect) {
  // TODO: sum weights for each true touchpoint
}

function classifyStage(score) {
  // TODO: 0-29 = 'Awareness', 30-59 = 'Consideration', 60+ = 'Decision'
}

// TODO: log each prospect with their score and stage
`,
      solution: `const touchpointWeights = {
  visitedPricing:    30,
  requestedDemo:     40,
  opened3Emails:     15,
  readCaseStudy:     20,
  visitedBlog:        5,
  viewedComparison:  25,
};

const prospects = [
  { name: 'Alice',   visitedPricing: true,  requestedDemo: false, opened3Emails: true,  readCaseStudy: false, visitedBlog: true,  viewedComparison: false },
  { name: 'Bob',     visitedPricing: true,  requestedDemo: true,  opened3Emails: true,  readCaseStudy: true,  visitedBlog: false, viewedComparison: true  },
  { name: 'Carol',   visitedPricing: false, requestedDemo: false, opened3Emails: false, readCaseStudy: false, visitedBlog: true,  viewedComparison: false },
  { name: 'David',   visitedPricing: true,  requestedDemo: false, opened3Emails: true,  readCaseStudy: true,  visitedBlog: true,  viewedComparison: true  },
];

function calcReadinessScore(prospect) {
  return Object.entries(touchpointWeights).reduce((total, [key, weight]) => {
    return total + (prospect[key] ? weight : 0);
  }, 0);
}

function classifyStage(score) {
  if (score >= 60) return 'Decision';
  if (score >= 30) return 'Consideration';
  return 'Awareness';
}

prospects.forEach(p => {
  const score = calcReadinessScore(p);
  const stage = classifyStage(score);
  console.log(\`\${p.name.padEnd(8)} Score: \${String(score).padStart(3)}  Stage: \${stage}\`);
});
`,
    },
  },

  {
    id: 'cc-mktg-degree-3',
    track: 'crash',
    title: 'Brand Management',
    subtitle: 'Brand equity, identity systems, architecture models, and how strong brands are built and protected.',
    level: 'Masters',
    xp: 130,
    duration: 13,
    module: 3,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Brand Equity', definition: 'The premium value a product commands because of its brand name rather than its functional attributes. Measured by willingness to pay a premium, loyalty rates, and the ability to extend into new categories.' },
      { term: 'Brand Architecture', definition: 'The structural organization of brands within a portfolio. The three models are: Branded House (all products under one brand, e.g. Virgin), House of Brands (separate brands, e.g. P&G), and Endorsed Brand.' },
      { term: 'Brand Identity Prism', definition: 'Kapferer\'s six-sided model: Physique, Personality, Culture, Relationship, Reflection, and Self-Image. Describes how a brand expresses itself and what it means to its customers.' },
      { term: 'Brand Extension', definition: 'Applying an existing brand to a new product category. Successful when the new category shares brand associations (e.g. Apple into services); risky when it dilutes the core identity.' },
      { term: 'Brand Dilution', definition: 'Erosion of brand equity caused by extending into too many categories, inconsistent quality, or over-discounting. Once diluted, brand equity is difficult to recover.' },
    ],
    content: `## Brand Management

### What a Brand Actually Is

A brand is not a logo, a color palette, or a tagline. A brand is a set of associations, expectations, and emotions that exist in the minds of people who have encountered it. The visual identity system — logo, typography, colors — is the trigger that activates those associations, but the associations themselves are the brand.

This distinction matters because it means brand is built through every customer experience, not just advertising. A customer support interaction, the quality of your onboarding email, the packaging that arrives, the speed of your app — these are all brand-building moments.

---

### Brand Equity: Why It Matters Financially

David Aaker's brand equity model (1991) defines brand equity as the set of assets and liabilities linked to a brand that add or subtract value. His five components are:

1. **Brand loyalty** — what percentage of buyers repurchase without evaluating alternatives?
2. **Brand awareness** — is the brand in the consideration set when the category need arises?
3. **Perceived quality** — does the brand command a quality perception above its actual product attributes?
4. **Brand associations** — what images, ideas, emotions, and values does the brand trigger?
5. **Other proprietary assets** — trademarks, patents, channel relationships

The financial implication is concrete: Coca-Cola's brand is valued at approximately $35 billion, separate from its physical assets. Brand equity translates directly into pricing power (the ability to charge more), customer acquisition efficiency (people seek you out rather than needing to be found), retention (loyalty reduces churn), and talent acquisition (people want to work for strong brands).

---

### Keller's Brand Equity Model (CBBE)

Kevin Lane Keller built on Aaker with the Customer-Based Brand Equity pyramid, showing that brand equity is built from the bottom up:

**Level 1 — Salience**: Who are you? Is the brand in the customer's awareness and consideration set for the relevant need?

**Level 2 — Performance and Imagery**: What are you? Performance addresses functional attributes; imagery addresses the social and psychological associations.

**Level 3 — Judgments and Feelings**: What do I think or feel about you? Judgments are rational evaluations (quality, credibility, consideration, superiority). Feelings are emotional responses (warmth, fun, excitement, security, social approval, self-respect).

**Level 4 — Resonance**: What relationship do I have with you? Resonance is the pinnacle — it describes behavioral loyalty, attitudinal attachment, sense of community, and active engagement (users who evangelize without being asked).

The pyramid model is useful for audits: if a brand scores low on resonance, the diagnosis must trace back to which lower level is weak. Poor resonance often traces to unaddressed performance gaps or inconsistent quality, not creative failures.

---

### Brand Identity Systems

A brand identity system is the complete set of visual and verbal elements that present the brand consistently across touchpoints. It includes:

**Visual identity:**
- Logo (wordmark, symbol, combination mark)
- Color palette (primary, secondary, semantic)
- Typography (primary typeface, secondary typeface, hierarchy rules)
- Iconography and illustration style
- Photography and video style guide

**Verbal identity:**
- Brand voice and tone guidelines
- Messaging hierarchy (brand promise → value proposition → proof points)
- Naming conventions
- Terminology and vocabulary (words you own vs. words you avoid)

The purpose of a brand identity system is not aesthetic — it is cognitive efficiency. Consistent visual and verbal signals reduce the cognitive load for customers, build pattern recognition, and accelerate the associations that drive conversion and loyalty.

---

### Kapferer's Brand Identity Prism

Jean-Noël Kapferer's six-facet model describes a brand from two dimensions: externalization (outward-facing) vs. internalization (inward-facing), and sender (brand as source) vs. receiver (customer as target).

The six facets:
1. **Physique** — the brand's tangible characteristics (Apple: sleek, premium hardware)
2. **Personality** — the brand's human character (Apple: creative, rebellious, sophisticated)
3. **Culture** — the values and principles driving the brand (Apple: design excellence, simplicity, individual empowerment)
4. **Relationship** — the mode of conduct between brand and customer (Apple: curator/member, aspiration + belonging)
5. **Reflection** — the customer the brand reflects in its communication (Apple: the creative professional)
6. **Self-image** — how customers see themselves when using the brand (Apple: "I am creative and ahead of the curve")

When any facet is inconsistent with the others, customers feel cognitive dissonance and brand credibility declines.

---

### Brand Architecture Models

When a company has multiple products or sub-brands, it must choose how to organize them:

**Branded House (Monolithic)**
All products carry the parent brand. Example: Virgin (Virgin Atlantic, Virgin Mobile, Virgin Money), FedEx. Advantages: every new product benefits from the parent equity. Disadvantages: failure in one category tarnishes the parent.

**House of Brands (Pluralistic)**
Each product has its own brand with no visible corporate connection. Example: Procter & Gamble (Tide, Gillette, Pampers, Olay), Unilever. Advantages: each brand can be positioned independently; failures are contained. Disadvantages: no synergy; expensive to build and maintain multiple brands.

**Endorsed Brand**
Products have their own names but carry the parent brand's endorsement. Example: Marriott (Courtyard by Marriott, Ritz-Carlton A Marriott Company). The parent lends credibility without dominating.

---

### Brand Extension vs. Line Extension

A **line extension** adds a variant within the same category (Colgate Total, Colgate Whitening, Colgate Sensitive). Risk: SKU proliferation and brand blur.

A **brand extension** moves into a new category (Apple into financial services via Apple Card, or Dyson from vacuums into hair dryers). Success requires that the brand associations transfer credibly. Failed extensions dilute equity: when Bic tried to extend from pens to perfume, the disposable/cheap associations made the product feel inappropriate.

The golden rule: extend into categories where your brand's core associations are a genuine advantage, not just where there is revenue opportunity.`,
    quiz: [
      {
        q: 'What is the key financial reason brand equity matters beyond marketing metrics?',
        options: [
          'It improves advertising click-through rates',
          'It enables pricing power, reduces CAC through organic demand, and increases retention — all of which directly improve unit economics',
          'It increases social media follower count',
          'It simplifies the product roadmap'
        ],
        correct: 1,
        explanation: 'Brand equity creates compounding financial advantages: pricing power (charge more for the same product), lower CAC (customers seek you out vs. needing to be acquired), higher retention (loyalty reduces churn), and talent advantages. These are why brand equity shows up on balance sheets in acquisitions.'
      },
      {
        q: 'In Keller\'s CBBE pyramid, what does "Resonance" represent?',
        options: [
          'Customers can recall your brand name',
          'Customers feel the brand is high quality',
          'Customers have behavioral loyalty, attitudinal attachment, and actively advocate for the brand',
          'Customers associate the brand with positive imagery'
        ],
        correct: 2,
        explanation: 'Resonance is the pinnacle of Keller\'s pyramid. It describes the full relationship: behavioral loyalty (repeat purchase), attitudinal attachment (emotional bond), community (sense of belonging with other users), and active engagement (voluntary advocacy). It requires all lower pyramid levels to be strong first.'
      },
      {
        q: 'A company launches a new budget phone under its premium tech brand to expand market share. What risk does this create?',
        options: [
          'Trademark dilution',
          'Brand dilution — inconsistent quality signals can damage the premium associations the parent brand has built',
          'Channel conflict with existing distributors',
          'Regulatory scrutiny of market expansion'
        ],
        correct: 1,
        explanation: 'Brand dilution occurs when extensions into inconsistent quality tiers or categories undermine the core brand associations. A premium brand launching a budget line risks signaling that "premium" no longer means what it once did, eroding the pricing power and loyalty the parent brand commands.'
      },
      {
        q: 'Which brand architecture model does Procter & Gamble use, and what is its primary advantage?',
        options: [
          'Branded House — all products benefit from the P&G name',
          'Endorsed Brand — each product uses "by P&G" to leverage trust',
          'House of Brands — each brand (Tide, Gillette, Pampers) is independent, so failures are contained and each can be positioned for its specific segment',
          'Sub-brand architecture — all products share P&G\'s visual identity'
        ],
        correct: 2,
        explanation: 'P&G runs a House of Brands. Tide, Gillette, Pampers, and Olay each have independent equity with no visible corporate parent in consumer communication. This contains risk (a Pampers crisis doesn\'t hurt Tide) and allows each brand to own its specific segment positioning fully.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a Brand Equity Scorer based on Aaker\'s five dimensions. Each dimension is scored 1-10 by a brand audit. Calculate a weighted Brand Equity Index (BEI): Loyalty (25%), Awareness (20%), Perceived Quality (25%), Associations (20%), Proprietary Assets (10%). Compare two competing brands.',
      starterCode: `// Brand Equity Index Calculator (Aaker Model)

const weights = {
  loyalty:           0.25,
  awareness:         0.20,
  perceivedQuality:  0.25,
  associations:      0.20,
  proprietaryAssets: 0.10,
};

const brands = [
  {
    name: 'BrandAlpha',
    loyalty:           8,
    awareness:         9,
    perceivedQuality:  7,
    associations:      8,
    proprietaryAssets: 6,
  },
  {
    name: 'BrandBeta',
    loyalty:           6,
    awareness:         7,
    perceivedQuality:  9,
    associations:      6,
    proprietaryAssets: 8,
  },
];

function calcBEI(brand) {
  // TODO: multiply each dimension score by its weight and sum
}

function compareBrands(brands) {
  // TODO: calculate BEI for each, determine winner, log results
}

compareBrands(brands);
`,
      solution: `const weights = {
  loyalty:           0.25,
  awareness:         0.20,
  perceivedQuality:  0.25,
  associations:      0.20,
  proprietaryAssets: 0.10,
};

const brands = [
  { name: 'BrandAlpha', loyalty: 8, awareness: 9, perceivedQuality: 7, associations: 8, proprietaryAssets: 6 },
  { name: 'BrandBeta',  loyalty: 6, awareness: 7, perceivedQuality: 9, associations: 6, proprietaryAssets: 8 },
];

function calcBEI(brand) {
  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + brand[key] * weight;
  }, 0);
}

function compareBrands(brands) {
  const scored = brands.map(b => ({ ...b, bei: parseFloat(calcBEI(b).toFixed(2)) }));
  scored.sort((a, b) => b.bei - a.bei);

  scored.forEach(b => {
    console.log(\`\${b.name}: BEI = \${b.bei}/10\`);
    console.log(\`  Loyalty \${b.loyalty} | Awareness \${b.awareness} | Quality \${b.perceivedQuality} | Associations \${b.associations} | Assets \${b.proprietaryAssets}\`);
  });

  const winner = scored[0];
  const margin = (scored[0].bei - scored[1].bei).toFixed(2);
  console.log(\`\\nWinner: \${winner.name} (BEI \${winner.bei}) by \${margin} points\`);
}

compareBrands(brands);
`,
    },
  },

  {
    id: 'cc-mktg-degree-4',
    track: 'crash',
    title: 'Digital Marketing Analytics',
    subtitle: 'Attribution models, CAC, LTV, conversion funnels, and A/B testing — the numbers behind every campaign.',
    level: 'Masters',
    xp: 145,
    duration: 16,
    module: 4,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Customer Acquisition Cost (CAC)', definition: 'Total sales and marketing spend divided by the number of new customers acquired in a period. The most critical unit economics metric. CAC must be recovered by LTV within an acceptable payback period.' },
      { term: 'Customer Lifetime Value (LTV)', definition: 'The total revenue (or gross profit) a single customer generates over the entire relationship. LTV / CAC ratio must exceed 3:1 for a sustainable business.' },
      { term: 'Attribution Model', definition: 'The rule for assigning credit to marketing touchpoints that contributed to a conversion. Models include Last-Click, First-Click, Linear, Time-Decay, and Data-Driven. Each tells a different story.' },
      { term: 'Conversion Rate (CVR)', definition: 'The percentage of visitors who complete a desired action. Varies by funnel stage: ad CTR (1-3%), landing page CVR (2-10%), trial-to-paid (15-40%). Small CVR improvements compound dramatically at scale.' },
      { term: 'A/B Test Statistical Significance', definition: 'A test result is significant at 95% confidence when there is less than 5% probability that the observed difference is due to chance. Running tests without statistical significance leads to wrong conclusions.' },
    ],
    content: `## Digital Marketing Analytics

### Why Analytics Is Not Optional

Marketing without measurement is indistinguishable from guessing. The shift to digital channels made measurement possible at a granularity unimaginable in the print era. But more data without a framework for interpretation produces noise, not insight. This module gives you the analytical framework that separates marketing scientists from marketing wishers.

---

### The Marketing Funnel and Where Revenue Is Lost

The classic funnel: Awareness → Interest → Consideration → Intent → Evaluation → Purchase. Each transition has a conversion rate. Your job is to find the leakiest stage and fix it first — not spray improvements across the whole funnel.

A simple diagnostic:
- If awareness metrics are strong (high traffic, strong brand search) but consideration is weak (low email signups, low demo requests) → messaging or offer is the problem
- If consideration is strong but conversion is weak (high trial activations, low paid conversions) → onboarding or value delivery is the problem
- If conversion is strong but retention is weak → product-market fit is incomplete

---

### Customer Acquisition Cost (CAC)

**Formula:**

> CAC = Total Marketing + Sales Spend / Number of New Customers Acquired

The most common mistake is calculating blended CAC without separating paid CAC from organic CAC. If 60% of your customers come from organic search, your blended CAC looks low — but your paid CAC might be extremely high and unsustainable.

**Payback period** = CAC / Monthly Gross Profit per Customer

A payback period of 12 months or less is typical for SaaS. Consumer products often need 3-6 months. If you are paying to acquire customers and not recovering that cost for 36 months, you need either a higher-LTV segment or lower acquisition costs.

---

### Customer Lifetime Value (LTV)

**Simple LTV formula:**
> LTV = Average Revenue Per User (ARPU) x Gross Margin x Average Customer Lifespan

**Or using churn rate:**
> LTV = (ARPU x Gross Margin) / Monthly Churn Rate

Example: If ARPU = $50/month, gross margin = 70%, and monthly churn = 2%:
> LTV = ($50 x 0.70) / 0.02 = $35 / 0.02 = $1,750

The LTV:CAC ratio is the north star metric for marketing efficiency:
- LTV:CAC < 1 → destroying value with every customer acquired
- LTV:CAC 1-3 → marginal; growth is slow or expensive
- LTV:CAC > 3 → healthy; growth is capital-efficient
- LTV:CAC > 5 → potentially under-investing in growth

---

### Attribution Models

When a customer converted after seeing a Facebook ad, a Google search ad, reading a blog post, and clicking an email — which touchpoint gets credit?

**Last-Click Attribution**: 100% credit to the final touchpoint before conversion. Most common default in analytics platforms. Overvalues bottom-of-funnel channels (branded search, retargeting) and undervalues awareness channels (social, content).

**First-Click Attribution**: 100% credit to the first touchpoint. Overvalues awareness channels; ignores the role of nurture.

**Linear Attribution**: Credit split equally across all touchpoints. Treats every touch as equal, which is rarely accurate.

**Time-Decay Attribution**: More credit to touchpoints closer to the conversion. Reasonable middle ground — recognizes that the final nudge matters more.

**Data-Driven Attribution**: Machine learning model that calculates the actual incremental conversion lift each touchpoint provides. Requires significant data volume (typically 3,000+ conversions per channel). The most accurate when available.

**The problem with all click-based attribution**: it measures clicks, not causation. A customer might have converted regardless of seeing your retargeting ad. Marketing Mix Modeling (MMM) addresses this by using regression on aggregate data, but it requires statistical expertise and large datasets.

---

### Conversion Rate Optimization (CRO)

CRO is the practice of increasing the percentage of visitors who complete a desired action without increasing traffic spend. The economics are powerful: doubling your conversion rate from 2% to 4% halves your effective CAC.

**CRO process:**
1. **Identify the leak** — use funnel analysis, session recordings, heatmaps, and form analytics to find where users abandon
2. **Form a hypothesis** — "Users are abandoning the pricing page because the pricing tiers are confusing" (not "let's change the button color")
3. **Design the test** — control vs. treatment with one variable changed
4. **Calculate required sample size** — undersampled tests produce false positives
5. **Run until statistical significance** — typically 95% confidence, minimum 1-2 weeks to avoid day-of-week bias
6. **Analyze and implement** — document the result even if the test loses; negative results prevent re-testing wrong hypotheses

---

### A/B Testing and Statistical Significance

An A/B test compares two versions of a page, email, or ad to determine which performs better. The challenge is distinguishing a real difference from random noise.

**Key concepts:**
- **Statistical significance** — the probability that the observed difference is not due to chance. 95% confidence means 5% chance of a false positive.
- **Statistical power** — the probability of detecting a real effect when one exists. 80% power is the standard.
- **Minimum Detectable Effect (MDE)** — the smallest improvement your test is designed to detect. Smaller MDE requires larger sample sizes.

Common A/B testing mistakes:
- Stopping tests early when results look good (peeking problem)
- Running tests with insufficient traffic, producing false significance
- Ignoring seasonality and time-of-week effects

---

### Cohort Analysis and Retention Metrics

Raw retention numbers lie unless segmented into cohorts — groups of customers who started at the same time. A product with declining retention will show a stable average if new cohorts are larger than old ones. Cohort analysis reveals the true trajectory.

Key retention metrics:
- **Day 1, Day 7, Day 30 retention** — for consumer apps, D1 retention below 25% indicates an onboarding problem
- **Net Revenue Retention (NRR)** — for SaaS: revenue retained from existing customers including expansion (upsell) minus contraction and churn. NRR > 100% means the existing customer base grows without new acquisition
- **Logo retention** — percentage of accounts that remain active regardless of revenue changes`,
    quiz: [
      {
        q: 'If a company spends $50,000 on marketing in a month and acquires 100 new customers, what is the CAC?',
        options: ['$50', '$500', '$5,000', '$50,000'],
        correct: 1,
        explanation: 'CAC = Total Marketing Spend / New Customers = $50,000 / 100 = $500. This is blended CAC. To understand true efficiency, you should also separate paid CAC (spend on paid channels only) from the blended number that includes organic.'
      },
      {
        q: 'A SaaS product has ARPU of $100/month, 80% gross margin, and 5% monthly churn. What is the LTV?',
        options: ['$200', '$800', '$1,600', '$16,000'],
        correct: 2,
        explanation: 'LTV = (ARPU x Gross Margin) / Churn Rate = ($100 x 0.80) / 0.05 = $80 / 0.05 = $1,600. With a $1,600 LTV, you can afford up to ~$533 in CAC while maintaining the healthy 3:1 LTV:CAC ratio.'
      },
      {
        q: 'Which attribution model is most likely to undervalue content marketing and SEO?',
        options: [
          'First-click attribution',
          'Last-click attribution — it gives 100% credit to the final touchpoint, ignoring the awareness and nurture role of content',
          'Linear attribution',
          'Time-decay attribution'
        ],
        correct: 1,
        explanation: 'Last-click attribution gives 100% credit to the final touchpoint (often branded search or retargeting). Content and SEO typically appear early in the journey — they drive awareness and first engagement. Last-click attribution makes them look valueless, causing under-investment in channels that are actually crucial for filling the funnel.'
      },
      {
        q: 'You run an A/B test and the result shows p=0.08. What should you do?',
        options: [
          'Implement the winning variant — 92% confidence is close enough',
          'Stop the test and report the result as inconclusive — p=0.08 does not meet the 95% confidence threshold',
          'Double the test duration and continue gathering data until significance is reached',
          'Increase the traffic split to 80/20 to get results faster'
        ],
        correct: 2,
        explanation: 'p=0.08 means 8% chance the result is random noise — above the standard 5% (p<0.05) threshold for 95% confidence. The correct action is to continue gathering data if you have sufficient traffic. Do not call the test early — peeking and stopping at p=0.08 is a common false positive trap.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a marketing unit economics calculator. Given campaign data, calculate: CAC per channel, blended CAC, LTV (using churn rate formula), LTV:CAC ratio, payback period in months, and a recommendation for each channel (scale / optimize / pause).',
      starterCode: `// Marketing Unit Economics Calculator

const product = {
  arpu:        120,   // avg monthly revenue per user
  grossMargin: 0.72,  // 72%
  churnRate:   0.03,  // 3% monthly churn
};

const channels = [
  { name: 'Google Search',  spend: 15000, newCustomers: 45 },
  { name: 'Meta Ads',       spend: 12000, newCustomers: 28 },
  { name: 'Content/SEO',   spend: 4000,  newCustomers: 60 },
  { name: 'Email',          spend: 1500,  newCustomers: 35 },
];

function calcLTV(product) {
  // LTV = (arpu * grossMargin) / churnRate
}

function calcCAC(channel) {
  // CAC = spend / newCustomers
}

function calcPayback(cac, product) {
  // paybackMonths = CAC / (arpu * grossMargin)
}

function recommend(ltv, cac) {
  // LTV:CAC > 4 → 'Scale', > 2 → 'Optimize', else → 'Pause'
}

// TODO: calculate and log results for each channel + blended CAC
`,
      solution: `const product = {
  arpu:        120,
  grossMargin: 0.72,
  churnRate:   0.03,
};

const channels = [
  { name: 'Google Search', spend: 15000, newCustomers: 45 },
  { name: 'Meta Ads',      spend: 12000, newCustomers: 28 },
  { name: 'Content/SEO',  spend: 4000,  newCustomers: 60 },
  { name: 'Email',         spend: 1500,  newCustomers: 35 },
];

function calcLTV(product) {
  return (product.arpu * product.grossMargin) / product.churnRate;
}

function calcCAC(channel) {
  return channel.spend / channel.newCustomers;
}

function calcPayback(cac, product) {
  return cac / (product.arpu * product.grossMargin);
}

function recommend(ltv, cac) {
  const ratio = ltv / cac;
  if (ratio > 4) return 'Scale';
  if (ratio > 2) return 'Optimize';
  return 'Pause';
}

const ltv = calcLTV(product);
console.log(\`LTV: \$\${ltv.toFixed(0)}\\n\`);

let totalSpend = 0, totalCustomers = 0;

channels.forEach(ch => {
  const cac = calcCAC(ch);
  const payback = calcPayback(cac, product);
  const ratio = ltv / cac;
  const rec = recommend(ltv, cac);
  totalSpend += ch.spend;
  totalCustomers += ch.newCustomers;
  console.log(\`\${ch.name.padEnd(16)} CAC: \$\${cac.toFixed(0).padStart(5)}  LTV:CAC: \${ratio.toFixed(1)}x  Payback: \${payback.toFixed(1)}mo  → \${rec}\`);
});

const blendedCAC = totalSpend / totalCustomers;
console.log(\`\\nBlended CAC: \$\${blendedCAC.toFixed(0)} | LTV:CAC: \${(ltv / blendedCAC).toFixed(1)}x\`);
`,
    },
  },

  {
    id: 'cc-mktg-degree-5',
    track: 'crash',
    title: 'SEO & Content Marketing',
    subtitle: 'On-page optimization, technical SEO, keyword strategy, and content systems that compound over time.',
    level: 'Masters',
    xp: 135,
    duration: 14,
    module: 5,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Search Intent', definition: 'The underlying goal behind a search query. The four types are: Informational (learn), Navigational (find a site), Commercial Investigation (compare before buying), and Transactional (buy now). Content must match intent to rank.' },
      { term: 'Domain Authority (DA)', definition: 'A third-party metric (Moz) predicting how likely a domain is to rank, based on link profile quality and quantity. Not a Google metric, but correlates with ranking ability. Scale: 0-100 (logarithmic).' },
      { term: 'Core Web Vitals', definition: 'Google\'s three page experience metrics: Largest Contentful Paint (LCP, loading), Interaction to Next Paint (INP, interactivity), and Cumulative Layout Shift (CLS, visual stability). These are ranking signals.' },
      { term: 'Topical Authority', definition: 'The depth of coverage a site has on a specific subject. Google rewards sites that cover a topic comprehensively with a cluster of interlinked content over sites with isolated, thin articles.' },
      { term: 'Keyword Difficulty (KD)', definition: 'A metric estimating how hard it is to rank on page 1 for a keyword, based on the authority of pages currently ranking. High-volume, low-KD keywords are the goldmine for early SEO investment.' },
    ],
    content: `## SEO & Content Marketing

### Why SEO Is a Compounding Asset

Paid ads stop working the moment you stop paying. SEO content compounds over time — a well-optimized article written today can generate organic traffic for years, with declining marginal cost per visitor over time. For developers and founders building with limited budgets, SEO-driven content is often the highest-ROI channel in the medium term (6-24 months after investment begins).

The tradeoff: SEO has a long ramp. A new site with zero domain authority will not rank competitively for 6-12 months regardless of content quality. The decision to invest in SEO is a bet on medium-term growth, not immediate return.

---

### How Search Engines Work (Simplified)

Google operates three core systems:

**Crawling** — Googlebot discovers URLs by following links across the web, from sitemaps, and from direct URL submission. If your page has no inbound links and is not in your sitemap, Googlebot may never find it.

**Indexing** — After crawling, Google processes the page's content, metadata, and signals and stores it in its index. Not all crawled pages are indexed (thin content, duplicate content, and no-index tags prevent indexing).

**Ranking** — When a user searches, Google retrieves relevant indexed pages and ranks them using 200+ signals. The most important are: content relevance (does the page match the query?), authority (how many quality sites link here?), page experience (Core Web Vitals), and E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

---

### Keyword Research

Keyword research answers: what do my target customers search for at each stage of their journey, and which of those queries can my site realistically rank for?

**Step 1 — Seed keyword generation**
Brainstorm the core topics your business addresses. Use tools like Ahrefs, Semrush, or Google Search Console to expand these into keyword lists. Also: Google autocomplete, "People also ask" boxes, competitor ranking analysis.

**Step 2 — Analyze search intent**
For each keyword, determine the dominant intent. If you target a transactional query with informational content, you will not rank. Google shows you the intended content type by looking at what currently ranks: if the top 10 results are all listicles, write a listicle. If they are product pages, build a product page.

**Step 3 — Evaluate difficulty vs. volume**
A keyword's value is a function of search volume, conversion potential, and your ability to rank (based on your domain authority vs. current ranking pages). A keyword with 500 monthly searches and low competition is often more valuable than a 50,000-search keyword dominated by high-DA sites.

**Step 4 — Build a keyword map**
Assign each target keyword to a single URL (or a URL to be created). No two pages should target the same keyword — this is "keyword cannibalization" and confuses search engines about which page to rank.

---

### On-Page SEO

On-page SEO is the set of optimizations you control within a specific page:

**Title tag** — the most important on-page element. Include the primary keyword near the front. Keep under 60 characters. Write for humans first; if the title gets clicked, the content must deliver on what the title promises.

**Meta description** — not a ranking factor, but influences click-through rate (CTR) in SERPs. Include the keyword (Google bolds it), state the value clearly, include a call to action. Keep under 155 characters.

**Heading structure (H1-H6)** — one H1 per page containing the primary keyword. Use H2s for major sections, H3s for sub-sections. Structure conveys hierarchy to both users and crawlers.

**Content depth and quality** — match the depth of top-ranking competitors. Add unique value: original data, expert opinion, better examples, more complete coverage. Google's helpful content guidance: write for the reader, not for the algorithm.

**Internal linking** — link to related pages on your site using anchor text that describes the target page's topic. Internal links distribute authority across your site and help Googlebot discover and understand content relationships.

**Image optimization** — compress images (WebP format). Add descriptive alt text. Serve appropriately sized images.

---

### Technical SEO

Technical SEO ensures Google can crawl, index, and rank your content. The most impactful technical issues:

**Site speed** — Core Web Vitals directly affect both ranking and conversion. LCP should be under 2.5 seconds. Use Lighthouse, PageSpeed Insights, or WebPageTest to identify bottlenecks.

**Mobile-first indexing** — Google uses the mobile version of your site as the primary index. Every element and piece of content must be accessible on mobile.

**Crawl budget** — Large sites can exhaust Googlebot's crawl allocation. Use robots.txt and canonical tags correctly. Avoid duplicate content (URL parameter variants of the same page).

**Structured data (Schema.org)** — JSON-LD markup tells Google what your content is about — a recipe, a product, a FAQ, an event. Unlocks rich snippets in SERPs (star ratings, FAQ accordions) which can dramatically increase CTR.

**HTTPS** — a direct ranking signal since 2014. Non-HTTPS sites also display browser warnings, destroying trust.

---

### Content Strategy: The Hub-and-Spoke Model

Rather than publishing isolated articles, organize content around **topic clusters**:

- **Pillar content (hub)** — a comprehensive, authoritative piece covering a broad topic (e.g., "The Complete Guide to Email Marketing"). Long, 3,000+ words, targets a high-value head keyword.
- **Cluster content (spokes)** — narrower, more specific articles on sub-topics (e.g., "How to Write Subject Lines That Get Opened", "Email List Segmentation Strategies"). Each links back to the pillar.

This structure builds topical authority. Google sees a site that covers a topic from multiple angles and treats it as an authoritative resource, ranking both the pillar and spoke content more strongly.

**Content calendar principle**: consistency beats volume. Publishing 2 high-quality articles per week beats 10 thin ones. Thin content with low engagement signals dilutes site-wide quality in Google's assessment.`,
    quiz: [
      {
        q: 'A search query like "best project management software for teams" represents which search intent type?',
        options: [
          'Informational — the user wants to learn about project management',
          'Navigational — the user is looking for a specific site',
          'Commercial Investigation — the user is comparing options before making a purchase decision',
          'Transactional — the user is ready to buy immediately'
        ],
        correct: 2,
        explanation: 'Commercial Investigation intent means the user is actively evaluating options before buying. The word "best" combined with a product category is a classic commercial investigation signal. Content that works here: comparison articles, listicles (Top 10...), feature comparison tables. Pure product pages or tutorials would be mismatched to this intent.'
      },
      {
        q: 'You have a new site with low domain authority. Which keyword targeting strategy makes the most sense initially?',
        options: [
          'Target the highest-volume keywords in your niche to maximize potential traffic',
          'Target low-competition, long-tail keywords where current ranking pages have similar or lower authority',
          'Only target branded keywords until DA exceeds 40',
          'Focus on backlink building before publishing any content'
        ],
        correct: 1,
        explanation: 'New sites cannot compete on high-authority, high-competition keywords. Long-tail, low-KD keywords with lower-authority competitors are achievable. Ranking these builds early organic traffic, earns backlinks, and grows DA — which eventually allows you to compete for higher-difficulty terms.'
      },
      {
        q: 'What is "keyword cannibalization" and why is it a problem?',
        options: [
          'Targeting overly competitive keywords that are impossible to rank for',
          'Multiple pages on your site targeting the same keyword — search engines cannot determine which page to rank, and both pages underperform',
          'Copying keywords from competitors\' pages',
          'Using the same keyword too many times on a single page (keyword stuffing)'
        ],
        correct: 1,
        explanation: 'Keyword cannibalization occurs when multiple URLs on your site compete for the same target keyword. Google\'s algorithm must choose between them, often ranking neither as strongly as a single consolidated page would rank. Fix it by merging the pages, redirecting the weaker one, or clearly differentiating the intent each page serves.'
      },
      {
        q: 'What is the strategic advantage of the hub-and-spoke content model over publishing isolated articles?',
        options: [
          'It requires less writing time per topic',
          'It builds topical authority by demonstrating comprehensive coverage of a subject, which Google rewards with stronger rankings across the entire cluster',
          'It eliminates the need for backlinks from other sites',
          'It allows faster indexing by Google'
        ],
        correct: 1,
        explanation: 'Google evaluates topical depth when deciding how authoritative a site is on a subject. A cluster of interlinked articles covering a topic from multiple angles signals comprehensive expertise. The pillar article benefits from the cluster\'s internal links, and Google indexes the entire cluster more favorably than isolated, unconnected articles.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a keyword opportunity scorer. For each keyword in a list, calculate a Priority Score based on: Monthly Search Volume (weight: 40%), Keyword Difficulty inverted so low KD = high score (weight: 35%), and Business Relevance scored 1-10 (weight: 25%). Sort by Priority Score and flag the top 3 as "Target Now".',
      starterCode: `// Keyword Opportunity Scorer

const keywords = [
  { keyword: 'project management software',      volume: 40000, kd: 85, relevance: 9 },
  { keyword: 'project management for startups',  volume: 1200,  kd: 28, relevance: 10 },
  { keyword: 'free project management tool',     volume: 8000,  kd: 55, relevance: 7 },
  { keyword: 'trello alternative',               volume: 5500,  kd: 42, relevance: 9 },
  { keyword: 'how to manage a remote team',      volume: 3200,  kd: 30, relevance: 6 },
  { keyword: 'sprint planning best practices',   volume: 900,   kd: 18, relevance: 8 },
  { keyword: 'project management certification', volume: 22000, kd: 70, relevance: 3 },
];

function calcPriorityScore(kw) {
  // Normalize volume to 0-10 (max volume in dataset = 40000)
  // Normalize kd inverted: score = (100 - kd) / 10 capped at 10
  // relevance is already 1-10
  // Priority = (volScore * 0.40) + (kdScore * 0.35) + (relevance * 0.25)
}

// TODO: calculate scores, sort, flag top 3 as 'Target Now', log results
`,
      solution: `const keywords = [
  { keyword: 'project management software',      volume: 40000, kd: 85, relevance: 9 },
  { keyword: 'project management for startups',  volume: 1200,  kd: 28, relevance: 10 },
  { keyword: 'free project management tool',     volume: 8000,  kd: 55, relevance: 7 },
  { keyword: 'trello alternative',               volume: 5500,  kd: 42, relevance: 9 },
  { keyword: 'how to manage a remote team',      volume: 3200,  kd: 30, relevance: 6 },
  { keyword: 'sprint planning best practices',   volume: 900,   kd: 18, relevance: 8 },
  { keyword: 'project management certification', volume: 22000, kd: 70, relevance: 3 },
];

const maxVolume = Math.max(...keywords.map(k => k.volume));

function calcPriorityScore(kw) {
  const volScore = (kw.volume / maxVolume) * 10;
  const kdScore = Math.min((100 - kw.kd) / 10, 10);
  return (volScore * 0.40) + (kdScore * 0.35) + (kw.relevance * 0.25);
}

const scored = keywords
  .map(kw => ({ ...kw, score: parseFloat(calcPriorityScore(kw).toFixed(2)) }))
  .sort((a, b) => b.score - a.score);

scored.forEach((kw, i) => {
  const flag = i < 3 ? ' <- Target Now' : '';
  console.log(\`\${String(i+1).padStart(2)}. [\${kw.score.toFixed(2)}] \${kw.keyword.padEnd(38)} Vol:\${String(kw.volume).padStart(6)}  KD:\${kw.kd}\${flag}\`);
});
`,
    },
  },

  {
    id: 'cc-mktg-degree-6',
    track: 'crash',
    title: 'Growth Marketing & Paid Acquisition',
    subtitle: 'Meta and Google ads, ROAS, retargeting, performance loops, and scaling paid channels profitably.',
    level: 'Masters',
    xp: 145,
    duration: 16,
    module: 6,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Return on Ad Spend (ROAS)', definition: 'Revenue generated divided by ad spend. ROAS of 4x means $4 in revenue for every $1 spent on ads. Minimum viable ROAS depends on gross margin — a 70% GM business needs at least 1.43x ROAS to break even on product cost alone.' },
      { term: 'Cost Per Click (CPC)', definition: 'Total ad spend divided by total clicks. CPC varies dramatically by industry, platform, audience temperature, and ad quality. High CPC is only a problem if conversion rates do not justify it.' },
      { term: 'Click-Through Rate (CTR)', definition: 'Clicks divided by impressions. Ad creative quality is the primary CTR lever on social platforms. Industry average Facebook CTR is 0.9%; a strong direct-response ad achieves 2-4%.' },
      { term: 'Retargeting', definition: 'Showing ads to users who previously visited your site or engaged with your content. Retargeting audiences are warmer (already aware of the brand), typically converting at 3-5x the rate of cold traffic.' },
      { term: 'Customer Match / Lookalike Audience', definition: 'Upload a customer email list to Meta or Google to create a Lookalike Audience — users statistically similar to your existing customers. Often the highest-performing prospecting audience.' },
    ],
    content: `## Growth Marketing & Paid Acquisition

### Growth Marketing vs. Traditional Marketing

Traditional marketing focuses on brand building and awareness — campaigns measured by reach, impressions, and brand lift surveys. Growth marketing treats the entire customer lifecycle as a system, running experiments at every stage (acquisition, activation, retention, referral, revenue) and optimizing based on measurable outcomes.

The growth marketing framework (popularized by Sean Ellis and later formalized by the "AARRR" pirate metrics model) measures:
- **Acquisition** — how do users find you?
- **Activation** — do they have a good first experience?
- **Retention** — do they come back?
- **Referral** — do they tell others?
- **Revenue** — do they pay?

Most companies obsess over Acquisition and neglect the four downstream metrics that actually determine whether acquisition dollars are well spent.

---

### Google Ads: Search Intent Meets Ad Targeting

Google Search Ads are unique because they intercept active demand — a user is already searching for what you sell. This makes them highest-intent at the point of capture.

**Campaign types:**
- **Search campaigns** — text ads triggered by keyword queries. Best for capturing existing demand.
- **Performance Max (PMax)** — Google's AI-driven campaign type that shows ads across Search, Display, YouTube, Gmail, and Maps. Requires minimal creative but requires giving Google significant budget to optimize.
- **Display campaigns** — visual banner ads across the Google Display Network. Lower intent; better for retargeting and awareness.

**Keyword match types:**
- **Broad match** — Google interprets the semantic meaning and shows ads for related queries. Widest reach, least control. Only use with strong negative keyword lists.
- **Phrase match** — ads show when query contains the phrase (in order). Balanced control/reach.
- **Exact match** — ads show only for the exact query or close variants. Maximum control, minimum reach.

**Quality Score** — Google's 1-10 score for keyword-ad-landing page relevance. Higher Quality Score = lower CPC. The three components: expected CTR, ad relevance, landing page experience. Improving Quality Score can reduce CPC by 30-50% for the same ad position.

---

### Meta Ads: Behavior and Interest Targeting

Meta (Facebook and Instagram) Ads are demand generation — they interrupt users who are not actively searching. The creative must stop the scroll, establish relevance, and create desire.

**The Meta ad auction:**
Meta ranks ads by Total Value = Advertiser Bid x Estimated Action Probability x Ad Quality. A high-quality, high-CTR ad from a $10 CPM bid can beat a low-quality $15 CPM bid. This is why creative is the most important lever in Meta advertising, not just budget.

**Audience structure:**
- **Top of Funnel (Cold)** — Broad audiences, Lookalike Audiences (1-5% of country), Interest-based targeting
- **Middle of Funnel (Warm)** — Video viewers (25%+), Instagram Engagers, Facebook Page Engagers
- **Bottom of Funnel (Retargeting)** — Site visitors (last 30/60/90 days), Add-to-Cart, Initiate Checkout, Customer lists

**The creative testing framework:**
Test one variable at a time. Structure: 3-5 ad concepts (different hooks/angles) x 2-3 creative formats (image, video, carousel) = 6-15 ads. Let each spend $50-100 before drawing conclusions. Kill losers, scale winners, and always be refreshing creative (ad fatigue typically sets in at 2-3x weekly frequency).

---

### Understanding ROAS and Profitability

ROAS (Return on Ad Spend) is the most-used paid media metric — and the most misunderstood.

**ROAS formula:**
> ROAS = Revenue from Ads / Ad Spend

**Why ROAS alone is insufficient:**
A ROAS of 3x sounds positive, but if your gross margin is 30%, you're earning $3 for every $1 spent on ads — but $2.10 of that goes to cost of goods. The actual profit contribution is $0.90 minus any other operating costs. You could be running at a loss.

**Minimum ROAS for profitability:**
> Break-even ROAS = 1 / Gross Margin

Example: 70% gross margin → break-even ROAS = 1/0.70 = 1.43x. Any ROAS above 1.43x contributes gross profit dollars toward fixed costs.

**Blended ROAS vs. Channel ROAS:**
Attribution platforms show channel-specific ROAS, but these are distorted by attribution models. Blended ROAS (total revenue / total ad spend) is a more honest top-level metric.

---

### Retargeting Architecture

Retargeting shows ads to people who previously engaged with your brand. Since these users are already aware, retargeting typically generates 3-5x the conversion rate of cold prospecting at a lower CPM.

**Retargeting funnel:**
1. **Site visitors (all pages)** — broad retargeting. Show brand awareness or value-focused content.
2. **Content engagers (blog, video viewers)** — mid-funnel. Show proof (case studies, social proof ads).
3. **High-intent visitors (pricing page, checkout page)** — hot retargeting. Show direct response with offer or urgency.
4. **Cart abandoners (for e-commerce)** — hottest signal. Dynamic product ads showing exactly what they viewed.

**Retargeting windows:**
Typical windows: 7 days (highest intent), 30 days, 90 days, 180 days. Shorter windows = smaller audience but higher purchase probability. Test window lengths and exclude purchasers from all retargeting pools.

---

### The Performance Marketing Loop

The compounding growth loop in paid acquisition:
1. Run ads → acquire customers at target CAC
2. Customers generate revenue and data
3. Data improves audience models (Lookalikes, Customer Match)
4. Better audiences improve CVR and ROAS
5. Improved ROAS allows higher bids and more scale
6. More scale generates more customers and data
7. Repeat

Breaking into this loop requires patience — the first 3 months of paid advertising are expensive data-gathering. Companies that give up after 30 days never reach the compounding stage.`,
    quiz: [
      {
        q: 'Your gross margin is 60% and your current ROAS is 2x. Are you profitable on ad spend?',
        options: [
          'Yes — 2x ROAS means you are doubling your money',
          'Yes — break-even ROAS is 1/0.60 = 1.67x, so 2x is profitable, but barely',
          'No — 2x ROAS means you are losing money since gross margin is below 50%',
          'It is impossible to determine without knowing your ad creative costs'
        ],
        correct: 1,
        explanation: 'Break-even ROAS = 1 / Gross Margin = 1 / 0.60 = 1.67x. A 2x ROAS exceeds break-even, so you are contributing gross profit dollars. The contribution margin per $1 of ad spend is $2 x 0.60 - $1 = $0.20. Profitable, but not dramatically so — you need to cover fixed costs from that $0.20.'
      },
      {
        q: 'Why does Meta\'s ad auction reward high-CTR creatives with lower CPMs, even at the same bid?',
        options: [
          'Meta charges less for popular ads as a reward for advertisers',
          'High CTR signals high ad quality and relevance, which increases Total Value in Meta\'s auction formula (Bid x Estimated Action Probability x Ad Quality), allowing lower bids to win auctions',
          'High CTR ads are shown to more people automatically by Meta\'s algorithm',
          'CPM is only determined by bid amount, not creative performance'
        ],
        correct: 1,
        explanation: 'Meta\'s Total Value formula means ad quality and estimated action rate are direct auction factors. A high-CTR ad signals relevance, which multiplies the advertiser\'s bid in the auction. A $10 bid with a 3% CTR often wins over a $15 bid with a 0.5% CTR. This is why creative is the primary lever in Meta advertising.'
      },
      {
        q: 'What is the strategic purpose of retargeting a "pricing page visitor" audience separately from "all site visitors"?',
        options: [
          'Pricing page visitors have higher browser compatibility for retargeting pixels',
          'Pricing page visitors have demonstrated purchase intent — they are in the Decision stage and deserve a different ad message focused on offer/objection handling rather than awareness content',
          'This audience is larger, giving better statistical significance in testing',
          'Meta charges lower CPMs for more specific audience segments'
        ],
        correct: 1,
        explanation: 'Audience segmentation in retargeting maps to buyer journey stages. Pricing page visitors are at the Decision stage — they know the product and are evaluating cost and ROI. Showing them the same awareness ad as a first-time visitor is a missed opportunity. Decision-stage ads should address price objections, offer testimonials, provide a discount, or simplify the next step.'
      },
      {
        q: 'What is Google Quality Score and why does it matter economically?',
        options: [
          'A score advertisers assign to their own campaigns to organize reporting',
          'Google\'s 1-10 score for keyword-ad-landing page relevance that directly affects CPC — higher Quality Score means lower cost per click for the same ad position, reducing overall CAC',
          'A metric that determines whether ads appear on search or display networks',
          'Google\'s measure of advertiser creditworthiness for billing purposes'
        ],
        correct: 1,
        explanation: 'Quality Score (1-10) is based on expected CTR, ad relevance, and landing page experience. It is a multiplier in the ad rank formula alongside bid amount. A Quality Score of 8 vs. 4 can reduce CPC by 30-50% for equivalent ad positions, directly lowering CAC and improving ROAS without changing the bid.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a paid acquisition profitability analyzer. Given a set of ad campaigns with spend, revenue, impressions, and clicks data, calculate: CTR, CPC, ROAS, break-even ROAS (given gross margin), profit contribution per dollar spent, and a status of Profitable / Break-Even / Loss. Print a ranked performance summary.',
      starterCode: `// Paid Acquisition Profitability Analyzer

const grossMargin = 0.68;  // 68%

const campaigns = [
  { name: 'Google Search - Brand',    spend: 3000,  revenue: 18000, impressions: 50000,  clicks: 2100 },
  { name: 'Google Search - Generic',  spend: 8000,  revenue: 22000, impressions: 120000, clicks: 3200 },
  { name: 'Meta - Prospecting',       spend: 10000, revenue: 19000, impressions: 800000, clicks: 7200 },
  { name: 'Meta - Retargeting',       spend: 2500,  revenue: 12000, impressions: 95000,  clicks: 2800 },
  { name: 'YouTube - Awareness',      spend: 5000,  revenue: 6000,  impressions: 500000, clicks: 1800 },
];

function analyzeCampaign(campaign, grossMargin) {
  // TODO: ctr = clicks / impressions
  // TODO: cpc = spend / clicks
  // TODO: roas = revenue / spend
  // TODO: breakEvenROAS = 1 / grossMargin
  // TODO: profitPerDollar = (roas * grossMargin) - 1
  // TODO: status: profitPerDollar > 0.1 => 'Profitable', > 0 => 'Break-Even', else => 'Loss'
}

// TODO: analyze all campaigns, sort by ROAS, log summary
`,
      solution: `const grossMargin = 0.68;

const campaigns = [
  { name: 'Google Search - Brand',    spend: 3000,  revenue: 18000, impressions: 50000,  clicks: 2100 },
  { name: 'Google Search - Generic',  spend: 8000,  revenue: 22000, impressions: 120000, clicks: 3200 },
  { name: 'Meta - Prospecting',       spend: 10000, revenue: 19000, impressions: 800000, clicks: 7200 },
  { name: 'Meta - Retargeting',       spend: 2500,  revenue: 12000, impressions: 95000,  clicks: 2800 },
  { name: 'YouTube - Awareness',      spend: 5000,  revenue: 6000,  impressions: 500000, clicks: 1800 },
];

function analyzeCampaign(campaign, grossMargin) {
  const ctr = campaign.clicks / campaign.impressions;
  const cpc = campaign.spend / campaign.clicks;
  const roas = campaign.revenue / campaign.spend;
  const breakEvenROAS = 1 / grossMargin;
  const profitPerDollar = (roas * grossMargin) - 1;
  let status;
  if (profitPerDollar > 0.1) status = 'Profitable';
  else if (profitPerDollar > 0) status = 'Break-Even';
  else status = 'Loss';
  return { ...campaign, ctr, cpc, roas, breakEvenROAS, profitPerDollar, status };
}

const analyzed = campaigns
  .map(c => analyzeCampaign(c, grossMargin))
  .sort((a, b) => b.roas - a.roas);

console.log(\`Break-Even ROAS (at \${(grossMargin*100).toFixed(0)}% GM): \${(1/grossMargin).toFixed(2)}x\\n\`);
analyzed.forEach(c => {
  console.log(\`\${c.name.padEnd(28)} ROAS: \${c.roas.toFixed(1)}x  CTR: \${(c.ctr*100).toFixed(2)}%  CPC: \$\${c.cpc.toFixed(2)}  -> \${c.status}\`);
});
`,
    },
  },

  {
    id: 'cc-mktg-degree-7',
    track: 'crash',
    title: 'Email Marketing & CRM',
    subtitle: 'Lifecycle emails, segmentation, deliverability, drip sequences, and building a CRM that retains customers.',
    level: 'Masters',
    xp: 130,
    duration: 13,
    module: 7,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Email Deliverability', definition: 'The ability to land in the inbox rather than the spam folder. Governed by authentication (SPF, DKIM, DMARC), sender reputation, list hygiene, and engagement rates. Even a 10% spam rate can permanently damage domain reputation.' },
      { term: 'Open Rate', definition: 'Percentage of delivered emails that are opened. Industry benchmarks vary by sector (SaaS: 22-30%, e-commerce: 15-20%). Declining since Apple Mail Privacy Protection in 2021 made open tracking unreliable for Apple Mail users.' },
      { term: 'Click-Through Rate (Email CTR)', definition: 'Percentage of delivered emails where the recipient clicked at least one link. More reliable than open rate since iOS 15. A CTR of 2-5% is strong for broadcast emails; automated lifecycle emails typically achieve 5-15%.' },
      { term: 'Drip Sequence', definition: 'A series of automated emails sent at pre-defined time intervals or triggered by user actions. Used for onboarding, lead nurturing, and re-engagement. The sequence logic responds to engagement (opens, clicks) to branch the journey.' },
      { term: 'Net Promoter Score (NPS)', definition: 'A 0-10 scale survey asking "How likely are you to recommend [product] to a friend?" Scores 9-10 = Promoters, 7-8 = Passives, 0-6 = Detractors. NPS = % Promoters - % Detractors.' },
    ],
    content: `## Email Marketing & CRM

### Why Email Outperforms Every Other Channel on ROI

According to repeated industry studies, email marketing consistently delivers $36-42 in return for every $1 spent — an ROI that outperforms paid social, paid search, and SEO for most businesses. The reasons are structural:

1. **You own the list** — unlike social media followers, email subscribers are an asset you control regardless of algorithm changes.
2. **Direct channel** — email reaches the inbox without competing against a feed algorithm.
3. **Permission-based** — subscribers opted in, making them pre-qualified.
4. **Automatable** — lifecycle emails run 24/7 without incremental cost per send.

The caveat: email marketing is only as powerful as your list quality, segmentation sophistication, and content relevance. Mass-blasting irrelevant emails destroys deliverability and accelerates churn.

---

### Deliverability: The Foundation

No tactic matters if your emails land in spam. Deliverability is determined by:

**Authentication protocols:**
- **SPF (Sender Policy Framework)** — a DNS record that specifies which servers are authorized to send email from your domain. Prevents spoofing.
- **DKIM (DomainKeys Identified Mail)** — a digital signature attached to outgoing emails that receiving servers verify. Confirms the email was not altered in transit.
- **DMARC (Domain-based Message Authentication)** — a policy that tells receiving servers what to do with emails that fail SPF or DKIM (quarantine or reject). Also sends failure reports to the domain owner.

All three must be configured correctly. Most email service providers (Mailchimp, Klaviyo, Resend, Postmark) walk you through setup.

**Sender reputation:**
Gmail, Outlook, and Yahoo maintain reputation scores for sending domains and IPs. Key reputation signals:
- **Engagement rate** — do recipients open, click, and reply? High engagement signals legitimate content.
- **Spam complaint rate** — must stay below 0.1% (Google's threshold). Above 0.3% triggers deliverability consequences.
- **Bounce rate** — hard bounces (invalid addresses) must be removed immediately. High bounce rates signal poor list hygiene.
- **Unsubscribe rate** — high unsubscribe rates signal list-audience mismatch.

**List hygiene practices:**
- Remove hard bounces immediately
- Sunset inactive subscribers after 6-12 months of no engagement (or run a re-engagement campaign first)
- Use double opt-in (confirm email address) to ensure list quality
- Never buy email lists — purchased lists have no engagement history and generate immediate reputation damage

---

### Segmentation: The Key to Relevance

Segmenting your list means sending different messages to different groups. Even basic segmentation dramatically improves performance:

**Behavioral segmentation:**
- Purchased vs. never-purchased
- Last purchase date (recently active vs. lapsed)
- High spenders vs. low spenders (for e-commerce)
- Feature users vs. non-users (for SaaS)
- Email engagement tier (active, dormant, inactive)

**Lifecycle stage segmentation:**
- Lead (interested but not converted)
- Trial user (free plan, evaluating)
- Customer (paying, new)
- Power user (high engagement, long tenure)
- At-risk (declining engagement, no recent purchase)
- Churned (cancelled)

Each segment needs different content, different tone, and different offers. Sending a "Thanks for signing up for a trial" email to a 3-year enterprise customer is brand-damaging.

---

### Lifecycle Email Architecture

A well-designed lifecycle email program has automated sequences covering the full customer journey:

**Welcome sequence (Days 1-14 post-signup):**
The welcome email is the highest-opened email you will ever send (50-60% open rates are common). Use it to: confirm the subscription, deliver the promised value (free resource, next step), introduce the brand voice, and set expectations for future emails. Follow-up emails in the first two weeks should progressively deepen engagement.

**Onboarding sequence (for SaaS/apps):**
Triggered emails teaching users to reach the "Aha moment" — the point where they first experience product value. Each email should correspond to a specific activation milestone. If users do not complete a step within 24-48 hours, an automated nudge fires. Onboarding sequence quality is the single biggest lever in trial-to-paid conversion.

**Nurture/drip sequence (for leads):**
A series of value-first emails for leads who are not yet customers. Content progression: educational content → social proof (case studies) → comparison (why you vs. alternatives) → direct offer. Length varies by sales cycle: B2B enterprise deals require 8-12 touch nurtures; B2C e-commerce purchases can happen in 3-5.

**Re-engagement / win-back sequence:**
Triggered when a subscriber has not opened or clicked in 90 days (or a customer has not purchased in 6 months). Typically 3-4 emails: "We miss you" + value reminder → "Is this still useful?" with re-permission ask → final "We're removing you" (creates urgency) → sunset (remove from active list if no response).

**Post-purchase / success sequence:**
Sent after a transaction. Objectives: reduce buyer's remorse, guide toward first value delivery, encourage reviews or referrals, introduce cross-sell/upsell. The customer is most engaged in the first 48 hours post-purchase — this is when success emails have maximum impact.

---

### Email Copywriting Principles

**Subject line:**
- 41 characters or less displays fully on mobile
- Curiosity gap and specificity outperform generic subject lines
- Test: question vs. statement vs. number format vs. personalization
- Avoid spam trigger words: "free," "guaranteed," "act now," excessive caps and punctuation

**Preview text (preheader):**
The 100-character preview visible beside the subject in the inbox. If not set, email clients pull the first text in the email body. Set it explicitly as a continuation of the subject line's hook.

**Email body structure:**
1. Hook — address the reader's situation within the first sentence
2. Bridge — connect the situation to the solution
3. Offer — one primary call to action (not three competing ones)
4. CTA button — specific action, not generic ("Start your free trial" vs. "Click here")

**Personalization beyond first name:**
Behavioral personalization uses subscriber data to send contextually relevant content. "You haven't completed your profile yet" beats "Hi Jordan, here's this week's newsletter." Recommendation engines that surface products based on browse history (Klaviyo, Braze) can increase revenue per email by 30-50%.

---

### CRM: Managing the Customer Relationship at Scale

A CRM (Customer Relationship Management) system is the data infrastructure for all customer interactions. For B2B, the CRM (Salesforce, HubSpot, Pipedrive) tracks leads, deals, activities, and contacts. For B2C, the ESP (Email Service Provider) often serves as the de facto CRM.

Key CRM concepts:
- **Contact lifecycle stages** — subscriber → MQL → SQL → Opportunity → Customer → Churned
- **Lead scoring** — assigning points to contacts based on demographic fit (job title, company size) and behavioral signals (email opens, pricing page visits, demo requests). Contacts exceeding a threshold are passed to sales as Marketing Qualified Leads (MQLs).
- **Deal stages and pipeline** — for B2B, the sales pipeline maps stages from first contact to closed deal. Win rates by stage identify where deals are lost and where coaching is needed.`,
    quiz: [
      {
        q: 'What is the primary reason email marketing delivers higher ROI than most paid channels?',
        options: [
          'Email platforms charge lower fees than ad networks',
          'Email subscribers are permission-based and owned — no algorithm controls reach, costs are low, and the audience is pre-qualified',
          'Email has better design flexibility than digital ads',
          'Email automation requires no human management after setup'
        ],
        correct: 1,
        explanation: 'Email\'s structural advantage is ownership and permission. Unlike paid social (where Meta controls reach) or organic (where Google controls visibility), your email list is an asset you own. Permission-based subscribers are pre-qualified, reducing waste. And automation allows lifecycle messages to run at near-zero incremental cost per send.'
      },
      {
        q: 'Your email spam complaint rate rises to 0.4%. What should you do immediately?',
        options: [
          'Nothing — industry average is higher than 0.4%',
          'Stop sending all emails for 30 days',
          'Immediately audit your list for unengaged subscribers and remove them; Google\'s threshold is 0.1% and above 0.3% triggers deliverability consequences',
          'Switch to a new sending domain to reset reputation'
        ],
        correct: 2,
        explanation: 'Google\'s bulk sender guidelines (2024) set 0.1% as the complaint rate threshold and treat 0.3%+ as a trigger for deliverability actions. At 0.4%, you are at high risk of inbox placement declining. Immediately remove non-engaged subscribers and identify whether a recent campaign to a mismatched segment caused the spike.'
      },
      {
        q: 'Why is the welcome email typically the highest-performing email in a sequence?',
        options: [
          'Welcome emails are shorter and load faster',
          'They are sent when subscriber expectations and brand curiosity are at their peak — the subscriber just opted in, so engagement intent is highest',
          'Email clients prioritize welcome emails in the inbox',
          'Welcome emails have better deliverability because they are sent to a smaller audience'
        ],
        correct: 1,
        explanation: 'The welcome email arrives at the moment of highest intent and lowest friction — the subscriber just made an active choice to engage. Expectations are freshly formed and curiosity about the brand is at its peak. This is why welcome emails routinely achieve 50-60% open rates vs. 20-25% for later broadcast emails.'
      },
      {
        q: 'What is the purpose of sunsetting inactive email subscribers?',
        options: [
          'Reducing email platform costs by managing list size',
          'Protecting sender reputation by removing subscribers who never engage, preventing low engagement rates from hurting deliverability for the entire list',
          'Complying with GDPR data retention limits',
          'Freeing up list capacity for new subscribers'
        ],
        correct: 1,
        explanation: 'Inbox providers (Gmail, Outlook) measure engagement rates across your entire sending domain. Low engagement from inactive subscribers dilutes your engagement signal, which damages deliverability for all your emails — including those to engaged subscribers. Sunsetting inactives keeps your engagement rate healthy and your list representative of actual interest.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build an email campaign performance analyzer. Given a list of email campaigns with sent, opened, clicked, and unsubscribed counts, calculate: open rate, CTD rate (click-to-delivered), unsubscribe rate, and a health score (start at 100, deduct points for poor open rate and high unsub rate). Flag campaigns that need attention.',
      starterCode: `// Email Campaign Performance Analyzer

const campaigns = [
  { name: 'Welcome Series - Email 1', sent: 5000,  opens: 2800, clicks: 980,  unsubs: 12 },
  { name: 'Monthly Newsletter',       sent: 12000, opens: 2640, clicks: 380,  unsubs: 95 },
  { name: 'Product Launch Announce',  sent: 8500,  opens: 3570, clicks: 1420, unsubs: 28 },
  { name: 'Re-engagement Campaign',   sent: 3200,  opens: 512,  clicks: 88,   unsubs: 140 },
  { name: 'Black Friday Promotion',   sent: 15000, opens: 4200, clicks: 2100, unsubs: 210 },
];

function analyzeEmail(campaign) {
  const openRate  = campaign.opens  / campaign.sent;
  // TODO: ctdRate = clicks / sent
  // TODO: unsubRate = unsubs / sent

  // Health Score: start at 100
  // deduct 30 if openRate < 0.15, else deduct 20 if openRate < 0.20
  // deduct 25 if unsubRate > 0.005, else deduct 15 if unsubRate > 0.002

  // flag as 'Needs Review' if health < 60, else 'Healthy'
}

campaigns.forEach(c => {
  const r = analyzeEmail(c);
  // TODO: log name, open rate, CTD rate, unsub rate, health score, flag
});
`,
      solution: `const campaigns = [
  { name: 'Welcome Series - Email 1', sent: 5000,  opens: 2800, clicks: 980,  unsubs: 12 },
  { name: 'Monthly Newsletter',       sent: 12000, opens: 2640, clicks: 380,  unsubs: 95 },
  { name: 'Product Launch Announce',  sent: 8500,  opens: 3570, clicks: 1420, unsubs: 28 },
  { name: 'Re-engagement Campaign',   sent: 3200,  opens: 512,  clicks: 88,   unsubs: 140 },
  { name: 'Black Friday Promotion',   sent: 15000, opens: 4200, clicks: 2100, unsubs: 210 },
];

function analyzeEmail(campaign) {
  const openRate  = campaign.opens  / campaign.sent;
  const ctdRate   = campaign.clicks / campaign.sent;
  const unsubRate = campaign.unsubs  / campaign.sent;

  let health = 100;
  if (openRate < 0.15) health -= 30;
  else if (openRate < 0.20) health -= 20;
  if (unsubRate > 0.005) health -= 25;
  else if (unsubRate > 0.002) health -= 15;

  const flag = health < 60 ? 'Needs Review' : 'Healthy';
  return { openRate, ctdRate, unsubRate, health, flag };
}

campaigns.forEach(c => {
  const r = analyzeEmail(c);
  console.log(\`\${c.name.padEnd(30)} Open:\${(r.openRate*100).toFixed(1).padStart(5)}%  CTD:\${(r.ctdRate*100).toFixed(1).padStart(5)}%  Unsub:\${(r.unsubRate*100).toFixed(2)}%  Health:\${r.health}  [\${r.flag}]\`);
});
`,
    },
  },

  {
    id: 'cc-mktg-degree-8',
    track: 'crash',
    title: 'Go-to-Market Strategy',
    subtitle: 'GTM planning, ideal customer profile, channel selection, launch sequencing, and reading PMF signals.',
    level: 'Masters',
    xp: 140,
    duration: 15,
    module: 8,
    crashId: 'cc-mktg-degree',
    crashTitle: 'Marketing Degree Add-On',
    keyTerms: [
      { term: 'Go-to-Market (GTM) Strategy', definition: 'The plan for how a company will bring a product to market — defining who the customer is, what channels will be used, how value will be communicated, and in what sequence the market will be approached.' },
      { term: 'Ideal Customer Profile (ICP)', definition: 'A detailed description of the company (for B2B) or person (for B2C) who gets maximum value from your product, has the budget to pay for it, and is most likely to become a long-term, high-LTV customer.' },
      { term: 'Product-Market Fit (PMF)', definition: 'The state in which a product satisfies a strong market demand. Sean Ellis\'s benchmark: 40% of users would be "very disappointed" if the product disappeared. Before PMF, marketing amplifies problems; after PMF, it amplifies growth.' },
      { term: 'Sales-Led Growth (SLG)', definition: 'GTM motion in which the sales team drives revenue through outbound prospecting, demos, and relationship management. Dominant in high-ACV B2B markets.' },
      { term: 'Product-Led Growth (PLG)', definition: 'GTM motion in which the product itself drives acquisition, conversion, and expansion. Users discover value before paying (freemium, free trial). Dominant in developer tools, SaaS, and consumer apps.' },
    ],
    content: `## Go-to-Market Strategy

### Why GTM Is Not Just a Launch Plan

Most founders and marketers treat "go-to-market" as a launch checklist — press release, social posts, Product Hunt submission, email blast. A real GTM strategy is the structured answer to four foundational questions:

1. **Who** is the customer? (Ideal Customer Profile)
2. **What** value does the product deliver for them? (Value Proposition)
3. **How** will we reach them? (Channels and Motion)
4. **When** and in what sequence? (Launch Sequencing)

A GTM without answers to all four questions is a product launch with no commercial logic. And without commercial logic, growth is accidental.

---

### Ideal Customer Profile (ICP)

The ICP is the detailed portrait of the customer who derives maximum value from your product. It is not a broad demographic — it is a precise definition that makes targeting decisions automatic.

**For B2B, the ICP includes:**
- Industry/vertical (e.g. Series A-C SaaS companies in the US)
- Company size (headcount and/or revenue range)
- Tech stack (if relevant to integration or compatibility)
- Job title and seniority of the buyer (who signs the contract) and the user (who uses it daily)
- Existing workflow being replaced or supplemented
- Pain trigger (what specific event causes them to start looking for your solution)
- Budget range and buying process (self-serve or procurement?)

**For B2C, the ICP includes:**
- Demographics (age, income, location — as secondary descriptors, not primary)
- Psychographic profile (values, lifestyle, aspirations, risk tolerance)
- Behavioral pattern (purchase frequency, category engagement, online behavior)
- Jobs-to-be-done (the progress they are trying to make — see Module 2)
- Willingness to pay (are they price-sensitive or value-sensitive?)

**Why ICP precision matters:**
A vague ICP produces unfocused messaging, expensive CAC, and low retention (because you attract customers who are not well-suited to the product). A sharp ICP enables: account-based targeting in B2B, precise Meta audience building, content that resonates immediately, and onboarding tuned to the right use case.

---

### GTM Motions

A GTM motion is the mechanism through which you convert interest into revenue. The three dominant motions are:

**Sales-Led Growth (SLG)**
Humans (sales reps) are the primary conversion mechanism. The process: outbound prospecting or inbound leads → qualification → discovery call → demo → proposal → close. SLG is appropriate when: ACV (Annual Contract Value) is high enough to justify sales time ($10k+ per year), the purchase involves organizational change or integration complexity, and the buying committee is large.

SLG metrics: pipeline volume, pipeline velocity, win rate, average deal size, sales cycle length, quota attainment.

**Marketing-Led Growth (MLG)**
Marketing drives demand and qualified leads; sales closes them. The process: content/SEO/ads/events generate awareness → lead capture and nurture → MQL threshold reached → sales-assisted close. Appropriate when ACV is moderate ($1k-$50k/year) and the buyer needs education and trust-building before buying.

MLG metrics: MQL volume, MQL-to-SQL conversion rate, lead source attribution, CAC by channel, pipeline generated by marketing.

**Product-Led Growth (PLG)**
The product itself is the acquisition, conversion, and expansion engine. Free trials, freemium tiers, or self-serve accounts let users experience value before paying. Viral loops (users invite teammates or share work product) compound growth without marketing spend. Appropriate when: the product delivers obvious value quickly, usage is self-explanatory, and the network or share effects benefit from a low-friction distribution model.

PLG metrics: activation rate (% of signups who reach the "Aha moment"), time-to-value, trial-to-paid conversion rate, product qualified leads (PQLs), expansion revenue (upsells within the existing base).

---

### Product-Market Fit: How to Know If You Have It

Before product-market fit, growth is expensive and retention is poor. After it, the product grows with reduced friction. The challenge: PMF is easy to mistake for early traction.

**Sean Ellis PMF test:**
Survey active users: "How would you feel if you could no longer use [product]?" If 40% or more say "very disappointed," you likely have PMF in that segment. Below 25% — product-market fit is not achieved.

**Qualitative PMF signals:**
- Users are adopting the product without being pushed
- Word-of-mouth and referrals arrive without an incentive program
- Users are upset when you change features (they care deeply)
- Churn rates are low and declining
- Support requests are about limitations and requested features, not about confusion

**Quantitative PMF signals (for SaaS):**
- Monthly churn below 2-3%
- Net Revenue Retention above 100% (expansion revenue exceeds churn)
- NPS above 30
- Organic growth share above 30% of new signups

**The cost of marketing without PMF:**
Pouring budget into acquisition before achieving PMF is one of the most common startup mistakes. Paid acquisition works by amplifying what is already working — if retention is poor (users are not staying), more acquisition just creates a leaky bucket. Find PMF in a narrow segment first. Then scale.

---

### Launch Sequencing

A product launch is not a single event — it is a sequenced set of activities designed to build momentum.

**Pre-launch (6-12 weeks before):**
- Finalize ICP and build early access waitlist (email capture)
- Brief and warm up press, analysts, and influencers
- Prepare SEO-optimized landing pages and comparison content
- Set up tracking: events, funnels, cohort analysis, referral attribution
- Identify 10-20 "design partner" customers for testimonials and case studies
- Prepare launch assets: screenshots, demo video, one-pager, FAQ

**Soft launch (weeks 1-2):**
Send to the waitlist, existing users, design partners, and professional network. Objective: gather feedback, identify friction in the activation flow, collect early social proof before the hard launch.

**Hard launch:**
Press release distribution, Product Hunt submission, social media campaign, email broadcast to full list, paid advertising launch. Stagger by timezone — launch US morning for maximum Product Hunt visibility.

**Post-launch (weeks 3-12):**
The launch event is not the campaign. Post-launch is where most of the commercial work happens: retargeting the launch traffic with nurture sequences, sales follow-up on inbound leads, A/B testing landing page conversion, publishing case studies from early users, and beginning to build the SEO content cluster.

---

### Channel Selection Framework

Not every channel is appropriate for every product. The right channel depends on:

**ACV and margin:** Low-ACV, high-volume products ($10-100/month consumer or SMB) require efficient self-serve channels (SEO, content, PLG, paid social). High-ACV enterprise products ($50k+/year) justify SDR outbound, events, and relationship-based selling.

**Market awareness:** If the problem is unknown, content and thought leadership are required before demand-capture channels (search) can work. If the category is established, demand capture (search ads, SEO) has immediate ROI.

**Competitive intensity in channels:** If every competitor is buying Google Search and CPCs are $50+, a new entrant with limited budget will not win there. Find channels with less competition and lower CPCs where targeting allows reaching the same ICP.

**Where your ICP already congregates:** Developer tools → GitHub, Hacker News, dev-focused newsletters. B2B SaaS → LinkedIn, industry events, Slack communities. Consumer apps → TikTok, Instagram, YouTube, referral programs.

The most common GTM mistake is spreading budget across 6 channels at launch. Go deep on 1-2 channels first. Build proficiency, establish the playbook, then expand.`,
    quiz: [
      {
        q: 'Sean Ellis\'s PMF test uses "very disappointed" responses as a threshold. What percentage indicates likely product-market fit?',
        options: ['20% or more', '40% or more', '60% or more', '80% or more'],
        correct: 1,
        explanation: 'Ellis\'s benchmark: if 40% or more of active users say they would be "very disappointed" if they could no longer use the product, you likely have PMF in that segment. Below 25% suggests poor PMF; 25-40% is in a zone where improvement is still needed. This test specifically surveys active users, not all signups.'
      },
      {
        q: 'A SaaS product has $200 ACV, self-explanatory onboarding, and a natural sharing mechanic (users send reports to teammates). Which GTM motion is most appropriate?',
        options: [
          'Sales-Led Growth — all SaaS products need a sales team',
          'Product-Led Growth — the low ACV, self-serve nature, and sharing mechanic fit the PLG model perfectly',
          'Marketing-Led Growth — SEO and content should always come first',
          'Partnership-Led Growth — channel partners will provide cheaper distribution'
        ],
        correct: 1,
        explanation: 'PLG is appropriate when: ACV is too low to justify a human sales process ($200/year cannot pay for an SDR), the product delivers value quickly without explanation, and there is a natural viral or sharing mechanic. The teammate sharing mechanic is a built-in PLG loop — Slack, Notion, and Figma all scaled primarily through this pattern.'
      },
      {
        q: 'Why is it strategically wrong to scale paid acquisition before achieving product-market fit?',
        options: [
          'Paid advertising is too expensive for early-stage companies',
          'Acquisition before PMF means acquiring customers who will churn, creating a leaky bucket — you cannot buy your way out of a retention problem that indicates the product does not yet solve the problem well',
          'Google and Meta require minimum domain authority before running ads',
          'Early customers provide bad data for lookalike audience modeling'
        ],
        correct: 1,
        explanation: 'Paid acquisition amplifies what is already working. Before PMF, retention is poor — new customers leave quickly. Spending to acquire customers who churn means you are paying for temporary engagement, not building a business. Each dollar spent increases CAC without building the compounding customer base that generates LTV. Fix retention (PMF) first, then scale acquisition.'
      },
      {
        q: 'What is the purpose of a "soft launch" before the hard launch event?',
        options: [
          'To test the payment infrastructure before a high-traffic event',
          'To gather real-world feedback on activation friction, collect early social proof, and identify issues before amplifying to a larger audience',
          'To comply with app store review requirements',
          'To give the engineering team more time to fix bugs'
        ],
        correct: 1,
        explanation: 'The soft launch serves QA and social proof objectives. By sending to a warm audience first (waitlist, existing users, design partners), you discover where users get stuck in onboarding, collect testimonials and case studies, and stress-test the infrastructure — all before the hard launch amplifies everything including the problems.'
      },
    ],
    ide: {
      language: 'javascript',
      task: 'Build a GTM Channel Prioritizer. Given a product profile and a set of potential channels scored on: ACV fit (1-10), budget efficiency (1-10), and market awareness match (1-10), calculate a weighted GTM Priority Score (35% / 40% / 25%) and recommend the top 2 channels to launch with.',
      starterCode: `// GTM Channel Prioritizer

const channels = [
  { name: 'Google Search Ads',    acvFit: 5, budgetEfficiency: 6, awarenessMatch: 9 },
  { name: 'SEO / Content',        acvFit: 7, budgetEfficiency: 9, awarenessMatch: 7 },
  { name: 'Meta Ads',             acvFit: 6, budgetEfficiency: 7, awarenessMatch: 5 },
  { name: 'LinkedIn Ads',         acvFit: 5, budgetEfficiency: 4, awarenessMatch: 6 },
  { name: 'Product-Led / PLG',    acvFit: 8, budgetEfficiency: 9, awarenessMatch: 6 },
  { name: 'SDR Outbound',         acvFit: 3, budgetEfficiency: 3, awarenessMatch: 8 },
  { name: 'Community / Organic',  acvFit: 8, budgetEfficiency: 10, awarenessMatch: 5 },
];

// Weights: acvFit 35%, budgetEfficiency 40%, awarenessMatch 25%
function calcGTMScore(channel) {
  // TODO: return weighted score
}

function prioritizeChannels(channels) {
  // TODO: score all, sort descending, log all with rank
  // TODO: flag top 2 as 'Launch with this'
  // TODO: print recommendation for the top 2
}

prioritizeChannels(channels);
`,
      solution: `const channels = [
  { name: 'Google Search Ads',    acvFit: 5, budgetEfficiency: 6, awarenessMatch: 9 },
  { name: 'SEO / Content',        acvFit: 7, budgetEfficiency: 9, awarenessMatch: 7 },
  { name: 'Meta Ads',             acvFit: 6, budgetEfficiency: 7, awarenessMatch: 5 },
  { name: 'LinkedIn Ads',         acvFit: 5, budgetEfficiency: 4, awarenessMatch: 6 },
  { name: 'Product-Led / PLG',    acvFit: 8, budgetEfficiency: 9, awarenessMatch: 6 },
  { name: 'SDR Outbound',         acvFit: 3, budgetEfficiency: 3, awarenessMatch: 8 },
  { name: 'Community / Organic',  acvFit: 8, budgetEfficiency: 10, awarenessMatch: 5 },
];

function calcGTMScore(channel) {
  return (channel.acvFit * 0.35) + (channel.budgetEfficiency * 0.40) + (channel.awarenessMatch * 0.25);
}

function prioritizeChannels(channels) {
  const scored = channels
    .map(c => ({ ...c, score: parseFloat(calcGTMScore(c).toFixed(2)) }))
    .sort((a, b) => b.score - a.score);

  console.log('GTM Channel Priority Ranking:\\n');
  scored.forEach((c, i) => {
    const tag = i < 2 ? ' <- Launch with this' : '';
    console.log(\`\${i+1}. [\${c.score}] \${c.name.padEnd(24)} ACV:\${c.acvFit} Eff:\${c.budgetEfficiency} Aware:\${c.awarenessMatch}\${tag}\`);
  });

  const [first, second] = scored;
  console.log(\`\\nRecommendation: Launch with "\${first.name}" and "\${second.name}" first.\`);
}

prioritizeChannels(channels);
`,
    },
  },
]
