'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getProgress, type UserProgress } from '@/lib/progress'
import { COURSES, TRACKS, type Track, type Level } from '@/lib/courses'
import { downloadCertificate } from '@/lib/certificate'
import { Lock, CheckCircle, Download } from 'lucide-react'

const LEVEL_RANK: Record<Level, number> = { Basic: 0, Masters: 1, PhD: 2, 'Next-Gen AI': 3 }

function highestLevel(levels: Level[]): Level {
  return levels.reduce((top, l) => (LEVEL_RANK[l] > LEVEL_RANK[top] ? l : top), levels[0])
}

export default function CertificationsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    const i = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(i)
  }, [])

  if (!progress) return <Shell><div className="p-8 text-neutral-400">Loading…</div></Shell>

  const completedIds = new Set(progress.completedCourses.filter(c => c.completedAt).map(c => c.courseId))

  // One certification per track, earned by completing every module in it.
  // Previously this list hardcoded a handful of stale course IDs (from a
  // retired week/day naming scheme) that no longer matched any real course,
  // so no certification could ever be earned. Deriving straight from
  // COURSES means it can't drift out of sync again as tracks grow.
  const certs = (Object.entries(TRACKS) as [Track, typeof TRACKS[Track]][])
    .filter(([track]) => track !== 'language') // language lab has no completable course flow
    .map(([track, meta]) => {
      const courses = COURSES.filter(c => c.track === track)
      const done = courses.filter(c => completedIds.has(c.id)).length
      const level = highestLevel(courses.map(c => c.level))
      return { track, meta, total: courses.length, done, level }
    })
    .filter(c => c.total > 0)

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="text-[13px] text-neutral-500">Digital certifications</div>
      </div>
      <div className="p-6 max-w-4xl">
        <div className="text-[11px] text-neutral-400 mb-6 leading-relaxed max-w-xl">
          Each certification is earned by completing every module in that track. The level badge reflects the track&rsquo;s highest difficulty tier.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map(({ track, meta, total, done, level }) => {
            const earned = done === total
            const pct = Math.round((done / total) * 100)
            const title = `${meta.label} Certification`
            return (
              <div
                key={track}
                className={`border rounded-lg p-5 transition-all ${earned ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  {earned
                    ? <CheckCircle size={20} style={{ color: meta.color }} />
                    : <Lock size={18} className="text-neutral-300" />
                  }
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ color: meta.color, background: meta.color + '15' }}>
                    {level}
                  </span>
                </div>
                <div className={`text-[13px] font-medium mb-1 leading-snug ${earned ? 'text-ink' : 'text-neutral-400'}`}>{title}</div>
                <div className="text-[10px] text-neutral-400 mb-3">{meta.description}</div>

                {!earned && (
                  <>
                    <div className="bg-neutral-200 rounded h-1 overflow-hidden mb-1">
                      <div className="h-full rounded" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                    <div className="text-[10px] text-neutral-400">{done}/{total} modules</div>
                  </>
                )}

                {earned && (
                  <div className="mt-3 border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-green-600 font-medium">Earned</span>
                    <button
                      onClick={() => downloadCertificate({ title, track: meta.label, level })}
                      className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-ink underline"
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
