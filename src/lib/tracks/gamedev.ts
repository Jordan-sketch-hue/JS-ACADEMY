import type { Course } from '../courses'

export const gamedevCourses: Course[] = [
  {
    id: 'gd-m01',
    track: 'gamedev',
    title: 'The Psychology of Play',
    subtitle: 'Why humans play — and how the brain turns play into obsession',
    level: 'Basic',
    xp: 100,
    duration: 12,
    module: 1,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Dopamine Loop',
        definition:
          'The neurochemical cycle underlying all compelling games. Anticipation of a reward releases dopamine — not the reward itself. This means uncertainty (a loot box, a boss health bar, an unknown door) is more stimulating than certainty. Well-designed games maintain anticipation without ever fully resolving it.',
      },
      {
        term: 'Intrinsic Motivation',
        definition:
          'Engagement driven by internal rewards — curiosity, mastery, autonomy — rather than external ones like prizes or leaderboards. Games that survive decades (Chess, Minecraft, Dark Souls) are built almost entirely on intrinsic motivation. External rewards can temporarily boost engagement but often destroy it long-term.',
      },
      {
        term: 'Flow State',
        definition:
          "Psychologist Mihaly Csikszentmihalyi's term for the optimal experience channel: the zone where challenge slightly exceeds current skill, producing total absorption. Too easy → boredom. Too hard → anxiety. Great games dynamically balance this equation — often invisibly — to keep players in flow.",
      },
      {
        term: 'Limbic System',
        definition:
          'The emotional brain — amygdala, hippocampus, nucleus accumbens. Horror games hijack the amygdala (fear response). Exploration games activate the hippocampus (spatial memory, curiosity). Reward systems spike the nucleus accumbens (pleasure, craving). Knowing which structure you are targeting tells you what design tools to use.',
      },
      {
        term: 'Operant Conditioning',
        definition:
          "B.F. Skinner's framework for behavior through reinforcement schedules. Variable-ratio schedules (rewards at unpredictable intervals) produce the highest and most persistent response rates — exactly why slot machines and loot systems are so powerful. Every reward system in game design is, consciously or not, an operant conditioning system.",
      },
    ],
    quiz: [
      {
        q: 'What neurotransmitter is most responsible for the compelling nature of uncertain rewards in games?',
        options: ['Serotonin', 'Dopamine', 'Oxytocin', 'Cortisol'],
        correct: 1,
        explanation: 'Dopamine is released in anticipation of a reward, not on receipt. Uncertainty — not certainty — is the engine of compulsive play.',
      },
      {
        q: 'A player says your game is "too boring." According to Flow State theory, what is the most likely cause?',
        options: [
          'The story is uninteresting',
          'The challenge is too low relative to current skill',
          'The graphics are outdated',
          'The controls are poorly mapped',
        ],
        correct: 1,
        explanation: 'Flow theory: boredom results when challenge is below skill level. The fix is to increase difficulty or introduce new complexity — not cosmetic changes.',
      },
      {
        q: 'Which brain region is most directly activated by horror game mechanics?',
        options: ['Prefrontal cortex', 'Hippocampus', 'Amygdala', 'Cerebellum'],
        correct: 2,
        explanation: 'The amygdala processes fear and threat detection. Horror games are essentially amygdala activation machines — every jump scare, sound cue, and monster design is targeting this structure.',
      },
      {
        q: 'Variable-ratio reinforcement schedules produce the highest response rates because:',
        options: [
          'Players know exactly when the reward is coming',
          'The reward is always proportional to effort',
          'Unpredictability maintains elevated anticipation',
          'They require the least cognitive load',
        ],
        correct: 2,
        explanation: 'Skinner found that unpredictable reward timing (variable-ratio) creates the most persistent behavior — you never know when the next reward is coming, so you never stop trying.',
      },
    ],
    content: `## The Psychology of Play

Before you write a single line of code or sketch a single level, you need to understand what a game actually is at the level of the human nervous system. A game is not entertainment — it is a stimulus environment engineered to trigger specific neurological responses at will.

### Why Humans Play

Play is not a luxury. It is one of the oldest behavioral programs in the mammalian brain. Young mammals of every species play — and the reason is always the same: play is how the brain builds models of the world in a consequence-free environment. When a cat plays with a toy, it is running its hunting neural pathways at low stakes. When a child plays a game, their brain is doing the same thing — modeling cause and effect, social dynamics, spatial reasoning, risk.

This is why humans never outgrow play. The adult version is just more abstract. Chess, poker, strategy games, and sports all satisfy the same deep program: give me a structured environment with meaningful decisions and feedback loops, and I will engage with it obsessively.

### The Dopamine Engine

Every game designer is, whether they know it or not, a dopamine system engineer.

Dopamine is not a pleasure chemical — it is an anticipation chemical. It spikes before the reward, on the prediction of the reward, especially when that prediction is uncertain. This is why:
- Opening a mystery loot box feels more exciting than receiving a known item
- The last 10% of a boss's HP bar is more intense than the first 90%
- A blinking door with no label produces more curiosity than one that says "Storage Room"

The design implication is profound: **never fully resolve anticipation**. The moment your player knows exactly what is coming, the dopamine drops. The art of game design is maintaining calibrated uncertainty across an entire experience arc.

### The Flow Channel

Csikszentmihalyi studied optimal experience across hundreds of professions and activities. The consistent finding: deep engagement requires challenge slightly above current skill. This produces what he called Flow — a state of total absorption where self-consciousness disappears and time distorts.

For game designers, this is both the goal and the primary engineering challenge. Skill is not static — players improve continuously. A game that was challenging on day one becomes easy by day three if difficulty does not adapt. This is why the best games use:

- **Dynamic difficulty adjustment (DDA)** — systems that silently adjust enemy behavior, resource availability, or puzzle complexity based on player performance
- **Skill expression windows** — moments where mastery unlocks options unavailable to beginners
- **Soft walls** — non-binary difficulty that lets struggling players progress while still failing to unlock optional content

### Brain Regions by Genre

| Genre | Primary Brain Region | Core Drive |
|-------|---------------------|------------|
| Horror / Survival | Amygdala | Fear, relief, vigilance |
| Exploration / Open World | Hippocampus | Spatial curiosity, discovery |
| Puzzle / Strategy | Prefrontal Cortex | Problem-solving, pattern recognition |
| Fighting / Action | Cerebellum + Motor Cortex | Reflex, muscle memory, flow |
| RPG / Narrative | Default Mode Network | Identity, empathy, story simulation |
| Social / MMO | Mirror Neurons | Belonging, status, cooperation |

Understanding this table changes how you make design decisions. A horror game should never be fully explained — the amygdala responds to the unknown. A puzzle game must signal progress clearly — the prefrontal cortex needs closure. An RPG must make you care about characters — the default mode network runs social simulation.

### Attention Spectrum

Players do not bring the same quality of attention to every session. Designing for attention means knowing which mode your player is in:

- **Ambient** — half-attention, background experience (idle games, casual mobile)
- **Focused** — intentional session, moderate investment (daily puzzles, short campaigns)
- **Reactive** — high-speed, reflex-dominant (action games, FPS, fighting games)
- **Deep** — total immersion, long sessions, emotional investment (RPGs, survival, narrative)

The worst design mistake is building for Deep when your player is in Ambient mode — or building for Ambient when they came for Deep. Your platform, session length, and feedback intensity should all match the attention mode you are designing for.`,
  },

  {
    id: 'gd-m02',
    track: 'gamedev',
    title: 'Point of View & First-Person Design',
    subtitle: 'How camera perspective shapes identity, emotion, and immersion',
    level: 'Basic',
    xp: 100,
    duration: 11,
    module: 2,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Embodied Cognition',
        definition:
          'The psychological principle that what the body perceives, the mind internalizes. In a first-person game, the absence of a visible character body tricks the brain into treating the camera as the self. This is why first-person horror is more frightening than third-person — you cannot see yourself being threatened, so the threat feels aimed at you personally.',
      },
      {
        term: 'Presence',
        definition:
          'The subjective feeling of "being there" in a virtual environment. Presence is the goal of all immersive design and is maximized by: high frame rate, accurate spatial audio, low input latency, consistent physics, and a credible first-person perspective. VR is so effective precisely because it maximizes the presence variables simultaneously.',
      },
      {
        term: 'Diegetic vs. Non-Diegetic UI',
        definition:
          "Diegetic UI exists within the game world (a holographic health display on a character's armor, a watch showing ammo count). Non-diegetic UI floats on the HUD outside the game world (health bars, minimaps). First-person games often favor diegetic UI because non-diegetic elements break presence by reminding players they are looking at a screen.",
      },
      {
        term: 'Environmental Storytelling',
        definition:
          'Narrative delivered through the environment itself — not cutscenes or dialogue. A burned photograph. A child\'s shoe. A barricaded door. First-person games rely on environmental storytelling because they have no external "camera" to cut to for exposition. The world must explain itself through what the player\'s eyes encounter.',
      },
      {
        term: 'Field of View (FOV)',
        definition:
          "The angle of the game world visible through the camera at any moment. Human peripheral vision spans ~180°, but most FPS games default to 90°–110° FOV. Low FOV (60°) creates claustrophobia — effective in horror. High FOV (120°) increases spatial awareness — preferred in competitive shooters. FOV is a design tool, not just a comfort setting.",
      },
    ],
    quiz: [
      {
        q: 'Why is first-person perspective more effective for horror games than third-person?',
        options: [
          'It allows higher graphical fidelity',
          'The brain internalizes the camera as the self, making threats feel personal',
          'Players prefer not seeing their character',
          'It enables more complex AI behavior',
        ],
        correct: 1,
        explanation: 'Embodied cognition: the absence of a visible player body causes the brain to treat the camera as self. Threats aimed at that camera feel aimed at you — the defining mechanic of effective horror.',
      },
      {
        q: 'A survival game wants maximum immersion. Which UI approach is most appropriate?',
        options: [
          'Large, colorful HUD with all stats visible at all times',
          'No UI whatsoever',
          'Diegetic UI — health and resources shown through in-world objects',
          'Pop-up notifications for every status change',
        ],
        correct: 2,
        explanation: 'Diegetic UI maintains presence by keeping information inside the game world. Non-diegetic UI (floating HUDs) reminds the player they are looking at a screen, breaking immersion.',
      },
      {
        q: 'Environmental storytelling is especially critical for first-person games because:',
        options: [
          'It reduces development cost',
          'There is no external camera for cutscenes, so the world must explain itself',
          'Players read more carefully in first person',
          'It is easier to implement than dialogue trees',
        ],
        correct: 1,
        explanation: 'Without a third-person camera to cut to, first-person games cannot use traditional cinematic exposition. The environment itself must carry the narrative — through objects, layouts, and environmental details.',
      },
      {
        q: 'A competitive FPS player complains the game "feels slow." What FOV adjustment would most directly address this?',
        options: ['Decrease FOV from 90 to 60', 'Increase FOV from 90 to 110', 'Set FOV to exactly 180', 'Lock FOV and adjust player speed'],
        correct: 1,
        explanation: 'Higher FOV increases peripheral vision and creates a sensation of faster movement through more visible environment. Competitive players typically prefer 100–120° FOV for this reason.',
      },
    ],
    content: `## Point of View & First-Person Design

Camera perspective is not a technical choice. It is a psychological one. The angle from which a player sees the world determines how much they identify with the character, how intense the emotional experience is, and which genres and narratives are even possible.

### The Spectrum of Perspective

**Third-person** — camera behind and above the character. Player sees themselves in the world. Creates separation: you are directing a character, not inhabiting one. Effective for action, platformers, open-world exploration, over-the-shoulder combat.

**Isometric / top-down** — God-view. Maximum strategic overview, minimum embodiment. Effective for strategy, tactics, simulation, roguelikes.

**First-person** — eyes of the character. No body visible (or minimal). Player IS the character. Maximum embodiment, minimum separation. Effective for horror, survival, immersive sim, FPS, walking simulator, VR.

**2.5D / side-scrolling** — lateral perspective. Character visible but in a flattened world. Classic for platformers, beat-em-ups.

### Why First-Person Is Uniquely Powerful

First-person perspective activates a specific cognitive quirk: when you cannot see yourself, you assume you are in the position of what you see. This is embodied cognition — the same mechanism that makes you flinch when a car nearly hits someone else on screen.

In first-person games, the camera is not a camera. It is a body. When something frightens that body, your amygdala does not cleanly separate "that is a game camera" from "something is threatening me." The result:

- Horror is genuinely frightening, not just cinematically dramatic
- Environmental details feel like personal memories, not observations
- Character death creates actual stress, not just frustration
- Spatial audio becomes directional threat intelligence

### Genres That Work Best in First Person

| Genre | Why FP Works |
|-------|-------------|
| Horror | Amygdala activation; threat feels personal |
| Survival | Resource anxiety is visceral when you cannot see your own body |
| FPS Shooter | Precision aiming; spatial read; fast-twitch reflex engagement |
| Stealth | Peering around corners; tension of limited sightlines |
| Immersive Sim (Dishonored, Prey) | World as tactile environment to interact with, not observe |
| Walking Simulator | Pure environmental storytelling and atmosphere |
| VR | Presence maximized; embodied cognition fully exploited |

### Genres That Resist First Person

| Genre | Why FP Breaks It |
|-------|-----------------|
| Strategy / RTS | Need global overview; FP removes the strategic vantage |
| Platformer | Cannot judge jump distances without seeing own body |
| Third-Person Action | Cinematic combat choreography requires external camera |
| Card / Board Games | Abstract representation incompatible with embodied view |
| Match-3 / Puzzle | Spatial pattern recognition needs overview, not immersion |

### Building a First-Person Narrative

Without cutscenes, first-person storytelling relies entirely on what the world shows the player's eyes. This requires environmental storytelling discipline:

**Rule 1: Objects carry meaning.** Every collectible, every piece of furniture, every stain on the wall is a narrative beat. Nothing should be placed for purely visual fill. What does this object say about the person who owned it? What happened here?

**Rule 2: Architecture is character.** The layout of rooms tells us about the people who built or lived in them. A panic room says something different than a trophy room. A hoarder's apartment tells a different story than a sterile cell.

**Rule 3: Sound is memory.** Audio in a first-person game is not ambiance — it is history made present. A distant radio playing an old song, the creak of a specific stair, the echo of a room that was once full of people. Sound cues the hippocampus for emotional recall.

**Rule 4: The player's hands are characters.** If the player's hands are visible (holding a weapon, reaching for a door), they communicate: Are the hands shaking? Injured? Gloved? In armor? Bare? The hands are the only body the player has — make them eloquent.

### Emotional Levers by FP Design Choice

- **Narrow corridors** → claustrophobia, vulnerability
- **Vast open spaces** → awe, loneliness, scale
- **Low ceilings** → oppression, constraint
- **Vertical height** → power or danger, depending on context
- **Darkness** → amygdala on high alert; imagination fills what eyes cannot see
- **Mirrors** → uncanny, self-confrontation, identity questions
- **Locked doors** → narrative tension, denied agency — use sparingly

### Audience for First-Person Games

The first-person audience skews toward:
- **Age 16–35** — high immersion tolerance, self-identification with protagonist
- **Story-driven players** — want to inhabit a narrative, not just observe one
- **Sensory seekers** — spatial audio, haptic feedback, and visual detail matter deeply
- **Replay motivation** — hidden details, multiple paths, environmental secrets

Design your first-person game knowing that your player wants to disappear into it. Their tolerance for immersion-breaking elements (bad UI, inconsistent physics, clunky controls) is low — because those breaks remind them it is a game, not a world.`,
  },

  {
    id: 'gd-m03',
    track: 'gamedev',
    title: 'Game Genres & Brain Mapping',
    subtitle: 'Which neural systems each game type targets — and why it matters for design',
    level: 'Masters',
    xp: 120,
    duration: 13,
    module: 3,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Genre-Brain Fit',
        definition:
          "The principle that each game genre primarily activates a specific cluster of brain regions, and that design decisions within that genre should be optimized for those regions. A horror game that tries to be strategically complex is fighting its own brain target — the amygdala wants uncertainty, not deliberation.",
      },
      {
        term: 'Hippocampal Engagement',
        definition:
          'The hippocampus handles spatial memory, map-building, and navigation. Open-world games, dungeon crawlers, and exploration genres heavily engage this system. Players who say they "love exploring" are describing hippocampal satisfaction — the pleasure of building a spatial model of an unknown world.',
      },
      {
        term: 'Prefrontal Flow',
        definition:
          "The prefrontal cortex handles planning, decision-making, and working memory. Strategy games, puzzle games, and deck-builders are PFC-dominant. The satisfaction of 'figuring it out' is prefrontal. This region is also the slowest to process — which is why strategy games can tolerate (and often require) pause mechanics.",
      },
      {
        term: 'Mirror Neuron Activation',
        definition:
          "Mirror neurons fire when observing others perform actions, creating vicarious experience. In narrative and social games, watching characters suffer, celebrate, or connect activates the same regions as experiencing those things directly. This is the neurological basis of empathy in storytelling — and why player-controlled character death lands harder than NPC death.",
      },
      {
        term: 'Attention Span Spectrum',
        definition:
          'The range of attention qualities players bring to gaming sessions: Ambient (passive, half-attention), Focused (intentional short sessions), Reactive (high-speed reflex engagement), and Deep (full-immersion multi-hour engagement). Platform, genre, and session design should match the attention mode of the target audience.',
      },
    ],
    quiz: [
      {
        q: 'A developer wants to create a puzzle game that rewards the "aha moment." Which brain region are they primarily targeting?',
        options: ['Amygdala', 'Cerebellum', 'Prefrontal Cortex', 'Nucleus Accumbens'],
        correct: 2,
        explanation: 'The prefrontal cortex handles planning and problem-solving. The satisfaction of solving a puzzle — the "aha moment" — is prefrontal cortical closure. Design for deliberation, not reaction speed.',
      },
      {
        q: 'Open-world games that reward exploration tap primarily into which brain system?',
        options: ['Motor cortex', 'Hippocampus', 'Amygdala', 'Cerebellum'],
        correct: 1,
        explanation: 'The hippocampus builds spatial maps and drives curiosity-based navigation. Exploration games are fundamentally hippocampal — the satisfaction is map completion and spatial mastery.',
      },
      {
        q: 'A fighting game relies on precise timing and rapid reflexes. Which brain region is most critical for mastery?',
        options: ['Default Mode Network', 'Hippocampus', 'Prefrontal Cortex', 'Cerebellum and Motor Cortex'],
        correct: 3,
        explanation: 'The cerebellum handles timing, coordination, and motor memory. Fighting game mastery is cerebellar — it is built through repetition until actions become automatic, below conscious thought.',
      },
      {
        q: 'A mobile game targeting "ambient attention" should prioritize:',
        options: [
          'Deep narrative investment and complex controls',
          'Short, low-commitment sessions with clear quick rewards',
          'High-difficulty mechanics requiring full concentration',
          'Long tutorial sequences explaining complex systems',
        ],
        correct: 1,
        explanation: 'Ambient attention means half-presence. Design for interruption tolerance: short sessions, instant comprehension, satisfying micro-rewards, no penalty for putting the phone down mid-session.',
      },
    ],
    content: `## Game Genres & Brain Mapping

Every game genre is, at its core, a delivery mechanism for a specific neurological experience. Understanding which brain systems you are engaging — and what those systems need to stay engaged — is the difference between designing intuitively and designing with precision.

### The Genre-Brain Map

**Action / FPS**
- Primary regions: Cerebellum (timing, motor), Anterior Cingulate (error detection), Nucleus Accumbens (kill reward)
- Core drive: Reflex mastery, spatial dominance
- Age peak: 14–28 (reflex peak, competitive drive)
- Attention mode: Reactive
- Design for: Low latency, precise hit feedback, clear sightlines, escalating enemy density

**Horror / Survival**
- Primary regions: Amygdala (fear), Locus Coeruleus (arousal), Prefrontal (risk calculation)
- Core drive: Threat survival, relief
- Age peak: 16–30 (amygdala sensitivity, social approval of fear-tolerance)
- Attention mode: Deep, Focused
- Design for: Scarcity, darkness, sound design, pacing (fear needs breathing room)

**Exploration / Open World**
- Primary regions: Hippocampus (spatial), Dopaminergic reward (discovery)
- Core drive: Map-building, curiosity resolution
- Age peak: 18–35 (spatial confidence, willingness to wander)
- Attention mode: Deep
- Design for: Landmarks, fog of war, varied biomes, meaningful discovery rewards

**Puzzle / Strategy**
- Primary regions: Prefrontal Cortex (planning), Dorsal Striatum (habit learning)
- Core drive: Problem closure, systems mastery
- Age peak: 25–50 (PFC fully developed post-25; engagement stays high with age)
- Attention mode: Deep, Focused
- Design for: Clear problem statements, escalating complexity, "aha moment" pacing

**RPG / Narrative**
- Primary regions: Default Mode Network (self-referential thought, social simulation), Hippocampus (world model)
- Core drive: Identity play, story ownership, world inhabitation
- Age peak: 16–40 (narrative sophistication increases with age)
- Attention mode: Deep
- Design for: Character consequence, world consistency, meaningful choices with memorable outcomes

**Social / MMO**
- Primary regions: Mirror Neurons (social cognition), Ventral Striatum (social reward), Oxytocin system
- Core drive: Status, belonging, cooperation, competition
- Age peak: 14–30 (social identity formation peak)
- Attention mode: Ambient to Deep (varies by role in guild/party)
- Design for: Status visibility, guild/party mechanics, social gifting, public achievement display

**Casual / Mobile**
- Primary regions: Nucleus Accumbens (quick reward), Dopamine (habit loop)
- Core drive: Quick satisfaction, stress relief, idle mastery
- Age peak: 25–55 (time-constrained players; broad age range)
- Attention mode: Ambient
- Design for: 2-minute session viability, one-thumb control, immediate reward, no penalty for dropping mid-session

**Deck-Builder / Card**
- Primary regions: Prefrontal (combo planning), Hippocampus (card catalog memory)
- Core drive: Systems mastery, emergent strategy
- Age peak: 20–40
- Attention mode: Focused, Deep
- Design for: Card legibility, combo discovery, build variety, meaningful draft decisions

### Designing a Multi-Genre Game

Many successful games blend genres — but the best ones understand which brain system is primary and which is supporting. Dark Souls is an action game with RPG layering. The action (cerebellum, reflex) is primary. The RPG builds (prefrontal, strategy) are secondary. When those priorities are confused — when the systems demand equal cognitive weight — the experience fragments.

The design principle: **one primary brain target, one supporting brain target**. Everything else is decoration.

### Attention Span as a Design Constraint

The platform you build for largely determines the attention mode of your player — and your entire design must align with that mode.

| Platform | Likely Attention Mode | Design Priority |
|----------|----------------------|-----------------|
| Mobile | Ambient | Quick session, easy to pause, micro-rewards |
| Browser | Focused | Accessible, no install, clear progression |
| Console living room | Deep or Focused | Cinematic presentation, controller feel, long arcs |
| PC desktop | Deep or Reactive | Precision controls, complex UI tolerance, competitive depth |
| VR | Deep | Presence above all else; every break is jarring |`,
  },

  {
    id: 'gd-m04',
    track: 'gamedev',
    title: 'Narrative Design & Emotional Storytelling',
    subtitle: 'How to tell stories players feel, not just follow',
    level: 'Masters',
    xp: 130,
    duration: 14,
    module: 4,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Ludonarrative Dissonance',
        definition:
          'The conflict between what a game\'s story says and what its gameplay asks you to do. A narrative about a pacifist character who must kill hundreds of enemies creates dissonance — the player\'s actions contradict the stated identity. The best games align mechanics and narrative so that playing the game IS the story, not just a vehicle for it.',
      },
      {
        term: 'Player Agency',
        definition:
          'The degree to which player choices meaningfully alter the narrative or world. True agency requires: choices that feel real, consequences that are visible, and outcomes that persist. False agency — choices that are cosmetic or immediately overridden — is detected instantly and destroys narrative trust.',
      },
      {
        term: 'Narrative Arc',
        definition:
          "The structural shape of a story over time — typically: exposition, rising action, climax, falling action, resolution. In games, narrative arc must be compatible with non-linear play. The best game narratives use multiple smaller arcs (quest arcs, character arcs) that can be experienced in flexible order while maintaining a central throughline.",
      },
      {
        term: 'Dread vs. Horror',
        definition:
          'Dread is slow-building existential unease — the feeling that something is wrong without knowing what. Horror is acute fear — the jump scare, the monster, the immediate threat. The best horror games (Silent Hill, Soma) build dread first, using horror sparingly as a release valve. Constant horror becomes noise; sustained dread becomes unforgettable.',
      },
      {
        term: 'Character Consequence',
        definition:
          "The principle that player-controlled characters must feel the weight of their decisions. A choice that does not change anything is not a choice. Character consequence means: decisions affect relationships, world state, available options, and the character's own perception of themselves. Without consequence, story becomes passive entertainment.",
      },
    ],
    quiz: [
      {
        q: 'A game has a protagonist described as reluctant to violence but requires the player to kill 500 enemies. This is an example of:',
        options: ['Dynamic difficulty adjustment', 'Ludonarrative dissonance', 'Environmental storytelling', 'Player agency'],
        correct: 1,
        explanation: "Ludonarrative dissonance: the story says one thing, the mechanics demand another. The player's actions constantly contradict the stated character identity, undermining both the narrative and the player's connection to the character.",
      },
      {
        q: 'What distinguishes true player agency from false agency in narrative games?',
        options: [
          'True agency has more dialogue options',
          'True agency requires 3D environments',
          'True agency produces visible, persistent consequences to choices',
          'True agency is always presented with a timer',
        ],
        correct: 2,
        explanation: 'False agency is cosmetic — choices that look meaningful but do not change anything. True agency requires that choices produce visible outcomes that persist in the world and affect future options.',
      },
      {
        q: 'In horror game design, why is sustained dread more effective than constant horror?',
        options: [
          'Horror is more expensive to produce',
          'Constant horror becomes background noise; dread maintains heightened vigilance',
          'Players prefer narrative over action',
          'Dread is easier to implement technically',
        ],
        correct: 1,
        explanation: 'The amygdala habituates to repeated stimuli — constant jump scares stop landing. Dread maintains sustained amygdala activation without habituation, making the eventual horror release dramatically more powerful.',
      },
      {
        q: 'How should game narrative arc account for non-linear player behavior?',
        options: [
          'Force linear progression through locked doors and sequences',
          'Use multiple smaller arcs that tolerate flexible ordering with a central throughline',
          'Remove all narrative to allow complete freedom',
          'Reset the story whenever the player deviates from the intended path',
        ],
        correct: 1,
        explanation: 'Non-linear play is the defining challenge of game narrative. The solution: multiple self-contained arcs (quests, characters) that can be experienced in any order, anchored to a persistent central throughline the player always returns to.',
      },
    ],
    content: `## Narrative Design & Emotional Storytelling

The greatest stories in gaming history are not the ones with the most polished cutscenes or the most famous voice actors. They are the ones where you made a choice, lived with its consequences, and felt something real about it months later.

Narrative design is not writing. It is architecture. You are building a space in which stories happen — and the quality of your architecture determines whether players find a story worth telling or walk through a beautiful empty museum.

### What Makes a Game Story Land

**Consequence.** A story with no consequence is a tour. Something must be permanently different because the player acted. Relationships, world state, available options, the player's own psychology — something must change and stay changed.

**Complicity.** The player must be involved, not just witnessing. When the player pulls the trigger, makes the deal, chooses who lives — the weight of that moment belongs to them. This is why the most devastating game moments are not the cinematic ones. They are the ones where you chose.

**Coherence.** The world must follow rules the player can learn and trust. If cause and effect are arbitrary, choices feel meaningless. Narrative coherence means: the world is consistent, characters behave according to their established nature, and the physics of consequence are learnable.

### Ludonarrative Coherence as a Goal

The best game narratives use mechanics to tell the story — not story to justify mechanics. In Hades, you fight to escape the underworld and keep failing. The story is about persistence, family, and earned connection. Every run is a narrative argument for those themes. The mechanical loop IS the story.

In contrast: a war game that frames its protagonist as haunted by violence but requires you to collect 500 kills for a trophy is ludonarratively incoherent. The story and the systems are fighting each other.

**The test:** Cover the screen showing the HUD and ask — what story is the gameplay telling? Cover the screen showing the cutscenes and ask — what story are the mechanics telling? If the answers are different, you have a dissonance problem.

### Emotional Storytelling Across Genres

**In Horror:** Dread is the primary emotion. Build it slowly. A game that starts with a monster is a monster movie. A game that spends 20 minutes making you feel that something is wrong before you see anything — that is horror. Use sound design, architecture, and information restriction to build dread before deploying horror.

**In RPG:** Identity is the primary emotion. The player must feel that the character's story is also their story. This requires: choices that reflect real values, consequences that match the weight of decisions, and companions who feel like they have inner lives that exist independent of the player.

**In Survival:** Scarcity is the primary emotion. The world must feel genuinely hostile. Resources must be rare enough that every decision about their use carries weight. The emotional core of survival is the gap between what you need and what you have.

**In Action/FPS:** Mastery is the primary emotion. The story must honor the player's skill — giving them enemies worthy of their growing capability, moments where their practiced techniques produce spectacular results, and bosses that serve as narrative climaxes expressed through combat.

### The Player's Relationship with Characters

Mirror neurons make us experience what characters experience — but only if we believe in the characters. Characters become believable through:

- **Consistent behavior** — they act from their established nature, not from plot convenience
- **Specific detail** — a character who likes a particular brand of coffee feels more real than one with generic traits
- **Vulnerability** — characters who cannot do everything, who fail, who need help, produce more empathy than competent archetypes
- **Memory** — characters who remember what the player has done and reference it create the sensation of a genuine relationship

The moment a character breaks any of these — acting inconsistently, speaking in generic terms, never acknowledging what just happened — the spell breaks. The player's mirror neurons have nothing to fire on, and empathy collapses into observation.`,
  },

  {
    id: 'gd-m05',
    track: 'gamedev',
    title: 'Reward Systems & Progression Design',
    subtitle: 'Building loops that keep players coming back without manipulating them',
    level: 'Masters',
    xp: 130,
    duration: 12,
    module: 5,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Core Loop',
        definition:
          'The fundamental repeating action cycle of a game — the thing the player does most often. In a shooter: aim, shoot, reload. In an RPG: explore, fight, level up, explore more. The core loop must be inherently enjoyable independent of external rewards, because players will repeat it thousands of times.',
      },
      {
        term: 'Progression System',
        definition:
          'The structure that tracks and rewards player advancement over time. Progression systems create the sense that time invested produces measurable growth. The best progression systems feel earned (not inflated), visible (player can see growth), and meaningful (new capabilities matter in gameplay).',
      },
      {
        term: 'Sunk Cost Fallacy',
        definition:
          "The psychological tendency to continue investing in something because of past investment, not future value. Predatory games deliberately engineer sunk cost — making players feel they can't quit because they've already spent money, time, or emotional capital. Ethical design creates genuine forward value rather than exploiting backward investment.",
      },
      {
        term: 'Mastery vs. Performance Goals',
        definition:
          "Mastery goals focus on skill development ('I want to get better at this'). Performance goals focus on external validation ('I want to rank higher than others'). Mastery goals produce more resilient, long-term engagement; performance goals produce intense short-term engagement but higher burnout and churn rates.",
      },
      {
        term: 'Feedback Latency',
        definition:
          "The time between a player's action and receiving meaningful feedback about its outcome. Low feedback latency (instant hit markers, immediate XP popups) is satisfying but can trivialize decisions. High feedback latency (consequences that unfold over hours of play) creates weight and significance but risks confusion. The optimal balance depends on genre.",
      },
    ],
    quiz: [
      {
        q: 'A game\'s core loop should be enjoyable independent of rewards because:',
        options: [
          'Players can disable rewards in settings',
          'External rewards are too expensive to produce',
          'Players will repeat the core loop thousands of times, making intrinsic enjoyment essential',
          'Rewards cause addiction',
        ],
        correct: 2,
        explanation: 'The core loop is what the player actually does — the moment-to-moment experience. External rewards can motivate starting, but if the core action is not intrinsically enjoyable, no reward system will retain players long-term.',
      },
      {
        q: 'What distinguishes ethical progression design from predatory design?',
        options: [
          'Ethical games have no progression systems',
          'Ethical games create genuine forward value rather than exploiting sunk cost',
          'Ethical games require real money to progress',
          'Ethical games only reward mastery goals',
        ],
        correct: 1,
        explanation: "Predatory design makes players feel they can't stop because of what they've already invested. Ethical design gives players compelling reasons to continue based on future value — new content, new capabilities, new story — not past investment.",
      },
      {
        q: 'Which type of player goal produces more resilient long-term engagement?',
        options: ['Performance goals (ranking, beating others)', 'Mastery goals (skill development)', 'Social goals (making friends)', 'Completion goals (100% all achievements)'],
        correct: 1,
        explanation: 'Mastery goals are internally regulated — progress is self-defined. Performance goals depend on external rankings, which fluctuate and can produce anxiety and churn. Mastery-oriented players play longer and report higher satisfaction.',
      },
    ],
    content: `## Reward Systems & Progression Design

Every game is a reward machine. The question is not whether you will use psychological reward mechanisms — you will, unavoidably. The question is whether you will use them to create genuine, lasting value for your player, or to extract maximum playtime through artificial compulsion.

### Anatomy of a Reward System

A reward system has three components:

**The Signal** — something that tells the player a reward is coming or available. A glowing item. A skill tree node that just unlocked. An XP bar near completion. Signals activate the dopamine anticipation response.

**The Action** — what the player must do to receive the reward. The action should feel skilled or meaningful — not arbitrary. A reward that arrives regardless of player behavior teaches nothing and means nothing.

**The Reward** — the outcome. Effective rewards fall into four categories:
- **Capability rewards** — new abilities that change what you can do
- **Content rewards** — new areas, story, or characters that expand the world
- **Expressive rewards** — cosmetics, customization, identity elements
- **Social rewards** — status, recognition, leaderboard position

The hierarchy matters. Capability and content rewards create genuine value. Expressive and social rewards are powerful but hollow if not backed by the first two.

### The Core Loop as Foundation

Before designing any reward system, verify your core loop is worth repeating. Strip away all progression, all rewards, all unlocks. Is the moment-to-moment action — moving through the world, fighting enemies, solving puzzles — inherently satisfying?

If yes, your reward system amplifies genuine value. If no, your reward system is concealing a hollow experience. Players will eventually see through the concealment — and they will be far more negative about a deceptive experience than a simple boring one.

### Progression That Feels Earned

The curse of inflated progression is that players can smell it immediately. When levels are trivially earned, when the XP bar fills every thirty seconds, when skill trees unlock abilities that are identical to the previous tier — the progression feels fake. Worse, it paradoxically reduces engagement because there is nothing to work toward.

Earned progression requires:
- **Meaningful time investment** — the next tier should require effort that feels proportional to its value
- **Visible capability gap** — the player should be able to see and feel the difference between old and new
- **Choice** — when multiple progression paths exist and the player must choose, each level decision carries weight

### Ethical vs. Predatory Reward Design

The line between compelling and manipulative is whether the player's continued engagement serves their genuine enjoyment or the company's extraction of attention and money.

**Ethical signals:**
- Players can stop without losing meaningful value (no expiring rewards, no daily login gates for core content)
- Progression communicates genuine skill development, not purchased velocity
- Content is available to free players; premium is cosmetic or convenience, not competitive advantage
- Players can tell where they are in the progression and can reasonably predict completion

**Predatory signals:**
- Artificial urgency ("limited time only," energy timers)
- Sunk cost engineering (large investment required before the predatory mechanics kick in)
- Variable-ratio loot systems where the odds are hidden or manipulated
- Social comparison mechanics designed to produce anxiety, not inspiration`,
  },

  {
    id: 'gd-m06',
    track: 'gamedev',
    title: 'Audience Design & Emotional Appeal',
    subtitle: 'Who is your player — and what do they actually need from your game',
    level: 'Masters',
    xp: 120,
    duration: 11,
    module: 6,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Player Taxonomy',
        definition:
          "Richard Bartle's classic framework categorizing online game players: Achievers (XP, levels, completion), Explorers (world discovery, hidden content), Socializers (relationships, guilds), Killers (dominance, PvP, competition). Real players are mixes of all four, but one type usually dominates. Design that satisfies all four types produces the broadest and most loyal audience.",
      },
      {
        term: 'Core vs. Casual',
        definition:
          "A spectrum of player investment: Core players play multiple hours per session, follow patch notes, optimize builds, and have strong opinions about balance. Casual players play in short bursts, skip optional content, and evaluate games by immediate emotional impact rather than systems depth. Most successful games serve both by having accessible surface and deep optional systems.",
      },
      {
        term: 'Accessibility Design',
        definition:
          "The practice of making games playable by the widest possible audience — including players with visual, auditory, motor, or cognitive differences. Accessibility is not charity — it expands your market, increases retention, and often produces design improvements that benefit all players. Subtitles, colorblind modes, remappable controls, and adjustable difficulty are baseline expectations.",
      },
      {
        term: 'Emotional Need',
        definition:
          "The underlying psychological state a player seeks to satisfy through play. Common emotional needs: escape (temporary relief from real-world stress), competence (feeling capable), connection (belonging with other players), achievement (visible progress and recognition), identity exploration (trying on different selves). The best games satisfy multiple emotional needs simultaneously.",
      },
    ],
    quiz: [
      {
        q: 'A player who primarily enjoys finding hidden lore, undocumented areas, and game secrets aligns with which Bartle type?',
        options: ['Achiever', 'Explorer', 'Socializer', 'Killer'],
        correct: 1,
        explanation: "Bartle's Explorer type is motivated by discovery — hidden content, secret mechanics, undocumented world details. They play to know the game fully, not to compete or socialize.",
      },
      {
        q: 'Why should a game designed for casual players still have deep optional systems?',
        options: [
          'It makes the game look more impressive in trailers',
          'Casual players will eventually become core players',
          'Accessible surface + deep optional systems serves both player types, maximizing audience',
          'Regulatory requirements mandate system depth',
        ],
        correct: 2,
        explanation: "Accessible surface lets casual players enjoy the game immediately. Deep optional systems give core players the complexity they crave. Both audiences coexist in your player base — and you don't have to choose between them.",
      },
      {
        q: 'Accessibility features like subtitles, colorblind modes, and remappable controls primarily benefit:',
        options: [
          'Only players with disabilities',
          'Game reviewers evaluating technical polish',
          'The widest possible player base — including non-disabled players in varied conditions',
          'Players who prefer harder difficulty modes',
        ],
        correct: 2,
        explanation: 'Subtitles help players in noisy environments. Colorblind modes sometimes improve readability for all players. Remappable controls benefit anyone with non-standard hardware. Accessibility features universally improve the experience — their benefits extend far beyond their labeled audience.',
      },
    ],
    content: `## Audience Design & Emotional Appeal

The most common mistake in game design is building for yourself. You know the genre, you know the references, you have opinions about what is good and bad — so you build the game you would want. This is a reasonable starting point and a dangerous ending point.

Designing for an audience requires stepping outside your own taste and asking: who are these people, what do they already know, what emotional state are they in when they sit down to play, and what do they need from this experience?

### Understanding Player Types

Bartle's taxonomy remains one of the most useful frameworks for understanding why different players love (or abandon) the same game:

**Achievers** want visible progress. XP bars, achievement lists, completion percentages, and skill trees that light up. They are motivated by quantifiable advancement. Design for them: clear progression metrics, visible milestone rewards, 100% completion paths.

**Explorers** want the world to surprise them. Hidden rooms, undocumented mechanics, secret lore, areas that reward players who go off the beaten path. They are motivated by the unknown becoming known. Design for them: dense environmental storytelling, optional discovery content, rewards that assume the player went looking.

**Socializers** want the game to be a context for connection. They care less about the game itself than about the relationships formed through it. They are motivated by co-experience and shared memory. Design for them: co-op mechanics, guild structures, communication tools, and shared milestone moments that become stories.

**Killers** want to test their capability against other humans. Ranking systems, PvP, competitive meta, leaderboards. They are motivated by dominance and recognition. Design for them: meaningful competitive balance, clear skill expression, visible status markers.

### Emotional Need Mapping

Before writing a design document, write an emotional brief:

1. What emotional state does the player arrive in? (Stressed from work? Excited to compete? Looking for peace?)
2. What emotional state do you want them to leave in? (Satisfied? Energized? Moved?)
3. What emotional needs does your game primarily serve? (Escape? Competence? Connection? Identity?)
4. Are there emotional needs your genre typically ignores that you could address?

The last question is where differentiation lives. A competitive FPS that acknowledges the player as a whole person — with a brief narrative, expressive customization, and moments of beauty between combat — serves emotional needs its competitors ignore. This is why games like Halo built cultural moments, not just mechanical ones.

### Accessibility as Design Philosophy

Every player you cannot reach is a player whose experience you have decided does not matter. Accessibility design is not a checkbox feature — it is evidence of design maturity.

The practical baseline for any released game in 2025:
- Subtitles with adjustable size and background contrast
- Colorblind modes (protanopia, deuteranopia, tritanopia at minimum)
- Fully remappable controls across all input devices
- Adjustable difficulty with honest labeling (not "Story Mode" as a shame label)
- Audio visualization for deaf and hard-of-hearing players
- Input assist options for motor-impaired players (auto-aim, extended timing windows, one-handed options)

Each of these also improves the experience for non-disabled players in specific situations. Subtitles help in noisy environments. Remappable controls help left-handed players or those with non-standard setups. Adjustable difficulty retains players who would otherwise churn.

### Designing for Age

Age shapes not just what players know but how they play:

**Under 13:** Short sessions, clear visual feedback, forgiving difficulty, no social comparison mechanics, bright color language, no narrative complexity that requires adult context.

**13–17:** Identity formation is the primary developmental task. Games that allow identity expression (character customization, alignment choices, subcultural signaling) are extremely powerful. Competitive social mechanics peak here. Attention spans lengthen. Narrative complexity tolerable.

**18–30:** Peak reflex performance. Competitive engagement highest. Narrative sophistication growing. First money in their pocket — monetization window opens. Open world and RPG depth becomes satisfying.

**30–45:** Time-constrained. Depth over breadth — they will invest in fewer games but more deeply. Prefer games that respect their time (no excessive grinding, clear session stopping points). Narrative weight appreciated.

**45+:** Systems mastery valued. Strategy and puzzle genres thrive here. Social gaming (family-friendly co-op). Accessibility features matter more. Competition less important than completion.`,
  },

  {
    id: 'gd-m07',
    track: 'gamedev',
    title: 'Immersive Experience Design',
    subtitle: 'Sound, environment, feedback — making the game world feel real',
    level: 'PhD',
    xp: 150,
    duration: 15,
    module: 7,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Sensory Coherence',
        definition:
          'The principle that all sensory channels — visual, audio, haptic, spatial — must tell the same story simultaneously. A game with beautiful visuals but mismatched audio (gunshots that sound weak, footsteps on the wrong surface) feels wrong without players being able to articulate why. Sensory coherence is the silent architecture of immersion.',
      },
      {
        term: 'Procedural Audio',
        definition:
          "Sound generated in real-time by code rather than pre-recorded audio files. Procedural audio allows sound to adapt to game state — a door that sounds different based on material, a creature whose calls shift based on its current behavior, music that intensifies as danger increases. The Web Audio API enables procedural audio in browser-based games without file dependencies.",
      },
      {
        term: 'Lumic Design',
        definition:
          'The deliberate use of light as a storytelling and emotional tool. Light communicates: safety (warm, amber light), danger (red, flickering), mystery (blue-green, partial), revelation (white flash, bloom). The absence of light — darkness — is one of the most powerful emotional tools in game design, forcing the player\'s imagination to fill what their eyes cannot see.',
      },
      {
        term: 'Haptic Feedback',
        definition:
          'Physical sensation feedback from game controllers — vibration, resistance, texture simulation. Modern controllers (PS5 DualSense) deliver directional haptics: feeling rain come from above, resistance in drawing a bow, the specific texture of surfaces. Haptic design is now a creative discipline equal to audio design in immersive games.',
      },
      {
        term: 'World Consistency',
        definition:
          "The degree to which a game world follows its own rules reliably. Players are remarkable at detecting inconsistency — a physics object that behaves differently from identical-looking objects, an enemy that ignores rules applied to all others, a door that works the opposite of every door they've opened. Inconsistency breaks the trance of presence faster than almost anything else.",
      },
    ],
    quiz: [
      {
        q: 'A game has excellent visuals but players describe it as "something feels off." The most likely cause is:',
        options: [
          'The framerate is too high',
          'Sensory incoherence — audio or haptic cues not matching visual presentation',
          'The story is too complex',
          'The game is too long',
        ],
        correct: 1,
        explanation: "Sensory incoherence produces a persistent feeling that something is wrong without conscious identification of the source. Audio that doesn't match visuals, haptics that don't match actions — these are detected subconsciously and erode immersion.",
      },
      {
        q: 'What is the primary emotional function of darkness in game design?',
        options: [
          'Reducing GPU load',
          'Signaling nighttime',
          'Activating the amygdala and forcing imagination to fill the unknown',
          'Hiding graphical limitations',
        ],
        correct: 2,
        explanation: "The amygdala responds strongly to the unknown. Darkness is the literal absence of information — the player's imagination fills it with threats, producing sustained dread more effectively than any monster design.",
      },
      {
        q: 'Procedural audio differs from pre-recorded audio in that it:',
        options: [
          'Sounds lower quality',
          'Cannot include music',
          'Adapts in real-time to game state without file dependencies',
          'Requires expensive hardware',
        ],
        correct: 2,
        explanation: 'Procedural audio is generated by code, allowing real-time adaptation to game state. A door sounds different based on what it is made of; combat music intensifies based on enemy proximity. This flexibility is impossible with pre-recorded files.',
      },
    ],
    content: `## Immersive Experience Design

Immersion is not a feature. It is a state the player enters when every signal they receive — visual, audio, haptic, spatial — consistently reinforces that the game world is real. It breaks not from single catastrophic failures but from accumulated small inconsistencies that the brain's pattern recognition detects without conscious articulation.

Designing for immersion means designing every sensory channel deliberately, then ensuring those channels agree with each other.

### Sound as Primary Immersion Architecture

Most designers think visually. Most players feel sonically. Sound is processed by older, deeper brain structures than vision — which is why a sudden noise can produce physical startle even in an experienced horror player who has seen the same visual ten times.

Sound does five things simultaneously in an immersive game:

**1. Environmental verisimilitude** — The world sounds like the world it claims to be. Footsteps change by surface. Wind behaves differently in open plains versus narrow corridors. Water reflects differently in stone chambers versus wooden rooms.

**2. Emotional tone management** — Music and ambient sound control the emotional register of the player at all times. Horror games use dissonant drones, silence, and binaural audio. RPG towns use warm, resolving harmonies. Combat tracks use percussion and sustained strings. The player should feel the genre shift when they enter a new space.

**3. Threat signaling** — The first warning of danger is almost always acoustic. A creak. A shifted breathing pattern. A musical phrase that resolves unexpectedly. Teaching the player to read audio cues creates genuine tension — they begin self-generating dread because they have learned to notice things.

**4. Reward amplification** — A satisfying sound effect makes every reward land 30% harder. The specific crunch of a satisfying hit. The shimmer of a level-up. The deep boom of a boss defeat. These sounds are not decorative — they are the actual delivery mechanism of the reward.

**5. Spatial orientation** — Directional audio tells the player where to look, where danger is coming from, and how large the space around them is. Echo and reverb communicate volume. Panning communicates direction. A player who hears an enemy before seeing it is already engaged — the visual encounter becomes confirmation of acoustic anticipation.

### Light as Storytelling

Lumic design is the art of using light to tell stories without words:

- **Amber, warm light** → safety, home, resolution (the inn at the end of a dungeon, the campfire)
- **Cold blue-green** → mystery, unease, the uncanny (underwater sequences, cursed environments)
- **Red** → danger, emergency, corruption (alarm states, corrupted magic)
- **Flickering** → instability, fragility, haunting (horror)
- **Stark white flash** → revelation, violence, impact (the moment of a critical hit, a truth revealed)
- **Darkness** → the unknown, fear, possibility (what the imagination fills in is always scarier than what you show)

### Environmental Feedback Loops

The environment must respond to player action. A world that does not change in response to the player is a museum — observed, not inhabited.

Minimum environmental responsiveness:
- Enemies react to proximity, sound, and player movement — not just line-of-sight
- Destructible elements that communicate physics (grass that bends, water that ripples, dust that settles)
- Ambient reactions to major player events (silence after a boss dies, world lighting shift after a story beat)
- NPCs that acknowledge what has happened (even minimally — looking up, moving away)

Maximum environmental responsiveness (for immersive sims and narrative games):
- World state persists across sessions — the fire you lit is still burning, the enemy you spared is still alive
- Faction relationships shift based on player history
- Environmental storytelling evolves — new objects appear, old ones are moved or destroyed
- The world behaves as if the player is not the center of it — events happen off-screen, systems run on their own schedules

### Building The Vault — An Immersion Audit

Using the dungeon crawler we built as a case study:

| Element | Current State | Immersion Impact |
|---------|---------------|-----------------|
| Floor tiles | Dark blue grid | Good — low visual noise keeps focus on entities |
| Enemy glow | Alpha circles | Good — subtle, non-intrusive, readable |
| Audio | Web Audio API procedural | Good — no file dependencies, genre-appropriate |
| Camera | Shake on hit, flash on damage | Good — physical feedback without controller |
| Boss death | Particle burst + camera shake | Good — reward amplified multimodally |
| Darkness | Limited — world is mostly lit | Opportunity — adding dark zones and light sources would escalate tension |
| Sound cues | Hit, death, loot | Opportunity — ambient dungeon audio would add dread |
| Environmental memory | None — world resets per floor | Opportunity — persistent element could deepen investment |

The current build has solid sensory coherence. Its next immersion layer would be ambient atmospheric audio and partial darkness zones to activate the dread mechanics the horror/survival genre relies on.`,
  },

  {
    id: 'gd-m08',
    track: 'gamedev',
    title: 'Building & Shipping Games',
    subtitle: 'From prototype to playable — the technical and creative pipeline',
    level: 'PhD',
    xp: 160,
    duration: 16,
    module: 8,
    certArea: 'Game Design & Development',
    keyTerms: [
      {
        term: 'Game Loop',
        definition:
          'The central cycle of a real-time game: process input → update state → render frame → repeat. In Phaser 3, this runs at 60fps by default. The update() method is called every frame. All game logic — movement, collision detection, AI, physics — executes within this loop. Understanding the game loop is prerequisite to debugging any performance or timing issue.',
      },
      {
        term: 'Scene Graph',
        definition:
          'A hierarchical data structure representing all objects in a game world and their spatial relationships. In Phaser, the Scene is the container — it holds sprites, physics bodies, cameras, and input handlers. Multiple scenes can run simultaneously (the UIScene overlaying GameScene in our dungeon crawler is an example of this pattern).',
      },
      {
        term: 'Physics Body',
        definition:
          'A mathematical representation of an object for physics simulation — its size, mass, velocity, and collision boundaries. In arcade physics (Phaser\'s lightweight physics system), bodies are axis-aligned boxes or circles that check for overlap and collision each frame. Understanding physics bodies is essential for diagnosing collision bugs.',
      },
      {
        term: 'Procedural Generation',
        definition:
          'Creating game content algorithmically at runtime rather than designing it manually. Our dungeon crawler generates new room layouts every floor using a BSP-inspired algorithm. Procedural generation enables infinite content variety from finite code, but requires careful constraint systems to ensure generated content is always playable.',
      },
      {
        term: 'Hot Module Replacement (HMR)',
        definition:
          'A development server feature that pushes code changes to the running game without requiring a full page reload. Vite\'s HMR updates the game immediately when source files change, dramatically accelerating the design-test iteration loop. The cost: not all state is preserved across HMR updates, sometimes requiring manual game restart.',
      },
    ],
    quiz: [
      {
        q: 'In Phaser 3, where should all per-frame game logic (movement, AI, collision checks) be placed?',
        options: ['create()', 'constructor()', 'update()', 'preload()'],
        correct: 2,
        explanation: 'update() is called every frame by the game loop. create() runs once on scene start. preload() runs before the scene for asset loading. Per-frame logic must be in update() to run continuously.',
      },
      {
        q: 'The dungeon crawler uses two simultaneous scenes (Game + UI). What is the primary design benefit of this pattern?',
        options: [
          'Better performance through parallel processing',
          'Clean separation of world-space gameplay from screen-space UI without scroll factor hacks',
          'Easier asset loading',
          'Required by Phaser for HUD rendering',
        ],
        correct: 1,
        explanation: 'Separating UI into its own scene means UI elements never scroll with the camera, never conflict with world physics, and can be updated independently. The UIScene listens to events from GameScene without coupling the two systems.',
      },
      {
        q: 'Procedural dungeon generation enables replayability by:',
        options: [
          'Reducing file size',
          'Creating unique layouts every run from algorithmic rules rather than fixed manual design',
          'Making development faster',
          'Improving collision accuracy',
        ],
        correct: 1,
        explanation: 'Procedural generation creates unique content at runtime from parameterized rules. Each floor of The Vault has a different room arrangement — same code, infinite layouts. This is the core replayability engine of roguelikes.',
      },
      {
        q: 'A player reports enemies passing through walls. The bug is most likely in:',
        options: ['The render system', 'The audio system', 'The physics body configuration or collider setup', 'The scene graph hierarchy'],
        correct: 2,
        explanation: 'Wall-clipping bugs are physics bugs. The enemy either lacks a physics body, the wall collider is not set up correctly, or the physics group configuration has an error. Start debugging by logging physics body sizes and checking that colliders reference the correct groups.',
      },
    ],
    content: `## Building & Shipping Games

Understanding why games work psychologically is table stakes. The other half of game design is understanding how games work technically — and building the taste to know when a technical limitation is a constraint to work around and when it is a creative constraint to lean into.

This module maps the technical pipeline through the lens of what we actually built in The Vault dungeon crawler.

### The Stack Decision

Every game starts with a stack decision. Ours:

| Choice | Reason |
|--------|--------|
| Phaser 3 | Mature 2D engine, arcade physics, procedural texture generation, camera effects, scene system |
| Vite | Fast dev server, HMR, zero config for ES modules |
| Web Audio API | Procedural sound without file dependencies — the game ships with zero assets |
| No external assets | Forces procedural generation competence; no attribution, no licensing, fast load |

The no-external-assets constraint was deliberately chosen. It is a design constraint that produced better engineering: every visual element had to be generated in code, which means every visual element is parameterized and programmable.

### The Game Loop in Practice

The Phaser game loop calls update() 60 times per second. Everything that moves, thinks, or reacts lives in update(). Our update() does:

1. Check if player is active (skip all logic if player is dead)
2. Read keyboard input (WASD for movement, arrows for shooting)
3. Calculate velocity vector and apply to player physics body
4. Update player glow position to follow player
5. Check shoot cooldown, fire bullet if shooting and cooldown elapsed
6. Chase player with all active enemies
7. Emit player position event for minimap

That is the complete game logic per frame. Simple is not primitive — it is disciplined. Every additional per-frame operation costs 1/60th of a second budget. Staying lean keeps the game smooth.

### Scene Architecture

The dungeon crawler uses two scenes running simultaneously:

**GameScene** — owns all gameplay: the dungeon, physics bodies, enemies, player, bullets, loot. Uses world-space coordinates that scroll with the camera.

**UIScene** — owns all interface: HP bar, score text, minimap, controls. Uses screen-space coordinates that never scroll. Listens to events emitted by GameScene.

This architecture is the right pattern for any game with a fixed HUD. The alternative — putting UI in the game scene with \`setScrollFactor(0)\` — works but couples UI to world-space logic in ways that create bugs and complicate camera work.

### Procedural Generation Principles

Our dungeon generator (BSP-inspired) follows these rules:

1. Place rooms randomly, constrained to grid boundaries with minimum separation
2. Sort rooms by position for consistent ordering
3. Connect adjacent rooms with L-shaped corridors
4. Mark the last room as the boss room
5. Return a tile grid (0=floor, 1=wall) and a room array

The critical insight about procedural generation: **guarantee playability, not balance**. A generated dungeon must always be completable — every room connected, no dead-ends that trap the player. Balance (difficulty, reward distribution) can be probabilistic and imperfect. Connectivity must be guaranteed.

### The Complete Shipping Pipeline for Web Games

1. **Local development** — Vite dev server + HMR for rapid iteration
2. **Test in target browser** — not a dev-tools preview; actual user behavior
3. **Build** — \`npm run build\` produces optimized static files in /dist
4. **Deploy** — static hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages)
5. **Domain** — custom domain via DNS configuration
6. **Analytics** — player session length, drop-off points, error rates

The Vault is currently at step 1–2. Steps 3–5 are one Vercel deploy command.

### What Makes a Game Shippable

A game is shippable when:
- It does not crash under any normal player path
- The tutorial (implicit or explicit) is learnable without instruction
- Every system the player interacts with has feedback (nothing happens silently)
- The first 60 seconds produce a clear win and a clear goal
- There is a clear endpoint or loop (the game knows when a session is complete)

The Vault is shippable. It has: immediate action clarity (shoot enemies, collect shards), a clear win condition (defeat the boss, take the portal), clear feedback on every action (sound, particles, camera effects), and a loop (each floor is a complete arc).

### Your Game Dev Stack — Built and Ready

| Tool | What It Does | Cost |
|------|-------------|------|
| Phaser 3 | 2D game engine | Free |
| Vite | Dev server + builder | Free |
| Web Audio API | Procedural sound | Free (browser native) |
| Vercel | Hosting + deploy | Free tier |
| GitHub | Version control | Free |
| Tiled (optional) | Level editor for manual maps | Free |
| Aseprite (optional) | Pixel art tool | $20 one-time |
| BFXR (optional) | Retro sound design | Free |

Total cost to build and ship a professional-quality 2D web game: $0–$20.`,
  },
]
