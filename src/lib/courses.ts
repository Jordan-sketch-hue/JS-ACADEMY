export type Level = 'Beginner' | 'Masters' | 'PhD' | 'Next-Gen AI'
export type Track = 'Marketing' | 'Technology' | 'Trading' | 'Business' | 'Design' | 'Mindset' | 'Creative' | 'Cross Cultures' | 'Need to Know' | 'Higher Self'

export interface Section {
  title: string
  content: string
  keyPoints?: string[]
}

export interface Course {
  id: string
  track: Track
  title: string
  subtitle: string
  duration: string
  level: Level
  xp: number
  sections: Section[]
}

export interface TrackGroup {
  track: Track
  subtitle: string
  icon: string
  courses: Course[]
}

export const COURSES: Course[] = [
  // ── MARKETING ──────────────────────────────────────────────────────────
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
    ],
  },
]

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
