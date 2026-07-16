export const CROSS_CULTURES_COURSES = [
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
  }
] as const
