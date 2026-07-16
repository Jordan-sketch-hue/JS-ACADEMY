export const DESIGN_COURSES = [
  {
    id: 'design-1',
    track: 'Design',
    title: 'Visual identity: building a brand system that scales',
    subtitle: 'Logo, colour, typography, grid & the components of a brand identity that stays consistent across everything',
    duration: '13 m',
    level: 'Masters',
    xp: 155,
    sections: [
      {
        title: 'What a brand identity system actually is',
        content: 'A brand identity is not a logo. It is a system of visual elements — logo, colour palette, typography, photography style, iconography, grid and spacing — that work together to create a consistent, recognisable impression across every touchpoint. The system exists to make decisions easier and outputs more consistent. With a strong system, any designer (or non-designer) can produce on-brand work. Without one, every piece of communication diverges slightly, and the cumulative effect is visual incoherence.',
        keyPoints: [
          'Identity system: logo + colour + type + photography + iconography + grid',
          'Systems make consistent outputs achievable at scale',
          'Visual incoherence is the result of no system, not bad taste',
        ],
      },
      {
        title: 'Colour: the most powerful and most misused element',
        content: 'Colour works through association, contrast, and hierarchy. Effective colour palettes have: a primary brand colour (the dominant, distinctive one), a secondary palette (supporting colours that harmonise), neutrals (for backgrounds, body text, structure), and functional colours (success green, error red, warning amber). The most common mistake is choosing colours that look beautiful together but have insufficient contrast — failing accessibility standards and reducing legibility. Contrast ratio of 4.5:1 is the WCAG AA minimum for body text.',
        keyPoints: [
          'Primary, secondary, neutrals, functional — the four colour categories',
          'Beautiful colours with poor contrast fail accessibility and legibility',
          'WCAG AA: 4.5:1 contrast ratio minimum for body text',
        ],
      },
      {
        title: 'Typography: the system beneath the surface',
        content: 'Most brand typography problems come from using too many fonts, using them inconsistently, or choosing fonts without understanding their character. The professional approach: one display typeface (for headlines, large text), one body typeface (for paragraphs, UI text), and optionally one monospace typeface (for code or technical content). Define a type scale — a set of sizes that relate to each other mathematically — and stick to it. Variable fonts give you weight and width ranges without loading multiple font files.',
        keyPoints: [
          'One display, one body, one monospace — the three-font rule',
          'A type scale creates visual rhythm and hierarchy',
          'Variable fonts: one file, many weights',
        ],
      },
    ],
  },
  {
    id: 'design-2',
    track: 'Design',
    title: 'UI/UX principles: designing for how people actually behave',
    subtitle: 'Cognitive load, Fitts\' Law, affordances, feedback & the research-backed principles of interface design',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'Cognitive load: the hidden cost of every design decision',
        content: 'Every element you add to a screen requires cognitive effort to process. Cognitive load is the mental effort required to understand and interact with an interface. Intrinsic load (the inherent complexity of the task) is unavoidable. Extraneous load (complexity added by poor design choices) is entirely avoidable. Your job as a designer is to minimise extraneous cognitive load: reduce choices, use familiar patterns, group related information, and remove anything that doesn\'t contribute to the user\'s goal.',
        keyPoints: [
          'Intrinsic load: unavoidable task complexity',
          'Extraneous load: complexity added by poor design — eliminate it',
          'Every additional element has a cognitive cost — justify its presence',
        ],
      },
      {
        title: 'Fitts\' Law and touch targets',
        content: 'Fitts\' Law: the time to reach a target is a function of its size and distance. Larger targets that are closer are faster to hit. The practical implications: important actions (primary CTA, submit button, navigation) should be large and easy to reach. On mobile, touch targets should be at least 44×44pt (Apple\'s guideline) or 48×48dp (Google\'s). The most common violation: tiny close buttons, small checkbox hit areas, and navigation items that are technically tappable but practically difficult.',
        keyPoints: [
          'Larger + closer = faster to hit — make important actions easy to reach',
          'Mobile touch target minimum: 44×44pt or 48×48dp',
          'Tiny close buttons and small checkboxes are Fitts\' Law violations',
        ],
      },
      {
        title: 'Affordances, feedback, and error states',
        content: 'An affordance is a design element that communicates how it can be used. A button looks clickable. A text field invites text input. A slider suggests draggable interaction. When affordances are absent or misleading, users make errors. Feedback closes the loop: every action should produce an immediate, clear response. Submitted a form? Show a confirmation. Making a network request? Show a loading state. Error states are where most products fail — errors must be caught, explained in plain language, and paired with a clear path to resolution.',
        keyPoints: [
          'Affordances communicate interaction — make them obvious',
          'Every action needs immediate feedback',
          'Error messages must explain what happened and what to do next',
        ],
      },
    ],
  },
  {
    id: 'design-3',
    track: 'Design',
    title: 'Art direction: the skill of giving creative direction',
    subtitle: 'Reference boards, visual briefing, feedback that\'s useful & communicating taste without being a designer',
    duration: '12 m',
    level: 'Masters',
    xp: 145,
    sections: [
      {
        title: 'What art direction actually is',
        content: 'Art direction is the discipline of making visual decisions and communicating them to creative collaborators. You don\'t need to be able to design to be a good art director — you need to be able to identify what works and what doesn\'t, communicate your reasoning precisely, and give feedback that is specific, actionable, and directed at the work rather than the person. The best art directors are fluent in the language of visual communication: composition, hierarchy, contrast, rhythm, and reference.',
        keyPoints: [
          'Art direction is a decision and communication skill, not a production skill',
          'You don\'t need to design to art direct effectively',
          'The language: composition, hierarchy, contrast, rhythm, reference',
        ],
      },
      {
        title: 'Building a reference board that actually helps',
        content: 'A reference board (or mood board) is a collection of visual examples that communicate the desired direction. The mistake is using references you love for reasons unrelated to the brief — the colours are nice but the category is wrong, the mood is right but the execution style is wrong. Effective reference boards use images from the same category or adjacent categories, isolate specific aspects of each reference ("I like the typography here, the colour palette here, the photography style here"), and are annotated so the designer knows what they\'re supposed to extract.',
        keyPoints: [
          'Annotate references — specify what you\'re borrowing from each',
          'Same category or adjacent categories only',
          'A good reference board is a brief, not a mood collection',
        ],
      },
      {
        title: 'Giving useful creative feedback',
        content: 'Useful creative feedback is specific, directional, and problem-focused rather than solution-focused. "This doesn\'t feel premium enough" is a starting point, not feedback. "The typeface weight is too light for a luxury brand — try Bold or Black weight, and reduce the tracking" is feedback. The useful structure: describe what you observe, explain why it\'s a problem relative to the objective, suggest a direction (not necessarily a solution). What\'s not useful: "I\'ll know it when I see it," vague aesthetic preferences, and feedback that contradicts the brief.',
        keyPoints: [
          'Specific + directional + problem-focused = useful feedback',
          'Describe → explain the problem → suggest a direction',
          'Never give feedback that contradicts the brief',
        ],
      },
    ],
  },
  {
    id: 'design-4',
    track: 'Design',
    title: 'Motion and interaction design: when things move',
    subtitle: 'Principles of animation, micro-interactions & how motion communicates meaning in digital products',
    duration: '11 m',
    level: 'Masters',
    xp: 140,
    sections: [
      {
        title: 'Why motion matters',
        content: 'Motion in digital products is not decoration — it\'s communication. Animation communicates: spatial relationships (this panel slides in from the right, so it\'s to the right of the current view), state changes (this button pulses to indicate a pending action), hierarchy (the primary action scales up before secondary actions), and system status (this spinner tells you something is happening). When motion is absent where it should exist, users experience jarring, disorienting transitions. When it\'s present but purposeless, it adds cognitive load.',
        keyPoints: [
          'Motion communicates: spatial relationships, state changes, hierarchy, status',
          'Purposeless motion adds cognitive load',
          'Absent motion causes disorientation at key transition points',
        ],
      },
      {
        title: 'The 12 principles of animation (applied to UI)',
        content: 'Disney\'s 12 principles of animation apply to UI motion. The most relevant: Timing (duration matters — too fast is jarring, too slow is frustrating; 200–500ms is the range for most UI transitions), Easing (motion should accelerate and decelerate naturally, not move at constant speed), Anticipation (a slight compression before a button press makes the interaction feel physical), and Follow-through (elements don\'t stop abruptly — they settle). These principles are why well-crafted UI feels premium and poorly crafted UI feels cheap.',
        keyPoints: [
          'UI transition sweet spot: 200–500ms',
          'Easing over linear: always use natural acceleration curves',
          'Follow-through and anticipation create physical, satisfying interactions',
        ],
      },
      {
        title: 'Micro-interactions: the detail that defines quality',
        content: 'A micro-interaction is a small, contained interaction with a single purpose — a like button animation, a toggle switch state change, a form field that shakes on incorrect input, a success checkmark that draws itself. These are the moments where product quality is felt without being seen. Dan Saffer\'s framework: every micro-interaction has a trigger (what initiates it), rules (what happens), feedback (how the system communicates back), and loops/modes (does it repeat?). The best micro-interactions are noticeable only when absent.',
        keyPoints: [
          'Micro-interactions: trigger → rules → feedback → loops',
          'Product quality is felt in micro-interactions even when not consciously noticed',
          'The best micro-interactions are noticed most when they\'re missing',
        ],
      },
    ],
  },
  {
    id: 'design-5',
    track: 'Design',
    title: 'Design systems: building the infrastructure for consistent design at scale',
    subtitle: 'Tokens, components, documentation & the organisational model that makes design scalable',
    duration: '13 m',
    level: 'PhD',
    xp: 165,
    sections: [
      {
        title: 'What a design system is (and is not)',
        content: 'A design system is a shared language between design and engineering — a set of reusable components, design tokens, and documentation that enables teams to build consistent, high-quality interfaces faster. It is not a component library (that\'s part of it). It is not a style guide (that\'s documentation of decisions). It is not a Figma file (that\'s the design tool implementation). A real design system is a living product with its own roadmap, governance model, and versioning — maintained by a team (even a team of one) and consumed by product teams.',
        keyPoints: [
          'Design system = components + tokens + documentation + governance',
          'Not just a Figma file or a component library',
          'It\'s a product with its own roadmap and maintenance requirements',
        ],
      },
      {
        title: 'Design tokens: the foundation',
        content: 'Design tokens are the named, stored values of design decisions: colour, spacing, typography, border radius, shadow. Instead of hardcoding hex values and pixel values throughout a codebase, you reference tokens (color.brand.primary, spacing.4, radius.md). Tokens enable: consistent application of design decisions, easy theme switching (light/dark mode), brand updates that propagate everywhere, and shared language between design tools and code. Modern token architecture uses three tiers: global tokens (raw values), semantic tokens (purpose-defined), and component tokens (component-specific).',
        keyPoints: [
          'Tokens: named values for colour, spacing, type, radius, shadow',
          'Three-tier architecture: global → semantic → component',
          'Tokens enable theme switching and consistent updates at scale',
        ],
      },
      {
        title: 'Component architecture and documentation',
        content: 'Components are the building blocks of a design system — reusable UI elements with defined props, states, and behaviours. Good component architecture: components are composable (built from smaller primitives), flexible (accept props for variation without creating infinite variants), and documented (every component has usage guidelines, do/don\'ts, and code examples). The documentation is half the product. Without it, teams build workarounds instead of using the system. Storybook is the de facto standard for component documentation in engineering teams.',
        keyPoints: [
          'Composable, flexible, documented — the three requirements for components',
          'Documentation is half the product — invest in it',
          'Storybook is the standard for engineering-side component documentation',
        ],
      },
    ],
  },
] as const
