'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase, type Job } from '@/lib/supabase'
import { JOB_CATEGORIES, type JobCategory } from '@/lib/resume'
import { DREAM_COMPANIES } from '@/lib/scraper'
import {
  Briefcase, BookmarkCheck, CheckCircle, Search, Bell, BellOff,
  ExternalLink, RefreshCw, ChevronDown, Zap, Shield, Code2,
  Database, Cloud, Wrench, Bot, Megaphone, Settings, Star, X, Building2, Send
} from 'lucide-react'

const CAT_ICONS: Record<string, any> = {
  'Software Development': Code2,
  'QA & Testing': CheckCircle,
  'Data & Analytics': Database,
  'Cloud & DevOps': Cloud,
  'IT Support': Wrench,
  'Cybersecurity': Shield,
  'AI & Automation': Bot,
  'Marketing & Digital': Megaphone,
  'Operations & Admin': Settings,
}

const NAV_ITEMS = [
  { key: 'discover' as const, icon: Zap, label: 'Discover' },
  { key: 'saved' as const, icon: BookmarkCheck, label: 'Saved' },
  { key: 'applied' as const, icon: CheckCircle, label: 'Applied' },
  { key: 'dream' as const, icon: Building2, label: 'Dream' },
]

const AVATAR_COLORS = [
  'bg-blue-900/60 border-blue-700/40 text-blue-300',
  'bg-purple-900/60 border-purple-700/40 text-purple-300',
  'bg-pink-900/60 border-pink-700/40 text-pink-300',
  'bg-orange-900/60 border-orange-700/40 text-orange-300',
  'bg-teal-900/60 border-teal-700/40 text-teal-300',
  'bg-indigo-900/60 border-indigo-700/40 text-indigo-300',
  'bg-rose-900/60 border-rose-700/40 text-rose-300',
]

function scoreBg(score: number) {
  if (score >= 70) return 'bg-green-900/30 border-green-700/60 text-green-400'
  if (score >= 50) return 'bg-yellow-900/30 border-yellow-700/60 text-yellow-400'
  return 'bg-slate-800/60 border-slate-700/60 text-slate-400'
}

function salaryDisplay(job: Job) {
  if (!job.salary_min && !job.salary_max) return null
  const fmt = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)}–${fmt(job.salary_max)} ${job.currency ?? 'USD'}`
  if (job.salary_min) return `${fmt(job.salary_min)}+ ${job.currency ?? 'USD'}`
  return null
}

function categoryFromJob(job: Job): JobCategory {
  const t = job.title.toLowerCase()
  const tags = (job.tags ?? []).join(' ').toLowerCase()
  const combined = t + ' ' + tags
  if (combined.match(/qa|quality|test|sdet/)) return 'QA & Testing'
  if (combined.match(/data|analyst|bi |sql|reporting/)) return 'Data & Analytics'
  if (combined.match(/cloud|devops|infra|sre|kubernetes|docker/)) return 'Cloud & DevOps'
  if (combined.match(/security|soc|cyber|grc/)) return 'Cybersecurity'
  if (combined.match(/ai |automation|workflow|n8n|zapier/)) return 'AI & Automation'
  if (combined.match(/marketing|seo|social media|digital|e-commerce/)) return 'Marketing & Digital'
  if (combined.match(/it support|helpdesk|help desk|service desk|desktop support/)) return 'IT Support'
  if (combined.match(/coordinator|assistant|admin|operations|virtual/)) return 'Operations & Admin'
  return 'Software Development'
}

function CompanyAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const idx = (name.charCodeAt(0) + name.length) % AVATAR_COLORS.length
  const cls = size === 'sm'
    ? 'w-8 h-8 rounded-lg text-xs'
    : 'w-10 h-10 rounded-xl text-sm'
  return (
    <div className={`${cls} ${AVATAR_COLORS[idx]} border flex items-center justify-center shrink-0 font-bold`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-800 rounded-lg w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-14 bg-slate-800 rounded-full" />
            <div className="h-5 w-10 bg-slate-800 rounded-full" />
            <div className="h-5 w-16 bg-slate-800 rounded-full" />
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-800 shrink-0" />
      </div>
    </div>
  )
}

export default function JobRadar() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filtered, setFiltered] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<JobCategory>('All')
  const [tab, setTab] = useState<'discover' | 'saved' | 'applied' | 'dream'>('discover')
  const [testingPush, setTestingPush] = useState(false)
  const [pushTestResult, setPushTestResult] = useState<string | null>(null)
  const [expanding, setExpanding] = useState<string | null>(null)
  const [applying, setApplying] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState<{ id: string; text: string } | null>(null)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [noDegree, setNoDegree] = useState(false)
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('match_score', { ascending: false })
      .limit(500)
    const real = (data ?? []).filter(j =>
      /^(remotive|remoteok|jobicy|arbeitnow|workingnomads|getonboard|torre|greenhouse)-/.test(j.external_id)
    )
    setJobs(real)
    setLoading(false)
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dismissed') ?? '[]')
      if (stored.length > 0) setDismissed(new Set(stored))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    let list = jobs.filter(j => !dismissed.has(j.id))
    if (tab === 'saved') list = list.filter(j => j.saved)
    if (tab === 'applied') list = list.filter(j => j.applied)
    if (category !== 'All') list = list.filter(j => categoryFromJob(j) === category)
    if (noDegree) {
      list = list.filter(j => {
        const d = (j.description ?? '').toLowerCase()
        return !d.match(/bachelor'?s? degree required|bs\/ba required|require.{0,20}degree|degree.{0,20}required|must have.{0,20}degree/)
      })
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    }
    setFiltered(list)
  }, [jobs, tab, category, search, dismissed, noDegree])

  async function toggleSave(job: Job) {
    const saved = !job.saved
    await supabase.from('jobs').update({ saved }).eq('id', job.id)
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, saved } : j))
  }

  function dismissJob(job: Job) {
    const next = new Set(dismissed)
    next.add(job.id)
    setDismissed(next)
    try { localStorage.setItem('dismissed', JSON.stringify([...next])) } catch { /* ignore */ }
  }

  async function applyToJob(job: Job) {
    setApplying(job.id)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id }),
      })
      const data = await res.json()
      if (data.cover_letter) {
        setCoverLetter({ id: job.id, text: data.cover_letter })
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j))
      } else {
        setCoverLetter({ id: job.id, text: data.error ?? 'Failed to generate cover letter. Please try again.' })
      }
    } catch {
      setCoverLetter({ id: job.id, text: 'Network error — could not generate cover letter.' })
    } finally {
      setApplying(null)
    }
  }

  async function enablePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
      const padding = '='.repeat((4 - (vapidKey.length % 4)) % 4)
      const base64 = (vapidKey + padding).replace(/-/g, '+').replace(/_/g, '/')
      const raw = window.atob(base64)
      const keyBytes = new Uint8Array(raw.length)
      for (let i = 0; i < raw.length; i++) keyBytes[i] = raw.charCodeAt(i)
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes })
      await fetch('/api/push', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) })
      setPushEnabled(true)
    } catch (err) {
      console.error('Push subscription failed:', err)
    }
  }

  async function refreshJobs() {
    setRefreshing(true)
    await fetch('/api/scrape')
    await fetchJobs()
    setRefreshing(false)
  }

  async function testPush() {
    setTestingPush(true)
    setPushTestResult(null)
    try {
      const res = await fetch('/api/push-test')
      const data = await res.json()
      if (data.error) setPushTestResult(`❌ ${data.error}`)
      else setPushTestResult(`✅ Sent to ${data.sent} device(s)`)
    } catch {
      setPushTestResult('❌ Failed')
    } finally {
      setTestingPush(false)
    }
  }

  function changeTab(t: typeof tab) {
    setTab(t)
    setCategory('All')
  }

  const stats = {
    total: jobs.length,
    highMatch: jobs.filter(j => (j.match_score ?? 0) >= 70).length,
    saved: jobs.filter(j => j.saved).length,
    applied: jobs.filter(j => j.applied).length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans" style={{ overscrollBehavior: 'none' }}>

      {/* ── Sticky glassmorphism header ──────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-slate-800/50 bg-[#0d0d14]/85 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-yellow-400/15 border border-yellow-500/30 flex items-center justify-center">
              <Zap size={14} className="text-yellow-400" />
            </div>
            <span className="font-bold tracking-tight">Job Radar</span>
            <span className="hidden sm:block text-xs text-slate-600">Jordan Morris</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 h-9 min-w-[44px] rounded-xl bg-slate-800/70 hover:bg-slate-700/70 active:scale-95 text-sm transition-all disabled:opacity-40 border border-slate-700/50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={pushEnabled ? undefined : enablePush}
              className={`flex items-center gap-1.5 px-3 h-9 min-w-[44px] rounded-xl text-sm transition-all active:scale-95 border ${
                pushEnabled
                  ? 'bg-green-900/30 border-green-700/50 text-green-400'
                  : 'bg-slate-800/70 hover:bg-slate-700/70 border-slate-700/50'
              }`}
            >
              {pushEnabled ? <Bell size={13} /> : <BellOff size={13} />}
              <span className="hidden sm:inline">{pushEnabled ? 'Alerts On' : 'Alerts'}</span>
            </button>
          </div>
        </div>

        {/* Desktop tab bar (underline style) */}
        <div className="hidden sm:flex max-w-6xl mx-auto px-4">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => changeTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                tab === key
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 pt-5 pb-28 sm:pb-10">

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {[
            { label: 'Total Jobs', value: stats.total, icon: Briefcase, accent: 'bg-blue-500', text: 'text-blue-400' },
            { label: 'High Match', value: stats.highMatch, icon: Star, accent: 'bg-green-500', text: 'text-green-400' },
            { label: 'Saved', value: stats.saved, icon: BookmarkCheck, accent: 'bg-yellow-500', text: 'text-yellow-400' },
            { label: 'Applied', value: stats.applied, icon: CheckCircle, accent: 'bg-purple-500', text: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 overflow-hidden">
              <div className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full ${s.accent} opacity-70`} />
              <div className={`${s.text} mb-2`}><s.icon size={14} /></div>
              <div className="text-2xl font-bold tabular-nums">{loading ? <span className="text-slate-700">–</span> : s.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={15} />
          <input
            type="search"
            inputMode="search"
            placeholder="Search jobs, companies, skills…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-11 bg-slate-900/80 border border-slate-800 rounded-xl text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 focus:bg-slate-900 transition-all"
          />
        </div>

        {/* Category pills — horizontal scroll, no wrap */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-touch pb-1 mb-3">
          {JOB_CATEGORIES.map(cat => {
            const Icon = cat === 'All' ? Briefcase : (CAT_ICONS[cat] ?? Briefcase)
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium border transition-all shrink-0 active:scale-95 ${
                  category === cat
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <Icon size={11} />
                {cat}
              </button>
            )
          })}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2.5 mb-5 flex-wrap">
          <button
            onClick={() => setNoDegree(v => !v)}
            className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium border transition-all active:scale-95 ${
              noDegree
                ? 'bg-green-900/40 border-green-700/60 text-green-400'
                : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
            }`}
          >
            <CheckCircle size={11} />
            No Degree Required
          </button>
          {pushEnabled && (
            <>
              <button
                onClick={testPush}
                disabled={testingPush}
                className="flex items-center gap-1.5 px-3 h-8 rounded-full border border-slate-700/80 bg-slate-900 text-xs text-slate-400 hover:text-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={11} className={testingPush ? 'animate-pulse' : ''} />
                {testingPush ? 'Sending…' : 'Test Alert'}
              </button>
              {pushTestResult && <span className="text-xs text-slate-500">{pushTestResult}</span>}
            </>
          )}
        </div>

        {/* ── Dream Companies tab ──────────────────────────────────────────── */}
        {tab === 'dream' && loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {tab === 'dream' && !loading && (
          <>
            <p className="text-xs text-slate-500 mb-4">
              Active openings at top tech companies — matched live to your profile.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(DREAM_COMPANIES).map(company => {
                const companyJobs = jobs
                  .filter(j => j.company?.toLowerCase() === company.toLowerCase() && !dismissed.has(j.id))
                  .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
                if (companyJobs.length === 0) return null
                const topMatch = companyJobs[0]
                const isExpanded = expandedCompany === company
                const visibleJobs = isExpanded ? companyJobs : companyJobs.slice(0, 3)
                return (
                  <div key={company} className="bg-slate-900/60 border border-slate-700/50 hover:border-slate-600/60 active:scale-[0.99] rounded-2xl p-4 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <CompanyAvatar name={company} />
                        <div>
                          <span className="font-semibold text-sm block leading-tight">{company}</span>
                          <span className="text-[11px] text-slate-500">
                            {companyJobs.length} role{companyJobs.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${scoreBg(topMatch.match_score ?? 0)}`}>
                        <span className="text-xs font-bold tabular-nums leading-tight">{topMatch.match_score}</span>
                        <span className="text-[9px] opacity-60">%</span>
                      </div>
                    </div>
                    <div className="space-y-0">
                      {visibleJobs.map(j => (
                        <a
                          key={j.id}
                          href={j.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 text-xs text-slate-400 hover:text-white py-2 border-t border-slate-800/70 first:border-0 active:opacity-60 transition-all"
                        >
                          <span className="truncate">{j.title}</span>
                          <ExternalLink size={10} className="text-slate-600 shrink-0" />
                        </a>
                      ))}
                      {companyJobs.length > 3 && (
                        <button
                          onClick={() => setExpandedCompany(isExpanded ? null : company)}
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 pt-2 border-t border-slate-800/70 w-full transition-all active:opacity-70"
                        >
                          <ChevronDown size={11} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          {isExpanded ? 'Show less' : `+${companyJobs.length - 3} more roles`}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Job list ─────────────────────────────────────────────────────── */}
        {tab !== 'dream' && loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {tab !== 'dream' && !loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
              <Search size={24} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">
                {jobs.length === 0 ? 'No jobs yet' : 'No matches'}
              </p>
              <p className="text-slate-600 text-xs mt-1">
                {jobs.length === 0 ? 'Tap Refresh to scrape latest openings.' : 'Try a different filter or category.'}
              </p>
            </div>
          </div>
        )}

        {tab !== 'dream' && !loading && filtered.length > 0 && (
          <div className="space-y-2.5">
            {filtered.map(job => {
              const sal = salaryDisplay(job)
              const score = job.match_score ?? 0
              return (
                <div
                  key={job.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 hover:border-slate-700/80 active:scale-[0.99] transition-all"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3">
                    <CompanyAvatar name={job.company} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm leading-snug mb-0.5 line-clamp-2">{job.title}</h3>
                          <p className="text-[12px] text-slate-500 truncate">{job.company} · {job.location}</p>
                        </div>
                        {/* Score badge */}
                        <div className={`shrink-0 w-11 h-11 rounded-xl border flex flex-col items-center justify-center ${scoreBg(score)}`}>
                          <span className="text-xs font-bold tabular-nums leading-tight">{score}</span>
                          <span className="text-[9px] opacity-60">%</span>
                        </div>
                      </div>

                      {/* Match tags */}
                      {(job.match_reasons ?? []).length > 0 && (
                        <div className="flex gap-1.5 mt-2.5 overflow-x-auto scrollbar-hide scroll-touch">
                          {(job.match_reasons ?? []).slice(0, 5).map((r: string) => (
                            <span
                              key={r}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 shrink-0 whitespace-nowrap"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Salary + status */}
                      {(sal || job.applied || job.saved) && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {sal && <span className="text-[11px] text-green-500 font-medium">{sal}</span>}
                          {job.applied && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-400 border border-purple-800/60">Applied</span>
                          )}
                          {job.saved && !job.applied && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800/60">Saved</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center mt-3 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => dismissJob(job)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 active:scale-90 transition-all"
                        title="Not interested"
                      >
                        <X size={16} className="text-slate-600 hover:text-red-400 transition-colors" />
                      </button>
                      <button
                        onClick={() => toggleSave(job)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 active:scale-90 transition-all"
                      >
                        <BookmarkCheck size={16} className={job.saved ? 'text-yellow-400' : 'text-slate-600'} />
                      </button>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 active:scale-90 transition-all"
                      >
                        <ExternalLink size={16} className="text-slate-500" />
                      </a>
                    </div>
                    <button
                      onClick={() => setExpanding(expanding === job.id ? null : job.id)}
                      className="ml-auto flex items-center gap-1.5 px-3 h-9 rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-xs text-slate-500 hover:text-slate-300"
                    >
                      {expanding === job.id ? 'Close' : 'Details'}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${expanding === job.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded details */}
                  {expanding === job.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50">
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-10">
                        {job.description?.replace(/<[^>]+>/g, '').slice(0, 1200)}
                      </p>
                      {!job.applied && (
                        <button
                          onClick={() => applyToJob(job)}
                          disabled={applying === job.id}
                          className="mt-3 w-full sm:w-auto flex items-center justify-center gap-2 px-5 h-11 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60 rounded-xl text-sm font-semibold transition-all"
                        >
                          {applying === job.id ? (
                            <><RefreshCw size={13} className="animate-spin" /> Generating…</>
                          ) : (
                            <><Zap size={13} /> Apply with AI Cover Letter</>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cover letter panel */}
                  {coverLetter?.id === job.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-green-400">Generated Cover Letter</span>
                        <button
                          onClick={() => setCoverLetter(null)}
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          dismiss
                        </button>
                      </div>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 max-h-64 overflow-y-auto scroll-touch">
                        {coverLetter.text}
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(coverLetter.text)}
                        className="mt-2 text-xs px-3 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        Copy to clipboard
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav (sm: hidden on desktop) ───────────────────── */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0d0d14]/90 backdrop-blur-xl border-t border-slate-800/50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => changeTab(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-all active:opacity-60 ${
                tab === key ? 'text-yellow-400' : 'text-slate-500'
              }`}
            >
              <Icon size={21} strokeWidth={tab === key ? 2.5 : 1.5} />
              <span className={`text-[10px] font-medium ${tab === key ? 'text-yellow-400' : 'text-slate-500'}`}>
                {label}
              </span>
              {tab === key && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-yellow-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  )
}
