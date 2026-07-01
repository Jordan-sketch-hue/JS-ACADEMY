'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { COURSES, TRACKS, LEVEL_COLORS, type Course } from '@/lib/courses'
import { getProgress, isCourseCompleted, levelName, xpToNextLevel, type UserProgress } from '@/lib/progress'
import { Clock, Play, CheckCircle, Flame, Trophy, BookOpen, Star } from 'lucide-react'

function TrackDot({ track }: { track: string }) {
  const t = TRACKS[track as keyof typeof TRACKS]
  return <span style={{ color: t?.color }} className="text-[10px] font-medium tracking-[0.15em] uppercase">{t?.label ?? track}</span>
}

function LevelBadge({ level }: { level: string }) {
  const c = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] ?? { text: '#555', bg: '#f0f0ee' }
  return (
    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded tracking-[0.1em] uppercase flex-shrink-0" style={{ color: c.text, background: c.bg }}>
      {level}
    </span>
  )
}

function CourseRow({ course }: { course: Course }) {
  const done = isCourseCompleted(course.id)
  const track = TRACKS[course.track]
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0 group"
    >
      <div
        className="w-1.5 h-8 rounded-full flex-shrink-0"
        style={{ background: track?.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-ink leading-tight truncate">{course.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <TrackDot track={course.track} />
          <span className="text-[10px] text-neutral-300">·</span>
          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
            <Clock size={9} />{course.duration}m
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <LevelBadge level={course.level} />
        <span className="text-[10px] text-gold font-medium">+{course.xp}</span>
        {done
          ? <CheckCircle size={14} className="text-green-500" />
          : <div className="w-6 h-6 bg-ink rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={8} className="text-white ml-0.5" /></div>
        }
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  const today = new Date()
  const dayOfWeek = today.getDay() || 7
  const rawDay = dayOfWeek <= 5 ? dayOfWeek : 1
  const availableDays = [...new Set(COURSES.filter(c => c.weekNumber === 1).map(c => c.dayOfWeek))].sort()
  const activeDay = availableDays.includes(rawDay) ? rawDay : availableDays[0] ?? 1
  const todayCourses = COURSES.filter(c => c.weekNumber === 1 && c.dayOfWeek === activeDay)
  const allFirstWeek = COURSES.filter(c => c.weekNumber === 1)

  useEffect(() => {
    setProgress(getProgress())
    const interval = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(interval)
  }, [])

  const completed = progress?.completedCourses.filter(c => c.completedAt).length ?? 0
  const xp = progress?.xp ?? 0
  const streak = progress?.streak ?? 0
  const level = progress?.level ?? 1
  const { pct } = xpToNextLevel(xp)
  const totalXpAvailable = todayCourses.reduce((s, c) => s + c.xp, 0)
  const totalMin = todayCourses.reduce((s, c) => s + c.duration, 0)

  const days = [
    { label: 'Mon', n: 1 }, { label: 'Tue', n: 2 }, { label: 'Wed', n: 3 },
    { label: 'Thu', n: 4 }, { label: 'Fri', n: 5 },
  ]

  return (
    <Shell>
      {/* Topbar */}
      <div className="bg-white border-b border-neutral-100 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="text-[12px] text-neutral-400">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          <span className="mx-2 text-neutral-200">·</span>Week 1
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Flame size={12} className="text-gold" />{streak}-day streak
            </div>
          )}
          <div className="bg-ink text-white text-[10px] font-medium px-2.5 py-1 rounded tracking-wide">{xp.toLocaleString()} pts</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-5 max-w-5xl">

          {/* Hero — compact */}
          <div className="bg-ink rounded-lg px-5 py-4 mb-4 flex items-center justify-between">
            <div>
              <div className="text-white text-[14px] font-medium">Good {getTimeOfDay()}, Jordan.</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                {todayCourses.length} courses · {totalMin} min · {totalXpAvailable} XP available
              </div>
            </div>
            <div className="flex gap-5">
              {[
                { val: todayCourses.length, label: 'Today' },
                { val: `${totalMin}m`, label: 'Est.' },
                { val: `+${totalXpAvailable}`, label: 'XP' },
              ].map(({ val, label }) => (
                <div key={label} className="text-right">
                  <div className="text-gold text-lg font-medium leading-none">{val}</div>
                  <div className="text-[9px] text-neutral-600 tracking-[0.12em] uppercase mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {[
              { icon: Trophy, val: xp.toLocaleString(), label: 'Total XP', gold: true },
              { icon: Flame, val: streak || '—', label: 'Streak', gold: false },
              { icon: BookOpen, val: completed, label: 'Done', gold: false },
              { icon: Star, val: `L${level}`, label: levelName(level), gold: false },
            ].map(({ icon: Icon, val, label, gold }) => (
              <div key={label} className="bg-white border border-neutral-100 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
                <Icon size={14} className={gold ? 'text-gold' : 'text-neutral-300'} />
                <div>
                  <div className={`text-[14px] font-medium leading-none ${gold ? 'text-gold' : 'text-ink'}`}>{val}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div className="bg-white border border-neutral-100 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-4">
            <div className="text-[10px] text-neutral-400 tracking-[0.1em] uppercase w-24 flex-shrink-0">Level {level} · {levelName(level)}</div>
            <div className="flex-1 bg-neutral-100 rounded h-1.5 overflow-hidden">
              <div className="h-full bg-gold rounded transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-[10px] text-neutral-400 flex-shrink-0">{pct}% → L{level + 1}</div>
          </div>

          {/* Two column layout: today's courses + week schedule */}
          <div className="grid grid-cols-5 gap-4">

            {/* Today's courses — takes 3 cols */}
            <div className="col-span-3 bg-white border border-neutral-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-neutral-50 flex items-center justify-between">
                <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">Today's courses</div>
                <div className="text-[10px] text-neutral-300">{today.toLocaleDateString('en-US', { weekday: 'long' })}</div>
              </div>
              {todayCourses.map(course => (
                <CourseRow key={course.id} course={course} />
              ))}
              {todayCourses.length === 0 && (
                <div className="px-4 py-6 text-[12px] text-neutral-300 text-center">No courses scheduled today</div>
              )}
            </div>

            {/* Week schedule — takes 2 cols */}
            <div className="col-span-2 bg-white border border-neutral-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-neutral-50">
                <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">This week</div>
              </div>
              {days.map(({ label, n }) => {
                const dayCourses = allFirstWeek.filter(c => c.dayOfWeek === n)
                const isToday = n === activeDay
                const doneCount = dayCourses.filter(c => isCourseCompleted(c.id)).length
                return (
                  <div key={n} className={`px-4 py-2.5 border-b border-neutral-50 last:border-0 ${isToday ? 'bg-neutral-50' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-medium tracking-[0.08em] uppercase ${isToday ? 'text-ink' : 'text-neutral-400'}`}>
                        {label} {isToday && <span className="text-gold ml-1">·</span>}
                      </span>
                      <span className="text-[9px] text-neutral-300">
                        {doneCount}/{dayCourses.length} · {dayCourses.reduce((s, c) => s + c.duration, 0)}m
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {dayCourses.map(c => (
                        <Link key={c.id} href={`/courses/${c.id}`} className="flex items-center gap-1.5 hover:opacity-70">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: TRACKS[c.track]?.color }} />
                          <span className="text-[10px] text-neutral-500 truncate leading-relaxed">{c.title.length > 32 ? c.title.slice(0, 32) + '…' : c.title}</span>
                          {isCourseCompleted(c.id) && <CheckCircle size={9} className="text-green-400 flex-shrink-0" />}
                        </Link>
                      ))}
                      {dayCourses.length === 0 && <span className="text-[10px] text-neutral-200">Rest</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </Shell>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
