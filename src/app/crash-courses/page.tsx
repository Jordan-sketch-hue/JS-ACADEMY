'use client'
import Shell from '@/components/Shell'
import Link from 'next/link'
import { COURSES, Course } from '@/lib/courses'
import { useCompletedCourseIds } from '@/lib/progress'
import { Zap, CheckCircle, ChevronRight } from 'lucide-react'

const CRASH_ORDER = [
  'cc-js', 'cc-html', 'cc-ts', 'cc-react', 'cc-nextjs',
  'cc-tailwind', 'cc-supabase', 'cc-postgres', 'cc-restapi', 'cc-payload',
]

type CrashGroup = { cid: string; title: string; objective: string; modules: Course[]; completedCount: number; pct: number }

export default function CrashCoursesPage() {
  const completedIds = useCompletedCourseIds()

  const crashGroups: CrashGroup[] = CRASH_ORDER.flatMap(cid => {
    const modules = COURSES.filter(c => c.crashId === cid).sort((a, b) => a.module - b.module)
    if (!modules.length) return []
    const first = modules[0]
    const completedCount = modules.filter(m => completedIds.has(m.id)).length
    const pct = Math.round((completedCount / modules.length) * 100)
    return [{ cid, title: first.crashTitle!, objective: first.courseObjective!, modules, completedCount, pct }]
  })

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5 flex items-center gap-3">
        <Zap size={14} className="text-amber-500" />
        <div>
          <div className="text-[13px] font-medium text-ink">Crash Courses</div>
          <div className="text-[11px] text-neutral-400">10 courses · 8 modules each · PhD-level mastery</div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {crashGroups.map(({ cid, title, objective, modules, completedCount, pct }) => {
            const done = completedCount === modules.length
            return (
              <Link
                key={cid}
                href={`/crash-courses/${cid}`}
                className="bg-white border border-neutral-150 rounded-xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={13} className="text-amber-500" />
                      <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-amber-600">Crash Course</span>
                    </div>
                    <div className="text-[15px] font-medium text-ink">{title}</div>
                  </div>
                  {done
                    ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : <div className="text-[11px] text-neutral-400 flex-shrink-0 mt-1">{completedCount}/{modules.length}</div>
                  }
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 line-clamp-2">{objective}</p>

                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-neutral-400">{pct}% complete</span>
                    <span className="text-[10px] text-amber-600">{modules.reduce((s: number, m: Course) => s + m.xp, 0)} XP total</span>
                  </div>
                  <div className="bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>{modules.length} modules · Basic → PhD</span>
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
