export type Level = 'Basic' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'marketing' | 'tech' | 'trading' | 'business' | 'design' | 'mindset' | 'creative' | 'culture' | 'knowledge' | 'future' | 'psychology' | 'higher' | 'language' | 'techco' | 'mktco'

export interface QuizQuestion {
  q: string
  options: string[]
  correct: number
  explanation: string
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
}

export const TRACKS: Record<Track, { label: string; color: string; bg: string; description: string; completionOutcome: string }> = {
  marketing: {
    label: 'Marketing',
    color: '#c9a84c',
    bg: '#fdf3dc',
    description: 'Brand strategy, paid growth, content & positioning',
    completionOutcome: "You'll be able to build a full acquisition funnel, brief a media buyer, write converting copy, and read attribution data without being misled by vanity metrics.",
  },
  tech: {
    label: 'Technology',
    color: '#378add',
    bg: '#e6f1fb',
    description: 'Full-stack, AI systems, architecture & automation',
    completionOutcome: "You'll understand how modern software is actually built, how AI models work under the hood, and how to architect and automate systems without being dependent on developers for every decision.",
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
    description: 'Photography, videography, editing — vocabulary & direction skills to brief creatives like a pro',
    completionOutcome: "You'll speak the language of photographers, videographers, and editors fluently — able to direct shoots, evaluate creative work, and brief a production team without needing to hold the camera yourself.",
  },
  culture: {
    label: 'Cross Cultures',
    color: '#1a7a6e',
    bg: '#e6f5f3',
    description: 'Cultural intelligence, global communication styles & navigating diverse environments',
    completionOutcome: "You'll navigate global business rooms with cultural fluency — reading unspoken rules, adjusting your register by context, and building trust across the cultural fault lines that derail most deals.",
  },
  knowledge: {
    label: 'Need to Know',
    color: '#6b3fa0',
    bg: '#f0eafd',
    description: 'Essential concepts across law, finance, science, psychology & the world — the things sharp people just know',
    completionOutcome: "You'll have the cross-domain literacy that distinguishes intellectually sovereign people — able to hold your own in rooms about law, economics, geopolitics, science, and markets without bluffing.",
  },
  future: {
    label: 'Future Systems',
    color: '#2456c4',
    bg: '#e8eefb',
    description: 'Law-making, lobbying, globalization, AI across every field & aligning with the tech-driven future',
    completionOutcome: "You'll understand the macro forces reshaping every industry — and be positioned to move with them rather than be displaced by them.",
  },
  psychology: {
    label: 'Psychology',
    color: '#b02a4c',
    bg: '#fdeaf0',
    description: 'How minds work — and how to recognise & defend against psychopaths, manipulators & toxic people',
    completionOutcome: "You'll understand the architecture of the human mind, recognise manipulation in real-time, identify dark triad personalities before they cause damage, and build genuine psychological resilience.",
  },
  higher: {
    label: 'Higher Self',
    color: '#7c3aed',
    bg: '#f3eeff',
    description: 'Self-actualisation, consciousness, mysticism & the inner architecture of a life lived at full potential',
    completionOutcome: "You'll have a working inner framework — drawn from philosophy, psychology, and contemplative tradition — for living with purpose, meeting difficulty with equanimity, and building a life that means something.",
  },
  language: {
    label: 'Language Lab',
    color: '#d4376e',
    bg: '#fde8ef',
    description: 'Mandarin, Spanish, French, German, Russian, Dutch & more — Basic to PhD with Azure Neural voice coaching',
    completionOutcome: "You'll have foundational to advanced command of your chosen language — with real pronunciation coaching, cultural context, and practical conversation ability that extends beyond the classroom.",
  },
  techco: {
    label: 'Run Your Tech Co.',
    color: '#0f7490',
    bg: '#e6f6fb',
    description: 'Product, engineering, hiring, infra, pricing & scaling — everything you need to actually operate a technology company',
    completionOutcome: "You'll have the operational, strategic, and technical knowledge to run a technology company without being dependent on advisors for every decision — from product roadmap to dev hiring to infrastructure to profitable scaling.",
  },
  mktco: {
    label: 'Run Your Marketing Co.',
    color: '#7b2fa0',
    bg: '#f4eafd',
    description: 'Client acquisition, delivery, team structure, pricing, retention & scaling a marketing agency or consultancy',
    completionOutcome: "You'll know how to price, acquire, deliver, retain, and scale a marketing company — from your first retainer client to a multi-brand agency with systematised delivery and a team that runs without you in every meeting.",
  },
}

export const LEVEL_COLORS: Record<Level, { text: string; bg: string }> = {
  Basic: { text: '#555', bg: '#f0f0ee' },
  Masters: { text: '#185fa5', bg: '#e6f1fb' },
  PhD: { text: '#7a5a1a', bg: '#fdf3dc' },
  'Next-Gen AI': { text: '#5c1d8a', bg: '#f3e8fd' },
}

import { marketingCourses } from './tracks/marketing'
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
import { languageCoursesFull } from './tracks/language'

const languageCourses: Course[] = [
  {
    id: 'lang-mon',
    track: 'language',
    title: 'Language Lab — Romance Languages',
    subtitle: 'Spanish · French · Portuguese · Italian — vocabulary, drills & Azure Neural pronunciation',
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
    title: 'Language Lab — Asian Languages',
    subtitle: 'Mandarin · Japanese · Korean · Hindi — tones, scripts & character drills',
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
    title: 'Language Lab — Germanic & Slavic',
    subtitle: 'German · Dutch · Russian · Polish — grammar patterns & pronunciation coaching',
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
    title: 'Language Lab — Afro-Caribbean & Semitic',
    subtitle: 'Swahili · Arabic · Patois · Haitian Creole — cultural context & oral fluency',
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
    title: 'Language Lab — Full Session (All 14)',
    subtitle: 'Mandarin, Spanish, French, German, Russian, Dutch, Japanese, Arabic, Portuguese, Italian, Korean, Hindi, Swahili, English — comprehensive review',
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

// Merged from all track files — old inline COURSES removed
export const COURSES: Course[] = [
  ...marketingCourses,
  ...techCourses,
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
  ...languageCoursesFull,
  ...languageCourses, // keep 5 stub entries as fallback until language.ts resolves
]


export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}

export function getAllTracks(): Track[] {
  return ['marketing', 'tech', 'trading', 'business', 'design', 'mindset', 'creative', 'culture', 'knowledge', 'future', 'psychology', 'higher', 'techco', 'mktco', 'language']
}

export function getCoursesByTrack(track: Track): Course[] {
  return COURSES.filter(c => c.track === track)
}

export function getCourseByModule(track: Track, module: number): Course | undefined {
  return COURSES.find(c => c.track === track && c.module === module)
}
