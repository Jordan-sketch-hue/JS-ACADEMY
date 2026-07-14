'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { COURSES, TRACKS, LEVEL_COLORS, type Course } from '@/lib/courses'
import { getProgress, isCourseCompleted, levelName, xpToNextLevel, type UserProgress } from '@/lib/progress'
import { Clock, Play, CheckCircle, Flame, Trophy, BookOpen, Star } from 'lucide-react'

function LevelBadge({ level }: { level: string }) {
  const c = LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] ?? { text: '#555', bg: '#f0f0ee' }
  return (
    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-[0.08em] uppercase flex-shrink-0"
      style={{ color: c.text, background: c.bg }}>{level}</span>
  )
}

function CourseRow({ course }: { course: Course }) {
  const done = isCourseCompleted(course.id)
  const track = TRACKS[course.track]
  return (
    <Link href={`/courses/${course.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 active:bg-neutral-100 transition-colors border-b border-neutral-50 last:border-0 group">
      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: track?.color }} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#0a0a0a] leading-snug">{course.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: track?.color }}>{track?.label}</span>
          <span className="text-neutral-200 text-[10px]">·</span>
          <span className="text-[10px] text-neutral-400 flex items-center gap-0.5"><Clock size={9} />{course.duration}m</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <LevelBadge level={course.level} />
        <span className="text-[11px] text-[#c9a84c] font-medium">+{course.xp}</span>
        {done
          ? <CheckCircle size={15} className="text-green-500" />
          : <div className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-shrink-0">
              <Play size={9} className="text-white ml-0.5" />
            </div>
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
  const todayDay = availableDays.includes(rawDay) ? rawDay : availableDays[0] ?? 1
  const [selectedDay, setSelectedDay] = useState<number>(todayDay)
  const TRACK_ORDER: Record<string, number> = {
    marketing: 1, tech: 2, business: 3, design: 4, mindset: 5,
    creative: 6, culture: 7, knowledge: 8, future: 9, psychology: 10,
    higher: 11, language: 12, trading: 13,
  }
  const sortCourses = (a: Course, b: Course) => (TRACK_ORDER[a.track] ?? 99) - (TRACK_ORDER[b.track] ?? 99)
  const todayCourses = COURSES.filter(c => c.weekNumber === 1 && c.dayOfWeek === selectedDay).sort(sortCourses)
  const allFirstWeek = COURSES.filter(c => c.weekNumber === 1)

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
  const totalXpAvailable = todayCourses.reduce((s, c) => s + c.xp, 0)
  const totalMin = todayCourses.reduce((s, c) => s + c.duration, 0)

  const days = [
    { label: 'Mon', n: 1 }, { label: 'Tue', n: 2 }, { label: 'Wed', n: 3 },
    { label: 'Thu', n: 4 }, { label: 'Fri', n: 5 },
  ]

  return (
    <Shell>
      <div className="p-4 md:p-5 space-y-4">

        {/* Hero */}
        <div className="bg-[#0a0a0a] rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white text-[15px] font-medium">Good {getTimeOfDay()}, Jordan.</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{todayCourses.length} courses · {totalMin} min</div>
          </div>
          <div className="flex gap-4">
            {[
              { val: todayCourses.length, label: 'Today' },
              { val: `+${totalXpAvailable}`, label: 'XP' },
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

        {/* Day switcher tabs */}
        <div className="flex gap-1.5">
          {days.map(({ label, n }) => {
            const isToday = n === todayDay
            const isSelected = n === selectedDay
            const hasCourses = allFirstWeek.some(c => c.dayOfWeek === n)
            return (
              <button key={n} onClick={() => setSelectedDay(n)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-medium tracking-[0.1em] uppercase transition-colors ${
                  isSelected
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-white border border-neutral-100 text-neutral-400 hover:border-neutral-300'
                } ${!hasCourses ? 'opacity-40' : ''}`}>
                {label}
                {isToday && <span className="block text-[8px] mt-0.5 opacity-60">today</span>}
              </button>
            )
          })}
        </div>

        {/* Selected day courses */}
        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-50 flex items-center justify-between">
            <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">
              {selectedDay === todayDay ? "Today's courses" : days.find(d => d.n === selectedDay)?.label + "'s courses"}
            </div>
            <div className="text-[10px] text-neutral-300">{todayCourses.length} courses · {todayCourses.reduce((s,c)=>s+c.duration,0)}m</div>
          </div>
          {todayCourses.length > 0
            ? todayCourses.map(c => <CourseRow key={c.id} course={c} />)
            : <div className="px-4 py-6 text-center text-[12px] text-neutral-300">No courses scheduled</div>
          }
        </div>

        {/* Week overview */}
        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-50">
            <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-400">This week</div>
          </div>
          {days.map(({ label, n }) => {
            const dayCourses = allFirstWeek.filter(c => c.dayOfWeek === n)
            const isToday = n === todayDay
            const isSelected = n === selectedDay
            const doneCount = dayCourses.filter(c => isCourseCompleted(c.id)).length
            return (
              <button key={n} onClick={() => setSelectedDay(n)}
                className={`w-full text-left px-4 py-3 border-b border-neutral-50 last:border-0 transition-colors ${isSelected ? 'bg-neutral-50' : 'hover:bg-neutral-50/50'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-medium tracking-[0.08em] uppercase ${isSelected ? 'text-[#0a0a0a]' : 'text-neutral-400'}`}>
                    {label}
                    {isToday && <span className="text-[#c9a84c] ml-1.5">← today</span>}
                  </span>
                  <span className="text-[10px] text-neutral-300">{doneCount}/{dayCourses.length} · {dayCourses.reduce((s, c) => s + c.duration, 0)}m</span>
                </div>
                <div className="space-y-1">
                  {dayCourses.map(c => (
                    <Link key={c.id} href={`/courses/${c.id}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 active:opacity-60">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TRACKS[c.track]?.color }} />
                      <span className="text-[11px] text-neutral-500 leading-snug truncate">{c.title}</span>
                      {isCourseCompleted(c.id) && <CheckCircle size={10} className="text-green-400 flex-shrink-0" />}
                    </Link>
                  ))}
                  {dayCourses.length === 0 && <span className="text-[11px] text-neutral-300">No courses yet</span>}
                </div>
              </button>
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
