'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getProgress, levelName, xpToNextLevel, type UserProgress } from '@/lib/progress'
import { COURSES, TRACKS } from '@/lib/courses'
import { Trophy, Flame, Star, BookOpen, Target, Zap } from 'lucide-react'

const BADGES = [
  { id: 'first', label: 'First step', desc: 'Complete your first course', icon: Star, req: (p: UserProgress) => p.completedCourses.filter(c => c.completedAt).length >= 1 },
  { id: 'streak3', label: '3-day streak', desc: 'Learn 3 days in a row', icon: Flame, req: (p: UserProgress) => p.streak >= 3 },
  { id: 'streak7', label: 'Week warrior', desc: '7-day learning streak', icon: Flame, req: (p: UserProgress) => p.streak >= 7 },
  { id: 'xp500', label: '500 XP', desc: 'Earn your first 500 XP', icon: Zap, req: (p: UserProgress) => p.xp >= 500 },
  { id: 'xp1000', label: '1K XP', desc: 'Reach 1,000 XP', icon: Zap, req: (p: UserProgress) => p.xp >= 1000 },
  { id: 'allday', label: 'Full day', desc: 'Complete all courses in a day', icon: Target, req: (p: UserProgress) => {
    const dayGroups: Record<string, number> = {}
    COURSES.filter(c => c.weekNumber === 1).forEach(c => { dayGroups[c.dayOfWeek] = (dayGroups[c.dayOfWeek] ?? 0) + 1 })
    return Object.values(dayGroups).some(count => {
      const doneForDay = p.completedCourses.filter(cp => cp.completedAt && COURSES.find(c => c.id === cp.courseId)?.dayOfWeek !== undefined).length
      return doneForDay >= count
    })
  }},
  { id: 'mkt', label: 'Marketer', desc: 'Complete 2 marketing courses', icon: BookOpen, req: (p: UserProgress) => p.completedCourses.filter(cp => cp.completedAt && COURSES.find(c => c.id === cp.courseId)?.track === 'marketing').length >= 2 },
  { id: 'trd', label: 'Trader', desc: 'Complete 2 trading courses', icon: BookOpen, req: (p: UserProgress) => p.completedCourses.filter(cp => cp.completedAt && COURSES.find(c => c.id === cp.courseId)?.track === 'trading').length >= 2 },
]

export default function RewardsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    const i = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(i)
  }, [])

  if (!progress) return <Shell><div className="p-8 text-neutral-400">Loading…</div></Shell>

  const { current, needed, pct } = xpToNextLevel(progress.xp)
  const completed = progress.completedCourses.filter(c => c.completedAt).length

  const trackStats = Object.entries(TRACKS).map(([track, meta]) => {
    const total = COURSES.filter(c => c.track === track).length
    const done = progress.completedCourses.filter(cp => cp.completedAt && COURSES.find(c => c.id === cp.courseId)?.track === track).length
    return { track, meta, total, done }
  })

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="text-[13px] text-neutral-500">Rewards & progress</div>
      </div>
      <div className="p-6 max-w-4xl">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: Trophy, val: progress.xp.toLocaleString(), label: 'Total XP', gold: true },
            { icon: Flame, val: progress.streak, label: 'Day streak', gold: false },
            { icon: BookOpen, val: completed, label: 'Completed', gold: false },
            { icon: Star, val: `L${progress.level}`, label: levelName(progress.level), gold: false },
          ].map(({ icon: Icon, val, label, gold }) => (
            <div key={label} className="bg-white border border-neutral-100 rounded-lg p-4 text-center">
              <Icon size={18} className={`mx-auto mb-2 ${gold ? 'text-gold' : 'text-neutral-300'}`} />
              <div className={`text-xl font-medium ${gold ? 'text-gold' : 'text-ink'}`}>{val}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-ink rounded-lg p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-white text-[13px] font-medium">Level {progress.level} · {levelName(progress.level)}</div>
            <div className="text-gold text-[12px]">{progress.xp.toLocaleString()} XP total</div>
          </div>
          <div className="bg-neutral-800 rounded h-2 overflow-hidden mb-2">
            <div className="h-full bg-gold rounded" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] text-neutral-500">{current.toLocaleString()} / {needed.toLocaleString()} XP to Level {progress.level + 1}</div>
        </div>

        <div className="mb-2 text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400">Progress by track</div>
        <div className="space-y-2 mb-6">
          {trackStats.filter(t => t.total > 0).map(({ track, meta, total, done }) => (
            <div key={track} className="bg-white border border-neutral-100 rounded-lg px-4 py-3 flex items-center gap-4">
              <div className="w-20 text-[11px] font-medium" style={{ color: meta.color }}>{meta.label}</div>
              <div className="flex-1 bg-neutral-100 rounded h-1.5 overflow-hidden">
                <div className="h-full rounded transition-all" style={{ width: `${Math.round((done / total) * 100)}%`, background: meta.color }} />
              </div>
              <div className="text-[11px] text-neutral-400 w-16 text-right">{done}/{total} done</div>
            </div>
          ))}
        </div>

        <div className="mb-2 text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400">Badges</div>
        <div className="grid grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const earned = badge.req(progress)
            const Icon = badge.icon
            return (
              <div
                key={badge.id}
                className={`border rounded-lg p-4 text-center transition-all ${earned ? 'border-gold bg-white' : 'border-neutral-100 bg-neutral-50 opacity-50'}`}
              >
                <Icon size={22} className={`mx-auto mb-2 ${earned ? 'text-gold' : 'text-neutral-300'}`} />
                <div className={`text-[12px] font-medium ${earned ? 'text-ink' : 'text-neutral-400'}`}>{badge.label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{badge.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
