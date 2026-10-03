import type { Course } from '../courses'

export const hciCourses: Course[] = [
  {
    id: 'hci-m01',
    track: 'hci' as any,
    title: 'Foundations of HCI',
    subtitle: 'The discipline that turned computers from machines for experts into tools for everyone',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 1,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Human-Computer Interaction', definition: 'The interdisciplinary study of how people interact with computer systems, spanning cognitive science, design, and engineering to make interfaces usable, efficient, and satisfying.' },
      { term: 'Usability', definition: 'The degree to which a system can be used by specified users to achieve goals with effectiveness, efficiency, and satisfaction — the core measurable property HCI optimises for.' },
      { term: 'User Experience (UX)', definition: 'The holistic perception a person has while using a product — encompassing usability, aesthetics, emotional response, and meaning — broader than usability alone.' },
      { term: 'Affordance', definition: 'A quality of an object that signals how it can be used — a button affords pressing, a slider affords dragging. Poor affordances cause user error; good ones feel obvious.' },
      { term: 'WIMP Interface', definition: 'Windows, Icons, Menus, Pointer — the dominant desktop paradigm since Xerox PARC in 1973. Most modern interfaces are WIMP-based or derived from it.' },
    ],
    content: `## Foundations of HCI

Before graphical interfaces, computers required users to memorise commands, syntax, and cryptic abbreviations. A wrong keystroke crashed programs. Interfaces were designed for the machine's convenience, not the human's. Human-Computer Interaction emerged as a discipline to reverse that — to make the computer adapt to the human, not the other way around.

### Why HCI Matters

Bad interfaces cost real money. Studies consistently find that interface problems cause 50–80% of software project cost overruns — not through bad code, but through rework driven by unusable systems. Poor usability drives abandonment: a user who cannot find what they need in three interactions leaves and does not come back.

The inverse is also true. Amazon's 1-Click purchase removed one step from checkout and generated an estimated $2.4 billion in additional annual revenue. Google's search box — one field, two buttons — became the most used interface in history by removing every possible friction point.

### The History That Shaped Modern Interfaces

HCI as a formal discipline began at Xerox PARC in the 1970s, where researchers combined computer science with cognitive psychology to invent the graphical user interface, the desktop metaphor, and the mouse. Their Alto computer (1973) introduced windows, icons, menus, and a pointer — the WIMP paradigm that every desktop interface since has inherited.

Apple commercialised PARC's research with the Macintosh (1984). Microsoft followed with Windows. The web introduced hypertext navigation and forms. Touchscreens removed the pointer entirely, replacing it with gesture-based interaction. Voice interfaces (Siri, Alexa) removed the screen. Each transition required reconsidering every design assumption from the prior paradigm.

### The Three Pillars of HCI

**1. Understanding Users**

HCI starts with the recognition that users are not rational agents who read manuals. They are busy, distracted, operating under cognitive load, with varying mental models of how things work. A core HCI finding: users do not behave the way designers expect. This makes empirical research — watching real users use real interfaces — non-negotiable.

**2. Design**

Good interface design is not decoration. It is the application of principles about perception, cognition, and behaviour to make systems that support human goals. Visual hierarchy, feedback timing, error recovery, and workflow organisation are design decisions with measurable usability consequences.

**3. Evaluation**

Claims about interface quality require evidence. HCI developed a toolkit of evaluation methods: usability testing (watching users attempt tasks), heuristic evaluation (expert inspection against principles), A/B testing (comparing design variants on real users), and analytics (measuring actual behaviour at scale).

### The Shift from Usability to User Experience

Early HCI focused narrowly on usability: can users accomplish tasks without errors? The field expanded in the 1990s and 2000s to encompass User Experience — the full perceptual, cognitive, and emotional response to a product. Don Norman's *The Design of Everyday Things* (1988, revised 2013) is the canonical text bridging the two. Norman introduced concepts that now define the discipline: affordances, feedback, constraints, mapping, and the gulf of execution and evaluation.

The distinction matters practically. A product can be technically usable but feel frustrating, cold, or confusing. A product can be delightful to use despite minor inefficiencies. Both dimensions matter — efficiency for productivity tools, emotional resonance for consumer apps.

### HCI in a Practitioner's Toolkit

Whether you are building software, directing a design team, evaluating a product, or writing briefs — HCI gives you:
- **A vocabulary** for articulating interface problems precisely ("affordance mismatch" rather than "it looks wrong")
- **Evaluation criteria** to assess interfaces before they go to users
- **Research methods** to understand what users actually need
- **Design principles** that translate cognitive science into practical guidance

Understanding HCI doesn't require becoming a designer. It requires knowing enough to ask the right questions, identify real problems, and direct improvement with evidence rather than opinion.`,
    quiz: [
      {
        q: 'What was the primary paradigm introduced at Xerox PARC that still underpins most desktop interfaces?',
        options: ['Command-line interface', 'WIMP (Windows, Icons, Menus, Pointer)', 'Touch-based gesture navigation', 'Voice interaction'],
        correct: 1,
        explanation: 'Xerox PARC invented the WIMP paradigm in the early 1970s. It was commercialised by Apple and Microsoft and remains the dominant desktop interface model.',
      },
      {
        q: 'A button that looks 3D and raised is an example of what HCI concept?',
        options: ['Constraint', 'Affordance', 'Mental model', 'Feedback'],
        correct: 1,
        explanation: 'Affordance is a quality that signals how an object can be used. A raised, 3D button affords pressing — it visually communicates that it can be clicked.',
      },
      {
        q: 'Why did the field expand from usability to user experience?',
        options: ['Usability testing became too expensive', 'Users demanded prettier interfaces', 'Usability alone missed emotional and perceptual dimensions of product quality', 'Cognitive psychology research was discredited'],
        correct: 2,
        explanation: 'Usability measures task efficiency and error rates. User experience encompasses the full emotional, perceptual, and cognitive response — a product can be usable but frustrating, or inefficient but delightful.',
      },
      {
        q: 'What is the core practical argument for investing in interface usability?',
        options: ['Users prefer beautiful things', 'Poor interfaces cause abandonment and project cost overruns', 'Developers prefer clean code', 'Accessibility regulations require it'],
        correct: 1,
        explanation: 'Research shows 50–80% of software cost overruns stem from usability-driven rework, and poor usability directly drives user abandonment and lost revenue.',
      },
      {
        q: 'Which of these is NOT one of the three pillars of HCI?',
        options: ['Understanding users', 'Design', 'Evaluation', 'Programming languages'],
        correct: 3,
        explanation: 'The three pillars of HCI are understanding users (via research), design (applying principles), and evaluation (measuring outcomes). Programming language choice is an implementation concern, not an HCI pillar.',
      },
    ],
  },
  {
    id: 'hci-m02',
    track: 'hci' as any,
    title: 'Mental Models & Cognitive Load',
    subtitle: 'Why users misread interfaces — and how to design with the brain\'s actual architecture',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 2,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Mental Model', definition: 'A user\'s internal representation of how a system works — built from past experience and analogy, often incomplete or incorrect, but used to predict system behaviour.' },
      { term: 'Cognitive Load', definition: 'The total mental effort required to process information in working memory; HCI design aims to reduce extraneous cognitive load (from interface complexity) to free capacity for actual tasks.' },
      { term: 'Working Memory', definition: 'The cognitive system that holds and manipulates a limited amount of information (roughly 7 ± 2 items) for active use — the bottleneck that interface design must respect.' },
      { term: 'Hick\'s Law', definition: 'The time to make a decision increases with the number and complexity of choices — the cognitive basis for minimising unnecessary options in navigation and menus.' },
      { term: 'Gulf of Execution', definition: 'The gap between a user\'s intention and the available actions in an interface — large gulfs cause confusion about how to accomplish goals.' },
    ],
    content: `## Mental Models & Cognitive Load

Every user arrives at an interface with assumptions. They assume the app works like other apps they know. They assume the icons mean what they've seen elsewhere. They assume the navigation follows patterns they've learned. When those assumptions are wrong — when the interface violates their mental model — they make errors, feel frustrated, and often abandon the task.

HCI's fundamental insight about cognition is that designers cannot change how the human brain works. They can only design interfaces that align with it.

### How Mental Models Form

A mental model is a user's internal representation of how a system works. It is built through:
- **Experience with the current system** — using it, making errors, learning from them
- **Prior experience with similar systems** — the mental model of email applies to every new email client
- **Analogy and metaphor** — the desktop metaphor (files in folders, a trash can for deletions) imports understanding from the physical world

Mental models are almost never complete or accurate. Users operate on partial, often wrong models — and navigate successfully anyway, by recognising patterns that worked before.

**Design implication:** Match your system's actual model (how it really works) to users' expected mental model. Where they diverge, users will make systematic, predictable errors. These errors are not user failures — they are design failures.

The classic example: a user who types a URL into the Google search bar (rather than the address bar) is not wrong about how to access a website. They have learned that "typing something there takes you somewhere." The distinction between search and direct navigation is not obvious to non-technical users. Google's search handles both gracefully because it understands this mental model.

### Cognitive Architecture: What Designers Must Respect

**Working Memory** holds active information. It is limited — roughly 7 ± 2 items, though modern research suggests closer to 4 chunks for complex information. Interfaces that demand users hold many things in mind simultaneously overwhelm working memory, causing errors and frustration.

**Long-Term Memory** stores learned patterns, skills, and concepts. Good interfaces exploit long-term memory by following conventions users already know. Deviating from conventions (even to "innovate") forces users to learn new patterns — a working memory cost that only pays off if the new pattern is substantially better.

**Attention** is selective and limited. Users do not read interfaces — they scan. Eye-tracking studies show F-pattern or Z-pattern reading, with attention concentrated at the top-left and rapidly declining. Important information buried below the fold or in right-side columns is frequently missed.

### Cognitive Load in Practice

Cognitive load theory (Sweller, 1988) distinguishes three types:
1. **Intrinsic load** — the inherent complexity of the task itself
2. **Extraneous load** — complexity added by poor design (unclear labels, excessive options, inconsistent layouts)
3. **Germane load** — cognitive effort that builds useful mental models (good complexity that teaches)

Interface design's job is to minimise extraneous load. Intrinsic load is unavoidable — a tax filing form is genuinely complex. But a confusing layout, ambiguous labels, and unclear error messages add extraneous load on top of an already difficult task.

**Hick's Law** formalises one dimension: decision time grows logarithmically with the number of choices. A menu with 12 items takes measurably longer to navigate than one with 4 — even for experienced users. This is why great navigation systems (Google's homepage, Apple's product pages) are ruthlessly minimal.

### Gulf of Execution and Gulf of Evaluation

Don Norman introduced two critical gaps:

**Gulf of Execution:** The gap between what a user wants to do and the actions available. "I want to delete this item — how do I do that?" If the answer is not obvious, the gulf is large. Design closes this gap through clear affordances, visible controls, and progressive disclosure.

**Gulf of Evaluation:** The gap between what happened and what the user expected. "Did my action work? Was that a success or failure?" Design closes this through immediate, clear feedback — progress indicators, confirmation messages, error states that explain what went wrong.

Large gulfs in either direction produce the "I don't know what I'm doing and I don't know if it worked" experience that drives user abandonment.

### Designing for Cognitive Alignment

Practical principles that follow directly from cognitive science:

- **Reduce choices** at every decision point — Hick's Law is always operating
- **Follow conventions** — deviate only when the benefit dramatically outweighs the relearning cost
- **Make system state visible** — users need to always know where they are and what happened
- **Support recognition over recall** — users can recognise options more reliably than recall them from memory; keep commands visible rather than requiring memorisation
- **Design for error recovery** — users will make errors; interfaces must make correction obvious and easy`,
    quiz: [
      {
        q: 'A user tries to find the "send" button in a new email app and looks for an envelope icon, but the app uses a paper plane. This is an example of:',
        options: ['Cognitive overload', 'A mental model mismatch', 'Hick\'s Law in action', 'Working memory limitation'],
        correct: 1,
        explanation: 'The user\'s mental model (envelope = send) does not match the designer\'s conceptual model (paper plane = send). When interfaces violate expected mental models, users make predictable errors.',
      },
      {
        q: 'According to Hick\'s Law, what happens to decision time as menu options increase?',
        options: ['It decreases linearly', 'It stays constant', 'It increases logarithmically', 'It doubles with each option added'],
        correct: 2,
        explanation: 'Hick\'s Law states that decision time increases logarithmically with the number of options — each additional choice adds a smaller increment, but the total decision time consistently rises.',
      },
      {
        q: 'Which type of cognitive load should interface designers focus on minimising?',
        options: ['Intrinsic load', 'Extraneous load', 'Germane load', 'Working memory load'],
        correct: 1,
        explanation: 'Extraneous load is complexity added by poor design — confusing layout, ambiguous labels, unnecessary options. Intrinsic load is inherent to the task and cannot be removed; germane load builds useful understanding.',
      },
      {
        q: 'A user submits a form and receives no visual feedback — no confirmation, no error message. This is a large:',
        options: ['Gulf of execution', 'Gulf of evaluation', 'Mental model mismatch', 'Affordance violation'],
        correct: 1,
        explanation: 'The gulf of evaluation is the gap between what happened and what the user can perceive. No feedback means the user cannot tell if their action succeeded — a classic gulf of evaluation failure.',
      },
      {
        q: 'Why do good interfaces follow conventions even when the designer thinks they can improve on them?',
        options: ['Legal requirements mandate it', 'Following conventions exploits long-term memory patterns users already have, reducing cognitive load', 'Conventions are always better than new approaches', 'Users cannot learn new patterns'],
        correct: 1,
        explanation: 'Conventions work because users have already built mental models around them. Breaking conventions forces users to learn new patterns — an upfront cognitive cost that only pays off if the new pattern is substantially better.',
      },
    ],
  },
  {
    id: 'hci-m03',
    track: 'hci' as any,
    title: 'User Research Methods',
    subtitle: 'How to find out what users actually need — not what they say they need',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 3,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Contextual Inquiry', definition: 'A user research technique involving observation of users in their actual work environment while they perform real tasks — captures context that lab studies miss.' },
      { term: 'Think-Aloud Protocol', definition: 'A usability testing method where participants verbalize their thoughts while completing tasks, revealing mental models, expectations, and points of confusion in real time.' },
      { term: 'Task Analysis', definition: 'The systematic breakdown of how users accomplish goals — identifying subtasks, decision points, and tool interactions to inform interface design.' },
      { term: 'Persona', definition: 'A composite, research-based character representing a segment of users — their goals, behaviours, frustrations, and contexts — used to maintain user focus in design decisions.' },
      { term: 'Generative vs Evaluative Research', definition: 'Generative research discovers user needs and problems (done before design); evaluative research tests whether a design solution meets those needs (done during and after design).' },
    ],
    content: `## User Research Methods

The most common and expensive mistake in product development is building for an assumed user. Teams imagine users like themselves — technical, patient, motivated to learn the product. Real users are none of these things. They are pressed for time, operating under stress, using your product as a side task while doing something else, and they will not read documentation.

User research is the discipline of replacing assumptions with evidence. It does not guarantee good design — but it systematically eliminates the class of failures caused by building the wrong thing.

### The Two Modes of Research

**Generative research** is done before or during early design to understand user needs, contexts, mental models, and problems. It answers: What do users actually need? What are they trying to accomplish? What is their environment like? What frustrates them today?

**Evaluative research** is done with a design in hand to test whether it works. It answers: Can users accomplish tasks with this interface? Where do they get stuck? What did they misunderstand?

Both are required at different stages. Teams that skip generative research build elegant solutions to the wrong problems. Teams that skip evaluative research ship interfaces that look right but behave wrong.

### Core Research Methods

**Usability Testing** — Participants attempt realistic tasks on the interface while a facilitator observes. The think-aloud protocol (participants verbalise what they're thinking) reveals mental models in real time. Rule of thumb: 5 participants reveal 85% of usability problems. Testing does not need to be elaborate — a prototype on a laptop with 5 users over an afternoon generates actionable findings.

**Contextual Inquiry** — Researchers observe and interview users in their actual work environment while they perform real tasks. Lab studies miss context: the workarounds users have developed, the distractions they operate under, the tools they combine with your product. Contextual inquiry captures these. The AEIOU framework structures observation: Activities, Environments, Interactions, Objects, Users.

**Interviews** — Structured conversations to explore user needs, workflows, and mental models. Effective interviews use open-ended questions ("Walk me through how you do X") rather than closed ones ("Do you like X?"). The critical failure mode: asking about hypotheticals ("Would you use this feature?") — users are poor predictors of their own future behaviour. Ask about actual past behaviour instead.

**Surveys** — Quantitative data at scale. Useful for measuring attitudes and satisfaction (System Usability Scale, Net Promoter Score), segmenting users, and triangulating qualitative findings. The weakness: surveys measure what users say, not what they do. Always complement with observational methods.

**Diary Studies** — Participants log their experiences, thoughts, and activities over an extended period (days to weeks), capturing longitudinal patterns and natural context that single sessions miss. Used for understanding workflows that unfold over time.

**Card Sorting** — Participants group concepts or features into categories that make sense to them — used to design information architecture. Open card sorts reveal user mental models; closed card sorts evaluate whether a proposed structure matches user expectations.

**A/B Testing** — Randomised experiments comparing design variants on real users at scale. Measures behaviour (not preference) with statistical significance. Powerful for optimisation; requires large traffic volumes to detect meaningful differences.

### Synthesising Research into Action

Raw research data must be synthesised into design direction. Key synthesis tools:

**Affinity Diagramming** — Observations are written on individual notes and physically (or digitally) grouped into themes, revealing patterns that no single observation makes obvious.

**Personas** — Composite characters built from research, representing the range of users the design must serve. Effective personas include goals, frustrations, context, and a representative quote — they make the user visible in design discussions. The warning: personas built on demographic assumptions rather than research are useless or misleading.

**Journey Maps** — Visualisations of the user's experience across time as they accomplish a goal — including touchpoints, emotions, and pain points. Useful for identifying where the worst friction occurs and where design investment has the highest leverage.

**"How Might We" Statements** — Translating research findings into design challenges: "Users don't understand the pricing tiers" becomes "How might we make pricing differences immediately legible?" This reframes problems as opportunities and connects research to action.`,
    quiz: [
      {
        q: 'Why does contextual inquiry often reveal more than lab-based usability testing?',
        options: ['It is cheaper to run', 'It captures the actual work environment, interruptions, workarounds, and context that lab studies cannot reproduce', 'Users behave more naturally when recorded', 'It uses larger sample sizes'],
        correct: 1,
        explanation: 'Lab studies isolate the interface; contextual inquiry captures it in real conditions — the competing tools, interruptions, physical environment, and workarounds users have developed that shape how they actually use your product.',
      },
      {
        q: 'You ask a user "Would you use a feature that shows your spending trends over the last 12 months?" — what is the main problem with this question?',
        options: ['It is too long', 'Users are poor predictors of their own future behaviour; asking about hypotheticals yields unreliable data', 'It reveals too much about the product roadmap', 'It requires visual context to answer'],
        correct: 1,
        explanation: 'Hypothetical questions ("Would you use...") consistently overestimate usage. Users want to be helpful and imagine themselves as the ideal user. Ask about past behaviour instead: "How have you tracked your spending in the last year?"',
      },
      {
        q: 'What is the research-backed rule of thumb for how many participants reveal most usability problems?',
        options: ['3 participants', '5 participants', '20 participants', '50 participants'],
        correct: 1,
        explanation: 'Nielsen and Landauer\'s research found that 5 participants reveal approximately 85% of usability problems — making small-scale testing highly cost-effective compared to waiting for large samples.',
      },
      {
        q: 'A team is designing a new filing system. They present users with features written on cards and ask them to group the features into categories. This is:',
        options: ['A/B testing', 'A diary study', 'Card sorting', 'Contextual inquiry'],
        correct: 2,
        explanation: 'Card sorting reveals user mental models of how concepts should be organised — used to design information architecture and navigation structures that match how users naturally categorise things.',
      },
      {
        q: 'What is the difference between generative and evaluative research?',
        options: ['Generative uses qualitative methods; evaluative uses quantitative', 'Generative discovers what to build; evaluative tests whether what you built works', 'Generative is done with users; evaluative is done with experts', 'Generative is faster; evaluative is more reliable'],
        correct: 1,
        explanation: 'Generative research is done before/during early design to understand needs and context. Evaluative research tests whether a specific design solution meets those needs. Both are required at different stages.',
      },
    ],
  },
  {
    id: 'hci-m04',
    track: 'hci' as any,
    title: 'Usability Principles & Heuristics',
    subtitle: 'The ten rules that predict 85% of interface problems before a single user sees it',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 4,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Heuristic Evaluation', definition: 'An expert inspection method where evaluators assess an interface against a set of recognised usability principles (heuristics), identifying problems without requiring user testing.' },
      { term: 'Visibility of System Status', definition: 'Nielsen\'s first heuristic: the interface should always inform users about what is happening through appropriate feedback within reasonable time.' },
      { term: 'Error Prevention', definition: 'Designing interfaces to prevent problems from occurring in the first place — through confirmation dialogs, constraints, and sensible defaults — rather than just providing good error messages.' },
      { term: 'Recognition over Recall', definition: 'Making objects, actions, and options visible so users can recognise them, rather than requiring them to remember information from earlier in the interaction.' },
      { term: 'Fitts\'s Law', definition: 'The time to reach a target with a pointer increases with distance and decreases with target size — the basis for placing important controls where they are large and easily reachable.' },
    ],
    content: `## Usability Principles & Heuristics

Jakob Nielsen's ten usability heuristics, published in 1994, remain the most widely used framework for evaluating interfaces. They are called "heuristics" not because they are vague, but because they are rules of thumb derived from decades of usability research — practical enough to apply immediately, predictive enough to identify most interface problems before a single user sees the design.

A heuristic evaluation — one or more experts reviewing an interface against these principles — identifies 85% of usability problems in a fraction of the time and cost of user testing. It is not a replacement for testing with real users, but it eliminates preventable problems before they reach users.

### Nielsen's Ten Heuristics

**1. Visibility of System Status**
The interface always keeps users informed about what is going on through feedback within reasonable time. A loading spinner, a "Saved" confirmation, a progress bar during upload, a highlight showing the active menu item — these all communicate system state. Violations: no feedback after clicking a button, no progress indication during a slow operation, no confirmation that a form was submitted.

**2. Match Between System and Real World**
The interface uses language, concepts, and conventions familiar to users rather than system-oriented jargon. Error messages say "Your password must be at least 8 characters" not "INVALID_CREDENTIAL_LENGTH." Dates show in the user's format. File names follow user conventions. The system speaks the user's language.

**3. User Control and Freedom**
Users frequently make actions by mistake and need a clearly marked "emergency exit" — undo, cancel, back. The classic violation: no undo. Deleting a file, sending a message, or submitting a form should be undoable or at minimum confirmable. Gmail's "Send" delay with an Undo option is a textbook implementation of this heuristic.

**4. Consistency and Standards**
Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions. "Submit" in forms, "Save" for documents, "Post" for social content. Using "Upload" in one place and "Add" in another for the same action violates this heuristic and confuses users familiar with the former.

**5. Error Prevention**
Better than a good error message is a careful design that prevents a problem from occurring in the first place. Confirm dialogs for irreversible actions. Date pickers that only allow valid dates. Form fields that reject obviously invalid input in real time. Greyed-out buttons that become active only when all required fields are complete.

**6. Recognition Rather Than Recall**
Minimise the user's memory load by making objects, actions, and options visible. A user should not have to remember information from one part of the interface to use another. Icons with labels, visible navigation, persistent breadcrumbs, and command histories all support recognition over recall.

**7. Flexibility and Efficiency of Use**
Allow accelerators (keyboard shortcuts, gestures, macros) for expert users while keeping the basic interface accessible to novices. Most users start novice and become expert. Interfaces that cannot grow with the user force experts to work at novice speed forever.

**8. Aesthetic and Minimalist Design**
Every extra piece of information competes with and dilutes the relevant information. Interfaces should contain no irrelevant or rarely needed information. This is not about style — it is about cognitive load. Every unnecessary element demands attention and processing.

**9. Help Users Recognise, Diagnose, and Recover from Errors**
Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution. "Error 403" violates this heuristic. "You don't have permission to view this page — contact your administrator at admin@company.com" follows it.

**10. Help and Documentation**
Even though it is better if the system can be used without documentation, it may be necessary to provide help. Documentation should be easy to search, focused on the user's task, list concrete steps to carry out, and not be too large.

### Fitts's Law: The Physics of Pointing

Fitts's Law quantifies pointing time: it is proportional to the distance to a target and inversely proportional to the target's size. Implications:
- **Large targets are reached faster** — primary call-to-action buttons should be large
- **Screen corners are infinitely large** — a pointer stopped at a corner cannot overshoot; the Dock and Start Menu exploit this
- **Distance matters** — related controls should be physically close to the elements they affect
- **The "fat finger" problem** — touch targets must be at least 44×44 pixels (Apple guideline) to be reliably tappable

### Gestalt Principles in Interface Design

Gestalt psychology describes how humans perceive visual elements as organised wholes. The principles directly apply to layout:
- **Proximity** — elements near each other are perceived as related
- **Similarity** — elements that look alike are perceived as a group
- **Continuity** — the eye follows smooth paths over abrupt breaks
- **Closure** — the brain completes incomplete shapes
- **Figure-Ground** — the tendency to perceive some elements as foreground and others as background

Using these principles deliberately makes interfaces feel organised and logical. Violating them produces layouts that feel arbitrary and confusing even when all the information is present.`,
    quiz: [
      {
        q: 'A form submits silently — no confirmation message, no loading indicator, no result page. Which heuristic does this violate?',
        options: ['Error prevention', 'Visibility of system status', 'User control and freedom', 'Aesthetic and minimalist design'],
        correct: 1,
        explanation: 'Visibility of system status requires keeping users informed about what is happening. A silent form submission leaves the user with no way to know if the action succeeded or failed.',
      },
      {
        q: 'According to Fitts\'s Law, why do operating systems place primary actions like the Start Menu in screen corners?',
        options: ['They look better there', 'Screen corners are effectively infinite in size — a pointer cannot overshoot them', 'Users expect controls in corners', 'It reduces visual clutter elsewhere'],
        correct: 1,
        explanation: 'Fitts\'s Law: target size affects pointing time. A screen corner acts as an infinitely large target because the pointer stops at the boundary in both directions — making it the fastest target to hit.',
      },
      {
        q: 'A date picker only shows calendar dates and prevents typing an invalid date. This implements which heuristic?',
        options: ['Flexibility and efficiency of use', 'Consistency and standards', 'Error prevention', 'Recognition rather than recall'],
        correct: 2,
        explanation: 'Error prevention means designing to prevent problems before they occur. A date picker that structurally prevents invalid input is superior to one that allows it and then shows an error message.',
      },
      {
        q: 'On a form with 12 fields, the "Submit" button is greyed out. Which Gestalt principle best explains why users understand this button is inactive?',
        options: ['Proximity', 'Similarity', 'Figure-ground', 'Closure'],
        correct: 2,
        explanation: 'Figure-ground perception allows users to distinguish foreground (active, relevant) from background (inactive, less relevant) elements. A greyed button reads as "background" — inactive and not currently actionable.',
      },
      {
        q: 'Which heuristic is violated when a desktop app uses "Upload" in one screen and "Add File" in another for the same action?',
        options: ['Visibility of system status', 'Consistency and standards', 'Match between system and real world', 'Recognition rather than recall'],
        correct: 1,
        explanation: 'Consistency and standards requires that the same action has the same label throughout the interface. Using two different terms for the same action forces users to decide whether they mean the same thing — a cognitive cost with no benefit.',
      },
    ],
  },
  {
    id: 'hci-m05',
    track: 'hci' as any,
    title: 'Information Architecture',
    subtitle: 'Organising content so users can find what they need without thinking about how to find it',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 5,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Information Architecture (IA)', definition: 'The practice of organising, labelling, and structuring content to support usability and findability — how information is arranged, not how it looks.' },
      { term: 'Navigation Pattern', definition: 'A reusable structural model for moving between sections of a product — global navigation, local navigation, breadcrumbs, tabs, hamburger menus — each suited to different content scales and use patterns.' },
      { term: 'Taxonomy', definition: 'A classification system that groups content into hierarchical categories — the backbone of how a site or app organises its content space.' },
      { term: 'Wayfinding', definition: 'The process users employ to orient themselves and navigate toward their goals within an information space — supported by navigation, landmarks, breadcrumbs, and consistent layout.' },
      { term: 'Progressive Disclosure', definition: 'Presenting only the information users need for the current task, revealing complexity only as users advance — reduces cognitive load by hiding what is not yet relevant.' },
    ],
    content: `## Information Architecture

Information Architecture (IA) is the invisible skeleton of digital products. When it is done well, users navigate to what they need without thinking about how they got there. When it is wrong, users wander, backtrack, and eventually leave.

IA is not about visual design. It is about structure — how content is organised, how it is labelled, and how users can move through it. The same visual design on bad IA is still unusable. Great IA makes even average visual design navigable.

### The Core Problem IA Solves

Users do not browse products like they browse libraries. They arrive with a goal ("I need to change my billing address," "I want to find last month's invoices," "I need to cancel my subscription"). The IA's job is to support that goal with the fewest number of steps and the lowest cognitive load.

The fundamental tension: product teams organise information around their internal logic (teams, product lines, technical categories). Users organise information around their own tasks and mental models. These are rarely the same. Card sorting (covered in User Research) is the primary tool for bridging this gap.

### Taxonomy and Hierarchy

Most digital products organise content hierarchically — a tree structure with broad categories at the top that branch into increasingly specific subcategories. The key decisions:

**Breadth vs. depth:** A shallow, broad taxonomy (many items at top level) requires fewer clicks but more scanning. A deep, narrow taxonomy (few top-level items that branch deeply) requires more clicks but each choice is simpler. Research suggests users prefer shallower hierarchies — 3–4 items per level rather than 2–3 levels deep.

**Category naming:** Labels must match users' language, not the organisation's. "Account Management" may be internal terminology; users think "settings." Testing label comprehension is one of the highest-leverage IA research activities.

**Faceted classification:** Unlike strict hierarchies, faceted systems let users filter across multiple dimensions simultaneously (e-commerce: filter by colour, size, brand, price range all at once). More powerful for browsable content; unnecessary overhead for task-focused navigation.

### Navigation Patterns

**Global navigation** provides access to all major sections from anywhere in the product — typically a top navigation bar or persistent sidebar. It must answer: "Where am I? Where can I go?" at every moment.

**Local navigation** shows the structure within the current section — a sidebar menu in a settings panel, tabs within a content category. It handles the next level of hierarchy below global.

**Breadcrumbs** show the user's path through the hierarchy: Home > Account > Billing > Change Address. They support wayfinding and provide one-click returns to parent levels. Essential when users can enter the system from search (landing deep in the hierarchy without traversing the top).

**Contextual navigation** links to related content within the current page — "See also," related articles, next steps. It supports discovery and reduces dead ends.

**Search** is an alternative to navigation, not a substitute for it. Users who cannot find what they need through navigation will resort to search. A high search rate for basic content is a warning sign that IA is failing.

### Hamburger Menus and Mobile Navigation

The hamburger menu (≡) hides navigation behind a tap. Research consistently shows lower discoverability and engagement compared to visible tab bars. Yet mobile screens cannot always accommodate a full tab bar. The tradeoff:
- **Tab bars** (visible): higher discoverability, limited to 4–5 items
- **Hamburger menus**: more items, lower discovery, better for secondary navigation
- **Hybrid**: primary 4 items in tab bar, overflow in hamburger

Bottom navigation (tab bar at the screen bottom) is now the iOS and Material Design standard — it respects thumb reach zones.

### Progressive Disclosure

Progressive disclosure hides complexity until users need it. Advanced settings are collapsed behind "More options." Complex forms show only the relevant next step. Long content is truncated with a "Read more." This reduces cognitive load and avoids overwhelming novice users while keeping advanced functionality available.

The risk: burying frequently-needed options. Progressive disclosure requires research to establish which features are truly advanced versus which are routinely used.

### Content Audits and IA Review

Before redesigning IA, audit the existing content: what exists, how much of it there is, whether it is outdated, duplicated, or missing. A content audit creates the inventory IA is built around. Many IA problems are content problems — too much content competing for attention, no clear hierarchy in the content itself, missing bridging content that helps users move between sections.`,
    quiz: [
      {
        q: 'Users consistently cannot find the "Cancel Subscription" option despite it existing in the product. This is most likely a problem with:',
        options: ['Visual design', 'Information architecture — specifically labelling or hierarchy placement', 'Server performance', 'User research process'],
        correct: 1,
        explanation: 'Inability to find existing features is a classic IA problem — the feature is placed in a category that does not match users\' mental model, or labelled with terminology users do not recognise.',
      },
      {
        q: 'Card sorting is used to design information architecture because it reveals:',
        options: ['How users prefer things to look', 'What features users want', 'How users mentally group and categorise content', 'Which navigation patterns users prefer'],
        correct: 2,
        explanation: 'Card sorting has users physically group content labels into categories that make sense to them, revealing their mental models of how content should be organised — the basis for designing taxonomy and navigation.',
      },
      {
        q: 'Research shows users prefer navigation hierarchies that are:',
        options: ['Deep and narrow — few top-level items with many sublevels', 'Shallow and broad — more items per level with fewer levels', 'Alphabetically organised', 'Organised by department structure'],
        correct: 1,
        explanation: 'Research consistently shows users prefer shallower hierarchies — more items at each level — over deep structures requiring many clicks to reach content. Scanning 8 options is faster than navigating 4 levels.',
      },
      {
        q: 'What does a high site search rate for basic, primary content indicate?',
        options: ['Users prefer search over navigation', 'The search function is well-designed', 'The information architecture is likely failing — users cannot find primary content through navigation', 'Mobile users prefer search'],
        correct: 2,
        explanation: 'Search is a fallback, not a primary navigation pattern. When users frequently search for content that should be easily findable through navigation, it signals that the IA does not match their mental models.',
      },
      {
        q: 'Progressive disclosure is a technique for:',
        options: ['Showing all features to all users at once', 'Reducing cognitive load by presenting only the information needed for the current task', 'Improving search engine visibility', 'A/B testing navigation designs'],
        correct: 1,
        explanation: 'Progressive disclosure hides complexity until users need it — advanced options, detailed settings, long content — reducing cognitive load for the majority while keeping full functionality available.',
      },
    ],
  },
  {
    id: 'hci-m06',
    track: 'hci' as any,
    title: 'Interaction Design Patterns',
    subtitle: 'The reusable solutions that solve the recurring problems of digital interface design',
    level: 'Masters',
    xp: 150,
    duration: 14,
    module: 6,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Design Pattern', definition: 'A reusable solution to a recurring design problem in a given context — not a finished design but a template that shows how to solve a class of problems.' },
      { term: 'Modal Dialog', definition: 'A UI element that interrupts the current workflow requiring immediate user action before the underlying interface can be used — appropriate for critical decisions, inappropriate for routine tasks.' },
      { term: 'Onboarding Pattern', definition: 'A sequence of interface interactions designed to guide new users from first contact to first value, minimising the time-to-value and reducing early abandonment.' },
      { term: 'Form Design Patterns', definition: 'Established approaches for collecting user input — single-column layout, inline validation, clear labelling, logical grouping — derived from research into form abandonment and error rates.' },
      { term: 'Empty State', definition: 'The design of a screen when there is no content to display (new user, no results, error) — an empty state is a design opportunity to guide users toward action.' },
    ],
    content: `## Interaction Design Patterns

Design patterns in HCI are the equivalent of software design patterns in engineering: reusable solutions to recurring problems. They have been tested on millions of users, their trade-offs are understood, and they spare designers from rediscovering solutions to problems that have already been solved.

The value of patterns is not that they eliminate creativity — it is that they provide a starting point that users already understand. Deviating from patterns requires a reason proportional to the learning cost the deviation imposes.

### Core Interface Patterns

**Wizard / Step-by-Step**
For complex, multi-step processes (checkout, onboarding, account setup), wizards break the task into discrete steps with a visible progress indicator. Key principles: show step count ("Step 3 of 5"), allow backward navigation, save progress automatically, and confirm before abandoning a partially completed flow.

**Infinite Scroll vs. Pagination**
Infinite scroll (content loads automatically as the user scrolls) suits content-discovery contexts — social feeds, image galleries, news streams — where browsing is the goal. Pagination suits task-oriented contexts — search results, lists of records — where users need to re-find specific items and orient themselves within a bounded set. The mistake: applying infinite scroll to task-oriented interfaces because it feels modern.

**Modals and Dialogs**
Modals interrupt the current context to request a decision or display urgent information. Used appropriately: confirmation of irreversible actions, focused input forms, alerts requiring immediate attention. Overused: for promotional content, for secondary information users didn't ask for, for errors that don't require immediate action. Modal overuse is one of the most common and frustrating interface patterns.

**Tooltips and Popovers**
Tooltips (appear on hover) provide brief clarification for ambiguous controls. Popovers (click to reveal) show supplementary information without navigating away. Both require careful restraint — used for clarification, never to compensate for unclear primary labelling.

**Empty States**
Every interface has states where no content exists: a new user's dashboard, a search with no results, a deleted item. Empty states are a design opportunity, not an edge case. Good empty states explain what would normally appear, guide users toward the action that creates content, and reassure users that nothing is broken. Bad empty states show a blank screen or a cryptic "No items found."

### Form Design

Forms are where users give up most often. Research on form abandonment consistently identifies:
- **Too many fields** — each additional field drops completion rates. Ask only what is essential; collect the rest later.
- **Unclear labels** — labels must be above the field (not inside it, which disappears on focus), in plain language, consistently formatted
- **Inline validation** — validate as users type, not just on submit; catching errors early reduces frustration
- **Grouping** — related fields should be visually grouped; a wall of 15 equally-spaced fields is harder to process than three logical groups of five
- **Primary vs secondary actions** — "Submit" must be visually dominant; "Cancel" should be present but visually subordinate

The single most impactful form change in documented research: removing optional fields. If a field is optional, question whether it belongs at all.

### Onboarding Patterns

Onboarding is the transition from new user to activated user. The goal is minimising time-to-first-value — the moment the user gets a tangible benefit from the product. Common onboarding patterns:

**Product tour:** Highlights key features sequentially. Effective when there is a core set of features that determine success; ineffective when features vary by user type.

**Empty state onboarding:** The first-run empty state guides users toward their first action. Dropbox's first-empty-state says "Drag a file here" — the entire onboarding is one instruction.

**Progressive onboarding:** Features are introduced contextually when they become relevant to the user's actions, rather than upfront. Reduces overwhelm; requires careful trigger design.

**Checklist onboarding:** A persistent checklist of initial setup steps gives users a clear sense of progress and completion. LinkedIn's profile completion bar is the canonical example.

### Feedback and Microinteractions

Every user action should produce feedback. The types:
- **Immediate visual feedback** — button states (hover, active, disabled), form field focus states
- **Progress feedback** — loading indicators, progress bars, skeleton screens (placeholder layouts that appear before content loads)
- **Success/failure states** — confirmation messages, error states, undo prompts
- **Transition animations** — used to communicate spatial relationships and state changes; overuse slows users down

The principle: the delay between action and feedback must match the scale of the action. A click on a button must respond in under 100ms to feel instantaneous. A background process taking 30 seconds needs a progress indicator.`,
    quiz: [
      {
        q: 'Infinite scroll is appropriate for which type of content context?',
        options: ['Search results pages where users need to re-find specific items', 'Content discovery feeds where browsing is the goal', 'Account settings and configuration', 'Any long list of items'],
        correct: 1,
        explanation: 'Infinite scroll suits browsing/discovery contexts — social feeds, image galleries — where the user is exploring. It fails for task-oriented contexts where users need to re-find specific items, because there is no stable position reference.',
      },
      {
        q: 'What makes a modal dialog appropriate versus inappropriate?',
        options: ['Modals are always inappropriate — they interrupt users', 'Modals are appropriate for critical decisions and urgent alerts; inappropriate for promotional content or non-urgent secondary information', 'Modals should be used for all user decisions', 'Modals are only appropriate on mobile'],
        correct: 1,
        explanation: 'Modals are appropriate when the interruption is justified by urgency or irreversibility. They are overused as a pattern — particularly for promotional content or errors that do not require immediate action.',
      },
      {
        q: 'A new user\'s dashboard is blank. Which of these is the best empty state response?',
        options: ['Display a blank screen with only the navigation visible', 'Show "No items found" in grey text', 'Show what would normally appear here, explain how to create the first item, and provide a direct call-to-action', 'Redirect users to the documentation'],
        correct: 2,
        explanation: 'An empty state is a design opportunity to guide users toward their first action. The best empty states explain the context, reassure users, and provide a clear path to creating content.',
      },
      {
        q: 'Research on form abandonment consistently identifies which factor as having the highest impact?',
        options: ['Form colour and visual design', 'Number of fields — each additional field reduces completion rates', 'Presence of a progress indicator', 'Button placement'],
        correct: 1,
        explanation: 'Reducing optional fields is the single highest-impact form change in usability research. Each additional field has a cognitive and motivational cost. Asking only for what is essential dramatically improves completion rates.',
      },
      {
        q: 'What is the goal of "time-to-first-value" in onboarding design?',
        options: ['Showing users the most features as quickly as possible', 'Minimising the time before the user receives a tangible benefit from the product', 'Completing user setup before letting them use the product', 'Maximising time users spend in onboarding flows'],
        correct: 1,
        explanation: 'Time-to-first-value measures when the user first experiences the core benefit of the product. Minimising it reduces early abandonment — users who see value quickly are far more likely to continue.',
      },
    ],
  },
  {
    id: 'hci-m07',
    track: 'hci' as any,
    title: 'Prototyping & Testing',
    subtitle: 'Failing fast, learning cheaply — from paper sketches to A/B tests at scale',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 7,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Fidelity', definition: 'The degree to which a prototype resembles the final product — low-fidelity (paper sketches, wireframes) tests concepts quickly; high-fidelity (pixel-perfect, interactive) tests details accurately.' },
      { term: 'Prototype Fidelity Trade-off', definition: 'Low-fidelity prototypes are fast to build and invite honest feedback; high-fidelity prototypes test realistic interactions but take longer to build and may anchor users to surface details rather than concepts.' },
      { term: 'Formative vs Summative Testing', definition: 'Formative testing is done during development to improve design; summative testing is done at the end to evaluate whether a completed design meets requirements.' },
      { term: 'A/B Testing', definition: 'A randomised experiment comparing two design variants on real users; measures actual behaviour (not preference) with statistical significance over a large sample.' },
      { term: 'System Usability Scale (SUS)', definition: 'A standardised 10-item questionnaire measuring perceived usability on a 0–100 scale — widely used, validated, and allows comparison across systems. A score above 68 is considered above-average.' },
    ],
    content: `## Prototyping & Testing

The most expensive way to test a design idea is to build it fully, ship it, and measure the results. The cheapest way is to sketch it on paper and show it to five users before writing a line of code. Prototyping is the discipline of testing ideas at the lowest cost relative to the confidence you need.

### The Fidelity Spectrum

Prototypes exist on a spectrum from concept to product:

**Paper prototyping** — hand-drawn screens, sometimes with physical cut-outs that simulate interaction. Takes hours to create. Perfect for testing information architecture, navigation flows, and major layout concepts. Users readily provide honest feedback on rough sketches because they feel the design is not precious — it clearly invites change.

**Wireframes** — digital greyscale layouts showing structure, content hierarchy, and layout without visual design. Tools: Balsamiq (deliberately rough), Figma/Sketch (precise). Wireframes separate structural decisions from visual design decisions, preventing premature fixation on aesthetics.

**Interactive prototypes** — clickable wireframes or high-fidelity mockups that simulate navigation flows. Tools: Figma prototyping, InVision, ProtoPie. Test the actual interaction sequence — do users know where to click? Can they complete the task? — without requiring functional code.

**High-fidelity prototypes** — pixel-perfect designs that closely resemble the final product. Useful for testing fine-grained interactions, visual hierarchy, and microinteractions. Risk: users focus on visual details ("I don't like that font") rather than structural and conceptual issues.

**Coded prototypes** — working code, potentially with mocked data. Required for testing performance-sensitive interactions, specific animations, and technical feasibility.

The rule: use the lowest fidelity that can answer your current question. Testing whether users can navigate between sections? Paper. Testing whether a specific animation communicates state change? Coded prototype.

### Usability Testing Protocol

A basic usability test:

1. **Define tasks** — tasks must be realistic ("Find the most recent invoice") not instructions ("Click on Billing"). Tasks that reveal how users approach the interface rather than testing whether they can follow directions.

2. **Select participants** — 5 participants reveal 85% of usability problems in each round of testing. Match participants to the target user profile; generic "regular internet users" miss domain-specific mental models.

3. **Facilitate without leading** — the facilitator's job is to keep users thinking aloud, not to guide them to success. When users get stuck, wait. Ask "What are you thinking right now?" not "Can you see the button on the right?"

4. **Capture observations** — video (screen + audio + face), co-facilitator notes, or dedicated observation rooms. Record the number of users who failed each task, the failure point, and what they said when they failed.

5. **Analyse and prioritise** — affinity diagram failures, count frequency, assess severity. Severity = (frequency × impact). Fix high-severity problems first; minor polish issues can wait.

### Remote and Unmoderated Testing

Remote testing (participants in their own environments) broadens the geographic and demographic range and reduces the Hawthorne effect (behaviour change caused by being observed). Tools: Maze, UserTesting.com, Lookback. Unmoderated testing (participants complete tasks without a facilitator) scales to hundreds of participants but cannot probe unexpected behaviours.

### A/B Testing

A/B testing compares two variants (or more, in multivariate tests) on real users in production. Key requirements:

- **Sufficient traffic** — small samples produce statistically insignificant results. Rule of thumb: 1,000 users per variant to detect a 5% lift with 95% confidence.
- **One variable at a time** — changing multiple elements simultaneously makes attribution impossible.
- **Statistical significance** — do not call a winner early. Running tests until a result becomes significant (p-hacking) produces false positives.
- **Business metrics, not just UX metrics** — measuring click rates on a button is not enough if that button's clicks don't convert. Tie test metrics to revenue, activation, or retention.

### Standardised Measurement

**System Usability Scale (SUS)** — 10 alternating positive/negative statements rated 1–5. Scoring produces a 0–100 value. Above 68 is above average; below 51 is considered failing. SUS enables cross-system comparison and tracking improvement over time.

**Net Promoter Score (NPS)** — "How likely are you to recommend this product to a friend?" on a 0–10 scale. Promoters (9–10) minus Detractors (0–6) = NPS. Measures loyalty and word-of-mouth potential rather than usability directly.

**Task Completion Rate and Time on Task** — the most direct usability metrics. What percentage of users completed the task? How long did it take? These should improve with each design iteration.`,
    quiz: [
      {
        q: 'You need to test whether users can navigate between three major sections of a new app concept, and you have 2 days. What prototype fidelity is most appropriate?',
        options: ['High-fidelity Figma design', 'Coded prototype', 'Paper prototype or wireframe', 'Full product build'],
        correct: 2,
        explanation: 'Navigation and wayfinding questions can be answered with paper prototypes or wireframes — they are fast to create, invite honest structural feedback, and test the concept without investing in visual design or code.',
      },
      {
        q: 'During a usability test, a user gets stuck trying to find the settings page. You should:',
        options: ['Point them to the settings icon immediately to keep the test moving', 'Say "What are you thinking right now?" and wait', 'Tell them the location and explain the design decision', 'End the task and move to the next one'],
        correct: 1,
        explanation: 'A facilitator\'s job is to observe, not guide. Asking "What are you thinking right now?" keeps the user verbalising without leading them to the answer — which would prevent measuring the actual usability problem.',
      },
      {
        q: 'An A/B test shows Variant B has a 12% higher click rate than Variant A after 200 users. Should you call Variant B the winner?',
        options: ['Yes — 12% is a meaningful difference', 'No — 200 users per variant is insufficient to reach statistical significance for most conversion rate differences', 'Only if the test has run for 7 days', 'Yes, as long as both variants had equal exposure'],
        correct: 1,
        explanation: 'Statistical significance requires sufficient sample size. At 200 users per variant, the confidence interval is too wide to distinguish a real 12% lift from random variation. Rule of thumb: ~1,000 users per variant to detect a 5% lift at 95% confidence.',
      },
      {
        q: 'What is the System Usability Scale (SUS) used for?',
        options: ['Measuring the speed of an interface', 'A standardised questionnaire producing a 0–100 usability score for cross-system comparison', 'Counting how many errors users make', 'Testing information architecture through card sorting'],
        correct: 1,
        explanation: 'SUS is a validated 10-item questionnaire that produces a single usability score. Scores above 68 are above average; it enables tracking improvement across design iterations and comparing different systems.',
      },
      {
        q: 'A high-fidelity prototype is preferred over a paper prototype when:',
        options: ['You want to test the overall concept and structure', 'You need to test specific animations, microinteractions, or performance-sensitive interactions', 'You are in the earliest stages of design exploration', 'You want to encourage frank feedback on structural issues'],
        correct: 1,
        explanation: 'High-fidelity prototypes are appropriate when the question being tested requires close simulation of the final experience — specific animations, hover states, transition timing, or complex interaction sequences that low-fidelity prototypes cannot represent.',
      },
    ],
  },
  {
    id: 'hci-m08',
    track: 'hci' as any,
    title: 'Accessibility & Inclusive Design',
    subtitle: 'Building for the full range of human ability — not as a compliance checkbox but as a design standard',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 8,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'WCAG', definition: 'Web Content Accessibility Guidelines — the international standard (published by W3C) defining how to make web content accessible to people with disabilities, at three conformance levels: A, AA, and AAA.' },
      { term: 'Assistive Technology', definition: 'Hardware or software that helps people with disabilities use computers — screen readers (NVDA, JAWS, VoiceOver), switch access devices, voice control, screen magnifiers.' },
      { term: 'Screen Reader Compatibility', definition: 'The degree to which an interface can be used by screen readers that convert text and semantic HTML to audio or braille — requiring meaningful alt text, semantic markup, and logical reading order.' },
      { term: 'Colour Contrast Ratio', definition: 'The luminance difference between foreground text and background colour; WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text — insufficient contrast fails users with low vision and many standard displays.' },
      { term: 'Universal Design', definition: 'The design of products and environments to be usable by all people to the greatest extent possible, without the need for adaptation — the philosophical foundation behind inclusive design.' },
    ],
    content: `## Accessibility & Inclusive Design

Approximately 1 in 7 people worldwide has a disability. In the United States, the ADA mandates accessible digital products for regulated entities. In the UK, the Equality Act has the same effect. The EU Web Accessibility Directive applies to public sector bodies. Beyond compliance, inaccessible products exclude customers, create legal liability, and reflect a design failure.

The business case is clear. Apple's accessibility features — which began as disability accommodations — are now used by the majority of iPhone users. Captioned video was an accessibility feature; it is now standard. Large text was an accessibility feature; it is now preferred by ageing populations everywhere.

### Who Accessibility Affects

Disability categories relevant to interface design:

**Visual** — blindness (requires screen readers), low vision (requires magnification, high contrast), colour blindness (affects 8% of men; colour-only information is inaccessible).

**Motor/Physical** — inability to use a mouse, limited fine motor control, one-handed use, tremors. Requires keyboard navigation, larger touch targets, voice control support.

**Cognitive** — dyslexia, ADHD, memory impairments. Benefits from clear language, consistent layouts, reduced distractions, and error tolerance.

**Auditory** — deafness and hard-of-hearing. Requires captions for video and audio content.

**Situational disability** — a person without a disability who is temporarily impaired: holding a baby with one arm, in a loud environment, in bright sunlight, recovering from eye surgery. Accessibility features serve this vast population.

### WCAG: The Technical Standard

The Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2 define accessibility through four principles (POUR):

**Perceivable** — information must be presentable in ways all users can perceive:
- Text alternatives for all non-text content (alt text for images)
- Captions and transcripts for audio/video
- Content can be presented without losing information if colour, size, or visual formatting is unavailable
- Colour contrast: minimum 4.5:1 ratio for normal text at Level AA

**Operable** — users must be able to interact with all interface functionality:
- All functionality available via keyboard (no mouse required)
- No content that causes seizures (no flashing above 3Hz)
- Users have enough time to read and interact with content
- Skip navigation links let keyboard users bypass repetitive content

**Understandable** — information and operation must be understandable:
- Text is readable and understandable (appropriate reading level, language declaration)
- Pages appear and operate predictably
- Users are helped to avoid and correct mistakes (accessible error identification)

**Robust** — content must be robust enough to be interpreted by diverse user agents:
- Valid, semantic HTML that assistive technologies can parse
- Status messages programmatically determinable so screen readers can announce them

### Screen Readers and Semantic HTML

Screen readers (VoiceOver on macOS/iOS, NVDA and JAWS on Windows) convert page content to audio or braille. They navigate by semantic structure — headings, links, form labels, landmarks. An interface built with meaningless div elements and CSS-styled buttons is invisible to screen readers; it must be rebuilt with:

- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<h1>–<h6>`)
- Meaningful alt text on images (not "image1.jpg"; describes what the image conveys)
- Form labels programmatically associated with their inputs (`<label for="email">`)
- ARIA attributes where HTML semantics are insufficient (live regions for dynamic content, roles for custom widgets)
- Logical reading order in the DOM that matches visual order

### Colour and Contrast

Colour alone must never convey information — combine colour with shape, text, or pattern. Red error states must also have error text and an icon. Green success states must also have text confirmation.

Contrast ratios affect readability for low-vision users and in suboptimal conditions (outdoor screens, worn displays, print). Test contrast with automated tools (Colour Contrast Analyser, browser DevTools accessibility panels, Figma plugins like Colour Contrast Checker).

### Keyboard Navigation

All interactive elements must be reachable and operable via keyboard:
- Logical tab order (matches reading order)
- Visible focus indicators (not removed with `outline: none`)
- Focus management for dynamic content (modal opens, focus moves to modal; modal closes, focus returns to trigger)
- Custom keyboard interactions for complex widgets (arrow keys for menus, Escape to close)

### Testing for Accessibility

Automated tools (axe, Lighthouse, WAVE) catch approximately 30–40% of accessibility issues. The remainder require manual testing:
- **Keyboard-only navigation** — unplug or disable the mouse and navigate the entire application
- **Screen reader testing** — navigate with VoiceOver (macOS/iOS) or NVDA (Windows), verifying that all content is announced and all interactions work
- **Colour contrast audit** — verify all text meets WCAG AA minimum ratios
- **User testing with disabled users** — the highest-fidelity method; reveals issues that technical testing misses`,
    quiz: [
      {
        q: 'WCAG AA requires a minimum colour contrast ratio of what for normal body text?',
        options: ['2:1', '3:1', '4.5:1', '7:1'],
        correct: 2,
        explanation: 'WCAG 2.1 Level AA requires a minimum 4.5:1 contrast ratio for normal text (under 18pt/14pt bold) and 3:1 for large text. This ensures readability for users with low vision and in suboptimal viewing conditions.',
      },
      {
        q: 'A form uses a red border to indicate invalid fields but provides no text explanation of what is wrong. This fails which accessibility requirement?',
        options: ['Colour contrast', 'Colour alone as the sole information channel — must also include text describing the error', 'Keyboard navigation', 'ARIA landmark structure'],
        correct: 1,
        explanation: 'WCAG requires that information not be conveyed by colour alone. A user who is colour-blind may not perceive the red border; a screen reader user receives no information about the error from a colour change. Error text is required.',
      },
      {
        q: 'Automated accessibility tools like Lighthouse catch approximately what percentage of accessibility issues?',
        options: ['10–15%', '30–40%', '70–80%', '90–95%'],
        correct: 1,
        explanation: 'Research consistently shows automated tools catch 30–40% of accessibility issues. The majority require manual testing — keyboard navigation, screen reader evaluation, contrast auditing, and user testing with disabled users.',
      },
      {
        q: 'A modal dialog opens and the user\'s focus remains on the button that triggered it. This is an accessibility failure in:',
        options: ['Colour contrast', 'Focus management — focus should move to the modal on open and return to the trigger on close', 'Semantic HTML structure', 'ARIA labelling'],
        correct: 1,
        explanation: 'Focus management is a keyboard accessibility requirement. When a modal opens, focus must move into the modal so keyboard users can interact with it. When it closes, focus must return to the trigger element.',
      },
      {
        q: 'Why does WCAG specify that information must not be conveyed by colour alone?',
        options: ['Colour is unattractive in interfaces', 'Users with colour blindness (affecting ~8% of men) cannot perceive colour-only information', 'Colour increases cognitive load', 'Dark mode makes colours inconsistent'],
        correct: 1,
        explanation: 'Approximately 8% of men and 0.5% of women have colour vision deficiency — the most common form being red-green colour blindness. Colour-only signals (red = error, green = success) are invisible to these users.',
      },
    ],
  },
  {
    id: 'hci-m09',
    track: 'hci' as any,
    title: 'Mobile & Responsive Design',
    subtitle: 'Designing for small screens, touch input, and interrupted context — the constraints that produce better design',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 9,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Responsive Design', definition: 'A design approach where layout and content adapt to the user\'s device and screen size — typically implemented with CSS media queries, flexible grids, and fluid images.' },
      { term: 'Touch Target', definition: 'An interactive element on a touchscreen — must be at minimum 44×44 points (Apple) or 48×48dp (Google) to be reliably tappable; smaller targets cause frequent errors.' },
      { term: 'Thumb Zone', definition: 'The area of a mobile screen reachable by the thumb without repositioning the hand — primary actions should be in the comfortable zone (lower half of screen); secondary actions can be in the stretch zone (upper corners).' },
      { term: 'Mobile-First Design', definition: 'A design strategy that begins with the most constrained experience (small screen, touch, limited connectivity) and progressively enhances for larger screens — produces more focused, faster designs.' },
      { term: 'Progressive Web App (PWA)', definition: 'A web application that uses modern browser capabilities to deliver app-like experiences — offline functionality, home screen installation, push notifications — without requiring app store distribution.' },
    ],
    content: `## Mobile & Responsive Design

Mobile devices account for over 60% of global web traffic. In many markets (India, sub-Saharan Africa, Southeast Asia), mobile is the primary — and often only — digital access point. Designing for mobile is not a special case of web design. It is the primary design context, with desktop as the enhancement.

### The Constraints That Clarify Design

Mobile constraints — small screen, touch input, limited connectivity, interrupted usage — force design decisions that improve all interfaces:

**Small screens** force ruthless prioritisation. Every element on a mobile screen competes for limited space; non-essential content is eliminated. The discipline this imposes benefits desktop interfaces too.

**Touch input** changes the interaction model fundamentally. A finger is larger and less precise than a cursor; targets must be large and well-spaced. Hover states (which communicate affordance in cursor-based interfaces) do not exist in touch. Multi-touch gestures (pinch, swipe, long press) add interaction vocabulary.

**Variable connectivity** (3G, spotty Wi-Fi) demands performance optimisation and graceful degradation. Interfaces must function on slow connections, load essential content first, and fail gracefully when offline.

**Interrupted usage** means users frequently put the phone down mid-task and return later. State must be preserved; progress must be recoverable; tasks must not require continuous attention.

### Touch Target Design

Apple's Human Interface Guidelines specify 44×44 point minimum touch targets. Google's Material Design specifies 48×48dp. Research on touch accuracy shows that targets smaller than these sizes produce unacceptably high error rates — particularly for users with large fingers, motor impairments, or devices in motion.

Spacing between targets matters as much as size. Adjacent targets with insufficient spacing cause the wrong element to be activated. Rule of thumb: at least 8dp between interactive elements.

The implication for redesign: most desktop interfaces converted to mobile fail this requirement. Navigation items, small icon buttons, table row controls — all typically below 44px at desktop density.

### Thumb Zone Architecture

Steven Hoober's research on how users hold phones (2013, updated 2017) found:

- 75% of users hold their phone with one hand, using the thumb as the primary input
- The comfortable thumb reach zone is the lower 2/3 of the screen, centred
- Upper corners (the stretch zone) require repositioning the hand — reserved for secondary, less-frequently-used controls
- The far upper corners are the hardest to reach — avoid placing critical actions there

This is why iOS and Material Design both use bottom navigation bars for primary actions — they are in the most accessible thumb zone. It is also why Android's back button migrated from hardware to software to gesture — physical positions are not equally accessible.

### Mobile-First Design

Mobile-first is a design and development strategy: design the most constrained version (small screen, touch, slow connection) first, then enhance progressively for larger screens. Benefits:

- Forces identification of the essential content and actions
- Produces faster, cleaner interfaces (because non-essential content was removed, not hidden)
- Reveals layout structure before visual decoration

The alternative — "desktop-first" design that then gets squeezed into mobile — produces mobile layouts that are desktop designs with content hidden or reorganised, rather than interfaces built for mobile use patterns.

### Responsive Design Principles

**Breakpoints** define the screen widths at which the layout changes. Common breakpoints: 320px (small mobile), 375px (standard mobile), 768px (tablet), 1024px (laptop), 1440px+ (desktop). Design decisions at each breakpoint:

- Column count: mobile typically 1 column, tablet 2, desktop 3–4
- Navigation: mobile hamburger or bottom tab bar, desktop top navigation
- Font size: generally consistent (body text 16px on all devices), but heading scale adjusts
- Imagery: mobile images are narrower and may be cropped differently from desktop versions

**Fluid vs fixed:** Fluid layouts (percentage-based widths) adapt smoothly between breakpoints. Fixed layouts jump at breakpoint thresholds. Most modern designs use a combination — fluid columns with fixed padding and typography.

**Touch vs cursor:** interactive elements must meet touch target requirements even on responsive designs shown on mobile browsers. A CSS media query cannot detect whether the user is on a touchscreen; design for touch universally.

### Performance as UX

Load time is a primary mobile UX factor. Google research shows that for every additional second of load time, conversion rates drop by approximately 7%. For mobile:

- First Contentful Paint (FCP) — how quickly users see any content: target under 1.8 seconds
- Largest Contentful Paint (LCP) — how quickly the main content loads: target under 2.5 seconds
- Cumulative Layout Shift (CLS) — unexpected visual shifting during load: causes mis-taps on mobile

Performance optimisation is not solely a developer concern — design decisions (image sizes, number of font weights loaded, animation complexity) directly impact load time.`,
    quiz: [
      {
        q: 'Why should primary navigation actions be placed at the bottom of a mobile screen rather than the top?',
        options: ['It is more visually balanced', 'The thumb zone research shows the lower half of the screen is most easily reachable with one-handed use', 'The top is reserved for notifications', 'Bottom placement reduces scrolling'],
        correct: 1,
        explanation: 'Steven Hoober\'s thumb zone research found 75% of users hold phones with one hand. The comfortable thumb reach covers the lower two-thirds of the screen; upper corners are the hardest to reach. Primary actions placed at the bottom are accessible without hand repositioning.',
      },
      {
        q: 'What is the Apple guideline minimum for a touch target on iOS?',
        options: ['16×16 points', '32×32 points', '44×44 points', '60×60 points'],
        correct: 2,
        explanation: 'Apple\'s Human Interface Guidelines specify 44×44 points as the minimum touch target size to ensure reliably accurate tapping. Smaller targets cause unacceptably high error rates, particularly for users with motor impairments or in motion.',
      },
      {
        q: 'What does "mobile-first" design mean in practice?',
        options: ['Building the mobile app before the website', 'Designing for small screens and touch first, then progressively enhancing for larger screens', 'Ensuring the marketing site looks good on phones', 'Using a mobile prototype tool'],
        correct: 1,
        explanation: 'Mobile-first means starting with the most constrained context (small screen, touch, slow connection) and progressively enhancing — not squeezing desktop designs into mobile layouts. This forces prioritisation that produces cleaner designs at all sizes.',
      },
      {
        q: 'A responsive layout has a dense navigation menu at the top that works well on desktop. On mobile, users frequently tap the wrong item. The most likely cause is:',
        options: ['Users do not understand navigation', 'Touch targets are too small and insufficiently spaced for finger input', 'The navigation labels are too long', 'Mobile users prefer search over navigation'],
        correct: 1,
        explanation: 'Desktop navigation items are typically 24–32px in height — below the 44px minimum touch target. Dense menus with insufficient spacing between items cause frequent mis-taps on touch devices.',
      },
      {
        q: 'Google research shows conversion rates drop by approximately what amount for each additional second of mobile page load time?',
        options: ['1%', '3%', '7%', '15%'],
        correct: 2,
        explanation: 'Google research found approximately 7% conversion rate drop per additional second of load time. This makes performance a direct business metric, not a technical concern — and implicates design decisions (image sizes, font loading, animations) as business decisions.',
      },
    ],
  },
  {
    id: 'hci-m10',
    track: 'hci' as any,
    title: 'Persuasive Technology & Behavioural Design',
    subtitle: 'The science of designing for behaviour change — and the ethics of choosing to use it',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 10,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Persuasive Technology', definition: 'Technology designed to change attitudes or behaviours through persuasion and social influence, not coercion — coined by BJ Fogg at Stanford\'s Persuasive Technology Lab.' },
      { term: 'Dark Pattern', definition: 'A user interface design that tricks users into doing something they did not intend — subscribing to services, adding items to carts, sharing data — through deceptive or manipulative design.' },
      { term: 'Habit Loop', definition: 'The cue-routine-reward cycle through which habits form; products designed around habit loops (social media notifications, email) leverage this cycle to drive repeated, automatic usage.' },
      { term: 'Social Proof', definition: 'The tendency to conform to the actions of others when uncertain — implemented in interfaces as user counts, ratings, reviews, and "others are viewing this" notifications.' },
      { term: 'Nudge', definition: 'A design choice that predictably alters behaviour without restricting options — changing default settings, changing option order, or changing the physical environment — derived from behavioural economics.' },
    ],
    content: `## Persuasive Technology & Behavioural Design

Interfaces do not simply enable behaviour — they shape it. The choice of defaults, the framing of options, the timing of requests, and the structure of feedback all influence what users do. BJ Fogg's Persuasive Technology Lab at Stanford formalised this observation into a discipline: technology can reliably change behaviour through design.

This creates both opportunity and responsibility. The same mechanisms that help users develop healthy habits, save money, or exercise more are used by other products to drive compulsive usage, obscure cancellation paths, and extract data users did not intend to share.

### The Fogg Behaviour Model

Fogg's model: Behaviour = Motivation × Ability × Prompt (B=MAP).

A behaviour happens when motivation, ability, and a prompt converge at the same moment:
- **Motivation** — the desire to perform the behaviour (pleasure/pain, hope/fear, social acceptance/rejection)
- **Ability** — the ease of performing the behaviour (simpler = higher ability)
- **Prompt** — a trigger that cues the behaviour at the right moment

Design implication: increasing any of the three dimensions increases the probability of the target behaviour. Reducing friction (increasing ability) is often more effective than trying to increase motivation. A notification (prompt) at the moment someone is likely to be receptive converts far better than a promotional email blast.

### The Habit Loop in Product Design

Charles Duhigg's habit loop (cue → routine → reward) describes how habitual behaviour forms. Most high-engagement digital products are structured around this loop:

- **Cue (trigger):** notification, red badge, social interaction — something that draws attention
- **Routine (action):** opening the app, scrolling the feed, responding to the message
- **Reward (variable):** likes, messages, interesting content — variable rewards are more compelling than fixed rewards (slot machine effect)

Social media platforms are explicitly designed around variable reward schedules — the same mechanism that makes slot machines compelling. Each pull of the feed might produce a reward (interesting post, someone liked your photo) or nothing. This variability maximises engagement but also maximises compulsive checking behaviour.

### Nudges and Default Effects

Behavioural economics research has established that defaults have disproportionate influence on outcomes:
- Organ donation rates differ dramatically by country — countries where donation is the default (opt-out) have 90%+ participation; opt-in countries have 10–30%
- Default browser choices determine market share — most users never change their default browser
- Default privacy settings determine data exposure — the vast majority of users never read or change privacy settings

For designers: defaults are design decisions with ethical weight. Setting email marketing opt-in as default and making opt-out require clicking through a submenu is a dark pattern — technically legal in some jurisdictions, ethically indefensible.

### Dark Patterns

Harry Brignull coined the term "dark patterns" in 2010 to describe UI designs that trick users into unintended actions. Common examples:

**Roach motel** — easy to get in, hard to get out: subscribing takes one click; cancelling requires calling a phone number during business hours. Amazon Prime's cancellation flow became the canonical case study.

**Confirm-shaming** — shaming the user for not opting in: "No thanks, I hate saving money" as the decline option.

**Hidden costs** — adding charges (fees, taxes, extras) at the final checkout step after the user has invested time in the process.

**Disguised ads** — advertisements styled to look like editorial content or search results.

**Misdirection** — directing attention to one area while a consequential action occurs elsewhere.

Dark patterns are increasingly regulated. The EU's General Data Protection Regulation (GDPR) explicitly prohibits certain dark patterns in cookie consent. The FTC has published guidance on deceptive interface design. Several companies have faced regulatory action over cancellation dark patterns.

### Ethical Persuasive Design

The line between ethical persuasion and dark patterns:

**Ethical:** Designing to help users accomplish their stated goals. Making healthy defaults. Presenting information clearly. Using nudges to support user intention.

**Unethical:** Designing to accomplish the company's goals at the expense of user goals. Exploiting cognitive biases to extract actions users would not take if they thought carefully. Creating compulsion without value.

BJ Fogg's own position: persuasive technology is ethical when the designer and the user share the same goal. It is unethical when the designer's goal diverges from the user's goal and the design exploits that divergence.

The practical test: if the behaviour you are designing for would embarrass you if the user understood exactly how and why they were being prompted to do it, it is likely unethical.`,
    quiz: [
      {
        q: 'According to Fogg\'s Behaviour Model, what three factors must converge for a behaviour to occur?',
        options: ['Desire, knowledge, and technology', 'Motivation, ability, and a prompt', 'Habit, trigger, and reward', 'Persuasion, friction, and timing'],
        correct: 1,
        explanation: 'Fogg\'s B=MAP model: Behaviour happens when Motivation, Ability (ease), and a Prompt (trigger) are all present at the same moment. Increasing any dimension increases behaviour probability; removing the prompt means behaviours with high motivation and ability still don\'t happen.',
      },
      {
        q: 'Variable reward schedules (as used in social media feeds) produce what effect on user behaviour?',
        options: ['More predictable, rational usage patterns', 'Higher compulsive checking behaviour compared to fixed rewards', 'Higher user satisfaction with the product', 'More focused, intentional engagement'],
        correct: 1,
        explanation: 'Variable reward schedules — where the reward (interesting content, social validation) is unpredictable — are more compelling than fixed rewards. This is the mechanism behind slot machines and is deliberately used in social media product design to maximise engagement.',
      },
      {
        q: 'Organ donation opt-out countries have 90%+ participation; opt-in countries have 10–30%. This demonstrates which persuasive design principle?',
        options: ['Social proof', 'Scarcity principle', 'Default effects — defaults have disproportionate influence on outcomes', 'Variable reward schedules'],
        correct: 2,
        explanation: 'The organ donation example is the canonical demonstration of default effects. Most people never actively change defaults — making the default the decision for the vast majority. This applies equally to software defaults, consent forms, and privacy settings.',
      },
      {
        q: '"No thanks, I hate saving money" as the opt-out label for a promotional subscription is an example of which dark pattern?',
        options: ['Roach motel', 'Hidden costs', 'Confirm-shaming', 'Misdirection'],
        correct: 2,
        explanation: 'Confirm-shaming uses language that frames declining an option as negative or embarrassing, pressuring users into accepting something they might otherwise decline. It exploits social acceptability concerns to manipulate choice.',
      },
      {
        q: 'According to Fogg\'s ethical framework, persuasive technology is ethical when:',
        options: ['It increases product engagement metrics', 'The designer and the user share the same goal', 'The user does not notice the persuasive mechanism', 'Legal regulations permit the design pattern'],
        correct: 1,
        explanation: 'Fogg\'s ethical test: persuasion is ethical when it helps users accomplish their own goals. It is unethical when the designer\'s goal diverges from the user\'s and the design exploits cognitive biases to serve the designer\'s interest at the user\'s expense.',
      },
    ],
  },
  {
    id: 'hci-m11',
    track: 'hci' as any,
    title: 'Data-Driven UX',
    subtitle: 'Using analytics, heat maps, and funnel analysis to make interface decisions with evidence',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 11,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Funnel Analysis', definition: 'Tracking the percentage of users who complete each step in a multi-step flow (signup, checkout, onboarding) — identifying where the most users drop off and therefore where design improvement has the highest leverage.' },
      { term: 'Heat Map', definition: 'A visualisation of user interaction patterns — click maps (where users click), scroll maps (how far users scroll), and move maps (where users move the cursor) — revealing attention and engagement patterns.' },
      { term: 'Session Recording', definition: 'Recording individual user sessions (mouse movements, clicks, scrolls, form interactions) for playback — revealing the exact interaction patterns that aggregate data cannot show.' },
      { term: 'Cohort Analysis', definition: 'Tracking groups of users who started using a product in the same period over time, to measure retention, feature adoption, and long-term behaviour patterns.' },
      { term: 'North Star Metric', definition: 'The single metric that best captures the core value a product delivers to users — Airbnb: nights booked; Spotify: time listening; Slack: messages sent. Aligns product decisions around user value delivery.' },
    ],
    content: `## Data-Driven UX

Qualitative research reveals why users behave as they do; quantitative data shows how many users behave that way and what the consequences are for the business. Data-driven UX combines both — using analytics to identify where problems exist and where effort has the highest leverage, and qualitative methods to understand what is causing those problems and how to fix them.

### The Quantitative-Qualitative Gap

A common mistake: treating analytics as UX research. Analytics can tell you that 70% of users abandon the checkout flow at step 3. It cannot tell you why — whether users are confused by the address field, objecting to the shipping cost that appears there, being interrupted by a notification, or finding a competing site through a price comparison link on that page.

Quantitative data identifies the problem; qualitative research diagnoses its cause. Design decisions built on analytics alone tend to address symptoms, not causes — leading to endless A/B testing with marginal improvements rather than structural fixes.

### Core UX Analytics Techniques

**Funnel Analysis** tracks drop-off through multi-step flows. Every product has critical funnels: the signup funnel, the onboarding funnel, the purchase funnel, the feature adoption funnel. Measuring completion rates at each step reveals where friction is highest. A funnel analysis that shows 60% of users who start checkout abandon at the payment step is the most direct possible signal for design investigation priority.

Tools: Mixpanel, Amplitude, Google Analytics 4 events, product-specific analytics.

**Retention Curves** show what percentage of users who start using a product in a given period are still using it after N days. The shape of the retention curve reveals product health: a flat curve (stable long-term retention) is a good product; a curve that approaches zero means users are finding no lasting value. Most SaaS products consider Day 7 and Day 30 retention the critical metrics for early product-market fit.

**Cohort Analysis** groups users by acquisition period and tracks their retention or behaviour over time. Comparing cohorts reveals whether product improvements are increasing long-term retention, and whether specific acquisition channels produce users with different behaviour patterns.

**Heat Maps and Click Maps** visualise where users click, hover, and scroll. Useful for:
- Identifying elements users click that are not interactive (a non-linked image that looks clickable)
- Finding navigation elements that are ignored despite their prominence
- Measuring scroll depth — what percentage of users reach specific page sections
- Discovering content users engage with that is not highlighted by the current design

Tools: Hotjar, Microsoft Clarity (free), FullStory.

**Session Recordings** capture individual user sessions as video replays. Unlike aggregate data, recordings show the exact sequence of interactions — where users hover before clicking, when they encounter errors, how they navigate around confusing elements. The pattern analysis capability of modern session recording tools (Hotjar, FullStory) can surface common struggle patterns across thousands of recordings automatically.

### Defining and Using Metrics Correctly

**Vanity metrics** feel good but do not reflect product health or user value delivery: page views, total registered users, social media followers. They can increase while actual product health declines.

**Actionable metrics** connect to user value and business outcomes:
- **Daily Active Users (DAU) / Monthly Active Users (MAU)** — how many unique users are actually using the product
- **DAU/MAU ratio** — engagement depth; a ratio above 50% indicates a highly habitual product; below 10% indicates infrequent use
- **Feature adoption rate** — what percentage of users who could use a feature actually do
- **Task completion rate** — what percentage of users who attempt a critical task complete it
- **Time to value** — how long from signup to first meaningful usage of the core feature

**North Star Metric:** A single metric that best captures the core value the product delivers. LinkedIn: weekly active professional connections. Spotify: daily listening minutes. Slack: messages sent by users. The North Star Metric aligns all product decisions around user value delivery, not just growth.

### Combining Quant and Qual

The most effective UX improvement process:

1. Analytics identifies where drop-off, confusion, or non-adoption is highest (the where)
2. Session recordings and heat maps narrow the problem to specific interface elements (the approximately-where)
3. Usability testing with 5 users reveals the precise causes (the why)
4. Design changes address the diagnosed cause, not just the symptom
5. Analytics measures whether the change improved the target metric (validation)

This loop — measure, observe, investigate, fix, measure — is the engine of continuous UX improvement.`,
    quiz: [
      {
        q: 'Analytics show 70% of users abandon a checkout flow at step 3. What does this data tell you?',
        options: ['The payment form is confusing — redesign it', 'Users object to the price — lower it', 'Step 3 has the highest friction, but not why — qualitative research is needed to diagnose the cause', 'The checkout flow has too many steps'],
        correct: 2,
        explanation: 'Funnel drop-off data identifies where a problem exists, not why. 70% abandonment at step 3 signals a high-priority investigation area, but the cause requires qualitative research — usability testing, session recordings, user interviews — to identify.',
      },
      {
        q: 'A click map shows users frequently clicking a non-interactive image on a landing page. What does this suggest?',
        options: ['Users are accidentally clicking the image', 'The image has a visual affordance suggesting it is interactive — it should either be made interactive or redesigned', 'The page layout is too complex', 'Users want to zoom in on the image'],
        correct: 1,
        explanation: 'Users clicking non-interactive elements typically indicates the element looks interactive (has an affordance suggesting clickability). The design choice is: make it interactive (link, modal) or remove the affordance (change its visual treatment).',
      },
      {
        q: 'The North Star Metric for a product is best defined as:',
        options: ['The metric that generates the most positive press coverage', 'The single metric that best captures the core value the product delivers to users', 'The metric that is easiest to improve', 'The revenue metric the CFO prioritises'],
        correct: 1,
        explanation: 'The North Star Metric captures user value delivery — not just growth or revenue. Airbnb\'s North Star is nights booked because that directly measures users getting the core value (a place to stay). Revenue is a lagging indicator; NSM is a leading one.',
      },
      {
        q: 'A product has 100,000 registered users and 8,000 daily active users. The DAU/MAU ratio suggests:',
        options: ['The product is highly successful', 'The product has very high engagement', 'Low engagement — only 8% of users are active daily, indicating infrequent use', 'The product needs more users'],
        correct: 2,
        explanation: 'DAU/MAU below 10% indicates low engagement depth — most registered users rarely use the product. For reference: highly engaged products like Facebook have historically had DAU/MAU ratios above 50-65%.',
      },
      {
        q: 'What is the primary limitation of using analytics alone for UX decisions?',
        options: ['Analytics data is unreliable', 'Analytics identifies where problems occur but not why — diagnosis requires qualitative methods', 'Analytics only works on large traffic volumes', 'Analytics cannot measure mobile behaviour'],
        correct: 1,
        explanation: 'Analytics reveals patterns in what users do — drop-off points, click patterns, retention curves. It cannot reveal the reasoning, confusion, or motivation behind those behaviours. Design based only on analytics addresses symptoms; qualitative research is required to address causes.',
      },
    ],
  },
  {
    id: 'hci-m12',
    track: 'hci' as any,
    title: 'HCI in AI & Emerging Interfaces',
    subtitle: 'Conversational UI, voice, spatial computing, and the new design challenges of AI-mediated interaction',
    level: 'PhD',
    xp: 200,
    duration: 16,
    module: 12,
    certArea: 'Human-Computer Interaction',
    keyTerms: [
      { term: 'Conversational UI', definition: 'Interfaces where interaction occurs through natural language — chatbots, AI assistants, voice interfaces — requiring different design principles than visual GUI design.' },
      { term: 'Mixed Reality (XR)', definition: 'Spectrum of spatial computing experiences — Augmented Reality (AR) overlays digital content on the physical world; Virtual Reality (VR) replaces it; Mixed Reality blends both with interaction.' },
      { term: 'AI UX', definition: 'The design discipline addressing the unique challenges of AI-powered interfaces: uncertainty, unpredictability, explainability, appropriate trust calibration, and error recovery.' },
      { term: 'Explainability', definition: 'In AI systems, the ability to provide a comprehensible explanation of how or why a decision was made — essential for building appropriate user trust and enabling meaningful user control.' },
      { term: 'Trust Calibration', definition: 'Designing AI interfaces so users develop accurate expectations of the system\'s capabilities and limitations — neither over-trusting (automation bias) nor under-trusting (automation disuse).' },
    ],
    content: `## HCI in AI & Emerging Interfaces

For most of computing history, interfaces were deterministic: the same action produced the same result. Users could build accurate mental models because systems behaved consistently. AI changes this. Language models produce different outputs to the same prompt. Recommendation systems change behaviour based on inferred preferences. Autonomous systems make decisions with probabilities, not certainties.

This nondeterminism creates new HCI challenges that existing design frameworks do not fully address.

### Conversational User Interfaces

Chatbots and AI assistants replace graphical interfaces with natural language. The design space is fundamentally different:

**Discoverability fails.** In a GUI, all available actions are visible — users can scan a menu or button list. In a conversational UI, the action space is hidden — users must already know what to ask for. Design response: onboarding scripts that demonstrate capabilities, contextual suggestions (the "chips" in Google Assistant), and graceful handling of unexpected inputs.

**Error recovery changes.** A GUI error is a clear state — a red message, an unchanged form. A conversational UI error can be subtle — an AI response that is plausible but wrong, confidently delivered. Users trained by GUIs to expect clear error signals may not recognise AI errors. Design response: confidence indicators, explicit uncertainty acknowledgement, suggestions for rephrasing.

**Memory and context management.** Conversational interfaces must communicate what context they retain, how long they retain it, and when users need to re-establish context. This is a new design challenge with few established patterns.

**Personality and tone.** Conversational interfaces have implicit personality — the tone, vocabulary, and style of responses shapes user trust and engagement. Design decisions that appear stylistic (formal vs casual, verbose vs terse) have measurable UX effects.

### Voice Interface Design

Voice interfaces (Alexa, Siri, Google Assistant, voice navigation in cars) introduce constraints that screen-based design does not face:

**No visual feedback channel.** All state, all options, all confirmation must be communicated through audio. Long lists of options exceed working memory. The VUI (Voice User Interface) equivalent of a menu is a prompt — "Do you want to [A] or [B]?" — with typically two to three options maximum.

**Latency is expensive.** A 2-second delay in a GUI feels minor; in a conversation, it feels like an interruption. VUI systems must acknowledge user input within 200ms even if the full response requires more processing time.

**Errors are more disruptive.** Speech recognition errors (mishearing "flight to London" as "flight to Landen") are invisible to the user — they do not know an error occurred unless the system's response reveals it. VUI design requires explicit confirmation of high-stakes interpretations.

**Hands-free context.** The value of voice is in eyes-free, hands-free contexts (driving, cooking, exercising). Design must account for users who cannot look at a screen to verify or correct.

### Spatial Computing: AR and VR

Spatial computing interfaces (Apple Vision Pro, Meta Quest, AR glasses) place digital content in three-dimensional space. New design constraints:

**Spatial mapping:** Content placement must account for the physical environment. Fixed-position UI elements that sit in front of physical objects require sensors and dynamic repositioning. The concept of "above the fold" and "below the fold" has no direct spatial equivalent.

**Six degrees of freedom interaction:** Users can interact through gaze, voice, hand gestures, and physical movement — a richer input vocabulary than cursor and touch, but also more cognitively demanding to design consistently.

**Motion sickness (cybersickness):** VR interfaces with mismatched visual/vestibular signals cause physical discomfort. Design guidelines: stable reference frames, avoid accelerating the view independently of the user's head motion, ensure high and consistent frame rates.

**Physical ergonomics:** Extended XR use creates physical strain — hand position, head weight, eye focus. Design must consider usage duration and physical comfort alongside interaction design.

### AI Interface Design Challenges

**Automation bias and disuse:** Users tend to either over-trust AI systems (accepting recommendations without scrutiny) or under-trust them (ignoring recommendations even when the AI is more accurate). Design must calibrate trust appropriately — showing confidence levels, error history, explanation context.

**Explainability:** When an AI system makes a decision affecting a user — a loan rejection, a content recommendation, a diagnosis suggestion — users need to understand why. Black-box AI with no explanation violates the heuristic of visibility of system status at a deeper level — not just "what happened" but "why did it happen."

**Graceful degradation:** AI systems fail differently than rule-based systems. A rule-based system produces a clear error when a condition isn't met; an AI system produces a plausible-sounding wrong answer. Interfaces must design for AI failure modes — uncertainty acknowledgement, confidence indicators, easy pathways to human review.

**Privacy and consent in AI:** AI systems that learn from user behaviour, adapt their models, or share inferred characteristics create new consent design challenges. Users must be able to understand what data is used, provide or withdraw consent, and see the effect of their privacy choices.

### The Future of HCI

The trajectory of interface design is toward reduced friction and increased naturalness of interaction: from commands to GUIs, GUIs to touch, touch to voice and gesture, and now toward ambient computing where interfaces recede into the environment.

Each transition preserves the core HCI challenges: how do users form accurate mental models, how do they discover what is possible, how do they recover from errors, how do they maintain appropriate trust? These questions do not disappear with new paradigms — they become harder.`,
    quiz: [
      {
        q: 'What is the primary discoverability challenge in conversational interfaces compared to GUIs?',
        options: ['Conversational interfaces are slower to respond', 'In a GUI, all available actions are visible; in conversational UI, the action space is hidden — users must know what to ask for', 'Voice recognition errors are frequent', 'Conversational interfaces cannot handle complex tasks'],
        correct: 1,
        explanation: 'In a GUI, users can scan menus and button lists to discover available actions. In conversational UI, the action space is invisible — users cannot know what the system can do without prior knowledge or explicit demonstration. This fundamentally changes onboarding design.',
      },
      {
        q: 'A voice interface asks a user to confirm: "I heard: flight to London on Thursday, one passenger. Is that correct?" This design pattern addresses which voice UX challenge?',
        options: ['Reducing cognitive load on the user', 'Explicitly confirming high-stakes interpretations to catch speech recognition errors the user cannot otherwise detect', 'Keeping interactions brief', 'Improving voice recognition accuracy'],
        correct: 1,
        explanation: 'Speech recognition errors are invisible to users — they do not know a mishearing occurred unless the system\'s response reveals it. Explicitly confirming high-stakes interpretations ("I heard...") allows users to catch errors before acting on them.',
      },
      {
        q: 'Automation bias in AI interfaces refers to:',
        options: ['AI systems producing biased outputs', 'Users over-trusting AI recommendations — accepting them without sufficient scrutiny', 'AI interfaces being difficult to automate', 'Bias in training data'],
        correct: 1,
        explanation: 'Automation bias is the tendency for users to over-rely on automated system recommendations. Users accept AI suggestions without scrutiny even when they would otherwise question the same recommendation from a human. This is a UX trust calibration problem.',
      },
      {
        q: 'Why does motion sickness occur in VR, and what is the primary design mitigation?',
        options: ['It is caused by screen brightness; mitigated by dimming', 'It is caused by mismatch between visual and vestibular signals; mitigated by stable reference frames and high consistent frame rates', 'It is caused by low resolution; mitigated by higher pixel density', 'It is caused by social isolation in VR environments'],
        correct: 1,
        explanation: 'Cybersickness occurs when visual input (simulating movement) contradicts vestibular input (no physical movement). Mitigation: stable reference frames that do not move with the user\'s head, no artificial locomotion that doesn\'t match physical movement, and high/consistent frame rates to reduce prediction errors.',
      },
      {
        q: 'What does "explainability" mean in the context of AI UX design?',
        options: ['Providing clear documentation for the AI product', 'Making the codebase of the AI available to users', 'Enabling users to understand why an AI system made a particular decision, supporting appropriate trust and meaningful control', 'Explaining to users how to use the interface'],
        correct: 2,
        explanation: 'Explainability in AI UX addresses the need for users to understand AI decisions that affect them — a loan rejection, a content recommendation, a medical suggestion. Without explanation, users cannot evaluate the decision, build accurate trust, or meaningfully consent to AI-mediated choices.',
      },
    ],
  },
]
