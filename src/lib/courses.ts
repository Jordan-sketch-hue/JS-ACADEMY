import { MARKETING_COURSES } from './tracks/marketing'
import { TECHNOLOGY_COURSES } from './tracks/technology'
import { TRADING_COURSES } from './tracks/trading'
import { BUSINESS_COURSES } from './tracks/business'
import { DESIGN_COURSES } from './tracks/design'
import { MINDSET_COURSES } from './tracks/mindset'
import { CREATIVE_COURSES } from './tracks/creative'
import { CROSS_CULTURES_COURSES } from './tracks/cross-cultures'
import { NEED_TO_KNOW_COURSES } from './tracks/need-to-know'
import { HIGHER_SELF_COURSES } from './tracks/higher-self'

export type Level = 'Beginner' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'Marketing' | 'Technology' | 'Trading' | 'Business' | 'Design' | 'Mindset' | 'Creative' | 'Cross Cultures' | 'Need to Know' | 'Higher Self'

export interface Section {
  title: string
  content: string
  keyPoints?: readonly string[]
}

export interface Course {
  id: string
  track: Track
  title: string
  subtitle: string
  duration: string
  level: Level
  xp: number
  sections: readonly Section[]
}

export interface TrackGroup {
  track: Track
  subtitle: string
  icon: string
  courses: Course[]
}

export const COURSES: Course[] = [
  ...MARKETING_COURSES,
  ...TECHNOLOGY_COURSES,
  ...TRADING_COURSES,
  ...BUSINESS_COURSES,
  ...DESIGN_COURSES,
  ...MINDSET_COURSES,
  ...CREATIVE_COURSES,
  ...CROSS_CULTURES_COURSES,
  ...NEED_TO_KNOW_COURSES,
  ...HIGHER_SELF_COURSES,
] as unknown as Course[]

export const TRACK_META: Record<Track, { subtitle: string; icon: string }> = {
  'Marketing': { subtitle: 'Brand strategy, paid growth, content & positioning', icon: '📈' },
  'Technology': { subtitle: 'Full-stack, AI systems, architecture & automation', icon: '⚙️' },
  'Trading': { subtitle: 'SMC, VIX indices, risk models & execution', icon: '📊' },
  'Business': { subtitle: 'Operations, finance, strategy & leadership', icon: '💼' },
  'Design': { subtitle: 'Visual identity, UI/UX & brand systems', icon: '🎨' },
  'Mindset': { subtitle: 'Discipline, focus, decision-making & performance', icon: '🧠' },
  'Creative': { subtitle: 'Photography, videography, editing — vocabulary & direction skills to brief creatives like a pro', icon: '🎬' },
  'Cross Cultures': { subtitle: 'Cultural intelligence, global communication styles & navigating diverse environments', icon: '🌍' },
  'Need to Know': { subtitle: 'Essential concepts across law, finance, science, psychology & the world — the things sharp people just know', icon: '💡' },
  'Higher Self': { subtitle: 'Consciousness, spiritual philosophy, ego development & the long game of inner transformation', icon: '✨' },
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id)
}

export function getTrackGroups(): TrackGroup[] {
  const groups = new Map<Track, Course[]>()
  for (const course of COURSES) {
    if (!groups.has(course.track)) groups.set(course.track, [])
    groups.get(course.track)!.push(course)
  }
  return Array.from(groups.entries()).map(([track, courses]) => ({
    track,
    subtitle: TRACK_META[track].subtitle,
    icon: TRACK_META[track].icon,
    courses,
  }))
}
