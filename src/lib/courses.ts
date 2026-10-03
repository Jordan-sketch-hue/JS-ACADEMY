export type Level = 'Basic' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'marketing' | 'tech' | 'trading' | 'business' | 'design' | 'mindset' | 'creative' | 'culture' | 'knowledge' | 'future' | 'psychology' | 'higher' | 'language' | 'techco' | 'mktco' | 'gamedev' | 'crash' | 'terms' | 'cs-foundations' | 'software-eng' | 'networks-os' | 'consumer-psych' | 'marketing-science' | 'brand-strategy' | 'hci' | 'product-mgmt' | 'sales-mgmt'

export interface QuizQuestion {
  q: string
  options: string[]
  correct: number
  explanation: string
}

export interface IdeExercise {
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'python' | 'sql'
          | 'cpp' | 'rust' | 'go' | 'java' | 'kotlin' | 'swift' | 'r'
  task: string
  starterCode?: string
  solution?: string
  hints?: string[]
  files?: Array<{ name: string; code: string; language: string }>
}

export interface Course {
  id: string
  track: Track
  title: string
  subtitle: string
  level: Level
  xp: number
  duration: number
  module: number
  content: string
  keyTerms: { term: string; definition: string }[]
  quiz: QuizQuestion[]
  certArea?: string
  crashId?: string
  crashTitle?: string
  courseObjective?: string
  moduleObjective?: string
  ide?: IdeExercise
}

export const TRACKS: Record<Track, { label: string; color: string; bg: string; description: string; completionOutcome: string }> = {
  marketing: {
    label: 'Marketing',
    color: '#c9a84c',
    bg: '#fdf3dc',
    description: 'Brand strategy, paid growth, content & positioning',
    completionOutcome: "You'll be able to build a full acquisition funnel, brief a media buyer, write converting copy, and read attribution data without being misled by vanity metrics.",
  },
  'consumer-psych': {
    label: 'Consumer Psychology',
    color: '#b8902a',
    bg: '#fdf0d0',
    description: 'Cognitive biases, motivation, persuasion science, qualitative & quantitative research methods',
    completionOutcome: "You'll understand why consumers actually make decisions — the biases, emotions, social forces, and unconscious processes behind every purchase — and apply that knowledge to research, messaging, and strategy.",
  },
  'marketing-science': {
    label: 'Marketing Science',
    color: '#c4952a',
    bg: '#fdf2d8',
    description: 'Analytics, pricing, MMM, CLV modeling, CRO, PLG, email science & ROI frameworks',
    completionOutcome: "You'll approach marketing as a science — measuring, modeling, and optimizing with the rigor of a data scientist — from attribution and pricing strategy to CLV modeling and budget allocation.",
  },
  'brand-strategy': {
    label: 'Brand Strategy',
    color: '#a87a20',
    bg: '#fdefc8',
    description: 'Brand equity, positioning, identity systems, architecture, global strategy & crisis management',
    completionOutcome: "You'll build and manage brands like a senior brand strategist — positioning for competitive advantage, building identity systems that scale, managing equity across markets and over time, and connecting brand to financial outcomes.",
  },
  tech: {
    label: 'Technology',
    color: '#378add',
    bg: '#e6f1fb',
    description: 'Full-stack, AI systems, architecture & automation',
    completionOutcome: "You'll understand how modern software is actually built, how AI models work under the hood, and how to architect and automate systems without being dependent on developers for every decision.",
  },
  'cs-foundations': {
    label: 'CS Foundations',
    color: '#1a5fa8',
    bg: '#deeaf8',
    description: 'Algorithms, data structures, discrete math, OS theory, compilers & CS fundamentals',
    completionOutcome: "You'll have the theoretical computer science foundation that underpins everything you build — algorithms, complexity, systems theory, and the mental models that separate engineers who understand computing from those who only use tools.",
  },
  'software-eng': {
    label: 'Software Engineering',
    color: '#1e6bb5',
    bg: '#e2edf9',
    description: 'SOLID principles, design patterns, clean code, testing, architecture & engineering culture',
    completionOutcome: "You'll write and direct code with professional discipline — SOLID principles, design patterns, meaningful tests, clean architecture, and the engineering culture practices that separate high-performing teams from chaotic ones.",
  },
  'networks-os': {
    label: 'Networks & OS',
    color: '#2060a0',
    bg: '#dce8f6',
    description: 'TCP/IP, OS internals, Linux, cloud infrastructure, containers, SRE & systems engineering',
    completionOutcome: "You'll understand what actually happens beneath your application — the OS scheduling your threads, the TCP handshakes carrying your data, the Linux kernel you deploy on, and the reliability engineering practices that keep production alive.",
  },
  trading: {
    label: 'Trading',
    color: '#2d8a4e',
    bg: '#e6f4ec',
    description: 'SMC, VIX indices, risk models & execution',
    completionOutcome: "You'll be able to read price action using Smart Money Concepts, manage risk with a professional framework, and trade VIX indices with a documented, testable edge.",
  },
  business: {
    label: 'Business',
    color: '#9b4dca',
    bg: '#f3e8fd',
    description: 'Operations, finance, strategy & leadership',
    completionOutcome: "You'll be able to read financial statements, price for profit, build operational systems, lead a team, and think strategically across a 3-year horizon.",
  },
  design: {
    label: 'Design',
    color: '#e05c2a',
    bg: '#fdf0ea',
    description: 'Visual identity, UI/UX & brand systems',
    completionOutcome: "You'll be able to direct creative work with precision, brief designers like a creative director, build brand systems that scale, and evaluate design decisions against business objectives.",
  },
  mindset: {
    label: 'Mindset',
    color: '#555',
    bg: '#f5f5f3',
    description: 'Discipline, focus, decision-making & performance',
    completionOutcome: "You'll have a personal operating system built on systems over willpower, cognitive bias awareness, energy management, and a clearly articulated philosophy that guides decisions under pressure.",
  },
  creative: {
    label: 'Creative',
    color: '#b5451b',
    bg: '#fdf0ea',
    description: 'Photography, videography, editing Ã¢â‚¬â€ vocabulary & direction skills to brief creatives like a pro',
    completionOutcome: "You'll speak the language of photographers, videographers, and editors fluently Ã¢â‚¬â€ able to direct shoots, evaluate creative work, and brief a production team without needing to hold the camera yourself.",
  },
  culture: {
    label: 'Cross Cultures',
    color: '#1a7a6e',
    bg: '#e6f5f3',
    description: 'Cultural intelligence, global communication styles & navigating diverse environments',
    completionOutcome: "You'll navigate global business rooms with cultural fluency Ã¢â‚¬â€ reading unspoken rules, adjusting your register by context, and building trust across the cultural fault lines that derail most deals.",
  },
  knowledge: {
    label: 'Need to Know',
    color: '#6b3fa0',
    bg: '#f0eafd',
    description: 'Essential concepts across law, finance, science, psychology & the world Ã¢â‚¬â€ the things sharp people just know',
    completionOutcome: "You'll have the cross-domain literacy that distinguishes intellectually sovereign people Ã¢â‚¬â€ able to hold your own in rooms about law, economics, geopolitics, science, and markets without bluffing.",
  },
  future: {
    label: 'Future Systems',
    color: '#2456c4',
    bg: '#e8eefb',
    description: 'Law-making, lobbying, globalization, AI across every field & aligning with the tech-driven future',
    completionOutcome: "You'll understand the macro forces reshaping every industry Ã¢â‚¬â€ and be positioned to move with them rather than be displaced by them.",
  },
  psychology: {
    label: 'Psychology',
    color: '#b02a4c',
    bg: '#fdeaf0',
    description: 'How minds work Ã¢â‚¬â€ and how to recognise & defend against psychopaths, manipulators & toxic people',
    completionOutcome: "You'll understand the architecture of the human mind, recognise manipulation in real-time, identify dark triad personalities before they cause damage, and build genuine psychological resilience.",
  },
  higher: {
    label: 'Higher Self',
    color: '#7c3aed',
    bg: '#f3eeff',
    description: 'Self-actualisation, consciousness, mysticism & the inner architecture of a life lived at full potential',
    completionOutcome: "You'll have a working inner framework Ã¢â‚¬â€ drawn from philosophy, psychology, and contemplative tradition Ã¢â‚¬â€ for living with purpose, meeting difficulty with equanimity, and building a life that means something.",
  },
  language: {
    label: 'Language Lab',
    color: '#d4376e',
    bg: '#fde8ef',
    description: 'Mandarin, Spanish, French, German, Russian, Dutch & more Ã¢â‚¬â€ Basic to PhD with Azure Neural voice coaching',
    completionOutcome: "You'll have foundational to advanced command of your chosen language Ã¢â‚¬â€ with real pronunciation coaching, cultural context, and practical conversation ability that extends beyond the classroom.",
  },
  techco: {
    label: 'Run Your Tech Co.',
    color: '#0f7490',
    bg: '#e6f6fb',
    description: 'Product, engineering, hiring, infra, pricing & scaling Ã¢â‚¬â€ everything you need to actually operate a technology company',
    completionOutcome: "You'll have the operational, strategic, and technical knowledge to run a technology company without being dependent on advisors for every decision Ã¢â‚¬â€ from product roadmap to dev hiring to infrastructure to profitable scaling.",
  },
  mktco: {
    label: 'Run Your Marketing Co.',
    color: '#7b2fa0',
    bg: '#f4eafd',
    description: 'Client acquisition, delivery, team structure, pricing, retention & scaling a marketing agency or consultancy',
    completionOutcome: "You'll know how to price, acquire, deliver, retain, and scale a marketing company Ã¢â‚¬â€ from your first retainer client to a multi-brand agency with systematised delivery and a team that runs without you in every meeting.",
  },
  gamedev: {
    label: 'Game Design & Dev',
    color: '#00bcd4',
    bg: '#e0f7fa',
    description: 'Brain-mapped game design, POV mechanics, narrative, reward systems, immersive experience & building with Phaser 3',
    completionOutcome: "You'll understand how the human brain responds to games at a neurological level, design experiences mapped to specific emotional needs, build compelling narrative and reward systems, and ship a fully playable 2D game using modern web tools Ã¢â‚¬â€ with audio, procedural generation, and no external assets.",
  },
  crash: {
    label: 'Crash Courses',
    color: '#f59e0b',
    bg: '#fffbeb',
    description: 'Sprint-format mastery â€” 8 focused modules per language. JavaScript, HTML/CSS, TypeScript, React, Next.js, Tailwind, Supabase, PostgreSQL, REST APIs, Payload CMS.',
    completionOutcome: "You'll have sprint-certified mastery across ten core full-stack languages â€” each backed by 8 modules, a course objective, and a verifiable certification.",
  },
  terms: {
    label: 'Common Terms',
    color: '#0f172a',
    bg: '#f1f5f9',
    description: 'The vocabulary every operator, founder, and creator needs — decoded without the fluff',
    completionOutcome: "You'll command 200+ essential business, tech, marketing, finance, legal, ops, creative, AI, and global commerce terms — and recognise the jargon traps that make smart people sound confused.",
  },
  hci: {
    label: 'Human-Computer Interaction',
    color: '#6d28d9',
    bg: '#ede9fe',
    description: 'User research, usability, cognitive models, accessibility, interaction design & HCI theory',
    completionOutcome: "You'll design systems that match how people actually think and behave — grounded in cognitive science, usability research, and interaction design principles that separate frustrating products from exceptional ones.",
  },
  'product-mgmt': {
    label: 'Product Management',
    color: '#0891b2',
    bg: '#e0f2fe',
    description: 'Discovery, strategy, roadmapping, PMF, requirements, prioritisation, GTM & product leadership',
    completionOutcome: "You'll operate as a senior product manager — leading discovery, defining strategy, setting roadmaps, working with engineering, and measuring product success with the rigour of a principal PM at a growth-stage company.",
  },
  'sales-mgmt': {
    label: 'Sales Management',
    color: '#b45309',
    bg: '#fef3c7',
    description: 'Sales system design, buyer psychology, prospecting, discovery, closing, CRM, team structure, ABM, RevOps & sales culture',
    completionOutcome: "You'll design and operate a revenue system — not just sell — managing pipeline, coaching a team, forecasting accurately, building key account relationships, and creating the culture where great salespeople become exceptional ones.",
  },
}

export const LEVEL_COLORS: Record<Level, { text: string; bg: string }> = {
  Basic: { text: '#555', bg: '#f0f0ee' },
  Masters: { text: '#185fa5', bg: '#e6f1fb' },
  PhD: { text: '#7a5a1a', bg: '#fdf3dc' },
  'Next-Gen AI': { text: '#5c1d8a', bg: '#f3e8fd' },
}

import { marketingCourses } from './tracks/marketing'
import { csfCourses } from './tracks/cs-foundations'
import { sweCourses } from './tracks/software-eng'
import { nosCourses } from './tracks/networks-os'
import { cpsCourses } from './tracks/consumer-psych'
import { mscCourses } from './tracks/marketing-science'
import { bstCourses } from './tracks/brand-strategy'
import { creativeCourses } from './tracks/creative'
import { tradingCourses } from './tracks/trading'
import { techCourses } from './tracks/tech'
import { businessCourses } from './tracks/business'
import { designCourses } from './tracks/design'
import { mindsetCourses } from './tracks/mindset'
import { cultureCourses } from './tracks/culture'
import { knowledgeCourses } from './tracks/knowledge'
import { futureCourses } from './tracks/future'
import { psychologyCourses } from './tracks/psychology'
import { higherCourses } from './tracks/higher'
import { techcoCourses } from './tracks/techco'
import { mktcoCourses } from './tracks/mktco'
import { gamedevCourses } from './tracks/gamedev'
import { crashCourses } from './tracks/crash'
import { termsCourses } from './tracks/terms'
import { languageCoursesFull } from './tracks/language'
import { hciCourses } from './tracks/hci'
import { pmCourses } from './tracks/product-mgmt'
import { salesCourses } from './tracks/sales-mgmt'
// Language crash courses
import { crashPythonCourses } from './tracks/crash-python'
import { crashGoCourses } from './tracks/crash-go'
import { crashRustCourses } from './tracks/crash-rust'
import { crashCppCourses } from './tracks/crash-cpp'
import { crashJavaCourses } from './tracks/crash-java'
import { crashSwiftCourses } from './tracks/crash-swift'
import { crashRCourses } from './tracks/crash-r'
// Degree add-on crash courses
import { crashMarketingDegreeCourses } from './tracks/crash-marketing-degree'
import { crashCsDegreeCourses } from './tracks/crash-cs-degree'
// Interview prep crash courses
import { crashInterviewFrontendCourses } from './tracks/crash-interview-frontend'
import { crashInterviewBackendCourses } from './tracks/crash-interview-backend'
import { crashInterviewFullstackCourses } from './tracks/crash-interview-fullstack'
import { crashInterviewQaCourses } from './tracks/crash-interview-qa'
import { crashInterviewDataCourses } from './tracks/crash-interview-data'
import { crashInterviewSecurityCourses } from './tracks/crash-interview-security'

const languageCourses: Course[] = [
  {
    id: 'lang-mon',
    track: 'language',
    title: 'Language Lab Ã¢â‚¬â€ Romance Languages',
    subtitle: 'Spanish Ã‚Â· French Ã‚Â· Portuguese Ã‚Â· Italian Ã¢â‚¬â€ vocabulary, drills & Azure Neural pronunciation',
    level: 'Basic',
    xp: 50,
    duration: 25,
    module: 1,
    certArea: 'Language Mastery',
    content: 'LANGUAGE_LAB_REDIRECT',
    keyTerms: [],
    quiz: [],
  },
  {
    id: 'lang-tue',
    track: 'language',
    title: 'Language Lab Ã¢â‚¬â€ Asian Languages',
    subtitle: 'Mandarin Ã‚Â· Japanese Ã‚Â· Korean Ã‚Â· Hindi Ã¢â‚¬â€ tones, scripts & character drills',
    level: 'Basic',
    xp: 50,
    duration: 25,
    module: 2,
    certArea: 'Language Mastery',
    content: 'LANGUAGE_LAB_REDIRECT',
    keyTerms: [],
    quiz: [],
  },
  {
    id: 'lang-wed',
    track: 'language',
    title: 'Language Lab Ã¢â‚¬â€ Germanic & Slavic',
    subtitle: 'German Ã‚Â· Dutch Ã‚Â· Russian Ã‚Â· Polish Ã¢â‚¬â€ grammar patterns & pronunciation coaching',
    level: 'Basic',
    xp: 50,
    duration: 25,
    module: 3,
    certArea: 'Language Mastery',
    content: 'LANGUAGE_LAB_REDIRECT',
    keyTerms: [],
    quiz: [],
  },
  {
    id: 'lang-thu',
    track: 'language',
    title: 'Language Lab Ã¢â‚¬â€ Afro-Caribbean & Semitic',
    subtitle: 'Swahili Ã‚Â· Arabic Ã‚Â· Patois Ã‚Â· Haitian Creole Ã¢â‚¬â€ cultural context & oral fluency',
    level: 'Basic',
    xp: 50,
    duration: 25,
    module: 4,
    certArea: 'Language Mastery',
    content: 'LANGUAGE_LAB_REDIRECT',
    keyTerms: [],
    quiz: [],
  },
  {
    id: 'lang-gateway',
    track: 'language',
    title: 'Language Lab Ã¢â‚¬â€ Full Session (All 14)',
    subtitle: 'Mandarin, Spanish, French, German, Russian, Dutch, Japanese, Arabic, Portuguese, Italian, Korean, Hindi, Swahili, English Ã¢â‚¬â€ comprehensive review',
    level: 'Basic',
    xp: 80,
    duration: 30,
    module: 5,
    certArea: 'Language Mastery',
    content: 'LANGUAGE_LAB_REDIRECT',
    keyTerms: [],
    quiz: [],
  },
]

// Merged from all track files Ã¢â‚¬â€ old inline COURSES removed
export const COURSES: Course[] = [
  ...marketingCourses,
  ...cpsCourses,
  ...mscCourses,
  ...bstCourses,
  ...techCourses,
  ...csfCourses,
  ...sweCourses,
  ...nosCourses,
  ...tradingCourses,
  ...businessCourses,
  ...designCourses,
  ...mindsetCourses,
  ...creativeCourses,
  ...cultureCourses,
  ...knowledgeCourses,
  ...futureCourses,
  ...psychologyCourses,
  ...higherCourses,
  ...techcoCourses,
  ...mktcoCourses,
  ...gamedevCourses,
  ...languageCoursesFull,
  ...languageCourses, // keep 5 stub entries as fallback until language.ts resolves
  ...crashCourses,
  ...termsCourses,
  ...hciCourses,
  ...pmCourses,
  ...salesCourses,
  // Language crash courses
  ...crashPythonCourses,
  ...crashGoCourses,
  ...crashRustCourses,
  ...crashCppCourses,
  ...crashJavaCourses,
  ...crashSwiftCourses,
  ...crashRCourses,
  // Degree add-ons
  ...crashMarketingDegreeCourses,
  ...crashCsDegreeCourses,
  // Interview prep
  ...crashInterviewFrontendCourses,
  ...crashInterviewBackendCourses,
  ...crashInterviewFullstackCourses,
  ...crashInterviewQaCourses,
  ...crashInterviewDataCourses,
  ...crashInterviewSecurityCourses,
]


export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}

export function getAllTracks(): Track[] {
  return ['marketing', 'consumer-psych', 'marketing-science', 'brand-strategy', 'tech', 'cs-foundations', 'software-eng', 'networks-os', 'trading', 'business', 'design', 'mindset', 'creative', 'culture', 'knowledge', 'future', 'psychology', 'higher', 'techco', 'mktco', 'gamedev', 'language', 'crash', 'terms', 'hci', 'product-mgmt', 'sales-mgmt']
}

export function getCoursesByTrack(track: Track): Course[] {
  return COURSES.filter(c => c.track === track)
}

export function getCourseByModule(track: Track, module: number): Course | undefined {
  return COURSES.find(c => c.track === track && c.module === module)
}
