'use client'
import Shell from '@/components/Shell'
import Link from 'next/link'
import { COURSES, Course } from '@/lib/courses'
import { useCompletedCourseIds } from '@/lib/progress'
import { Zap, CheckCircle, ChevronRight, Lock } from 'lucide-react'

interface PathSection {
  label: string
  sublabel: string
  color: string
  courses: string[] // crashIds in order
}

const LEARNING_PATH: PathSection[] = [
  {
    label: 'Foundation',
    sublabel: 'Start here — every other course builds on these three',
    color: '#16a34a',
    courses: ['cc-html', 'cc-js', 'cc-ts'],
  },
  {
    label: 'Framework Layer',
    sublabel: 'The tools every web job requires — learn in this order',
    color: '#2563eb',
    courses: ['cc-react', 'cc-nextjs', 'cc-tailwind'],
  },
  {
    label: 'Backend & Data',
    sublabel: 'APIs, databases and CMS — full-stack readiness',
    color: '#7c3aed',
    courses: ['cc-restapi', 'cc-postgres', 'cc-supabase', 'cc-payload'],
  },
  {
    label: 'Ship It',
    sublabel: 'After the web dev stack — wire everything together and deploy to production',
    color: '#059669',
    courses: ['cc-ship-it'],
  },
  {
    label: 'Programming Languages',
    sublabel: 'Python first — highest ROI for data, AI, and automation',
    color: '#b45309',
    courses: ['cc-python', 'cc-r', 'cc-java', 'cc-go', 'cc-swift', 'cc-rust', 'cc-cpp'],
  },
  {
    label: 'Degree Add-Ons',
    sublabel: 'Theory and strategy that web dev courses skip — fills the degree gap',
    color: '#64748b',
    courses: ['cc-mktg-degree', 'cc-cs-degree'],
  },
  {
    label: 'Interview Prep',
    sublabel: 'Complete the relevant foundation courses before starting these',
    color: '#0f172a',
    courses: ['cc-interview-frontend', 'cc-interview-fullstack', 'cc-interview-backend', 'cc-interview-qa', 'cc-interview-data', 'cc-interview-security'],
  },
]

// Human-readable labels for courses not yet built
const COMING_SOON_LABELS: Record<string, string> = {
  'cc-python':            'Python',
  'cc-r':                 'R',
  'cc-java':              'Java / Kotlin',
  'cc-go':                'Go',
  'cc-swift':             'Swift',
  'cc-rust':              'Rust',
  'cc-cpp':               'C++',
  'cc-interview-frontend':'Front End Interview Prep',
  'cc-interview-fullstack':'Full Stack Interview Prep',
  'cc-interview-backend': 'Back End Interview Prep',
  'cc-interview-qa':      'QA Engineer Interview Prep',
  'cc-interview-data':    'Data Analyst Interview Prep',
  'cc-interview-security':'Cybersecurity Interview Prep',
  'cc-mktg-degree':       'Marketing Degree Add-On',
  'cc-cs-degree':         'CS Degree Add-On',
}

type CrashGroup = {
  cid: string
  title: string
  objective: string
  modules: Course[]
  completedCount: number
  pct: number
  comingSoon: boolean
}

export default function CrashCoursesPage() {
  const completedIds = useCompletedCourseIds()

  function getGroup(cid: string): CrashGroup {
    const modules = COURSES.filter(c => c.crashId === cid).sort((a, b) => a.module - b.module)
    if (!modules.length) {
      return {
        cid,
        title: COMING_SOON_LABELS[cid] ?? cid,
        objective: 'Coming soon — this course is being built.',
        modules: [],
        completedCount: 0,
        pct: 0,
        comingSoon: true,
      }
    }
    const first = modules[0]
    const completedCount = modules.filter(m => completedIds.has(m.id)).length
    const pct = Math.round((completedCount / modules.length) * 100)
    return { cid, title: first.crashTitle!, objective: first.courseObjective!, modules, completedCount, pct, comingSoon: false }
  }

  let globalIdx = 0

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5 flex items-center gap-3">
        <Zap size={14} className="text-amber-500" />
        <div>
          <div className="text-[13px] font-medium text-ink">Crash Courses</div>
          <div className="text-[11px] text-neutral-400">Follow this path in order — each section builds on the last</div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        {LEARNING_PATH.map((section) => {
          const groups = section.courses.map(cid => getGroup(cid))
          return (
            <div key={section.label}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: section.color, color: '#fff' }}
                >
                  {section.label}
                </div>
                <div className="flex-1 h-px" style={{ background: section.color, opacity: 0.15 }} />
              </div>
              <p className="text-[11px] text-neutral-400 mb-4 pl-0.5">{section.sublabel}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groups.map((group) => {
                  globalIdx++
                  const seq = globalIdx
                  const done = !group.comingSoon && group.completedCount === group.modules.length && group.modules.length > 0

                  if (group.comingSoon) {
                    return (
                      <div
                        key={group.cid}
                        className="bg-neutral-50 border border-dashed border-neutral-200 rounded-xl p-5 opacity-60"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
                                style={{ background: section.color }}
                              >{seq}</span>
                              <span className="text-[10px] tracking-[0.1em] uppercase text-neutral-400">Coming Soon</span>
                            </div>
                            <div className="text-[14px] font-medium text-neutral-400">{group.title}</div>
                          </div>
                          <Lock size={14} className="text-neutral-300 mt-1 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">{group.objective}</p>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={group.cid}
                      href={`/crash-courses/${group.cid}`}
                      className="bg-white border border-neutral-150 rounded-xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                              style={{ background: section.color }}
                            >{seq}</span>
                            <span className="text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: section.color }}>
                              Crash Course
                            </span>
                          </div>
                          <div className="text-[15px] font-medium text-ink">{group.title}</div>
                        </div>
                        {done
                          ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                          : <div className="text-[11px] text-neutral-400 flex-shrink-0 mt-1">{group.completedCount}/{group.modules.length}</div>
                        }
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 line-clamp-2">{group.objective}</p>

                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-neutral-400">{group.pct}% complete</span>
                          <span className="text-[10px]" style={{ color: '#c9a84c' }}>{group.modules.reduce((s: number, m: Course) => s + m.xp, 0)} XP</span>
                        </div>
                        <div className="bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${group.pct}%`, background: section.color }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{group.modules.length} modules · Basic → PhD</span>
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Shell>
  )
}
