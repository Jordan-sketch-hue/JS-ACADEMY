'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { COURSES, TRACKS, LEVEL_COLORS, type Course } from '@/lib/courses'
import { getProgress, isCourseCompleted, levelName, xpToNextLevel, type UserProgress } from '@/lib/progress'
import { Clock, Play, CheckCircle, Flame, Trophy, BookOpen, Star } from 'lucide-react'

function TrackBadge({ track }: { track: string }) {
  const t = TRACKS[track as keyof typeof TRACKS]
  return (
    <span className="text-[9px] tracking-[0.18em] uppercase font-medium" style={{ color: t?.color }}>
      {t?.label ?? track}
    </span>
  )
}

function LevelBadge({ level }: { level: string }) {
  const c = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] ?? { text: '#555', bg: '#f0f0ee' }
  return (
    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-[0.08em] uppercase" style={{ color: c.text, background: c.bg }}>
      {level}
    </span>
  )
}

function CourseCard({ course, featured = false }: { course: Course; featured?: boolean }) {
  const done = isCourseCompleted(course.id)
  return (
    <Link
      href={`/courses/${course.id}`}
      className={`block border border-neutral-200 rounded-lg p-4 hover:border-ink transition-colors bg-white ${featured ? 'col-span-2' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrackBadge track={course.track} />
          {featured && <span className="text-[9px] text-neutral-400 tracking-[0.1em] uppercase">Featured</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-neutral-400" />
          <span className="text-[11px] text-neutral-400">{course.duration} min</span>
        </div>
      </div>
      <div className="text-[13px] font-medium text-ink leading-snug mb-1">{course.title}</div>
      <div className="text-[11px] text-neutral-500 leading-snug mb-3">{course.subtitle}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gold font-medium">+{course.xp} XP</span>
        <div className="flex items-center gap-2">
          <LevelBadge level={course.level} />
          {done
            ? <CheckCircle size={18} className="text-green-500" />
            : <div className="w-7 h-7 bg-ink rounded-full flex items-center justify-center"><Play size={10} className="text-white ml-0.5" /></div>
          }
        </div>
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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5 flex items-center justify-between">
        <div className="text-[13px] text-neutral-500">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Week 1
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 text-[12px] text-neutral-500">
              <Flame size={13} className="text-gold" />
              {streak}-day streak
            </div>
          )}
          <div className="bg-ink text-white text-[11px] font-medium px-3 py-1.5 rounded tracking-wide">
            {xp.toLocaleString()} pts
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl">
        <div className="bg-ink rounded-lg p-5 mb-6 flex items-center justify-between">
          <div>
            <div className="text-white font-medium mb-1">Good {getTimeOfDay()}, Jordan.</div>
            <div className="text-[12px] text-neutral-500">
              {todayCourses.length} courses ready · est. {totalMin} min · {totalXpAvailable} XP available today
            </div>
          </div>
          <div className="flex gap-6">
            {[
              { val: todayCourses.length, label: 'Courses' },
              { val: `${totalMin}m`, label: 'Today' },
              { val: `+${totalXpAvailable}`, label: 'XP' },
            ].map(({ val, label }) => (
              <div key={label} className="text-right">
                <div className="text-gold text-xl font-medium">{val}</div>
                <div className="text-[10px] text-neutral-600 tracking-[0.1em] uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: Trophy, val: xp.toLocaleString(), label: 'Total XP', gold: true },
            { icon: Flame, val: streak, label: 'Day streak', gold: false },
            { icon: BookOpen, val: completed, label: 'Completed', gold: false },
            { icon: Star, val: `Level ${level}`, label: levelName(level), gold: false },
          ].map(({ icon: Icon, val, label, gold }) => (
            <div key={label} className="bg-white border border-neutral-100 rounded-lg p-3.5">
              <Icon size={16} className={gold ? 'text-gold' : 'text-neutral-400'} />
              <div className={`text-lg font-medium mt-1.5 ${gold ? 'text-gold' : 'text-ink'}`}>{val}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-neutral-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400">XP progress</div>
            <div className="text-[11px] text-neutral-400">Level {level} · {levelName(level)}</div>
          </div>
          <div className="bg-neutral-100 rounded h-2 overflow-hidden">
            <div className="h-full bg-gold rounded transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[10px] text-neutral-400 mt-1.5">{pct}% to Level {level + 1}</div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400">Today's courses</div>
          <span className="text-[11px] text-neutral-400">{today.toLocaleDateString('en-US', { weekday: 'long' })}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {todayCourses.map((course, i) => (
            <CourseCard key={course.id} course={course} featured={i === 0 && todayCourses.length > 2} />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-neutral-400">This week's schedule</div>
        </div>
        <div className="bg-white border border-neutral-100 rounded-lg overflow-hidden mb-6">
          {days.map((day, idx) => {
            const dayCourses = allFirstWeek.filter(c => c.dayOfWeek === idx + 1)
            const isToday = (idx + 1) === (dayOfWeek <= 5 ? dayOfWeek : 1)
            return (
              <div key={day} className={`border-b border-neutral-50 last:border-0 ${isToday ? 'bg-neutral-50' : ''}`}>
                <div className="px-4 py-2.5 flex items-center gap-4">
                  <div className={`w-8 text-[11px] font-medium tracking-[0.08em] uppercase ${isToday ? 'text-ink' : 'text-neutral-400'}`}>
                    {day}
                  </div>
                  <div className="flex gap-2 flex-wrap flex-1">
                    {dayCourses.map(c => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        className="flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-ink"
                      >
                        <span style={{ color: TRACKS[c.track]?.color }}>●</span>
                        {c.title.length > 40 ? c.title.slice(0, 40) + '…' : c.title}
                        {isCourseCompleted(c.id) && <CheckCircle size={11} className="text-green-500" />}
                      </Link>
                    ))}
                    {dayCourses.length === 0 && <span className="text-[11px] text-neutral-300">Rest day</span>}
                  </div>
                  <div className="text-[10px] text-neutral-300">
                    {dayCourses.reduce((s, c) => s + c.duration, 0)}m
                  </div>
                </div>
              </div>
            )
          })}
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
