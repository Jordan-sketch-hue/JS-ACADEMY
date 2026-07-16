export const NEED_TO_KNOW_COURSES = [
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
  }
] as const
