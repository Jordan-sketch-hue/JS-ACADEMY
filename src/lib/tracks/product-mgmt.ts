import type { Course } from '../courses'

export const pmCourses: Course[] = [
  {
    id: 'pm-m01',
    track: 'product-mgmt' as any,
    title: 'What Product Management Is',
    subtitle: 'The role that sits at the intersection of technology, business, and user need — and why it exists',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Product Manager', definition: 'The person responsible for defining what a product does, why, for whom, and by when — not for how it is built, but for the decisions that determine what gets built and in what order.' },
      { term: 'Product-Market Fit', definition: 'The state where a product satisfies a strong market demand — users find it indispensable, retention is high, and organic growth begins. Marc Andreessen: "You can always feel it when PMF is happening."' },
      { term: 'Product Roadmap', definition: 'A strategic document communicating what the product team will build and why, over a given time horizon — not a feature backlog or a promise, but a plan subject to change as learning occurs.' },
      { term: 'Discovery vs Delivery', definition: 'Discovery: learning whether a solution is valuable, usable, and feasible before building it. Delivery: building, testing, and shipping validated solutions. PM work splits roughly between these two modes.' },
      { term: 'Outcome vs Output', definition: 'Outputs are features built and shipped. Outcomes are changes in user behaviour or business metrics that those features produce. PMs are evaluated on outcomes, not outputs — shipping features that users don\'t adopt is a failure.' },
    ],
    content: `## What Product Management Is

Most companies build products through a process that has more in common with construction than discovery. Business stakeholders specify requirements, designers sketch screens, engineers build, and the result is measured against the original specification rather than against user outcomes. This process works for well-understood problems with stable requirements — houses, bridges, factories.

Software products are different. The problem space is unknown at the start. User needs are incompletely understood. The technical constraints change as building progresses. The competitive environment shifts. Trying to specify the right product before building it is not just difficult — it is conceptually wrong.

Product Management emerged to manage this reality: to translate uncertainty into a sequence of testable bets, and to represent user needs and business goals inside an organisation that would otherwise optimise for what engineers find interesting to build.

### The PM's Job Description

A PM is sometimes described as "the CEO of the product." This is an overstatement — PMs rarely have authority over engineering, design, or business decisions directly. The more accurate framing: PMs have accountability without authority. They are responsible for the product's outcomes but must achieve those outcomes through influence rather than command.

What PMs actually do:
- **Define the problem** — understand users well enough to know what problem the product should solve
- **Prioritise ruthlessly** — decide what to build now versus later versus never, and defend those decisions with evidence
- **Set direction** — communicate a coherent vision and s\`rategy that aligns the team's work
- **Manage trade-offs** — make calls when user needs, technical constraints, and business requirements conflict
- **Measure outcomes** — determine whether shipped features produced the intended results and iterate accordingly

What PMs do NOT do:
- Write code or design screens (unless they happen to have those skills — but it is not the role)
- Tell engineers how to build something (that is the engineer's domain)
- Make business decisions alone (PMs make recommendations; executives make final calls on large commitments)

### The Product Triad

Modern product teams are typically structured around a triad: Product Manager, Designer, and Tech Lead. Each brings a different lens to product decisions:

- **PM:** Is this valuable? Is this the right problem? Does this move the business forward?
- **Designer:** Is this usable? Does this match user mental models? Is this experience coherent?
- **Tech Lead:** Is this feasible? How should we build it? What are the technical trade-offs?

Good product decisions address all three dimensions. Building something technically feasible but not valuable wastes engineering resources. Building something users love but technically impossible in the timeframe sets false expectations.

### PM Levels and Archetypes

Entry-level PMs manage features within an existing product. Senior PMs manage products or product areas. Directors and VPs manage groups of PMs and set portfolio strategy. CPOs (Chief Product Officers) shape company-level product direction.

In practice, the PM role varies enormously by company type:
- **B2C consumer:** heavy emphasis on growth metrics, A/B testing, viral loops
- **B2B enterprise:** heavy emphasis on sales enablement, customer success, contract requirements
- **Platform/API:** heavy emphasis on developer experience, documentation, ecosystem
- **Early-stage startup:** PM role overlaps significantly with founder, doing customer development, writing code, running sales

### Why PM Exists

Before formal product management, software companies split into two failure modes:
- **Engineer-led:** built technically interesting things that users did not need or could not use
- **Business-led:** built according to client specifications without feedback loops, accumulating technical debt and user frustration

PM emerged to bridge these failure modes — to continuously ask "are we building the right thing?" while engineering asks "are we building it right?" Neither question alone produces good products. Both together, in continuous dialogue, do.

The best products in the world — the iPhone, Slack, Airbnb, Figma — were built by teams that were excellent at both. But neither started with a complete specification. They started with a hypothesis about user needs and iterated toward product-market fit through structured learning.`,
    quiz: [
      {
        q: 'A PM ships a feature that 90% of the engineering team\'s quarter was spent on, but only 2% of users adopt it. How should this outcome be evaluated?',
        options: ['Success — the feature was shipped as specified', 'Success — the engineering work was high quality', 'Failure — the PM\'s responsibility is outcomes (user adoption, behaviour change), not outputs (features shipped)', 'The engineering team should be held accountable'],
        correct: 2,
        explanation: 'PMs are evaluated on outcomes — changes in user behaviour and business metrics — not outputs. Shipping features users don\'t adopt represents a failure of discovery: the team built something without validating that users would want or use it.',
      },
      {
        q: 'What does "accountability without authority" mean in the context of PM work?',
        options: ['PMs report to multiple teams simultaneously', 'PMs are responsible for product outcomes but must achieve them through influence, not command, since they don\'t directly manage designers or engineers', 'PMs have authority to block engineering work', 'The title "PM" carries no formal responsibilities'],
        correct: 1,
        explanation: 'PMs are held accountable for product outcomes (does the product succeed?) but typically have no direct authority over the engineers and designers who build it. They achieve results through clear direction, compelling reasoning, and building trust.',
      },
      {
        q: 'In the product triad, what primary question does the designer bring to product decisions?',
        options: ['Is this technically feasible?', 'Will this generate revenue?', 'Is this usable — does it match user mental models and create a coherent experience?', 'Does this meet the roadmap timeline?'],
        correct: 2,
        explanation: 'The product triad: PM evaluates value and strategy; Designer evaluates usability and experience; Tech Lead evaluates technical feasibility. All three questions must be answered for a good product decision.',
      },
      {
        q: 'What distinguishes "discovery" from "delivery" in product management?',
        options: ['Discovery is done by designers; delivery is done by engineers', 'Discovery is learning whether a solution is valuable and feasible before building; delivery is building and shipping validated solutions', 'Discovery produces the roadmap; delivery executes it', 'Discovery is the marketing phase; delivery is the launch'],
        correct: 1,
        explanation: 'Discovery answers: is this the right problem, and will this solution work? Delivery answers: can we build it correctly? Both are required — discovery without delivery produces learning but no product; delivery without discovery produces product but not the right one.',
      },
      {
        q: 'Before formal product management, what were the two common failure modes for software companies?',
        options: ['Too much design; too little engineering', 'Engineer-led (built interesting things users didn\'t need) and business-led (built client specs without feedback loops)', 'Too much discovery; too little shipping', 'Technical debt and hiring failures'],
        correct: 1,
        explanation: 'PM emerged to bridge engineer-led teams (technically excellent but not solving real user needs) and business-led teams (client-driven, accumulating debt and user frustration). The PM role represents user needs and business goals inside an organisation that would otherwise optimise for technical interest or short-term client requests.',
      },
    ],
  },
  {
    id: 'pm-m02',
    track: 'product-mgmt' as any,
    title: 'User Research & Discovery',
    subtitle: 'Finding the right problem before spending a dollar building the wrong solution',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Jobs To Be Done (JTBD)', definition: 'A framework viewing products as tools users "hire" to accomplish specific jobs — focusing on the underlying motivation (the job) rather than the product or demographic of the user.' },
      { term: 'Customer Development', definition: 'Steve Blank\'s methodology for validating business and product assumptions through structured customer conversations before building — the foundation of the Lean Startup approach.' },
      { term: 'Problem Interview', definition: 'A structured conversation to validate that a problem exists, how painful it is, and what users currently do to solve it — done before any solution is proposed or shown.' },
      { term: 'Assumption Mapping', definition: 'The process of identifying all the beliefs a product hypothesis rests on and ordering them by risk — which assumptions, if wrong, would kill the product idea?' },
      { term: 'MVP (Minimum Viable Product)', definition: 'The smallest product that allows the team to learn the most important thing — often not a product at all, but a design prototype, a landing page, or a manual process.' },
    ],
    content: `## User Research & Discovery

The most common cause of product failure is not bad engineering. It is building the right thing in the wrong way, or the wrong thing extremely well. The top two causes of startup failure in post-mortem studies are "no market need" and "ran out of cash" — the second often being a direct consequence of spending money on the first.

Discovery is the discipline of answering one question before spending resources: is this problem real, important, and underserved enough that a solution people will pay for (or use at scale) can be built?

### Jobs To Be Done

Clayton Christensen's Jobs To Be Done framework reframes product thinking: users don't buy products, they hire them to do jobs. When someone hires a power drill, the job is not "have a drill" — it is "have a hole in the wall." When someone hires Slack, the job is not "have a messaging tool" — it is "coordinate my team without email chaos."

Understanding the job means understanding:
- **The functional job:** the practical task to be accomplished
- **The emotional job:** how the user wants to feel while doing it
- **The social job:** how the user wants to be perceived while doing it

The famous milkshake example: McDonald's discovered that a large proportion of milkshakes were purchased early in the morning, by commuters, for a job that had nothing to do with hunger or enjoyment. The job was "give me something to hold and sip that makes my commute less boring while keeping one hand free." Competing products (donuts, bananas) failed the social job (messy to eat while driving) or the functional job (done too fast). The milkshake hired better for that job than any obvious substitute.

### The Mom Test

Rob Fitzpatrick's "The Mom Test" (2013) identifies the fundamental error in most user research: asking questions users want to answer nicely rather than questions that reveal truth.

"Would you use this?" — a bad question. Users want to be supportive; they say yes.
"Do you have this problem?" — a bad question. Users retroactively construct a problem to validate your interest.
"What is the hardest part about your current approach?" — a good question. The answer is about their life, not your idea.
"Tell me about the last time you tried to do this?" — a good question. Anchors to specific past behaviour, not hypothetical future behaviour.

The Mom Test principle: ask about the customer's life and past behaviour. Never pitch or reveal your solution until you've confirmed the problem exists and is genuinely important.

### Assumption Mapping and Risk

Every product idea rests on a stack of assumptions. Before building, make them explicit and rank them by risk:

1. **Desirability:** Do users actually want this? Does the problem exist? Is it important enough to address?
2. **Feasibility:** Can this be built with available technology and resources?
3. **Viability:** Will this create a sustainable business? Will users pay for it?
4. **Ethical:** Are there unintended negative consequences?

Most product teams get these backwards — they validate feasibility (can we build it?) first because it is most comfortable, and test desirability last or never. Discovery flips this: test desirability — the riskiest assumption — first, and only invest in feasibility once desirability is established.

### The MVP Is Not a Beta Product

"Minimum Viable Product" is widely misunderstood as "a crappy early version." Eric Ries's original definition: the smallest thing you can build (or do) to test your most important assumption.

The MVP is a learning tool:
- A landing page describing a product that doesn't exist tests whether people click "Sign Up"
- A concierge MVP (doing the process manually for early users) tests whether users value the outcome before automating it
- A Wizard of Oz MVP (where a human behind the curtain simulates the AI or automation) tests whether users would pay for a fully-automated version
- A smoke test / pretotype shows a product and counts intent-to-purchase before building

Dropbox's MVP was a demo video. Zappos's MVP was manually purchasing shoes from physical stores when online orders came in. Airbnb's MVP was a website for one event in San Francisco with photos taken on a digital camera.

### Continuous Discovery

Teresa Torres popularised "continuous discovery" — the practice of doing small amounts of customer research every week rather than periodic large research projects. Weekly habits:
- 1-2 customer interviews per week
- Ongoing review of support tickets and user feedback
- Regular observation of session recordings
- Monthly review of analytics against discovery hypotheses

Continuous discovery prevents the organisation from going months or years between customer conversations and making large bets based on stale understanding.`,
    quiz: [
      {
        q: 'Using the Jobs To Be Done framework, what is the "job" someone hires a taxi app for?',
        options: ['To have a taxi app on their phone', 'To be transported from one location to another without the friction, uncertainty, or planning o` alternatives', 'To rate drivers and leave reviews', 'To see available cars on a map'],
        correct: 1,
        explanation: 'JTBD focuses on the underlying goal, not the product feature. The job is "reliably get from A to B without friction" — encompassing availability certainty, pricing transparency, and reduced cognitive effort compared to alternatives (calling a dispatcher, hailing on the street).',
      },
      {
        q: 'Why is "Would you use this product?" a bad user research question?',
        options: ['It reveals too much about the product concept', 'It is about a hypothetical future; users cannot accurately predict their future behaviour and are socially inclined to say yes', 'It is too long for a survey question', 'It doesn\'t measure retention'],
        correct: 1,
        explanation: 'Hypothetical questions produce socially desirable answers — users want to be supportive. The Mom Test principle: ask about past behaviour and current pain points, not about hypothetical future usage. "Tell me about the last time you tried to do X" produces far more reliable data.',
      },
      {
        q: 'In assumption mapping, which assumption should be tested first?',
        options: ['Feasibility — can we build it?', 'Viability — will it make money?', 'Desirability — do users actually want this? Does the problem exist and matter?', 'Scalability — can it grow?'],
        correct: 2,
        explanation: 'Desirability is the riskiest assumption and the one that kills the most products. Most teams test feasibility first because it\'s comfortable — they know how to estimate engineering effort. Testing desirability first means investing in understanding user needs before spending engineering resources.',
      },
      {
        q: 'Dropbox\'s original MVP was a demo video rather than a working product. What assumption did this test?',
        options: ['Whether engineers could build cloud file sync', 'Whether users desired a solution to the problem — sign-ups for the waitlist validated demand before a line of product code was written', 'Whether investors would fund the company', 'Whether the brand resonated with users'],
        correct: 1,
        explanation: 'Dropbox\'s demo video tested desirability: does this problem exist, and do users want a solution like this enough to sign up and wait for it? Overnight waitlist growth confirmed the answer before building the actual product.',
      },
      {
        q: 'What is "continuous discovery" and why does it matter?',
        options: ['Continuous A/B testing of new features', 'Ongoing weekly customer research habits rather than periodic large-scale research projects — preventing stale customer understanding and enabling continuous learning', 'The daily standup ritual for product teams', 'Automated user testing tools'],
        correct: 1,
        explanation: 'Continuous discovery (Torres) means small amounts of customer research every week — 1-2 interviews, ongoing analytics review, session recordings. Teams that do episodic research (every 6-12 months) make large bets based on outdated understanding; continuous discovery keeps the organisation aligned with current user reality.',
      },
    ],
  },
  {
    id: 'pm-m03',
    track: 'product-mgmt' as any,
    title: 'Product Strategy & Roadmapping',
    subtitle: 'The architecture of product direction — where you are going, why, and in what order',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Product Vision', definition: 'A long-term (3–5 year) inspiring description of what the product will become and why — directional rather than prescriptive, stable enough to guide decision-making, inspiring enough to motivate teams.' },
      { term: 'Product Strategy', definition: 'The plan for how the product will achieve its vision — which users to focus on, which problems to solve, and what capabilities to build to create durable competitive advantage.' },
      { term: 'OKRs (Objectives and Key Results)', definition: 'A goal-setting framework: Objectives are qualitative directional goals; Key Results are quantitative metrics that measure progress. Connects product work to business outcomes.' },
      { term: 'Now-Next-Later Roadmap', definition: 'A roadmap format organising work into three horizons without specific dates — "Now" (in progress), "Next" (validated and ready to start), "Later" (direction but not yet planned) — acknowledging uncertainty.' },
      { term: 'Opportunity Cost', definition: 'The value of the next-best alternative foregone by choosing a course of action — every item on a roadmap represents the decision NOT to build everything else; strategy is as much about what not to do.' },
    ],
    content: \`## Product Strategy & Roadmapping

Strategy is the answer to "how will we win?" For products, this means: which users, which problems, which capabilities, and in what sequence — given limited resources and an uncertain future. Most product "strategies" are actually lists of features, which is planning, not strategy.

### Vision, Strategy, Roadmap

These three concepts operate at different time horizons and levels of abstraction:

**Vision (3–5+ years):** Describes the world the product is trying to create. Amazon's early vision: "Every book in print, delivered anywhere in the world in 24 hours." This was not achievable immediately, but it was clear enough to guide every meaningful decision. Good visions are customer-centric (describes a customer experience), inspiring (makes people want to work toward it), and long-term enough to survive tactical volatility.

**Strategy (1–2 years):** Translates the vision into a theory of how to achieve it. Which segment to focus on first. Which problems to solve before others. Which technical capabilities create defensible advantage. Strategy involves explicit trade-offs — not doing something is a strategic choice as much as doing it.

**Roadmap (months):** Communicates the sequence of work the team is planning to do given the current strategy. Subject to change as learning occurs. Not a commitment — a current best guess given current information.

The common failure: treating the roadmap as a promise. Feature requests from sales become committed deliverables. Stakeholders plan launches around roadmap dates. Engineers are measured on delivering the feature, not on the outcome the feature was supposed to create. The result: a feature factory that ships relentlessly without knowing whether any of it works.

### OKRs for Products

OKRs translate strategy into measurable quarterly goals:
- **Objective:** "Make our onboarding the best in the category" — qualitative, inspiring, directional
- **Key Results:** "Increase Day 7 retention from 42% to 55%" / "Decrease time-to-first-value from 14 minutes to 6 minutes" / "Increase onboarding NPS from 32 to 45"

Key Results measure the outcomes you're trying to achieve, not the outputs (features) you're building. This keeps the team focused on whether the work is actually producing results, rather than just building things.

OKRs also create explicit focus: each quarter, the team commits to 3–5 Key Results. Everything not in service of those Key Results should be challenged. "We should add this feature because it would be nice" is not an argument against OKRs. "This feature moves KR2 (time-to-first-value)" is.

### Roadmap Formats

**Feature roadmaps** (what most companies use): a list of features with delivery dates. Problems: creates false precision about timelines, makes re-prioritisation politically difficult, evaluated on feature delivery rather than outcomes.

**Outcome roadmaps:** organised around outcomes and problem areas rather than features. "Q3: Reduce onboarding drop-off. Q4: Improve retention for the SMB segment." The specific solutions are TBD — discovery determines them. This is more honest and more flexible.

**Now-Next-Later roadmaps:** (popularised by Janna Bastow): three horizons without specific dates. "Now" = actively building. "Next" = validated and ready to start when Now completes. "Later" = directionally committed but not yet planned in detail. Acknowledges that certainty decreases with time, and reduces false precision.

**Theme-based roadmaps:** organised around strategic themes (areas of investment) rather than features or outcomes. "This year: data portability, enterprise security, and API ecosystem." Gives stakeholders directional clarity without committing to specific features.

### Strategy vs Feature Requests

Every product team is under pressure from stakeholders to build specific things: Sales wants a specific enterprise feature to close a deal. Marketing wants a sharing feature to drive acquisition. Executives want a dashboard. Support wants better tooling.

Good strategy does not mean ignoring these inputs — it means evaluating them against: Does this move us toward our strategic goals? Who else has this need? What is the opportunity cost?

A feature that closes one enterprise deal but requires abandoning a strategic platform investment may be wrong even if the deal is large. The discipline of strategy is making that argument with evidence rather than instinct.

### The Adjacent Possible

Strategic opportunity often lies in the "adjacent possible" — the set of next moves available from the current position. Amazon could not have launched AWS in 1994; it became possible only after the company had built the infrastructure that required managing cloud scale. The iPhone's timing was not arbitrary — it required the convergence of affordable touchscreens, mobile processors, and cellular bandwidth.

Good product strategy reads the adjacent possible: what capabilities have we built that enable something we couldn't do before? What is becoming technically or economically possible in the next 12–24 months? Strategy bets on the adjacent possible rather than waiting for it.`,
    quiz: [
      {
        q: 'What is the primary problem with using a feature roadmap with specific delivery dates?',
        options: ['Features are too specific to be strategic', 'It creates false precision, makes re-prioritisation politically difficult, and evaluates teams on delivery rather than outcomes', 'Dates are difficult to communicate to users', 'It requires too much engineering planning'],
        correct: 1,
        explanation: 'Feature roadmaps with dates imply commitments. Stakeholders plan around them; teams are measured on meeting them. This creates a "feature factory" where the team ships features without asking whether they produce the intended outcomes, and where re-prioritisation in response to new learning is resisted.',
      },
      {
        q: 'An OKR\'s Key Results should measure:',
        options: ['The features shipped each quarter', 'The hours the team worked', 'The outcomes (behaviour change, metric movement) you are trying to achieve, not the outputs you\'re building', 'Customer satisfaction with the PM'],
        correct: 2,
        explanation: 'Key Results measure whether the team is achieving the desired outcomes — retention, adoption, time-to-value — not whether features were shipped. This keeps teams focused on whether their work is actually producing results.',
      },
      {
        q: 'What distinguishes product "strategy" from a feature list?',
        options: ['Strategy is longer', 'Strategy defines which users to focus on, which problems to solve, and what capabilities create durable advantage — it includes explicit decisions about what NOT to do', 'Strategy is approved by executives', 'Strategy includes estimated development timelines'],
        correct: 1,
        explanation: 'Strategy answers "how will we win?" by making explicit trade-offs. A feature list is a plan of what to build; it does not answer why those things and not others, for which users, or how they create competitive advantage. Strategy is as much about what not to do as what to do.',
      },
      {
        q: 'In the Now-Next-Later roadmap format, what is the benefit of the "Later" category?',
        options: ['It allows teams to commit to future features in detail', 'It honestly acknowledges uncertainty by showing directional intent without false precision about unplanned future work', 'It replaces the need for an annual planning process', 'It is only used in agile development environments'],
        correct: 1,
        explanation: 'Now-Next-Later acknowledges that certainty decreases with time. "Later" communicates direction (we plan to invest in this area) without committing to specific solutions before discovery has happened — more honest and more flexible than a dated feature list.',
      },
      {
        q: 'Sales requests a feature that would close a large enterprise deal but requires deprioritising a strategic platform investment. How should a PM approach this decision?',
        options: ['Always prioritise sales requests to support revenue', 'Always decline non-strategic requests', 'Evaluate it against: does this move strategic goals, who else has this need, and what is the opportunity cost of deferring the platform investment', 'Escalate to the CEO to decide'],
        correct: 2,
        explanation: 'Good strategy means evaluating feature requests against strategic goals and opportunity costs. One large deal may be worth deferring a strategic investment — or not. The PM\'s job is to make that argument with evidence, not to rubber-stamp requests or reflexively refuse them.',
      },
    ],
  },
  {
    id: 'pm-m04',
    track: 'product-mgmt' as any,
    title: 'Product-Market Fit',
    subtitle: 'The only milestone that matters — and how to know when you have it',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Retention Curve', definition: 'The percentage of users who remain active over time after first using a product — a curve that flattens (rather than declining to zero) indicates retained value and is the strongest leading indicator of PMF.' },
      { term: 'Sean Ellis Test', definition: 'A survey asking "How would you feel if you could no longer use this product?" — a score of 40%+ "very disappointed" is a validated leading indicator of product-market fit.' },
      { term: 'NPS (Net Promoter Score)', definition: 'Measures loyalty: "How likely are you to recommend?" on a 0–10 scale. Promoters (9-10) minus Detractors (0-6). A product approaching PMF typically sees NPS improving quarter over quarter.' },
      { term: 'DAU/MAU Ratio', definition: 'Daily Active Users divided by Monthly Active Users — measures engagement depth. Above 50% is exceptional; above 25% is strong. A high ratio indicates users return habitually, not occasionally.' },
      { term: 'Cohort Retention', definition: 'Tracking groups of users who started in the same period over subsequent months — a cohort that retains at 30%+ at Month 6 is a positive PMF signal for many product categories.' },
    ],
    content: `## Product-Market Fit

Marc Andreessen: "Product-market fit means being in a good market with a product that can satisfy that market." He continued: "You can always feel when product/market fit isn't happening. The customers aren't quite getting value out of the product, word of mouth isn't spreading... But you can also feel product/market fit when it's happening. The customers are buying the product just as fast as you can make it... Money from customers is piling up in your company checking account."

Most product work before PMF is searching. Most product work after PMF is scaling. They require entirely different approaches. Scaling before PMF wastes resources; searching after PMF misses the window.

### Why PMF is the Only Metric That Matters Pre-Scale

Before PMF, all other metrics are misleading:
- Revenue exists because founders hustle and customers give you the benefit of the doubt
- Users sign up because of marketing spend, not because the product delivers genuine value
- Engagement is driven by novelty, not habit

The diagnostic: remove the hustle. If every founder stopped doing sales for a week, would the product continue growing organically through word of mouth? If the answer is no, PMF has not been achieved regardless of what the revenue numbers say.

### How to Measure PMF

**The Sean Ellis Test:** Survey users: "How would you feel if you could no longer use this product?" Options: Very disappointed / Somewhat disappointed / Not disappointed (it isn't that useful) / N/A.

A score of 40%+ "very disappointed" is a validated predictor of sustainable product growth. Below 40%, users are not finding the product essential enough to drive organic word of mouth. Above 40%, the product has found enough users for whom it is genuinely indispensable.

Segment the result: if 60% of one specific user segment responds "very disappointed" while the overall score is 25%, you have found your most valuable user segment. Optimise for them first.

**Retention curves:** Plot the percentage of new users who return at Day 1, Day 7, Day 30, Day 90. A curve that approaches zero means users try the product and don't come back — the product is not creating lasting value. A curve that flattens (stabilises above zero) means a subset of users has found the product genuinely valuable. The flattening indicates PMF within a segment; the height of the flat portion indicates how large that segment is.

**Organic acquisition fraction:** What percentage of new users came through paid channels versus organic (word of mouth, search, press)? A growing organic fraction at constant or decreasing paid spend indicates that the product is selling itself through user advocacy — the hallmark of PMF.

**Cohort retention:** Track groups of users who started in the same month. Healthy retention at Month 6 (product-dependent; typically above 25-30% for SaaS, above 15% for consumer) is a strong PMF signal.

### The PMF Spectrum

PMF is not binary — it's a spectrum. Common stages:

**Pre-PMF:** Users are not finding lasting value. Retention approaches zero. Product pivots are necessary, not refinements.

**Weak PMF:** A segment finds the product genuinely useful. Retention flattens for this segment but the segment is small or the product is hard to expand from. Requires deepening for the identified segment or expanding to adjacent segments.

**Strong PMF:** A large enough segment finds the product essential. Retention is healthy. Word of mouth is organic. Unit economics are improving. The question shifts from "does this work?" to "how do we scale this?"

**PMF in a new segment:** An existing product achieves PMF in a new user segment. Often happens when a B2C product develops B2B traction, or a tool built for one industry finds adoption in another.

### Pivoting Toward PMF

Paul Graham's observation: startups that succeed rarely succeed with their original idea. They succeed by being close enough to the right problem that customer conversations reveal the real opportunity.

Pivots come in several varieties:
- **Customer pivot:** Same problem, different customer segment (initial target didn't need it; an adjacent segment does)
- **Problem pivot:** Same customer, different problem (they don't have the problem you thought; they have a related, bigger one)
- **Solution pivot:** Same problem, different approach (the solution you chose doesn't work; an adjacent approach does)

The discipline: staying close enough to real users that the pivot is informed by evidence, not despair. Pivots made from data (customer interviews, retention data, usage patterns) tend to move toward PMF. Pivots made from internal frustration tend to circle in the wrong direction.`,
    quiz: [
      {
        q: 'A product has a retention curve that gradually approaches zero by Day 30. What does this indicate?',
        options: ['PMF has been achieved for a small segment', 'The onboarding experience needs improvement', 'Users are not finding lasting value — the product has not achieved PMF', 'The product category has low natural retention'],
        correct: 2,
        explana`ion: 'A retention curve approaching zero means users try the product and don\'t come back. No subset of users has found the product genuinely valuable. PMF produces a retention curve that flattens — a portion of users continues to return habitually.',
      },
      {
        q: 'The Sean Ellis Test asks "How would you feel if you could no longer use this product?" — what response percentage indicates PMF?',
        options: ['20%+ "somewhat disappointed"', '40%+ "very disappointed"', '60%+ "not disappointed"', '50%+ NPS promoters'],
        correct: 1,
        explanation: 'Sean Ellis validated that 40%+ "very disappointed" responses correlate with sustainable organic product growth. Below 40%, the product is not essential to enough users to drive word-of-mouth acquisition. Above 40%, PMF is indicated.',
      },
      {
        q: 'Before PMF, a startup\'s revenue growth is primarily driven by founder hustle and customers giving the product the benefit of the doubt. What is the practical implication of this for how revenue should be interpreted?',
        options: ['Revenue is irrelevant before PMF', 'Revenue growth before PMF reflects execution intensity, not product-market fit — removing the hustle tests whether the product generates organic demand', 'Founder-driven revenue does not count toward PMF', 'Revenue only matters in B2B products'],
        correct: 1,
        explanation: 'Pre-PMF revenue reflects how hard founders are working, not whether users genuinely need the product. The diagnostic: would the product grow organically if founders stopped selling for a week? If not, PMF has not been achieved regardless of revenue.',
      },
      {
        q: 'The Sean Ellis Test shows 60% "very disappointed" for engineers but only 18% overall. What should the product team do?',
        options: ['Ignore the result and improve overall score', 'Pivot away from engineers since the overall score is too low', 'Recognise that PMF has been found with engineer users; optimise specifically for that segment before attempting to broaden', 'Increase marketing to reach more engineers'],
        correct: 2,
        explanation: 'When a segment shows strong PMF signals while the overall score is low, the optimal move is to go deeper in the segment where PMF exists — optimise the product for that segment, understand what makes it compelling there, and expand from that position of strength.',
      },
      {
        q: 'What distinguishes an evidence-based pivot from a "despair pivot"?',
        options: ['Evidence-based pivots are faster', 'Evidence-based pivots are informed by customer data (interviews, retention, usage); despair pivots are driven by internal frustration without a clear signal about what to change', 'Evidence-based pivots change the customer segment; despair pivots change the solution', 'There is no meaningful distinction — pivots are always evidence-based'],
        correct: 1,
        explanation: 'Pivots driven by data — customer interviews revealing an adjacent problem, retention data showing one segment retains differently — tend to move toward PMF. Pivots driven by frustration with lack of traction, without a clear learning about what to change, often cycle without converging.',
      },
    ],
  },
  {
    id: 'pm-m05',
    track: 'product-mgmt' as any,
    title: 'Defining Requirements',
    subtitle: 'Translating user need and business intent into buildable, testable specifications',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 5,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'PRD (Product Requirements Document)', definition: 'A document describing what a product or feature must do — the problem it solves, the users it serves, the proposed solution, success metrics, and constraints — written by the PM before engineering begins.' },
      { term: 'User Story', definition: 'A short description of a feature from the perspective of the user: "As a [type of user], I want [goal] so that [reason]." A unit of work that expresses user value rather than technical tasks.' },
      { term: 'Acceptance Criteria', definition: 'The conditions a feature must meet to be considered complete — specific, testable statements that define the boundary between done and not done.' },
      { term: 'Edge Case', definition: 'A scenario that occurs at the boundaries of a feature\'s design space — rare inputs, unusual user states, system failures. Well-written requirements address edge cases before they become production bugs.' },
      { term: 'Non-Functional Requirements', definition: 'Requirements that define system quality attributes — performance, security, scalability, reliability — rather than feature behaviour. Often unstated and later discovered as production problems.' },
    ],
    content: \`## Defining Requirements

A requirement is a specification of what must be true for a feature to be considered complete and correct. Poor requirements produce features that don't match user needs, don't meet stakeholder expectations, and surprise engineers with edge cases mid-development. Good requirements align everyone on what is being built and why before the first line of code is written.

### From Problem to Requirement

The progression: problem statement → solution hypothesis → requirements → acceptance criteria.

**Problem statement:** "Users abandon the checkout flow at the payment step because they are uncertain whether their card information is secure."

**Solution hypothesis:** "Displaying security certifications, lock icons, and a brief trust statement near the payment fields will reduce abandonment."

**Requirements:** "The checkout payment page must display an SSL certificate indicator in the header, a payment security badge adjacent to the card fields, and a one-sentence trust statement below the card number field."

**Acceptance criteria:** "SSL indicator is visible in the browser address bar. Payment badge displays the provider's logo and reads 'Secured by [Provider]'. Trust statement reads 'Your payment information is encrypted and never stored.' All three elements are present on mobile and desktop. The page loads in under 2 seconds with all trust elements visible."

### Product Requirements Documents

PRDs vary in format by company and team, but a complete PRD typically includes:

1. **Problem definition** — what user problem or business opportunity is being addressed?
2. **User context** — who specifically has this problem? In what context? With what frequency and severity?
3. **Goals** — what outcomes should this feature produce? How will we measure success?
4. **Non-goals** — explicit statement of what is NOT being addressed in this iteration
5. **Proposed solution** — at a conceptual level (not implementation details)
6. **Requirements** — what must be true for this feature to be complete
7. **Edge cases** — unusual but possible scenarios the implementation must handle
8. **Non-functional requirements** — performance, security, accessibility constraints
9. **Dependencies** — what else must be true for this to work?
10. **Open questions** — decisions not yet made, information not yet known

The PRD is a communication tool, not a compliance document. Its purpose is to ensure that everyone building the feature is working toward the same outcome. Length matters less than clarity.

### User Stories

User stories express requirements from the user's perspective:
"As a [user type], I want [capability], so that [outcome]."

Examples:
- "As a returning customer, I want my shipping address to be pre-filled, so that I can check out faster."
- "As an admin, I want to export user data as a CSV, so that I can provide reports to our legal team."
- "As a new user, I want to see what the product can do before signing up, so that I can decide if it's right for me."

Good user stories are:
- **Independent:** can be built and shipped without requiring another story to be complete
- **Negotiable:** the story describes the goal, not the implementation — the team can discuss how to achieve it
- **Valuable:** the story delivers value to a user or the business
- **Estimable:** the team has enough information to estimate the effort
- **Small:** can be completed in one sprint
- **Testable:** has specific acceptance criteria

Stories are not task lists. "Build the database schema for user addresses" is a technical task. "As a returning user, I want my shipping address remembered" is a user story.

### Writing Acceptance Criteria

Acceptance criteria define "done." They are testable, specific conditions:

**Given** [precondition], **When** [action], **Then** [expected outcome].

Example: "Given a logged-in user with a saved shipping address, When they proceed to checkout, Then their saved address is pre-populated in the shipping form and marked as default."

Good acceptance criteria:
- Are specific enough to be tested manually or automatically
- Cover the happy path AND key edge cases
- Include non-functional conditions ("loads in under 1.5 seconds")
- Are written before implementation begins (forces agreement upfront)

### Edge Cases and Non-Functional Requirements

The most expensive bugs are the ones nobody wrote a requirement for.

Common edge cases that requirements miss:
- What happens when the user's internet connection drops mid-process?
- What happens when the user submits the form twice (double-click, slow connection)?
- What happens when the input is empty, or contains special characters, or is 10,000 characters long?
- What happens when the dependent service (payment processor, shipping API) is unavailable?

Non-functional requirements are frequently undocumented because stakeholders assume them. "The page should load fast" is not a requirement. "The page must achieve a First Contentful Paint of under 1.8 seconds on 4G mobile" is.`,
    quiz: [
      {
        q: 'What is the primary purpose of a PRD?',
        options: ['To assign work to engineers', 'To create a legal contract with stakeholders', 'To align everyone building a feature on the same problem, solution, and success criteria before implementation begins', 'To document the feature after it ships'],
        correct: 2,
        explanation: 'A PRD is a communication tool that ensures engineers, designers, QA, and stakeholders are all working toward the same outcome. Its purpose is alignment before investment, not specification for compliance.',
      },
      {
        q: 'Which of these is a user story, not a technical task?',
        options: ['"Build the database schema for user preferences"', '"Set up the Redis cache for session management"', '"As a frequent buyer, I want to save my payment method, so that I can checkout in one click"', '"Implement the OAuth token refresh endpoint"'],
        correct: 2,
        explanation: 'User stories express value from the user\'s perspective in the "As a / I want / So that" format. Technical tasks describe implementation work. User stories define what must be true; engineers determine how to implement it.',
      },
      {
        q: 'In the Given-When-Then acceptance criteria format, what is the role of "Given"?',
        options: ['It describes the expected outcome', 'It defines the precondition — the state that must be true for the test scenario to apply', 'It names the user who performs the action', 'It describes the business value of the feature'],
        correct: 1,
        explanation: '"Given" establishes the precondition — the state the system and user must be in for the scenario to apply. "When" is the action taken. "Then" is the expected outcome. This structure makes acceptance criteria unambiguous and testable.',
      },
      {
        q: 'A checkout feature ships and users discover that double-clicking "Buy" sometimes places the order twice. This is most likely a failure of:',
        options: ['Engineering quality', 'Requirements writing — the double-submit edge case was not specified in acceptance criteria', 'Product-market fit research', 'User testing protocol'],
        correct: 1,
        explanation: 'Double-submit is a classic edge case: the user takes the expected action more than once due to slow feedback, impatience, or finger movement. Requirements that address edge cases prevent this class of bug; omitting them shifts the discovery to production.',
      },
      {
        q: 'Why should non-functional requirements (performance, security, accessibility) be written explicitly in requirements documents?',
        options: ['They are legally required', 'Stakeholders routinely assume them without specifying them; undocumented NFRs become production problems that are expensive to fix post-launch', 'Engineers don\'t know how to implement performance without specifications', 'They prevent scope creep'],
        correct: 1,
        explanation: 'Stakeholders assume non-functional requirements ("it should be fast," "it should be secure") without specifying them. Without explicit, measurable NFRs, engineering teams optimise for functional requirements and discover performance or accessibility gaps in production, where fixing them is far more expensive.',
      },
    ],
  },
  {
    id: 'pm-m06',
    track: 'product-mgmt' as any,
    title: 'Prioritisation Frameworks',
    subtitle: 'Deciding what to build first when everything is urgent and nothing can be ignored',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 6,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'RICE Framework', definition: 'Reach × Impact × Confidence ÷ Effort — a scoring formula for prioritising features objectively; high reach, high impact, high confidence, and low effort scores rank highest.' },
      { term: 'ICE Score', definition: 'Impact × Confidence × Ease — a simpler prioritisation heuristic for early-stage teams; quick to apply but less rigorous than RICE.' },
      { term: 'MoSCoW Method', definition: 'Categorises requirements as Must Have, Should Have, Could Have, and Won\'t Have — used for release scope management rather than backlog ordering.' },
      { term: 'Opportunity Scoring', definition: 'Tony Ulwick\'s method rating jobs by importance and current satisfaction level — high importance, low satisfaction gaps are the highest-priority opportunities for product investment.' },
      { term: 'Technical Debt', definition: 'The accumulated cost of earlier shortcuts in software design — eventually creating interest payments in the form of slower development, more bugs, and harder maintenance. PMs must balance debt repayment against feature investment.' },
    ],
    content: `## Prioritisation Frameworks

Every product team has more ideas than capacity. Prioritisation is the process of deciding what to build next — not by instinct or by whoever argues loudest, but by a systematic evaluation of impact, effort, and strategic fit.

The goal of prioritisation frameworks is not to make the decision automatic. It is to make the decision process explicit, auditable, and defensible — so that the PM can explain to stakeholders why specific work was chosen and why alternatives were deferred.

### The Core Trade-off: Value vs Effort

All prioritisation frameworks are variations on value divided by effort. High value, low effort items should always come first. Low value, high effort items should almost never be done. The interesting decisions are high value, high effort (big bets) versus low value, low effort (quick wins).

A 2×2 matrix of value vs effort is the simplest prioritisation tool:
- **Top right (high value, low effort):** do immediately
- **Top left (high value, high effort):** plan and invest
- **Bottom right (low value, low effort):** do if capacity allows
- **Bottom left (low value, high effort):** never do unless strategically required

### RICE Scoring

Intercom's RICE framework adds rigour:

**RICE = (Reach × Impact × Confidence) / Effort**

- **Reach:** how many users will this affect in a given period? (e.g., users per quarter)
- **Impact:** how much will it improve each user's experience? (scored 3/2/1/0.5/0.25 for massive/high/medium/low/minimal)
- **Confidence:** how confident are you in the estimates? (100%/80%/50% for high/medium/low)
- **Effort:** person-months of work across the full team

A feature reaching 500 users/quarter with medium impact (1), high confidence (100%), and 1 month effort scores 500. Another reaching 2,000 users with low impact (0.5), low confidence (50%), and 2 months effort scores 250. RICE makes these comparisons explicit.

Caveats: RICE numbers are only as good as the estimates feeding them. Teams new to the framework tend to overestimate reach and underestimate effort. Calibrating against historical data makes scores more reliable over time.

### ICE Scoring

A simpler version: Impact × Confidence × Ease, each scored 1–10. Useful for quick comparative ranking in early-stage teams where rigorous estimation is not feasible. Less precise but faster and applicable with limited data.

### MoSCoW Method

Used primarily for release scope management:
- **Must Have:** without this, the release is a failure
- **Should Have:** important, but the release works without it
- **Could Have:** nice to have if time allows
- **Won't Have:** explicitly excluded from this release (but not forever)

MoSCoW does not prioritise across all backlog items — it scopes a specific release. The discipline is being honest about "Must Have." Teams that put everything in Must Have have negated the tool.

### Opportunity Scoring (Jobs To Be Done Prioritisation)

Tony Ulwick's method: for each important customer "job," survey users on:
1. **Importance:** how important is getting this job done? (1–10)
2. **Current satisfaction:** how satisfied are you with current solutions? (1–10)

Opportunity score = Importance + max(Importance – Satisfaction, 0)

High importance, low satisfaction = high opportunity. High importance, high satisfaction = over-served (low opportunity). Low importance regardless of satisfaction = low opportunity.

This surfaces the gaps where users care deeply but existing solutions (including yours) are failing them — the highest-leverage investment areas.

### Balancing Technical Debt

Features generate user value. Technical debt is the maintenance cost of shortcuts taken in pursuit of speed. Left unmanaged, debt compounds — each feature becomes more expensive to build on an increasingly brittle codebase.

The PM's role in technical debt management:
- Include debt repayment in roadmap planning (many teams target 20-25% of engineering capacity for debt and infrastructure)
- Understand the business consequence of specific debt items (if this database query bottleneck isn't addressed, what does it cost?)
- Avoid using "technical debt" as a black box that excuses engineering time without PM visibility

The best argument for debt repayment: frame it in user and business terms. "If we fix this caching issue, page load times drop from 4s to 0.8s, which reduces checkout abandonment by approximately 15% based on our analytics."`,
    quiz: [
      {
        q: 'In RICE scoring, a feature scores high on Reach and Impact but low on Confidence. What should the team do?',
        options: ['Build it immediately — the high impact justifies the uncertainty', 'Deprioritise it permanently', 'Acknowledge the lower score from low confidence and i`vestigate to increase confidence before committing — small validation experiments reduce uncertainty', 'Increase the Effort estimate to compensate'],
        correct: 2,
        explanation: 'Low confidence means the reach and impact estimates are uncertain. The correct response is to run small validation experiments (user interviews, prototypes, data analysis) to increase confidence before investing in a large build — not to guess or ignore the uncertainty.',
      },
      {
        q: 'An opportunity scoring exercise shows high importance (9/10) and low satisfaction (3/10) for a specific job. What does this indicate?',
        options: ['The job is not commercially viable', 'Users are over-served in this area', 'A high-opportunity gap — users care deeply about this job and are poorly served by current solutions, making it a priority investment area', 'The market is too competitive to enter'],
        correct: 2,
        explanation: 'Opportunity score = Importance + max(Importance – Satisfaction, 0). High importance, low satisfaction produces a high score — a gap where users care deeply and are underserved. This is the highest-leverage product investment area by this framework.',
      },
      {
        q: 'A team puts 15 items in the "Must Have" category during MoSCoW planning. What has gone wrong?',
        options: ['Nothing — comprehensive Must Haves ensure product quality', 'The team has negated the tool — honest MoSCoW requires genuine distinctions between what is truly launch-blocking and what is important but not essential', 'The Sprint is too long', 'Must Haves should be technical requirements only'],
        correct: 1,
        explanation: 'MoSCoW\'s value comes from distinguishing Must Have from Should Have. Putting everything in Must Have means nothing has been prioritised. The discipline is being honest: "Without THIS SPECIFICALLY, the release fails." That list should be short.',
      },
      {
        q: 'How should a PM make the case for technical debt repayment to a business audience?',
        options: ['Explain the technical architecture problems in detail', 'Frame the debt in user and business terms: reduced performance costs X% in conversion; this infrastructure work prevents Y% capacity expansion', 'Escalate to engineering leadership to handle', 'Refuse to prioritise debt — it is engineering\'s responsibility'],
        correct: 1,
        explanation: 'Business stakeholders respond to business arguments. Translating technical debt into user experience impact and business metrics ("4s load times reduce checkout conversion by ~15%") is the PM\'s job. Technical explanations are appropriate for engineers; business consequences are appropriate for stakeholders.',
      },
      {
        q: 'What is the main limitation of all quantitative prioritisation frameworks (RICE, ICE)?',
        options: ['They cannot handle technical features', 'They require too many users to generate meaningful data', 'They are only as accurate as the estimates feeding them — new teams consistently overestimate reach and underestimate effort until frameworks are calibrated against historical data', 'They favour short-term features over strategic investments'],
        correct: 2,
        explanation: 'Quantitative frameworks create the appearance of precision. Garbage in, garbage out: teams new to RICE routinely estimate reach at 10x reality and effort at 0.3x reality. Calibrating scores against historical actuals over several quarters makes the tool reliable.',
      },
    ],
  },
  {
    id: 'pm-m07',
    track: 'product-mgmt' as any,
    title: 'Working with Engineering',
    subtitle: 'How PMs and engineers build things together — and the breakdowns that sink both',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 7,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Sprint', definition: 'A fixed time-boxed period (typically 1–2 weeks) in which an agile team works on a committed set of user stories — ends with a potentially shippable increment.' },
      { term: 'Backlog Grooming', definition: 'The regular process of reviewing, estimating, and refining items in the product backlog — ensuring the top items are well-defined, estimated, and ready to be worked on in the next sprint.' },
      { term: 'Story Points', definition: 'A relative measure of work complexity and effort used by agile teams — teams estimate stories in points, not time, because points are more consistent: complexity and effort relative to other stories.' },
      { term: 'Definition of Done', definition: 'A shared team agreement on what must be true for a feature to be considered complete — code written, tests passing, code reviewed, documentation updated, QA verified, and accessible.' },
      { term: 'Velocity', definition: 'The average number of story points a team completes per sprint — used for capacity planning and release date estimation, not as a performance metric.' },
    ],
    content: \`## Working with Engineering

The PM-engineer relationship is one of the most consequential dynamics in software development. When it works well: the team builds the right things at a sustainable pace, engineers are creative participants in problem-solving, and technical reality shapes product decisions constructively. When it breaks down: feature factories ship code nobody uses, engineers feel like ticket-closers rather than craftspeople, and product direction is disconnected from technical reality.

### What Engineers Need from PMs

**Clear problem definitions.** Engineers do their best work when they understand the user problem and the outcome goal, not just the specified solution. "Users can't find their past orders" gives an engineer room to suggest a faster, simpler solution than "Build a new 'Order History' navigation item with a table sorted by date." The former provides context; the latter removes the engineer's creativity.

**Prioritised, groomed backlogs.** Work should arrive at engineering with clear requirements, acceptance criteria, and a known priority. Vague stories, changing priorities mid-sprint, and "urgent" requests that bypass planning create chaos that tanks velocity.

**Respect for technical constraints.** Engineers know things PMs don't: what makes a system fragile, where technical debt makes new features disproportionately expensive, what's trivially changeable and what requires careful migration. Good PMs listen to these signals and factor them into priority decisions.

**Protection from scope creep.** Mid-sprint scope changes are expensive — they disrupt engineering flow and make sprint commitments meaningless. PMs protect the team from scope additions during sprints by deferring non-urgent requests to the next planning cycle.

### What PMs Need from Engineers

**Honest estimates.** Story point estimates should reflect actual complexity and effort, not the estimates PMs want to hear. A culture where engineers are penalised for revising estimates upward creates systematic underestimation and missed dates.

**Technical input on product decisions.** Engineers often see solutions and constraints PMs miss. A PM who says "we can't add that feature because the current architecture makes it technically infeasible in the next 2 sprints" is more honest and useful than a PM who makes a commitment and lets the team scramble.

**Flagging technical debt early.** When new work is building on a fragile foundation, engineers should surface this during planning, not after the sprint starts. Delayed disclosure is the most common cause of sprint failures.

**Completed work that meets acceptance criteria.** Features done to 90% and then marked complete to make the sprint goal create downstream problems. The Definition of Done exists to prevent this.

### Agile Ceremonies and Their Purpose

**Sprint Planning** — PM presents the prioritised backlog; the team commits to a subset they can complete in the sprint based on velocity. The PM explains why items are prioritised; engineers ask clarifying questions and surface concerns before committing.

**Daily Standup** — 15-minute status check: what did you complete, what are you working on today, what is blocking you? Blockers are flagged and resolved outside the standup. The PM's role is to unblock — resolving dependencies, making decisions, answering questions.

**Sprint Review / Demo** — the team demonstrates completed work at the end of the sprint. Stakeholders and PMs give feedback. Incomplete work is not demo'd. This is a feedback loop, not a performance review.

**Retrospective** — the team reflects on the sprint process: what went well, what to improve, what to try next sprint. PM participates as a team member. Retrospectives are the primary mechanism for process improvement.

### Technical Decisions PMs Should Understand

PMs do not make architecture decisions, but they need enough technical literacy to participate in conversations about:

**Build vs Buy:** Should we build this capability or use an existing tool/service? Involves cost, time, flexibility, and vendor risk trade-offs.

**Monolith vs Microservices:** Affects how fast new features can be independently deployed and scaled. Relevant to roadmap sequencing.

**API Design:** The interface between the product and external systems. PM input on API design affects the product's integration ecosystem.

**Testing Strategy:** Unit tests, integration tests, end-to-end tests. PM should understand that under-tested code increases maintenance cost and slows future development — this is not purely an engineering concern.`,
    quiz: [
      {
        q: 'You tell an engineer "Build a new Order History page with a table sorted by date." A better PM approach would be:',
        options: ['Provide a detailed wireframe to ensure the engineer builds exactly what you specified', 'Describe the user problem: "Users can\'t find their past orders" — and let engineers propose solutions', 'Ask the engineer to estimate the wireframe version first, then revise', 'Consult the design team before talking to engineers'],
        correct: 1,
        explanation: 'Providing a clear problem statement rather than a specified solution preserves the engineer\'s creative input. Engineers often know faster, simpler solutions than the one the PM visualised. Specifying the solution treats engineers as ticket-closers rather than problem-solvers.',
      },
      {
        q: 'During a sprint, a sales manager requests that a "quick" feature be added immediately for a customer demo. What should the PM do?',
        options: ['Add it immediately since it\'s for a customer', 'Refuse all mid-sprint requests categorically', 'Evaluate urgency; if genuinely urgent, negotiate removing equivalent scope; if not urgent, defer to next sprint planning and explain the trade-off', 'Ask engineering to work overtime to accommodate both'],
        correct: 2,
        explanation: 'Mid-sprint scope additions disrupt engineering flow and make sprint commitments meaningless. The PM\'s job is to protect the team: either the new request is truly urgent (pull equivalent scope out) or it can wait for the next planning cycle. This isn\'t about rigidity — it\'s about making trade-offs explicit.',
      },
      {
        q: 'A team\'s velocity is 40 points per sprint. What should this number be used for?',
        options: ['Measuring individual engineer productivity', 'Benchmarking engineers against other teams', 'Capacity planning and release date estimation — predicting how much work can be completed in future sprints', 'Justifying headcount requests'],
        correct: 2,
        explanation: 'Velocity is a planning tool for the team. It predicts future capacity based on historical performance. Using it as a performance metric (pressuring the team to increase velocity) corrupts estimates and creates technical debt.',
      },
      {
        q: 'The "Definition of Done" prevents which common problem?',
        options: ['Feature scope expanding during development', 'Features being marked complete at 90% done, creating downstream quality and functionality problems', 'Engineers working on the wrong priority', 'Stakeholders changing requirements mid-sprint'],
        correct: 1,
        explanation: 'The Definition of Done is a shared agreement on what "complete" means — code reviewed, tests passing, QA verified, accessible. Without it, engineers declare features done to make sprint goals while leaving incomplete work that creates maintenance debt and user-facing problems.',
      },
      {
        q: 'Why should PMs understand technical concepts like "technical debt" and "build vs buy" even though they don\'t make architecture decisions?',
        options: ['To evaluate engineer performance', 'To communicate with investors about technical risk', 'To make informed roadmap and prioritisation decisions that account for technical reality — ignoring these signals produces roadmaps that are technically infeasible or economically unsound', 'To reduce engineering team headcount'],
        correct: 2,
        explanation: 'PMs who don\'t understand technical constraints produce roadmaps that are infeasible or more expensive than planned. Understanding why certain work is expensive (technical debt), whether to build or buy, and where the architecture creates constraints enables better prioritisation and expectation-setting.',
      },
    ],
  },
  {
    id: 'pm-m08',
    track: 'product-mgmt' as any,
    title: 'Go-to-Market Strategy',
    subtitle: 'From working product to adopted product — the gap most technical teams underestimate',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 8,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Go-to-Market (GTM) Strategy', definition: 'The plan for reaching target customers and delivering the product\'s value proposition — including target segment, positioning, distribution channels, pricing, and launch sequencing.' },
      { term: 'Product Positioning', definition: 'The space a product occupies in the customer\'s mind relative to alternatives — defined by who it is for, what problem it solves, and why it is better than the next best alternative.' },
      { term: 'Product Launch', definition: 'The coordinated execution of making a product or feature available to users — typically spanning engineering readiness, marketing, sales enablement, and support preparation.' },
      { term: 'Pricing Strategy', definition: 'The model by which a product\'s value is captured — subscription, usage-based, per-seat, freemium, one-time purchase — each creating different acquisition, expansion, and churn dynamics.' },
      { term: 'Activation', definition: 'The moment a new user first experiences the core value of the product — considered the most critical moment in the user lifecycle; high activation drives retention, low activation predicts churn regardless of acquisition.' },
    ],
    content: `## Go-to-Market Strategy

Building a product that works is a necessary but insufficient condition for success. The product must also reach the right users, with the right message, through the right channels, at the right price. Go-to-Market strategy is the plan for all of this.

Most technical teams underestimate GTM. The assumption: "We'll build it and they'll come." The reality: most products with strong GTM execution succeed moderately; most products with strong products but weak GTM execution fail.

### The Four GTM Decisions

**1. Target Segment**

Who is the primary user? Not "everyone who could benefit" — that produces messaging nobody identifies with and channels that scatter budget. A specific primary segment: "Series A founders in SaaS companies between 10 and 100 employees who are managing their first engineering team."

Segment definition requires understanding:
- Demographics/firmographics (company size, industry, role)
- The specific job this segment hires the product to do
- What competing solutions this segment currently uses
- How this segment discovers new tools

**2. Positioning**

Positioning is the answer to: "For [specific user], [product] is the [category] that [unique value proposition] unlike [alternatives] because [differentiator]."

April Dunford's framework (Obviously Awesome, 2019): positioning requires defining competitive alternatives (what would users do without you?), unique attributes (what can you do that alternatives cannot?), and the value those attributes deliver to the specific segment.

Positioning is not a tagline. It is an internal framework that guides all messaging, feature prioritisation, and sales enablement.

**3. Distribution Channel**

How do users discover and acquire the product?
- **Direct sales:** outbound, inbound, account-based — high cost, high touch, appropriate for high-ACV enterprise products
- **Product-led growth:** users discover value before paying, then convert — freemium, free trial, viral loops
- **Content/SEO:** organic discovery through content and search — slow to build, compounding returns
- **Partnerships:** distribution through existing channel partners — can accelerate reach but introduces dependency
- **Marketplace:** app stores, platform marketplaces — low acquisition friction, high platform dependency

Channel selection must match the product's economics: high-ACV products can support high-touch sales; low-ACV products require self-serve channels.

**4. Pricing**

Pricing communicates value positioning and determines acquisition economics:

**Subscription:** predictable recurring revenue; creates lock-in and customer success focus. Common for SaaS.

**Usage-based:** customers pay for what they use; low barrier to adoption; revenue scales with customer success. Common for infrastructure products (AWS, Stripe, Twilio).

**Per-seat:** scales with team size; natural expansion motion; common for collaboration tools.

**Freemium:** free tier drives adoption and network effects; premium tier converts power users. Works when the free tier creates genuine network value and when the conversion trigger (something in paid that free lacks) is compelling.

**One-time purchase:** simple; no recurring relationship; appropriate for content, tools, or markets where subscription is not expected.

### Launch Planning

A product launch is not a ship date — it is a coordinated execution across all GTM functions:

- **Engineering:** is the feature stable, monitored, and rollback-ready?
- **Marketing:** is messaging ready, assets developed, campaigns scheduled?
- **Sales enablement:** do salespeople know what the feature does and how to position it?
- **Support:** does support know what to expect and how to handle edge cases?
- **Analytics:** are measurements in place to know if the launch succeeded?

Launches can be tiered: limited beta → early access → general availability → broad marketing. Staged rollouts reduce risk and provide learning before full commitment.

### Activation

The most critical moment in the user lifecycle is not acquisition — it is activation: the first moment a user experiences the core value of the product. Dropbox's activation moment is storing the first file and seeing it appear on a second device. Slack's is receiving the first message from a colleague. Spotify's is discovering a song you love.

Users who do not activate churn regardless of acquisition volume. A product with 50% activation rate that improves to 75% achieves 50% more retained users from the same acquisition spend — without changing the product's core functionality.

Activation improvement levers:
- Reduce time-to-value: how quickly can a new user reach their "aha moment"?
- Improve onboarding: what is the shortest path from signup to first value?
- Remove friction: what obstacles are preventing users from reaching activation?
- Targeted engagement: which users are close to activating but haven't? What would push them over?`,
    quiz: [
      {
        q: 'A new productivity app is launching with positioning "for everyone who wants to be more productive." What is the problem with this positioning?',
        options: ['It is too short', 'It positions against the wrong competitive alternatives', '"Everyone" produces messaging nobody specifically identifies with — positioning requires a specific segment, not a universal claim', 'I` does not mention pricing'],
        correct: 2,
        explanation: 'Universal positioning ("for everyone") sounds appealing but produces generic messaging that no specific user identifies with. Specific positioning ("for solopreneurs managing multiple client projects") creates resonance with the target segment while still appealing to adjacent users.',
      },
      {
        q: 'A B2B SaaS product has an average contract value of $15,000/year. Which distribution channel is most appropriate?',
        options: ['Product-led growth with a freemium model', 'Marketplace listing', 'Direct sales — outbound or account-based — since high ACV justifies high-touch acquisition cost', 'Content marketing and SEO only'],
        correct: 2,
        explanation: 'High-ACV products support high-touch sales because the LTV justifies the acquisition cost. A $15,000/year contract can absorb the cost of a salesperson\'s time and multiple meetings. A $15/month product cannot — it requires self-serve channels.',
      },
      {
        q: 'Usage-based pricing aligns with which principle?',
        options: ['Maximum revenue extraction at signup', 'Revenue scales with customer success — customers pay for value received, creating alignment between the vendor\'s revenue growth and customer outcomes', 'Simplicity of billing administration', 'Reducing customer acquisition cost'],
        correct: 1,
        explanation: 'Usage-based pricing ties vendor revenue to customer value received. Customers who get more value (use more) pay more; customers who see less value (use less) pay less. This alignment creates incentives for the vendor to invest in customer success rather than just acquisition.',
      },
      {
        q: 'A product has strong acquisition (many new signups) but high early churn. The most likely root cause is:',
        options: ['The pricing is too high', 'The marketing messaging is misleading', 'Low activation — users are not experiencing the core value of the product quickly enough before losing interest', 'Engineering quality issues'],
        correct: 2,
        explanation: 'High acquisition with high early churn is the classic activation problem: users are intrigued enough to sign up but don\'t reach the "aha moment" — the first experience of core value — before churning. More users won\'t fix a low activation rate.',
      },
      {
        q: 'Why does Slack use "messages sent between colleagues" as its activation event rather than "signup"?',
        options: ['Signup data is difficult to track', 'Signup indicates intent; the first message sent between colleagues indicates value received — the actual experience that makes users want to return', 'Legal requirements around data collection', 'It is easier to measure than daily active use'],
        correct: 1,
        explanation: 'Signup indicates interest; activation indicates value received. Slack\'s core value is reducing team communication friction — that value is first experienced when a colleague responds to a message. Tracking signup misses whether users actually experienced what Slack is for.',
      },
    ],
  },
  {
    id: 'pm-m09',
    track: 'product-mgmt' as any,
    title: 'Product Metrics & Analytics',
    subtitle: 'The numbers that tell you if your product is working — and the ones that lie',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 9,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'AARRR Framework', definition: 'Dave McClure\'s Pirate Metrics: Acquisition, Activation, Retention, Referral, Revenue — a framework for measuring the full user lifecycle funnel from first touch to advocacy.' },
      { term: 'Leading vs Lagging Indicator', definition: 'Lagging indicators measure outcomes (revenue, churn) — they tell you what happened. Leading indicators predict future outcomes (feature adoption, engagement depth) — they tell you what will happen.' },
      { term: 'Churn Rate', definition: 'The percentage of customers or revenue lost in a period — the most critical metric for subscription businesses; a high churn rate makes growth impossible because new acquisition is lost as fast as it arrives.' },
      { term: 'LTV:CAC Ratio', definition: 'Customer Lifetime Value divided by Customer Acquisition Cost — a measure of unit economics health. A ratio above 3:1 is generally considered viable for a sustainable business.' },
      { term: 'Feature Adoption Rate', definition: 'The percentage of eligible users who actively use a feature within a defined period — low adoption on a recently shipped feature is a signal the feature was not what users needed.' },
    ],
    content: \`## Product Metrics & Analytics

"If you can't measure it, you can't improve it." But the more common failure in product management is measuring the wrong things, or measuring things correctly but drawing the wrong conclusions.

Metrics discipline means defining what success looks like before a feature ships, selecting metrics that reflect actual user value rather than activity, and distinguishing between correlation and causation in the data.

### The AARRR Framework

Dave McClure's Pirate Metrics maps the user lifecycle to five measurements:

**Acquisition:** How do users find you? Volume and cost by channel. Not all acquisition is equal — users from paid ads convert differently from users from word of mouth.

**Activation:** Do users have a great first experience? The activation rate is the percentage of new users who reach the "aha moment" — the first experience of core value. This is the most actionable metric in the early lifecycle.

**Retention:** Do users come back? Day 7 retention, Day 30 retention, cohort retention curves. The shape and height of the retention curve is the strongest signal of PMF.

**Referral:** Do users tell others? NPS as a leading indicator; new user attribution to word-of-mouth channels as a lagging one. A product with high referral rates grows without proportional increases in marketing spend.

**Revenue:** Do users pay? LTV, ARPU, MRR, churn. Revenue metrics confirm that users value the product enough to pay — but they are lagging indicators of product health.

### North Star Metric

The North Star Metric captures the single best measurement of the value the product delivers to users. It sits between leading indicators and revenue:

- Spotify: daily listening minutes (time spent with the product doing what it is for)
- Airbnb: nights booked (the transaction that delivers value to both supply and demand sides)
- Slack: messages sent between colleagues (the action that makes the product's value tangible)
- Medium: total reading time (quality engagement, not just visits)

North Star properties:
- Directly reflects value delivery to users
- Leads revenue (high North Star value predicts future revenue)
- Is influenceable by product decisions
- Is a single number the entire team can understand and rally around

### Churn and Retention

For subscription businesses, churn is the governing metric. A 5% monthly churn sounds small; it means losing 46% of customers per year. A business that acquires 1,000 new customers/month but churns 50/month (5%) will never grow beyond 1,000 customers regardless of how good its marketing is.

**Customer churn:** percentage of customers who cancel in a period. Problematic metric: can be stable while revenue churns (if small customers cancel while large ones stay).

**Revenue churn:** percentage of MRR lost to cancellations and downgrades. Net revenue retention includes expansion (upsells) — net NRR above 100% means the revenue from an existing customer cohort is growing even as some customers churn.

**Cohort retention:** tracking groups of users who started in the same period. Improving cohort retention curves (newer cohorts retain better than older ones) is the most direct evidence that product improvements are working.

### LTV:CAC — The Unit Economics Test

**LTV (Lifetime Value):** average revenue per customer × gross margin / churn rate. A customer paying $50/month with 75% gross margin and 5% monthly churn has LTV = $50 × 0.75 / 0.05 = $750.

**CAC (Customer Acquisition Cost):** total marketing and sales spend / new customers acquired in the period.

**LTV:CAC ratio:** above 3:1 is generally considered healthy for SaaS. Below 1:1 means you are spending more to acquire customers than you'll ever earn from them.

The LTV:CAC ratio changes as the product scales — early-stage companies often have poor unit economics that improve as organic acquisition increases. But a product that cannot project a path to 3:1+ has a fundamental pricing or retention problem.

### Metrics Traps

**Vanity metrics:** page views, registered users, social followers — can grow while the business declines. Always test: "What decision would this metric change?"

**Goodhart's Law:** "When a measure becomes a target, it ceases to be a good measure." If engineers are measured on velocity (story points per sprint), they inflate estimates. If support agents are measured on ticket close rate, they close tickets without resolving issues.

**Feature success metrics defined after the fact:** teams tend to define success metrics after a feature ships, selecting metrics that make the feature look good. Define success metrics before building.

**Attribution errors:** the feature that shipped at the same time as a marketing campaign will appear to drive the metric movement the campaign drove. Correlation in time series data is not causation.`,
    quiz: [
      {
        q: 'A product has strong Acquisition (many new signups) and strong Referral (high NPS), but low Retention. What is the most likely problem?',
        options: ['Marketing messaging attracts the wrong users', 'Activation — users are interested (NPS) but not finding lasting value before churning', 'The pricing model is wrong', 'Engineering quality is insufficient'],
        correct: 1,
        explanation: 'High NPS with low retention often indicates an activation problem: users like the idea of the product and recommend it to friends, but don\'t reach the specific moment of core value delivery that creates habit. Improving activation — reducing time-to-value — is the lever.',
      },
      {
        q: 'A business has 5% monthly customer churn. Approximately what percentage of its customers are lost in a year?',
        options: ['5%', '25%', '46%', '60%'],
        correct: 2,
        explanation: '5% monthly churn compounds: after 12 months, approximately 0.95^12 ≈ 54% of original customers remain, meaning ~46% were lost. This is why even apparently small monthly churn rates make sustainable growth very difficult without continuous acquisition.',
      },
      {
        q: 'What does a net revenue retention (NRR) above 100% indicate?',
        options: ['The company is profitable', 'Revenue from an existing customer cohort grows over time as expansions outpace churn — existing customers are becoming more valuable', 'Customer acquisition is exceeding churn', 'The pricing model is per-seat and team sizes are growing'],
        correct: 1,
        explanation: 'NRR above 100% means that revenue from a fixed cohort of existing customers grows over time through upsells, expansions, and cross-sells — even as some customers churn. This is the most compelling business model signal because it means growth compounds within the existing customer base.',
      },
      {
        q: 'Goodhart\'s Law applies to product metrics when:',
        options: ['Metrics are tracked manually', 'A metric becomes a performance target and teams optimise for the metric rather than the underlying value it was meant to measure', 'Multiple teams are measured on the same metric', 'Metrics are reviewed quarterly instead of monthly'],
        correct: 1,
        explanation: 'Goodhart\'s Law: "When a measure becomes a target, it ceases to be a good measure." Teams optimise for how they\'re measured, not for what the measurement was meant to proxy. Engineers inflating story point estimates when measured on velocity is the canonical product team example.',
      },
      {
        q: 'What is the problem with defining success metrics for a feature AFTER it ships?',
        options: ['Metrics cannot be defined retroactively', 'Teams tend to select metrics that make the feature look good rather than metrics that honestly measure the intended outcome — confirmation bias in metric selection', 'Post-ship metrics take too long to collect', 'Stakeholders cannot approve retroactive metrics'],
        correct: 1,
        explanation: 'Defining success metrics post-ship creates confirmation bias: teams naturally choose the metrics that are moving in the right direction. Pre-defined success metrics force honest evaluation of whether the feature produced the intended outcome, regardless of which other metrics moved.',
      },
    ],
  },
  {
    id: 'pm-m10',
    track: 'product-mgmt' as any,
    title: 'Growth & Lifecycle Management',
    subtitle: 'How products grow, stall, and sustain — and the PM decisions that determine which',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 10,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Growth Loop', definition: 'A self-reinforcing cycle where using the product creates more users or more value — more users creates more content (UGC), which attracts more users. More powerful and more efficient than linear funnels.' },
      { term: 'Product-Led Growth (PLG)', definition: 'A go-to-market strategy where the product itself is the primary driver of acquisition, conversion, and expansion — users discover and experience value before sales engagement.' },
      { term: 'Feature Adoption Curve', definition: 'The S-curve pattern of feature adoption: slow initial adoption by innovators, rapid growth through early majority, plateau at saturation. Understanding where a feature sits on the curve guides investment decisions.' },
      { term: 'Retention Cliff', definition: 'A sharp drop in user retention at a specific point in time after signup — often indicates a user expectation mismatch, an onboarding failure, or a trigger for feature discovery that isn\'t firing.' },
      { term: 'Product Lifecycle', definition: 'The stages a product moves through from introduction to growth, maturity, and decline — each stage requiring different PM strategies, investment priorities, and success metrics.' },
    ],
    content: `## Growth & Lifecycle Management

Growth is not an accident. Products that grow at exceptional rates share structural characteristics — mechanisms that make growth self-reinforcing rather than dependent on continuous external investment. Understanding those mechanisms, and managing products through different lifecycle stages, is a core PM competency.

### Growth Loops vs Funnels

The traditional model of product growth is a funnel: attract → convert → retain → monetise → repeat. Each stage requires continuous investment. Funnels are linear — more users require more marketing spend.

Growth loops are different: using the product generates more users or more value for existing users, which drives more usage, which generates more users. The loop is self-sustaining.

**Viral loops:** each new user invites or exposes others. Dropbox's "refer a friend for more storage" turned every user acquisition into potential new user acquisition. The k-factor (invitations per user × conversion rate) determines whether the loop is self-sustaining (k > 1) or just amplifying (k < 1).

**Content loops:** users create content that attracts more users. YouTube, TikTok, Reddit — each piece of user-generated content can attract new users through search and social distribution, who then create more content.

**Network effect loops:** the product becomes more valuable as more users join. LinkedIn, Slack, Zoom — each new user makes the product more valuable for all existing users.

**Marketplace loops:** supply creates demand; demand attracts supply. Airbnb, Uber, Etsy — more hosts attract more guests; more guests attract more hosts.

Identifying and designing growth loops is the highest-leverage activity in PLG product strategy.

### Product-Led Growth

PLG flips the traditional sales model: instead of sales driving product adoption, the product drives sales. The key mechanisms:

**Free tier/freemium:** users experience value before any commercial conversation. The free tier must deliver genuine value (not just limited functionality) while creating a clear trigger for paid conversion (hitting usage limits, needing collaboration features, needing admin controls).

**Viral mechanics built into the product:** Zoom meeting links, Figma share links, Notion published pages, Canva downloads with branding — the product's primary output is a distribution mechanism.

**Bottom-up enterprise:** individuals adopt the product because they love it; usage spreads within the company; the PM (or an AE) identifies accounts with high usage and initiates a commercial conversation. Slack, Figma, GitHub, and HubSpot all grew this way.

PLG requires different product decisions: the onboarding must be entirely self-serve, the time-to-value must be measurable in minutes not days, and the natural sharing moments must be designed into the core product flow.

### Feature Lifecycle Management

Features, like products, have lifecycles. New features start with slow adoption (innovators), then reach early majority, plateau at maturity, and eventually become table stakes (expected rather than valued) or decline.

PM decisions at each stage:
- **Introduction:** drive awareness through in-product prompts, email, and onboarding flows. Measure activation rate for the feature.
- **Growth:** remove friction for the growing majority of users discovering the feature. Invest in depth improvements.
- **Maturity:** maintain reliability. Disproportionate investment in mature features produces diminishing returns.
- **Table stakes:** don't market as a differentiator; ensure reliability. Failure here (rather than investment) damages retention.
- **Decline:** decide whether to sunset, replace, or maintain. Sunsetting features requires careful communication and migration support.

### The Product Lifecycle

Products follow market S-curves similar to features:

**Introduction:** small user base, poor unit economics, high uncertainty. Priority: find PMF and the first growth loop.

**Growth:** product-market fit confirmed, rapid adoption. Priority: capitalise on PMF by scaling acquisition and improving retention. Unit economics improve with scale.

**Maturity:** adoption has reached the majority of addressable users. Growth slows. Priority: defend market position, expand to adjacent markets, improve profitability.

**Decline:** market is moving to a successor product or paradigm. Priority: manage profitably while transitioning to the next product, or attempt a repositioning.

Most PMs work in growth or maturity phases. The decisions made during each phase are very different — investing as if a product is in growth when it is entering maturity produces diminishing returns; under-investing in a product in growth misses a window that may not return.

### Managing Stagnation

Stagnation — when growth slows without reaching market saturation — is different from natural maturity. Causes:
- **PMF for initial segment achieved, but growth to\`adjacent segments not activated**
- **Retention cliff preventing compounding growth** (losing users as fast as acquiring them)
- **Channel exhaustion** (the acquisition channel that drove initial growth has saturated or become more expensive)
- **Competitive displacement** (a new entrant is winning users the product was successfully acquiring)

Diagnosis requires cohort analysis: are newer cohorts retaining better, worse, or the same? Declining cohort retention with constant acquisition is a product quality or fit problem. Constant cohort retention with declining acquisition is a channel problem. Both require different interventions.`,
    quiz: [
      {
        q: 'What distinguishes a growth loop from a traditional acquisition funnel?',
        options: ['Growth loops are faster', 'Growth loops are self-reinforcing — product usage generates more users or value, which drives more usage; funnels require continuous external investment for each new user acquired', 'Funnels are only for paid acquisition', 'Growth loops only work for B2C products'],
        correct: 1,
        explanation: 'Funnels are linear — each new user requires marketing spend. Growth loops are compounding — each new user creates the conditions for more new users (viral loops, content, network effects). The compounding nature is why PLG products can grow faster with lower CAC.',
      },
      {
        q: 'A freemium tier creates the best conversion trigger when:',
        options: ['It gives users access to all features with usage limits', 'It delivers genuine value while creating a clear point where users naturally need paid features — the trigger should reflect the product\'s core value, not arbitrary limitations', 'It times out after 14 days regardless of usage', 'It is heavily promoted through marketing campaigns'],
        correct: 1,
        explanation: 'An effective freemium conversion trigger occurs when users have already experienced value and need more: more storage, more collaborators, more API calls, admin controls. Artificial limitations that prevent free tier users from experiencing core value create frustration rather than genuine conversion motivation.',
      },
      {
        q: 'Cohort analysis shows newer cohorts have the same retention rate as older cohorts, but acquisition volume has dropped 40% in 6 months. What is the most likely problem?',
        options: ['The product has a retention cliff', 'The product is losing PMF', 'The acquisition channel has saturated or become more competitive — product quality is unchanged but acquisition sources are exhausted', 'Engineers shipped a performance regression'],
        correct: 2,
        explanation: 'Stable cohort retention means the product is delivering consistent value to users who adopt it. Declining acquisition volume points to channel exhaustion or competitive displacement — the problem is finding users, not keeping them.',
      },
      {
        q: 'What PM decision is most important during a product\'s "growth" lifecycle phase?',
        options: ['Defending market position against competitors', 'Maximising profitability', 'Capitalising on product-market fit by scaling acquisition and improving retention while unit economics are improving', 'Planning product sunset and replacement'],
        correct: 2,
        explanation: 'The growth phase is the window to capitalise on PMF. Investment in acquisition and retention during growth creates the customer base and feedback loops that fund maturity. Under-investing during growth is one of the most costly strategic errors — the window does not last indefinitely.',
      },
      {
        q: 'A product has a k-factor of 0.7 (each user successfully invites 0.7 new users). This viral loop:',
        options: ['Is self-sustaining and will drive indefinite growth', 'Will produce finite growth — each user contributes less than one new user, so the loop amplifies but does not self-sustain without ongoing acquisition', 'Indicates the product has no viral potential', 'Will eventually become self-sustaining as the user base grows'],
        correct: 1,
        explanation: 'A k-factor below 1 means each user generates less than one additional user. The viral loop amplifies acquisition (a $10 CAC becomes effectively $5.88 with k=0.7) but does not sustain growth on its own. Only k > 1 creates self-sustaining viral growth.',
      },
    ],
  },
  {
    id: 'pm-m11',
    track: 'product-mgmt' as any,
    title: 'Platform Products & APIs',
    subtitle: 'When the product is infrastructure — designing for the developers who build on top of you',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 11,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Platform Product', definition: 'A product that enables third parties to build products and services on top of it — creating an ecosystem of complementary offerings that increases the platform\'s value and creates network effects.' },
      { term: 'API (Application Programming Interface)', definition: 'A defined set of rules and protocols that allows different software applications to communicate — the technical interface through which a platform exposes its capabilities to third-party developers.' },
      { term: 'Developer Experience (DX)', definition: 'The quality of a developer\'s experience when using a platform\'s APIs, SDKs, and documentation — DX for platforms is what UX is for consumer products; it determines adoption and retention.' },
      { term: 'Platform Risk', definition: 'The dependency risk faced by developers building on a platform — if the platform changes its API, restricts access, or raises pricing, it can destroy the dependent product. Platform companies must manage this risk to maintain ecosystem trust.' },
      { term: 'Ecosystem', definition: 'The community of developers, partners, and third-party products built on a platform — a healthy ecosystem creates value that the platform company alone could not build, and creates defensibility through switching costs.' },
    ],
    content: `## Platform Products & APIs

Most product management involves building for users. Platform product management involves building for developers who build for users — a level of indirection that changes every PM decision.

Stripe, Twilio, AWS, GitHub, Shopify, Salesforce — these are platform companies. Their customers are not end users; they are the companies and developers who use the platform to serve their own users. The platform's success depends on the ecosystem's success.

### What Makes a Product a Platform

A product becomes a platform when third parties can build value-creating extensions or applications on top of it. The key characteristics:

**Core enabling capability:** something valuable that would be expensive or difficult to replicate independently. Stripe: payment processing infrastructure with global coverage and compliance. AWS: on-demand computing infrastructure with massive capital expenditure spread across millions of customers. Shopify: e-commerce infrastructure including payments, inventory, and distribution.

**Extensibility:** mechanisms for third parties to build on the core capability — APIs, SDKs, webhooks, plugin systems, app marketplaces.

**Network effects:** each new third party building on the platform increases the platform's value. More Shopify apps make Shopify more valuable to merchants; more merchants make building Shopify apps more valuable to developers.

### Developer Experience as a PM Priority

For platform products, developer experience is the user experience. The developer is the direct customer; their end users are two steps removed.

DX dimensions:
- **API design:** Are the endpoints logically named and consistent? Do responses include enough context for error diagnosis? Is authentication straightforward?
- **Documentation:** Can a developer get to their first successful API call in under 30 minutes? Are there working code examples in every major language? Are edge cases documented?
- **SDKs:** Do official SDKs exist for major languages? Are they maintained and up-to-date?
- **Sandbox/Test environment:** Can developers test without affecting production data? Without real payment credentials? Without hitting rate limits?
- **Error messages:** Do errors identify the problem and point to the solution? "Invalid API key" is better than "Authentication error 401". "The email field is required" is better than "400 Bad Request".
- **Status page and reliability:** developers need to know when the platform is having issues and can plan around them

Stripe's documentation is the canonical example of exceptional DX. Every endpoint is documented with code examples in 8 languages. Error messages include a link to the relevant documentation. New developers can make their first test payment in under 10 minutes.

### API Design Principles for PMs

PMs working on APIs do not make low-level technical design decisions — but they shape the requirements that determine API design:

**Naming consistency:** if the API uses \`customer_id\` in one endpoint, it should not use \`client_id\` in another for the same concept.

**Versioning:** APIs change as the product evolves. Breaking changes (removing fields, changing field semantics) require version increments (v1 → v2) or long deprecation windows. Developers cannot update their integrations on the platform's schedule.

**Pagination and rate limiting:** what happens when a developer requests all 10 million customer records? Pagination and rate limiting define the platform's graceful degradation behaviour.

**Webhooks vs polling:** pushing events to developers (webhooks) when state changes is more efficient than requiring developers to poll for changes, but requires more reliable delivery guarantees.

### Platform Governance and Ecosystem Health

Platform companies face a fundamental tension: the interests of the platform and the interests of ecosystem participants can diverge.

**The "envelopment" threat:** the platform can choose to build a capability that third-party developers built on the platform — effectively competing with its own ecosystem partners. Apple adding camera apps after camera apps became popular in the App Store. Microsoft adding features to Windows that competed with middleware vendors. This creates a chilling effect on ecosystem investment.

**Pricing changes:** increasing API costs, adding usage tiers, or changing business models can destroy third-party businesses that built on the assumption of stable costs. Heroku's pricing changes in 2022 forced thousands of projects to migrate.

**Policy changes:** changing terms of service, restricting access, or requiring data sharing can undermine developer trust and ecosystem stability.

Platform PMs must actively manage ecosystem health — maintaining predictability, communicating changes with long deprecation windows, and demonstrating that the platform is a safe foundation on which to build a business.

### Build vs Join a Platform

A recurring PM decision for non-platform products: build a proprietary capability or integrate with an existing platform?

The integration economics: Stripe charges ~2.9% per transaction. Building payment processing from scratch requires PCI compliance, bank relationships, fraud management, and ongoing maintenance — likely costing more in aggregate than Stripe's fee at most scales. Similarly, Twilio's SMS and voice infrastructure costs less to use than to replicate. \`ost products should be customers of platforms rather than builders of competing infrastructure.

The exception: when the platform creates unacceptable strategic risk (single-source dependency for a core capability) or when the product needs capabilities the platform does not provide and cannot be customised to provide.`,
    quiz: [
      {
        q: 'Why is Developer Experience (DX) to platform products what User Experience (UX) is to consumer products?',
        options: ['Developers are the end users of platform products — they must adopt and succeed with the API for the platform to generate value', 'DX is a newer concept than UX', 'Developers are harder to please than consumers', 'Platform products don\'t have end users'],
        correct: 0,
        explanation: 'In platform products, developers are the direct customers. They decide whether to adopt the platform, build on it, and recommend it to colleagues. Poor DX drives developers to alternatives — just as poor UX drives consumers to competing products.',
      },
      {
        q: 'Stripe\'s documentation allows developers to make their first test payment in under 10 minutes. Why does this specific metric matter?',
        options: ['Faster documentation reduces support costs', 'Time-to-first-successful-call is the developer equivalent of time-to-first-value — it is the activation metric for platform products', 'Legal requirements mandate quick onboarding', 'It indicates documentation quality'],
        correct: 1,
        explanation: 'Time-to-first-successful-API-call is the developer activation metric — the moment a developer experiences that the platform works and can do what they need. Just as consumer product activation predicts retention, fast developer activation predicts ecosystem adoption.',
      },
      {
        q: 'A platform company builds a feature that competes directly with a popular third-party app in its ecosystem. This is called:',
        options: ['Vertical integration', 'Envelopment — using platform control to enter and displace third-party product categories', 'Platform expansion', 'Ecosystem management'],
        correct: 1,
        explanation: 'Platform envelopment is when a platform company competes with its own ecosystem partners — adding features that previously only third-party apps provided. It creates a chilling effect on ecosystem investment and is widely seen as a breach of the implicit platform-developer contract.',
      },
      {
        q: 'An API endpoint uses `customer_id` in all endpoints except one invoice endpoint that uses `client_id` for the same concept. This violates:',
        options: ['Rate limiting best practices', 'API naming consistency — inconsistent naming forces developers to remember exceptions and introduces integration errors', 'Webhook design principles', 'Authentication requirements'],
        correct: 1,
        explanation: 'API naming consistency is a core developer experience principle. When the same concept uses different names in different endpoints, developers must track exceptions, consult documentation for each call, and are more likely to introduce integration bugs.',
      },
      {
        q: 'When should a product company build its own payment processing rather than using Stripe or a similar platform?',
        options: ['When they have more than 10,000 transactions per month', 'When they want to reduce costs', 'When the platform creates unacceptable strategic risk (critical single-source dependency) or requires capabilities the platform cannot provide', 'When their engineering team has more than 50 people'],
        correct: 2,
        explanation: 'Building payment processing requires PCI compliance, bank relationships, fraud management — typically costing more than Stripe\'s 2.9% at most scales. The exception is strategic risk: when payment is core enough to the business that single-source dependency is unacceptable, or when the required capabilities are genuinely unavailable on existing platforms.',
      },
    ],
  },
  {
    id: 'pm-m12',
    track: 'product-mgmt' as any,
    title: 'Product Leadership',
    subtitle: 'The craft of making better product decisions, building product culture, and growing as a PM',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 12,
    certArea: 'Product Management',
    keyTerms: [
      { term: 'Product Culture', definition: 'The set of shared beliefs, practices, and incentives that determine how a team makes product decisions — healthy product culture is discovery-driven, outcome-focused, and psychologically safe enough to surface bad news early.' },
      { term: 'Managing Up', definition: 'The PM skill of communicating upward in the organisation — setting stakeholder expectations, aligning executives around product strategy, and making the case for investments that benefit the product long-term.' },
      { term: 'Cross-Functional Influence', definition: 'The ability to align and motivate teams (engineering, design, marketing, sales, support) toward a common product goal without direct management authority.' },
      { term: 'Product Debt', definition: 'Accumulated bad product decisions — features that shouldn\'t exist, flows that are confusing, functionality that wasn\'t validated — analogous to technical debt but in the product experience rather than the codebase.' },
      { term: 'PM Career Levels', definition: 'Associate PM → Product Manager → Senior PM → Principal/Staff PM → Director of Product → VP of Product → CPO — each level characterised by increasing scope, ambiguity, and influence.' },
    ],
    content: `## Product Leadership

Every part of this curriculum — discovery, strategy, requirements, metrics — is a set of tools. Product leadership is knowing when to use which tools and how to create the conditions in which good product decisions consistently get made.

Leadership does not require a title. A PM at any level who makes the team smarter about user needs, who builds a culture of evidence over opinion, and who inspires the team toward a meaningful vision is leading — whether their title says PM or VP.

### What Sets Great PMs Apart

Research and practitioner experience converge on a few consistent differentiators between average and exceptional PMs:

**Intellectual honesty:** Great PMs update their beliefs when evidence contradicts them. They present bad news to stakeholders before it becomes a crisis. They are more interested in being right than in being consistent with their prior positions.

**Genuine user empathy:** Not the performance of caring about users, but actual curiosity about their lives, their frustrations, and their mental models. The best PMs spend significant time with users — not just in formal research sessions, but in the environments where users do their work.

**Comfort with ambiguity:** Product problems are never perfectly specified. The PM who needs complete information before acting will be paralysed by the ambiguity inherent in discovery. Great PMs make defensible bets under uncertainty, remain open to being wrong, and course-correct quickly.

**Strong narrative and communication:** The PM's primary output is alignment — getting engineers, designers, executives, and stakeholders to build toward the same goal. This requires the ability to construct a clear, compelling narrative: this is the user problem, this is why it matters, this is how we will solve it, this is how we will know if it worked.

**Saying no, clearly and respectfully:** Every request a PM accepts is an implicit rejection of something else. Great PMs decline work that doesn't serve the strategy clearly, with a concise explanation of what they are choosing instead and why. Saying yes to everything is not prioritisation — it is abdication.

### Managing Up and Cross-Functional Influence

PMs influence without authority — they rarely have the power to mandate what engineers build or what executives decide. The influence comes from:

**Building credibility:** PMs who consistently make accurate predictions about user behaviour, deliver on commitments, and surface problems before they become crises earn the trust that makes their recommendations follow-on.

**Communicating in business language upward:** executives think in terms of revenue, risk, and market position. A PM who frames product decisions as "this will improve Day 30 retention from 32% to 45%, which at our average LTV increases projected annual revenue by $X" gets heard differently than one who says "users want better onboarding."

**Proactive stakeholder management:** the worst surprises are the ones that arrive late. A PM who identifies a risk 6 weeks before launch and communicates it proactively gives executives time to respond. A PM who surfaces it 3 days before launch creates crisis.

**Making the implicit explicit:** Teams make many decisions with implicit assumptions that different people understand differently. Great PMs surface these assumptions ("We're assuming SMB is our primary segment for this year — is that still true?") and make them explicit before they cause misaligned work.

### Building Product Culture

Product culture is the set of shared practices that determine how a team makes product decisions. Characteristics of healthy product culture:

**Outcome focus over output focus:** teams are evaluated on whether shipped work produced the intended outcomes, not whether they shipped on schedule.

**Discovery before delivery:** hypotheses are validated before teams invest in full builds. The first question is always "are we sure this is the right problem?"

**Psychological safety:** team members can surface bad news, admit uncertainty, and disagree with senior leaders without career consequences. Unsafe environments hide problems until they become crises.

**User proximity:** the team has regular contact with real users — through interviews, customer calls, user testing, and support ticket review. User input is not filtered through market research conducted quarterly.

### Product Debt

Like technical debt, product debt accumulates through shortcuts and compromises. Features added without validation, flows that have been patched repeatedly, functionality that users don't adopt but which was too politically fraught to remove — product debt slows the team, confuses users, and makes the product harder to evolve.

Managing product debt requires:
- Regular audits of low-adoption features (features used by fewer than 5% of users deserve sunset consideration)
- Feature deprecation processes that communicate clearly and provide migration paths
- Refusal to add features that don't have a validated user need

### PM Career Development

The PM career path involves increasing scope and ambiguity at each level:
- **Associate PM / Junior PM:** owns specific features, works closely with a senior PM, developing craft fundamentals
- **PM:**\`owns a product area, leads discovery and delivery, manages stakeholders within a domain
- **Senior PM:** owns significant product scope, mentors junior PMs, contributes to product strategy
- **Principal/Staff PM:** shapes cross-team product strategy, influences organisation-level decisions
- **Director of PM:** manages a team of PMs, owns product portfolio strategy
- **VP of Product / CPO:** shapes company product vision and culture

The skills that make a great individual contributor PM (user empathy, requirements clarity, analytical depth) are necessary but insufficient at leadership levels. At PM leadership levels, the ability to hire and develop other PMs, to set product culture, and to align the organisation around a coherent product vision becomes the primary value-add.`,
    quiz: [
      {
        q: 'A PM\'s feature has been in production for 6 months and only 3% of users have adopted it. What should the PM do?',
        options: ['Invest in better onboarding for the feature', 'Immediately remove the feature', 'Investigate why adoption is low (user interviews, session recordings, funnel analysis) before deciding whether to improve the feature, reposition it, or sunset it', 'Add it to the marketing campaign'],
        correct: 2,
        explanation: 'Low adoption is a signal, not a verdict. The cause determines the response: is the feature undiscoverable? Confusing to use? Solving a problem users don\'t have? Each cause requires a different response. Investigating before acting prevents investing in the wrong fix.',
      },
      {
        q: 'A VP asks a PM why the product team spent the last quarter on infrastructure rather than features. The best PM response:',
        options: ['Defer to the engineering team to explain the technical reasons', '"Trust the team — they know what they\'re doing"', '"This infrastructure work enables X% faster feature development and prevents a capacity bottleneck that would have cost Y in delayed revenue" — translate the technical into business impact', 'Apologise for not shipping features'],
        correct: 2,
        explanation: 'Managing up means communicating in the language executives use: revenue, risk, market position. Translating "infrastructure work" into "this prevents a capacity bottleneck projected to cost X in delayed revenue" is the PM\'s job — not delegating that translation to engineers.',
      },
      {
        q: 'What distinguishes a "discovery-before-delivery" product culture from a feature factory?',
        options: ['Discovery-before-delivery is slower', 'In discovery-before-delivery, hypotheses are validated before full builds; feature factories prioritise shipping speed, frequently building features that don\'t produce intended outcomes', 'Feature factories have better engineers', 'The two produce the same outcomes over time'],
        correct: 1,
        explanation: 'Feature factories measure success by features shipped and deadlines met. Discovery-before-delivery measures success by outcomes achieved. The former produces fast ships; the latter produces fast ships of the right things — a critical difference when resources are limited.',
      },
      {
        q: 'Why is psychological safety a product management concern, not just a management/HR concern?',
        options: ['PMs are responsible for team happiness', 'Psychologically unsafe environments suppress bad news, hiding product risks until they become crises — PMs need early signals to course-correct; a culture that punishes early problem-surfacing is a product risk', 'It improves design quality', 'Legal requirements mandate it'],
        correct: 1,
        explanation: 'When teams are afraid to surface bad news — a metric going in the wrong direction, a user research finding that challenges the roadmap, an engineering problem that threatens a launch — problems become crises. Psychological safety is the prerequisite for early warning systems that make good product decisions possible.',
      },
      {
        q: 'What is the most important shift in a PM\'s role as they move from PM to VP of Product?',
        options: ['More direct user research', 'More detailed requirements writing', 'Shifting from individual craft (discovery, requirements, metrics) to building the organisation\'s product culture, hiring and developing PMs, and setting company-level product vision', 'More engineering oversight'],
        correct: 2,
        explanation: 'Individual PM excellence is necessary but not sufficient for VP-level impact. At that level, the multiplier effect comes from creating the conditions — culture, talent, process — in which many PMs do excellent work. The PM\'s craft shifts from making great product decisions to enabling an organisation to make great product decisions systematically.',
      },
    ],
  },
]
