'use client'
import Shell from '@/components/Shell'
import Link from 'next/link'
import { COURSES, LEVEL_COLORS } from '@/lib/courses'
import { useCompletedCourseIds } from '@/lib/progress'
import { Zap, Clock, CheckCircle, Play, ArrowLeft } from 'lucide-react'
import { use } from 'react'

export default function CrashCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const completedIds = useCompletedCourseIds()
  const modules = COURSES.filter(c => c.crashId === slug).sort((a, b) => a.module - b.module)

  if (!modules.length) {
    return (
      <Shell>
        <div className="p-8 text-neutral-400">
          Course not found. <Link href="/crash-courses" className="underline">Back to Crash Courses</Link>
        </div>
      </Shell>
    )
  }

  const first = modules[0]
  const completedCount = modules.filter(m => completedIds.has(m.id)).length
  const pct = Math.round((completedCount / modules.length) * 100)

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5 flex items-center gap-3">
        <Link href="/crash-courses" className="flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-ink">
          <ArrowLeft size={14} />
          Crash Courses
        </Link>
        <div className="h-3 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-amber-500" />
          <span className="text-[13px] font-medium text-ink">{first.crashTitle}</span>
        </div>
        <div className="ml-auto text-[11px] text-neutral-400">{completedCount}/{modules.length} complete</div>
      </div>

      <div className="p-6 max-w-3xl">
        {/* Course objective */}
        {first.courseObjective && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="text-amber-500" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-amber-700">Course Objective</span>
            </div>
            <p className="text-[13px] text-amber-900 leading-relaxed">{first.courseObjective}</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-neutral-500">{pct}% complete</span>
            <span className="text-[11px] text-amber-600">{modules.reduce((s, m) => s + m.xp, 0)} XP total</span>
          </div>
          <div className="bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Module list */}
        <div className="space-y-2">
          {modules.map(module => {
            const done = completedIds.has(module.id)
            const lc = LEVEL_COLORS[module.level]
            return (
              <Link
                key={module.id}
                href={`/courses/${module.id}`}
                className="flex items-center gap-4 bg-white border border-neutral-100 rounded-lg px-4 py-3 hover:border-neutral-300 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-50 border border-neutral-100 text-[11px] font-medium text-neutral-500">
                  {module.module}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ink truncate">{module.title}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{module.moduleObjective || module.subtitle}</div>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                    <Clock size={10} /> {module.duration}m
                  </div>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ color: lc.text, background: lc.bg }}>
                    {module.level}
                  </span>
                  <span className="text-[10px] text-amber-600">+{module.xp}</span>
                  {done
                    ? <CheckCircle size={15} className="text-green-500" />
                    : <div className="w-6 h-6 bg-ink rounded-full flex items-center justify-center"><Play size={8} className="text-white ml-0.5" /></div>
                  }
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
