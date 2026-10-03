'use client'
import Shell from '@/components/Shell'
import Link from 'next/link'
import { COURSES, TRACKS, LEVEL_COLORS, type Track } from '@/lib/courses'
import { useCompletedCourseIds } from '@/lib/progress'
import { Clock, CheckCircle, Play, ChevronRight, Zap } from 'lucide-react'

interface TrackSection {
  heading: string
  description: string
  tracks: Track[]
}

const TRACK_SECTIONS: TrackSection[] = [
  {
    heading: '⚡ Crash Courses',
    description: 'Fastest path to job-ready — do these before anything else. Follow the order on the Crash Courses page.',
    tracks: ['crash'],
  },
  {
    heading: '💻 Technology',
    description: 'Core technical knowledge — framework → architecture → AI systems. Start with Technology, then CS Foundations.',
    tracks: ['tech', 'cs-foundations', 'software-eng', 'networks-os', 'hci', 'techco'],
  },
  {
    heading: '💼 Business & Marketing',
    description: 'Revenue, strategy and brand — the operator and founder stack.',
    tracks: ['marketing', 'consumer-psych', 'marketing-science', 'brand-strategy', 'business', 'product-mgmt', 'sales-mgmt', 'mktco'],
  },
  {
    heading: '🎨 Creative & Design',
    description: 'Direction, visual systems and game design.',
    tracks: ['design', 'creative', 'gamedev'],
  },
  {
    heading: '🧠 Mind, Culture & Knowledge',
    description: 'The inner architecture and cross-domain literacy that compounds everything else.',
    tracks: ['mindset', 'psychology', 'higher', 'culture', 'knowledge', 'future'],
  },
  {
    heading: '📈 Trading',
    description: 'Smart Money Concepts, VIX indices, risk and execution.',
    tracks: ['trading'],
  },
]

export default function TracksPage() {
  const completedIds = useCompletedCourseIds()

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="text-[13px] font-medium text-ink">All tracks</div>
        <div className="text-[11px] text-neutral-400 mt-0.5">Organised by priority — Technology and Crash Courses first</div>
      </div>

      <div className="p-6 max-w-5xl space-y-10">
        {TRACK_SECTIONS.map((section) => (
          <div key={section.heading}>
            {/* Section header */}
            <div className="mb-1">
              <div className="text-[13px] font-semibold text-ink">{section.heading}</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 mb-4">{section.description}</p>
            </div>

            {section.tracks.map((track) => {
              const meta = TRACKS[track]
              if (!meta) return null
              const courses = COURSES.filter(c => c.track === track).sort((a, b) => a.module - b.module)
              if (courses.length === 0) return null

              // For crash course track, show a redirect card
              if (track === 'crash') {
                return (
                  <Link key={track} href="/crash-courses"
                    className="flex items-center gap-3 bg-white border border-amber-200 rounded-xl px-5 py-4 hover:border-amber-400 hover:shadow-sm transition-all mb-4"
                  >
                    <Zap size={16} className="text-amber-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-ink">Crash Courses — Numbered Learning Path</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{meta.description}</div>
                    </div>
                    <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                      Open path <ChevronRight size={13} />
                    </div>
                  </Link>
                )
              }

              const completedCount = courses.filter(c => completedIds.has(c.id)).length
              const pct = Math.round((completedCount / courses.length) * 100)

              return (
                <div key={track} className="mb-6">
                  {/* Track header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <span className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: meta.color }}>{meta.label}</span>
                      <div className="flex-1 h-px bg-neutral-100" />
                      <span className="text-[11px] text-neutral-400 flex-shrink-0">{completedCount}/{courses.length}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {pct > 0 && (
                    <div className="mb-3 h-1 bg-neutral-100 rounded overflow-hidden">
                      <div className="h-full rounded transition-all" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                  )}

                  <div className="text-[11px] text-neutral-400 mb-2">{meta.description}</div>
                  <div className="text-[10px] text-neutral-300 italic mb-3">On completion: {meta.completionOutcome}</div>

                  <div className="space-y-1.5">
                    {courses.map(course => {
                      const done = completedIds.has(course.id)
                      const lc = LEVEL_COLORS[course.level]
                      return (
                        <Link
                          key={course.id}
                          href={`/courses/${course.id}`}
                          className="flex items-center gap-4 bg-white border border-neutral-100 rounded-lg px-4 py-3 hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-ink truncate">
                              <span className="text-neutral-300 mr-1">M{course.module}</span>{course.title}
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{course.subtitle}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                              <Clock size={11} /> {course.duration}m
                            </div>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase"
                              style={{ color: lc.text, background: lc.bg }}>
                              {course.level}
                            </span>
                            <span className="text-[11px] text-gold">+{course.xp}</span>
                            {done
                              ? <CheckCircle size={16} className="text-green-500" />
                              : <div className="w-6 h-6 bg-ink rounded-full flex items-center justify-center">
                                  <Play size={9} className="text-white ml-0.5" />
                                </div>
                            }
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Shell>
  )
}
