'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { COURSES, TRACKS, type Track, type Course } from '@/lib/courses'
import { getCourseOutline, buildBriefingScript } from '@/lib/notes'
import { useCompletedCourseIds } from '@/lib/progress'
import AudiobookPlayer from '@/components/AudiobookPlayer'
import { Search, ChevronDown, BookOpen, CheckCircle, ArrowRight, Zap } from 'lucide-react'

export default function NotesPage() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const completedIds = useCompletedCourseIds()

  const q = query.trim().toLowerCase()

  const rows = useMemo(() => {
    return COURSES
      .filter(c => c.content && c.content !== 'LANGUAGE_LAB_REDIRECT')
      .map(c => ({ course: c, outline: getCourseOutline(c.content) }))
  }, [])

  const matches = (course: Course, outline: ReturnType<typeof getCourseOutline>) => {
    if (!q) return true
    const haystack = [
      course.title, course.subtitle, outline.overview, ...outline.sections,
      ...course.keyTerms.map(t => `${t.term} ${t.definition}`),
    ].join(' ').toLowerCase()
    return haystack.includes(q)
  }

  const filtered = rows.filter(r => matches(r.course, r.outline))

  const tracks = Object.entries(TRACKS) as [Track, typeof TRACKS[Track]][]

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="text-[13px] text-neutral-500">Note Taker — quick recall across every module</div>
        </div>
      </div>

      <div className="p-6 max-w-5xl">
        <div className="relative mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search key terms, ideas, or course titles…"
            className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-400"
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-[13px] text-neutral-400 py-8 text-center">No matches for &ldquo;{query}&rdquo;.</div>
        )}

        {tracks.map(([track, meta]) => {
          const trackRows = filtered.filter(r => r.course.track === track).sort((a, b) => a.course.module - b.course.module)
          if (trackRows.length === 0) return null
          return (
            <div key={track} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: meta.color }}>{meta.label}</div>
                <div className="flex-1 h-px bg-neutral-100" />
                <div className="text-[11px] text-neutral-400">{trackRows.length} modules</div>
              </div>

              <div className="space-y-2">
                {trackRows.map(({ course, outline }) => {
                  const open = expanded.has(course.id) || (!!q && matches(course, outline))
                  const done = completedIds.has(course.id)
                  return (
                    <div key={course.id} className="bg-white border border-neutral-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggle(course.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-ink truncate">
                            <span className="text-neutral-300 mr-1">M{course.module}</span>{course.title}
                          </div>
                          {outline.overview && (
                            <div className="text-[11px] text-neutral-400 mt-0.5 truncate">{outline.overview}</div>
                          )}
                        </div>
                        {done && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
                        <ChevronDown size={14} className={`text-neutral-300 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>

                      {open && (
                        <div className="px-4 pb-4 border-t border-neutral-100 pt-3">
                          <AudiobookPlayer
                            text={buildBriefingScript(course, outline)}
                            courseTitle={`${course.title} — briefing`}
                            courseId={`notes-${course.id}`}
                            keyTerms={course.keyTerms}
                          />
                          {outline.overview && (
                            <p className="text-[12px] text-neutral-600 leading-relaxed mb-3">{outline.overview}</p>
                          )}

                          {outline.sections.length > 0 && (
                            <div className="mb-4">
                              <div className="text-[9px] tracking-[0.15em] uppercase text-neutral-400 mb-2">In this module</div>
                              <ul className="space-y-1">
                                {outline.sections.map((s, i) => (
                                  <li key={i} className="text-[11px] text-neutral-500 flex items-start gap-1.5">
                                    <span className="text-gold mt-1">•</span><span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {course.keyTerms.length > 0 && (
                            <div className="mb-4 space-y-2">
                              <div className="text-[9px] tracking-[0.15em] uppercase text-neutral-400 mb-2">Key terms</div>
                              {course.keyTerms.map(t => (
                                <div key={t.term} className="bg-neutral-50 border border-neutral-100 rounded-lg p-3">
                                  <div className="text-[11px] font-medium text-ink mb-1 flex items-center gap-1.5">
                                    <BookOpen size={11} className="text-gold" />{t.term}
                                  </div>
                                  <div className="text-[11px] text-neutral-500 leading-relaxed">{t.definition}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Link
                              href={`/courses/${course.id}`}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-white bg-ink px-3 py-1.5 rounded hover:bg-neutral-800"
                            >
                              Open course <ArrowRight size={11} />
                            </Link>
                            <Link
                              href={`/courses/${course.id}?phase=terms`}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded hover:border-ink"
                            >
                              <Zap size={11} /> Study terms
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
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
