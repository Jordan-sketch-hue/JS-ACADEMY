export const MARKETING_COURSES = [
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
        content: 'Linear attribution splits credit equally across all touchpoints. Time-decay gives more credit to touchpoints closer to conversion. Position-based (U-shaped) gives 40% to first touch, 40% to last touch, and 20% to everything in between. Data-driven attribution (DDA) uses machine learning to assign credit based on actual path analysis — but requires volume. For most businesses under $1M/month in ad spend, position-based is the most honest starting point.',
        keyPoints: [
          'Linear, time-decay, position-based, data-driven — know all four',
          'DDA requires significant conversion volume to be reliable',
          'Position-based is the most practical default for most businesses',
        ],
      },
      {
        title: 'Building a UTM architecture that doesn\'t break',
        content: 'UTM parameters are only as good as your consistency. Source, medium, campaign, content, term — all five should be standardised across every platform, every team member, every ad. Create a UTM naming convention document and enforce it. Use lowercase only. Use hyphens not underscores. Never let platforms auto-tag without also having your own UTMs. The biggest attribution disasters come from inconsistent UTM hygiene, not from the wrong attribution model.',
        keyPoints: [
          'Inconsistent UTMs destroy attribution more than any model choice',
          'Standardise: lowercase, hyphens, defined taxonomy',
          'Auto-tagging from platforms should supplement, not replace, your UTMs',
        ],
      },
    ],
  },
  {
    id: 'marketing-2',
    track: 'Marketing',
    title: 'Brand strategy: the difference between a brand and a logo',
    subtitle: 'Positioning, archetype, voice & the strategic decisions that make brands magnetic',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'What brand actually is',
        content: 'A brand is not a logo. It\'s not a colour palette. It\'s not a font. A brand is the sum of associations people have when they encounter your name. It lives in memory, not in design files. The question is not "what does our brand look like?" but "what do people feel, believe, and expect when they think of us?" Jeff Bezos\'s definition: your brand is what people say about you when you\'re not in the room.',
        keyPoints: [
          'Brand is memory and association, not visual identity',
          'The question is emotional and cognitive, not aesthetic',
          'Brand equity is built through consistent experience over time',
        ],
      },
      {
        title: 'Positioning: the strategic core',
        content: 'Positioning is the decision about what your brand stands for relative to alternatives. Al Ries and Jack Trout\'s original insight: the mind has limited space, and brands compete for slots in memory. The most powerful positioning owns a single idea: Volvo owns safety, FedEx owns overnight, Apple owns creativity. To position well, you need to understand: who your customer is, what alternatives they currently use, and what genuine difference you can credibly own.',
        keyPoints: [
          'Positioning is relative — it only exists in contrast to alternatives',
          'Own one idea, not many',
          'The idea must be credible, not aspirational',
        ],
      },
      {
        title: 'Brand voice: how you say things',
        content: 'Voice is the personality of your brand expressed through language. It should be consistent across every touchpoint — ads, emails, support responses, social captions, error messages, onboarding flows. To define your voice: choose three to five adjectives that describe your brand\'s personality, then for each one write what it means in practice and what it is not. "Confident" doesn\'t mean arrogant. "Friendly" doesn\'t mean informal. "Clear" doesn\'t mean simplistic.',
        keyPoints: [
          'Voice is personality, tone is context-specific adaptation of voice',
          'Define what each adjective means AND what it is not',
          'Voice consistency across touchpoints compounds brand recognition',
        ],
      },
    ],
  },
  {
    id: 'marketing-3',
    track: 'Marketing',
    title: 'Content strategy: how to stop creating noise',
    subtitle: 'Audience research, content pillars, distribution leverage & the difference between content that converts and content that just exists',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'Why most content fails',
        content: 'Most content is created from the inside out: the brand decides what it wants to say, then says it. Content that works is created from the outside in: you identify what your audience is already searching for, struggling with, or talking about — and you show up there. The distinction sounds obvious but almost no one practises it. The symptom is content that gets made but not consumed, shared, or acted upon.',
        keyPoints: [
          'Inside-out content: brand-centric. Outside-in content: audience-centric',
          'Start with search behaviour, conversation, and existing demand',
          'Content without distribution is not content strategy — it\'s publishing',
        ],
      },
      {
        title: 'Content pillars: structuring what you talk about',
        content: 'Content pillars are the three to five recurring themes your brand consistently addresses. They should sit at the intersection of what your audience cares about and what your brand has genuine authority on. A skincare brand\'s pillars might be: ingredient education, routine building, skin condition deep-dives, and founder story. Every piece of content maps to a pillar. This prevents the chaotic, incoherent content calendars that produce volume without compounding value.',
        keyPoints: [
          'Pillars = the recurring themes your brand owns',
          'Intersection of audience need and brand authority',
          'Every piece maps to a pillar — no free-floating content',
        ],
      },
      {
        title: 'Distribution leverage: the part everyone skips',
        content: 'Creating content is the easy part. Getting it in front of people who will act on it is the hard part. Distribution leverage means: understanding which channels your audience actually uses, which formats perform on each channel, how to repurpose one piece of content into five format variations without losing quality, and how to systematically amplify your best-performing content rather than moving on to the next piece. The goal is not to post more — it\'s to extract more value from each piece.',
        keyPoints: [
          'One piece of content, five format variations — this is leverage',
          'Amplify what works; don\'t just publish the next thing',
          'Channel-format fit matters as much as content quality',
        ],
      },
    ],
  },
  {
    id: 'marketing-4',
    track: 'Marketing',
    title: 'Email marketing: the channel that still wins',
    subtitle: 'List building, segmentation, deliverability & the psychology of sequences that convert',
    duration: '12 m',
    level: 'Beginner',
    xp: 130,
    sections: [
      {
        title: 'Why email still beats everything',
        content: 'Email has an average ROI of $36–42 for every $1 spent — higher than any other digital marketing channel. It\'s owned media: unlike social followers, your email list cannot be taken from you by an algorithm change. The people on your list have explicitly opted in, which means intent is high. And you control the timing — unlike social media, you decide when to show up in someone\'s inbox.',
        keyPoints: [
          'Email ROI consistently outperforms all other channels',
          'It\'s owned media — algorithm-proof',
          'Opt-in means high intent by definition',
        ],
      },
      {
        title: 'Segmentation: the difference between broadcast and relevance',
        content: 'Most email lists are treated as one homogeneous group. They are not. A first-time buyer and a five-time buyer have completely different relationships with your brand. Someone who opened your last 10 emails and someone who hasn\'t opened in 90 days need completely different messages. Segmentation is the practice of sending the right message to the right subset of your list. Basic segments: engagement level, purchase history, acquisition source, product interest, lifecycle stage.',
        keyPoints: [
          'One message to all subscribers is a missed opportunity',
          'Engagement-based segmentation improves deliverability and conversion',
          'Lifecycle stage segmentation is the most powerful starting point',
        ],
      },
      {
        title: 'Sequences vs broadcasts: the two email modes',
        content: 'Broadcasts are one-time sends to your list — news, promotions, content. Sequences are automated series triggered by behaviour or time — welcome flows, post-purchase flows, win-back flows, abandonment flows. Most brands over-invest in broadcasts and under-invest in sequences. A well-built welcome sequence runs automatically, converts new subscribers to buyers at high rates, and requires no ongoing effort. Build your sequences first, then focus on broadcasts.',
        keyPoints: [
          'Sequences automate relationship-building at scale',
          'Welcome, post-purchase, and win-back are the highest-ROI sequences',
          'Build sequences before investing in broadcast strategy',
        ],
      },
    ],
  },
  {
    id: 'marketing-5',
    track: 'Marketing',
    title: 'Conversion rate optimisation: the art of getting more from what you have',
    subtitle: 'CRO frameworks, hypothesis-driven testing & the psychology of conversion',
    duration: '14 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'What CRO actually is',
        content: 'CRO is the systematic practice of increasing the percentage of visitors who take a desired action — purchase, sign-up, call, download. It is not guessing. It is not copying competitors. It is forming a hypothesis based on data (analytics, heatmaps, session recordings, user research), designing an experiment, running it with statistical rigour, and applying the learning. The discipline requires both analytical thinking and deep understanding of human psychology.',
        keyPoints: [
          'CRO is a systematic, hypothesis-driven discipline',
          'Data → hypothesis → experiment → learning',
          'Both analytics and psychology are required',
        ],
      },
      {
        title: 'The psychology of conversion',
        content: 'Conversion happens when perceived value exceeds perceived cost and risk. Every element of your page either increases perceived value or reduces perceived cost/risk — or it does neither, in which case it\'s probably hurting. Cialdini\'s principles — reciprocity, commitment, social proof, authority, liking, scarcity — are not gimmicks; they are descriptions of how human decisions actually work. Use them honestly and they will increase conversion. Use them manipulatively and they will damage trust.',
        keyPoints: [
          'Value > cost + risk is the conversion equation',
          'Every element should increase value or reduce perceived risk',
          'Cialdini\'s principles work because they describe real cognitive mechanisms',
        ],
      },
      {
        title: 'The testing hierarchy',
        content: 'Not all tests are equal. Testing the colour of your CTA button is a micro-test with micro-impact. Testing your entire value proposition is a macro-test with potentially transformational impact. The correct testing hierarchy: start with the biggest potential impact (value proposition, hero section, pricing structure, product positioning) before moving to smaller elements (button copy, image choice, form length). Most teams do this backwards and wonder why their testing programme produces marginal results.',
        keyPoints: [
          'Macro-tests first: value proposition, pricing, positioning',
          'Micro-tests last: button colour, copy tweaks, image variants',
          'Most teams test backwards — fix the hierarchy first',
        ],
      },
    ],
  },
] as const
