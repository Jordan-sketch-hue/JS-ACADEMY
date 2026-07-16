export const TECHNOLOGY_COURSES = [
  {
    id: 'tech-1',
    track: 'Technology',
    title: 'AI agent architecture: patterns that actually ship',
    subtitle: 'Tool calling, memory layers, orchestration & the pitfalls that kill production agents',
    duration: '16 m',
    level: 'PhD',
    xp: 200,
    sections: [
      {
        title: 'What makes an agent different from a chatbot',
        content: 'A chatbot responds. An agent acts. The distinction is tool use: an agent can call functions, query APIs, write files, browse the web, run code — and then use the results to decide what to do next. The core loop is: perceive → think → act → observe → repeat. This loop is what makes agents capable of multi-step tasks that would require a human to context-switch and coordinate. But it also introduces failure modes that don\'t exist in simple inference calls.',
        keyPoints: [
          'Agents act; chatbots respond',
          'The perceive-think-act-observe loop is the agent primitive',
          'Multi-step capability introduces new categories of failure',
        ],
      },
      {
        title: 'Tool calling: the interface between LLM and the world',
        content: 'Tool calling (function calling) is how LLMs interact with external systems. You define a set of tools with names, descriptions, and parameter schemas. The model decides which tool to call and with what arguments. Your code executes the tool and returns the result. The model then uses that result to decide its next step. Critical design choices: tool descriptions matter enormously (ambiguous descriptions produce bad calls); parameter schemas should be strict; and you must handle errors gracefully because the model will encounter unexpected results.',
        keyPoints: [
          'Tool descriptions determine call quality — write them precisely',
          'Strict parameter schemas reduce malformed calls',
          'Error handling is not optional in production agents',
        ],
      },
      {
        title: 'Memory layers: what agents remember and how',
        content: 'Agents need memory at different timescales. In-context memory is the conversation history — fast but limited. External memory (vector databases, structured storage) persists across sessions and scales beyond context windows. Procedural memory is baked into prompts and system instructions — the agent\'s "how to do things." Episodic memory stores past interactions and their outcomes. Most production systems need at least two of these four layers; many need all four.',
        keyPoints: [
          'In-context, external, procedural, episodic — four memory types',
          'Context window is in-context memory; it\'s fast but finite',
          'Production agents typically need external + procedural at minimum',
        ],
      },
    ],
  },
  {
    id: 'tech-2',
    track: 'Technology',
    title: 'System design fundamentals for non-engineers',
    subtitle: 'Databases, APIs, caching, queues & the vocabulary to work with engineering teams',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'The vocabulary you need',
        content: 'System design is the practice of deciding how software components are structured, connected, and scaled. The basic vocabulary: a server is a computer that serves requests; a database stores data persistently; an API (Application Programming Interface) is a defined contract for how two systems communicate; a cache is fast temporary storage; a queue is a buffer for asynchronous work; a CDN distributes content geographically. You don\'t need to build these things to make decisions about them.',
        keyPoints: [
          'Server, database, API, cache, queue, CDN — know what each does',
          'System design is about trade-offs, not just technical knowledge',
          'Non-engineers make system design decisions constantly — do it consciously',
        ],
      },
      {
        title: 'The database decision',
        content: 'SQL (relational) databases store data in tables with defined relationships. They\'re excellent for structured data with complex queries and strict consistency requirements. NoSQL databases sacrifice some consistency guarantees for flexibility and horizontal scale. The decision is not "which is better" but "which fits this data and these access patterns." Most applications start with SQL and add NoSQL only when specific needs emerge. Never choose NoSQL because it\'s fashionable.',
        keyPoints: [
          'SQL: structured, consistent, relational',
          'NoSQL: flexible, scalable, eventually consistent',
          'Start with SQL; add NoSQL when you have a specific reason',
        ],
      },
      {
        title: 'Scalability patterns',
        content: 'Scaling is not a single decision — it\'s a progression. Vertical scaling (bigger machine) is the first move; it\'s simple and often sufficient. Horizontal scaling (more machines) is the next step; it requires stateless services. Caching reduces database load by storing frequently accessed data in memory. Read replicas distribute read load across multiple database instances. Queues decouple work so that spikes in demand don\'t overwhelm synchronous systems. Each pattern introduces complexity; apply only what your traffic demands.',
        keyPoints: [
          'Vertical first, horizontal when needed',
          'Caching reduces database load — learn it early',
          'Each scaling pattern adds complexity; don\'t pre-optimise',
        ],
      },
    ],
  },
  {
    id: 'tech-3',
    track: 'Technology',
    title: 'Prompt engineering: from guessing to systems',
    subtitle: 'Chain-of-thought, few-shot, structured output & the techniques that produce reliable LLM behaviour',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'Why prompt engineering is a real skill',
        content: 'The same model, given two differently worded prompts, can produce dramatically different outputs. This is not a bug — it\'s a consequence of how LLMs work. They predict the most likely continuation of their input, and the framing, structure, and content of that input shapes the probability distribution over outputs. Prompt engineering is the practice of shaping that distribution intentionally. It is not a soft skill; it is a technical discipline with measurable, reproducible techniques.',
        keyPoints: [
          'Prompt phrasing changes output quality measurably and predictably',
          'LLMs predict continuations — prompts set the context for prediction',
          'Prompt engineering is a technical discipline, not guesswork',
        ],
      },
      {
        title: 'The core techniques',
        content: 'Zero-shot: ask directly. Few-shot: provide examples before asking. Chain-of-thought: ask the model to reason step by step before answering. Self-consistency: generate multiple responses and aggregate. Role prompting: assign a persona to shape response style. Structured output: specify the exact format you want (JSON, table, list). Each technique solves a different failure mode. Chain-of-thought is the most reliable general improvement; few-shot is most effective for tasks with clear input-output patterns.',
        keyPoints: [
          'Chain-of-thought is the highest-leverage general technique',
          'Few-shot works best for structured input-output tasks',
          'Structured output prevents parsing failures downstream',
        ],
      },
      {
        title: 'Building prompt systems, not prompt strings',
        content: 'Production LLM applications don\'t use single prompts — they use prompt systems: a system message that defines the model\'s role and constraints, a set of tools with carefully crafted descriptions, conversation history managed to fit context limits, and dynamic content injected at runtime. The quality of your system message is often more important than your user-facing prompt. Treat your prompts as code: version-control them, test them, measure their performance, and iterate based on failure cases.',
        keyPoints: [
          'System messages shape behaviour more than user prompts',
          'Treat prompts as code: version, test, iterate',
          'Dynamic injection and context management are production essentials',
        ],
      },
    ],
  },
  {
    id: 'tech-4',
    track: 'Technology',
    title: 'No-code and low-code: building without a full engineering team',
    subtitle: 'The honest guide to what you can and cannot build — and when to hire an engineer',
    duration: '11 m',
    level: 'Beginner',
    xp: 120,
    sections: [
      {
        title: 'What no-code actually enables',
        content: 'No-code tools have genuine power: Webflow can build sophisticated marketing sites. Airtable can replace simple internal databases. Zapier can automate multi-step workflows between dozens of apps. Bubble can build functional web applications with user auth, databases, and complex logic. The ceiling has risen significantly in the past five years. The honest answer: if your requirements don\'t involve custom algorithms, high-performance computing, or complex integrations, you can probably build a v1 without writing code.',
        keyPoints: [
          'No-code has a genuinely higher ceiling than most people think',
          'Marketing sites, internal tools, simple apps — no-code territory',
          'Custom algorithms, high performance, complex integrations — engineer territory',
        ],
      },
      {
        title: 'The hidden costs',
        content: 'No-code is not free. Subscription costs compound: $49/month here, $99/month there, $200/month for that one integration tool — and suddenly you\'re spending $600/month on infrastructure for a product that hasn\'t made a dollar. Vendor lock-in is real: if Webflow changes its pricing or a tool shuts down, migrating is expensive. And scaling limits exist: no-code tools hit performance ceilings as data volumes and user counts grow. Budget for subscriptions and plan your migration path before you\'re forced into it.',
        keyPoints: [
          'Subscription stacking adds up quickly — audit your tool spend',
          'Vendor lock-in is real; plan your exit before you need it',
          'No-code has scaling limits; know when you\'ll hit them',
        ],
      },
      {
        title: 'When to hire an engineer',
        content: 'Hire an engineer when: (1) your no-code stack costs more than an engineer\'s salary; (2) you\'re spending significant founder time maintaining integrations; (3) your product requires custom business logic that no-code can\'t express; (4) performance problems are affecting user experience; (5) you need to integrate with systems that don\'t have no-code connectors. Don\'t hire an engineer to build a landing page. Do hire one when your business logic outgrows your tools.',
        keyPoints: [
          'Cost comparison: tool stack vs engineer salary is a real calculation',
          'Custom business logic is the clearest signal to hire',
          'Don\'t hire engineers for tasks tools can handle cheaply',
        ],
      },
    ],
  },
  {
    id: 'tech-5',
    track: 'Technology',
    title: 'Data literacy: reading numbers without getting fooled',
    subtitle: 'Metrics that matter, vanity metrics to ignore & the statistical intuition that separates sharp operators from noise-followers',
    duration: '13 m',
    level: 'Masters',
    xp: 155,
    sections: [
      {
        title: 'The difference between metrics and KPIs',
        content: 'A metric is any measurable value. A KPI (Key Performance Indicator) is a metric that is directly tied to a strategic objective and that you have the ability to influence. Most dashboards are full of metrics. Very few organisations are honest about which ones are actual KPIs. The discipline is to identify the three to five numbers that, if they move, genuinely change the trajectory of the business — and then build your measurement and decision-making around those, not around everything you can track.',
        keyPoints: [
          'Not all metrics are KPIs — most aren\'t',
          'KPIs must be tied to strategic objectives and be influenceable',
          'Three to five real KPIs beat twenty tracked metrics',
        ],
      },
      {
        title: 'Vanity metrics vs actionable metrics',
        content: 'Vanity metrics feel good but don\'t drive decisions. Total page views, social media followers, email list size, app downloads — all vanity metrics unless they\'re correlated with revenue or another business outcome. Actionable metrics have three properties: they\'re comparable (you can track change over time), they\'re specific (a change in this metric points to a specific cause), and they\'re consequential (a change in this metric matters for the business). Conversion rate, cohort retention, LTV:CAC ratio — these are actionable.',
        keyPoints: [
          'Vanity: looks good, drives no decisions',
          'Actionable: comparable, specific, consequential',
          'Conversion rate, retention, LTV:CAC are actionable; followers are not',
        ],
      },
      {
        title: 'The most common statistical mistakes',
        content: 'Confusing correlation with causation: two things move together doesn\'t mean one causes the other. Small sample sizes: drawing conclusions from 50 conversions is dangerous. Survivorship bias: studying successful companies tells you nothing about the failed ones with the same characteristics. P-hacking: running many tests until one is significant produces false positives. Regression to the mean: unusually high or low performance tends to revert — it\'s not your intervention, it\'s math. These are not academic concerns; they produce expensive business decisions.',
        keyPoints: [
          'Correlation ≠ causation — always ask what else changed',
          'Small samples produce unreliable conclusions',
          'Survivorship bias distorts almost every business case study',
        ],
      },
    ],
  },
] as const
