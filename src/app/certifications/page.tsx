'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getProgress, type UserProgress } from '@/lib/progress'
import { COURSES } from '@/lib/courses'
import { Award, Lock, CheckCircle } from 'lucide-react'

const CERTS = [
  { id: 'paid-growth', title: 'Paid Growth Specialist', track: 'Marketing', level: 'PhD', area: 'Paid Growth', xpRequired: 500, courseIds: ['mkt-w1-d1'], color: '#c9a84c' },
  { id: 'content-mkt', title: 'Content Marketing Strategist', track: 'Marketing', level: 'Masters', area: 'Content Marketing', xpRequired: 300, courseIds: ['mkt-w1-d2'], color: '#c9a84c' },
  { id: 'ai-systems', title: 'AI Systems Architect', track: 'Technology', level: 'Next-Gen AI', area: 'AI Systems', xpRequired: 600, courseIds: ['tech-w1-d1'], color: '#378add' },
  { id: 'backend', title: 'Backend Engineer', track: 'Technology', level: 'Masters', area: 'Backend Engineering', xpRequired: 300, courseIds: ['tech-w1-d2'], color: '#378add' },
  { id: 'smc-trading', title: 'SMC Trading Practitioner', track: 'Trading', level: 'Masters', area: 'SMC Trading', xpRequired: 400, courseIds: ['trd-w1-d1'], color: '#2d8a4e' },
  { id: 'risk-mgmt', title: 'Risk & Capital Management', track: 'Trading', level: 'PhD', area: 'Risk & Capital Management', xpRequired: 500, courseIds: ['trd-w1-d2'], color: '#2d8a4e' },
  { id: 'biz-strategy', title: 'Business Strategy Operator', track: 'Business', level: 'Masters', area: 'Business Strategy', xpRequired: 300, courseIds: ['biz-w1-d1'], color: '#9b4dca' },
  { id: 'brand-design', title: 'Brand Design Systems', track: 'Design', level: 'Masters', area: 'Brand Design', xpRequired: 300, courseIds: ['dsn-w1-d1'], color: '#e05c2a' },
  { id: 'exec-perf', title: 'Executive Performance', track: 'Mindset', level: 'PhD', area: 'Executive Performance', xpRequired: 300, courseIds: ['mnd-w1-d1'], color: '#555' },
]

export default function CertificationsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
    const i = setInterval(() => setProgress(getProgress()), 2000)
    return () => clearInterval(i)
  }, [])

  if (!progress) return <Shell><div className="p-8 text-neutral-400">Loading…</div></Shell>

  const completedIds = new Set(progress.completedCourses.filter(c => c.completedAt).map(c => c.courseId))

  return (
    <Shell>
      <div className="bg-white border-b border-neutral-100 px-6 py-3.5">
        <div className="text-[13px] text-neutral-500">Digital certifications</div>
      </div>
      <div className="p-6 max-w-4xl">
        <div className="text-[11px] text-neutral-400 mb-6 leading-relaxed max-w-xl">
          Each certification is earned by completing all required modules in a track area and meeting the XP threshold. Levels progress: Basic → Masters → PhD → Next-Gen AI.
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CERTS.map(cert => {
            const coursesCompleted = cert.courseIds.every(id => completedIds.has(id))
            const xpMet = progress.xp >= cert.xpRequired
            const earned = coursesCompleted && xpMet
            const progress_pct = Math.min(100, Math.round((cert.courseIds.filter(id => completedIds.has(id)).length / cert.courseIds.length) * 100))

            return (
              <div
                key={cert.id}
                className={`border rounded-lg p-5 transition-all ${earned ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  {earned
                    ? <CheckCircle size={20} style={{ color: cert.color }} />
                    : <Lock size={18} className="text-neutral-300" />
                  }
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ color: cert.color, background: cert.color + '15' }}>
                    {cert.level}
                  </span>
                </div>
                <div className={`text-[13px] font-medium mb-1 leading-snug ${earned ? 'text-ink' : 'text-neutral-400'}`}>{cert.title}</div>
                <div className="text-[10px] text-neutral-400 mb-3">{cert.track} · {cert.area}</div>

                {!earned && (
                  <>
                    <div className="bg-neutral-200 rounded h-1 overflow-hidden mb-1">
                      <div className="h-full rounded" style={{ width: `${progress_pct}%`, background: cert.color }} />
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {cert.courseIds.filter(id => completedIds.has(id)).length}/{cert.courseIds.length} modules
                      {!xpMet && ` · ${cert.xpRequired} XP needed`}
                    </div>
                  </>
                )}

                {earned && (
                  <div className="mt-3 border-t border-neutral-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-green-600 font-medium">Earned</span>
                    <button className="text-[10px] text-neutral-400 hover:text-ink underline">Download</button>
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
