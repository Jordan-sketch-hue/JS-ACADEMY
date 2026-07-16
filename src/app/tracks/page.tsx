'use client'
import Shell from '@/components/Shell'
import Link from 'next/link'
import { COURSES, TRACKS, LEVEL_COLORS, type Track } from '@/lib/courses'
import { isCourseCompleted } from '@/lib/progress'
import { Clock, CheckCircle, Play } from 'lucide-react'

export default function TracksPage() {
  const tracks = Object.entries(TRACKS) as [Track, typeof TRACKS[Track]][]

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="text-[13px] text-neutral-500">All tracks · 12 modules each</div>
      </div>
      <div className="p-6 max-w-5xl">
        {tracks.map(([track, meta]) => {
          const courses = COURSES.filter(c => c.track === track).sort((a, b) => a.module - b.module)
          if (courses.length === 0) return null
          return (
            <div key={track} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: meta.color }}>{meta.label}</div>
                <div className="flex-1 h-px bg-neutral-100" />
                <div className="text-[11px] text-neutral-400">{courses.length} modules</div>
              </div>
              <div className="text-[12px] text-neutral-400 mb-1">{meta.description}</div>
              <div className="text-[11px] text-neutral-300 italic mb-3">On completion: {meta.completionOutcome}</div>
              <div className="space-y-2">
                {courses.map(course => {
                  const done = isCourseCompleted(course.id)
                  const lc = LEVEL_COLORS[course.level]
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-4 bg-white border border-neutral-100 rounded-lg px-4 py-3 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink truncate"><span className="text-neutral-300 mr-1">M{course.module}</span>{course.title}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{course.subtitle}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                          <Clock size={11} /> {course.duration}m
                        </div>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ color: lc.text, background: lc.bg }}>
                          {course.level}
                        </span>
                        <span className="text-[11px] text-gold">+{course.xp}</span>
                        {done
                          ? <CheckCircle size={16} className="text-green-500" />
                          : <div className="w-6 h-6 bg-ink rounded-full flex items-center justify-center"><Play size={9} className="text-white ml-0.5" /></div>
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
    </Shell>
  )
}
