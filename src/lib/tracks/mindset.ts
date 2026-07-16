export const MINDSET_COURSES = [
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
  }
] as const
