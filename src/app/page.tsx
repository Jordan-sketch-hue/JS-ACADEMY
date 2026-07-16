'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { COURSES, TRACKS, LEVEL_COLORS, type Course, type Track } from '@/lib/courses'
import { getProgress, isCourseCompleted, levelName, xpToNextLevel, type UserProgress } from '@/lib/progress'
import { Clock, Play, CheckCircle, Flame, Trophy, BookOpen, Star, ChevronRight } from 'lucide-react'

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function LevelBadge({ level }: { level: string }) {
  const c = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] ?? { text: '#555', bg: '#f0f0ee' }
  return (
    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-[0.08em] uppercase flex-shrink-0"
      style={{ color: c.text, background: c.bg }}>{level}</span>
  )
}

function TrackCard({ track, courses }: { track: Track; courses: Course[] }) {
  const meta = TRACKS[track]
  const completed = courses.filter(c => isCourseCompleted(c.id)).length
  const total = courses.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const nextCourse = courses.find(c => !isCourseCompleted(c.id))

  return (
    <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
          <span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: meta.color }}>{meta.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400">{completed}/{total}</span>
          <Link href={`/tracks/${track}`} className="text-[10px] text-neutral-400 hover:text-neutral-600 flex items-center gap-0.5">
            View all <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* progress bar */}
      <div className="px-4 pt-2.5 pb-1">
        <div className="w-full bg-neutral-100 rounded h-1 overflow-hidden">
          <div className="h-full rounded transition-all duration-700" style={{ width: `${pct}%`, background: meta.color }} />
        </div>
        {pct === 100 && (
          <div className="text-[10px] mt-1.5 font-medium" style={{ color: meta.color }}>
            ✓ Track complete
          </div>
        )}
      </div>

      {/* completion outcome — shown when track is done */}
      {pct === 100 && (
        <div className="px-4 pb-3">
          <div className="text-[11px] text-neutral-500 leading-relaxed mt-1">{meta.completionOutcome}</div>
        </div>
      )}

      {/* next course to take */}
      {nextCourse && (
        <Link href={`/courses/${nextCourse.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-t border-neutral-50">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: meta.color }}>
            <Play size={9} className="text-white ml-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-[#0a0a0a] truncate">
              M{nextCourse.module} · {nextCourse.title}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-neutral-400 flex items-center gap-0.5"><Clock size={9} />{nextCourse.duration}m</span>
              <LevelBadge level={nextCourse.level} />
              <span className="text-[10px] font-medium" style={{ color: '#c9a84c' }}>+{nextCourse.xp} XP</span>
            </div>
          </div>
          <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
        </Link>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    const i = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(i)
  }, [])

  const completed = progress?.completedCourses.filter(c => c.completedAt).length ?? 0
  const xp = progress?.xp ?? 0
  const streak = progress?.streak ?? 0
  const level = progress?.level ?? 1
  const { pct } = xpToNextLevel(xp)

  const trackOrder: Track[] = [
    'marketing', 'tech', 'business', 'design', 'mindset',
    'creative', 'trading', 'culture', 'knowledge', 'future', 'psychology', 'higher',
  ]

  const trackCourses = trackOrder.map(track => ({
    track,
    courses: COURSES.filter(c => c.track === track).sort((a, b) => a.module - b.module),
  })).filter(t => t.courses.length > 0)

  const totalCourses = COURSES.filter(c => c.track !== 'language').length
  const totalXP = COURSES.filter(c => c.track !== 'language').reduce((s, c) => s + c.xp, 0)

  return (
    <Shell>
      <div className="p-4 md:p-5 space-y-4">

        {/* Hero */}
        <div className="bg-[#0a0a0a] rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white text-[15px] font-medium">Good {getTimeOfDay()}, Jordan.</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{totalCourses} modules across {trackOrder.length} tracks</div>
          </div>
          <div className="flex gap-4">
            {[
              { val: `${totalCourses}`, label: 'Modules' },
              { val: `+${(totalXP / 1000).toFixed(0)}k`, label: 'XP avail.' },
            ].map(({ val, label }) => (
              <div key={label} className="text-right">
                <div className="text-[#c9a84c] text-xl font-medium leading-none">{val}</div>
                <div className="text-[9px] text-neutral-600 tracking-[0.12em] uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Trophy, val: xp.toLocaleString(), label: 'XP', gold: true },
            { icon: Flame, val: streak || '—', label: 'Streak', gold: false },
            { icon: BookOpen, val: completed, label: 'Done', gold: false },
            { icon: Star, val: `L${level}`, label: levelName(level), gold: false },
          ].map(({ icon: Icon, val, label, gold }) => (
            <div key={label} className="bg-white border border-neutral-100 rounded-xl p-3 flex flex-col items-center text-center">
              <Icon size={14} className={gold ? 'text-[#c9a84c]' : 'text-neutral-300'} />
              <div className={`text-[15px] font-medium mt-1.5 leading-none ${gold ? 'text-[#c9a84c]' : 'text-[#0a0a0a]'}`}>{val}</div>
              <div className="text-[9px] text-neutral-400 mt-1 truncate w-full">{label}</div>
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div className="bg-white border border-neutral-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-[10px] text-neutral-400 flex-shrink-0">L{level}</span>
          <div className="flex-1 bg-neutral-100 rounded h-2 overflow-hidden">
            <div className="h-full bg-[#c9a84c] rounded transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-neutral-400 flex-shrink-0">{pct}% → L{level + 1}</span>
        </div>

        {/* Track cards */}
        <div className="space-y-3">
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400 px-0.5">Your tracks</div>
          {trackCourses.map(({ track, courses }) => (
            <TrackCard key={track} track={track} courses={courses} />
          ))}
        </div>

        {/* Language Lab CTA */}
        <Link href="/language"
          className="flex items-center gap-4 bg-white border border-neutral-100 rounded-xl px-4 py-3.5 hover:border-neutral-300 transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: TRACKS.language.bg }}>
            <span className="text-base">🌐</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-[#0a0a0a]">Language Lab</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">14 languages · Azure Neural voice coaching</div>
          </div>
          <ChevronRight size={14} className="text-neutral-300" />
        </Link>

      </div>
    </Shell>
  )
}
