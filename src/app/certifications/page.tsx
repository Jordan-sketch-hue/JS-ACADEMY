'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getProgress, type UserProgress } from '@/lib/progress'
import { COURSES, TRACKS, type Track, type Level } from '@/lib/courses'
import { downloadCertificate } from '@/lib/certificate'
import { Lock, CheckCircle, Download, Award } from 'lucide-react'

const LEVEL_RANK: Record<Level, number> = { Basic: 0, Masters: 1, PhD: 2, 'Next-Gen AI': 3 }

function highestLevel(levels: Level[]): Level {
  return levels.reduce((top, l) => (LEVEL_RANK[l] > LEVEL_RANK[top] ? l : top), levels[0])
}

interface CertCard {
  id: string
  title: string
  description: string
  color: string
  total: number
  done: number
  level: Level
  onDownload: () => void
}

function Cert({ card }: { card: CertCard }) {
  const earned = card.done === card.total && card.total > 0
  const pct = card.total > 0 ? Math.round((card.done / card.total) * 100) : 0
  return (
    <div className={`border rounded-xl p-5 transition-all ${earned ? 'border-neutral-200 bg-white shadow-sm' : 'border-neutral-100 bg-neutral-50'}`}>
      <div className="flex items-start justify-between mb-3">
        {earned
          ? <CheckCircle size={20} style={{ color: card.color }} />
          : <Lock size={18} className="text-neutral-300" />
        }
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ color: card.color, background: card.color + '18' }}>
          {card.level}
        </span>
      </div>
      <div className={`text-[13px] font-medium mb-1 leading-snug ${earned ? 'text-ink' : 'text-neutral-400'}`}>{card.title}</div>
      <div className="text-[10px] text-neutral-400 mb-3 line-clamp-2">{card.description}</div>

      {!earned && (
        <>
          <div className="bg-neutral-200 rounded-full h-1 overflow-hidden mb-1">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: card.color }} />
          </div>
          <div className="text-[10px] text-neutral-400">{card.done}/{card.total} modules</div>
        </>
      )}

      {earned && (
        <div className="mt-3 border-t border-neutral-100 pt-3 flex items-center justify-between">
          <span className="text-[10px] font-medium" style={{ color: card.color }}>Earned ✓</span>
          <button
            onClick={card.onDownload}
            className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-ink underline"
          >
            <Download size={11} /> Download
          </button>
        </div>
      )}
    </div>
  )
}

interface Section {
  label: string
  sublabel: string
  color: string
  cards: CertCard[]
}

const CRASH_SECTIONS: { label: string; sublabel: string; color: string; ids: string[] }[] = [
  {
    label: 'Web Dev Foundation',
    sublabel: 'HTML through Payload — the full JS stack',
    color: '#2563eb',
    ids: ['cc-html', 'cc-js', 'cc-ts', 'cc-react', 'cc-nextjs', 'cc-tailwind', 'cc-restapi', 'cc-postgres', 'cc-supabase', 'cc-payload'],
  },
  {
    label: 'Ship It',
    sublabel: 'Build → test → CI/CD → deploy',
    color: '#059669',
    ids: ['cc-ship-it'],
  },
  {
    label: 'Cloud & Infrastructure',
    sublabel: 'AWS from first principles',
    color: '#ea580c',
    ids: ['cc-aws'],
  },
  {
    label: 'Programming Languages',
    sublabel: 'Python, R, Java, Go, Swift, Rust, C++',
    color: '#b45309',
    ids: ['cc-python', 'cc-r', 'cc-java', 'cc-go', 'cc-swift', 'cc-rust', 'cc-cpp'],
  },
  {
    label: 'Degree Add-Ons',
    sublabel: 'CS theory and marketing strategy — fills the degree gap',
    color: '#64748b',
    ids: ['cc-cs-degree', 'cc-mktg-degree'],
  },
  {
    label: 'Interview Prep',
    sublabel: 'Role-specific interview readiness',
    color: '#0f172a',
    ids: ['cc-interview-frontend', 'cc-interview-fullstack', 'cc-interview-backend', 'cc-interview-qa', 'cc-interview-data', 'cc-interview-security'],
  },
]

const TRACK_SECTIONS: { label: string; sublabel: string; tracks: Track[] }[] = [
  {
    label: 'Business & Marketing',
    sublabel: 'Strategy, growth, brand and analytics',
    tracks: ['marketing', 'consumer-psych', 'marketing-science', 'brand-strategy', 'business', 'trading', 'techco', 'mktco', 'sales-mgmt'],
  },
  {
    label: 'Technology',
    sublabel: 'Software engineering, CS foundations, and systems',
    tracks: ['tech', 'cs-foundations', 'software-eng', 'networks-os', 'hci', 'product-mgmt', 'gamedev'],
  },
  {
    label: 'Creative & Culture',
    sublabel: 'Design, creativity, and cultural intelligence',
    tracks: ['design', 'creative', 'culture', 'higher'],
  },
  {
    label: 'Personal Development',
    sublabel: 'Mindset, psychology, knowledge, and the future',
    tracks: ['mindset', 'psychology', 'knowledge', 'future'],
  },
  {
    label: 'Reference & Foundations',
    sublabel: 'Core terminology and domain vocabulary',
    tracks: ['terms'],
  },
]

export default function CertificationsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    const i = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(i)
  }, [])

  if (!progress) return <Shell><div className="p-8 text-neutral-400">Loading…</div></Shell>

  const completedIds = new Set(progress.completedCourses.filter(c => c.completedAt).map(c => c.courseId))

  // Build crash cert cards
  function makeCrashCard(cid: string, color: string): CertCard | null {
    const mods = COURSES.filter(c => c.crashId === cid)
    if (!mods.length) return null
    const first = mods[0]
    const done = mods.filter(m => completedIds.has(m.id)).length
    const level = highestLevel(mods.map(m => m.level))
    return {
      id: cid,
      title: `${first.crashTitle} Certification`,
      description: first.courseObjective ?? '',
      color,
      total: mods.length,
      done,
      level,
      onDownload: () => downloadCertificate({ title: `${first.crashTitle} Certification`, track: first.crashTitle ?? cid, level }),
    }
  }

  // Build track cert cards
  function makeTrackCard(track: Track): CertCard | null {
    const meta = TRACKS[track]
    const courses = COURSES.filter(c => c.track === track)
    if (!courses.length) return null
    const done = courses.filter(c => completedIds.has(c.id)).length
    const level = highestLevel(courses.map(c => c.level))
    return {
      id: track,
      title: `${meta.label} Certification`,
      description: meta.completionOutcome,
      color: meta.color,
      total: courses.length,
      done,
      level,
      onDownload: () => downloadCertificate({ title: `${meta.label} Certification`, track: meta.label, level }),
    }
  }

  const crashSections: Section[] = CRASH_SECTIONS.map(s => ({
    label: s.label,
    sublabel: s.sublabel,
    color: s.color,
    cards: s.ids.map(id => makeCrashCard(id, s.color)).filter(Boolean) as CertCard[],
  })).filter(s => s.cards.length > 0)

  const trackSections: Section[] = TRACK_SECTIONS.map(s => ({
    label: s.label,
    sublabel: s.sublabel,
    color: TRACKS[s.tracks[0]]?.color ?? '#888',
    cards: s.tracks.map(t => makeTrackCard(t)).filter(Boolean) as CertCard[],
  })).filter(s => s.cards.length > 0)

  const allCards = [...crashSections, ...trackSections].flatMap(s => s.cards)
  const totalEarned = allCards.filter(c => c.done === c.total && c.total > 0).length
  const totalCerts = allCards.length

  return (
    <Shell>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award size={16} className="text-amber-500" />
          <div>
            <div className="text-[13px] font-medium text-ink">Certifications</div>
            <div className="text-[11px] text-neutral-400">Complete every module in a course to earn its certificate</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[18px] font-semibold text-ink">{totalEarned}<span className="text-neutral-300 font-normal">/{totalCerts}</span></div>
          <div className="text-[10px] text-neutral-400">earned</div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        {/* Crash Course Certs */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-neutral-400 mb-1">Crash Courses</div>
          <div className="text-[11px] text-neutral-400 mb-6">One certificate per crash course — complete all modules to earn it</div>
          <div className="space-y-8">
            {crashSections.map(section => (
              <div key={section.label}>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ background: section.color }}
                  >
                    {section.label}
                  </div>
                  <div className="flex-1 h-px" style={{ background: section.color, opacity: 0.15 }} />
                </div>
                <p className="text-[11px] text-neutral-400 mb-4 pl-0.5">{section.sublabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.cards.map(card => <Cert key={card.id} card={card} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-100" />

        {/* Track Certs */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-neutral-400 mb-1">Full Tracks</div>
          <div className="text-[11px] text-neutral-400 mb-6">Complete every module in a track to earn that track&rsquo;s certificate</div>
          <div className="space-y-8">
            {trackSections.map(section => (
              <div key={section.label}>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ background: section.color }}
                  >
                    {section.label}
                  </div>
                  <div className="flex-1 h-px" style={{ background: section.color, opacity: 0.15 }} />
                </div>
                <p className="text-[11px] text-neutral-400 mb-4 pl-0.5">{section.sublabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.cards.map(card => <Cert key={card.id} card={card} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
