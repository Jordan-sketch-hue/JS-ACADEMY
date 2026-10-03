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

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-slate-400'
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
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dismissed') ?? '[]')) } catch { return new Set() }
  })

  const fetchJobs = useCallback(async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('match_score', { ascending: false })
      .limit(200)
    // filter out fake seed jobs (non-numeric IDs) and dismissed jobs
    const real = (data ?? []).filter(j => /^(remotive|remoteok|jobicy|arbeitnow|workingnomads|getonboard|torre)-/.test(j.external_id))
    setJobs(real)
    setLoading(false)
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    let list = jobs.filter(j => !dismissed.has(j.id))
    if (tab === 'saved') list = list.filter(j => j.saved)
    if (tab === 'applied') list = list.filter(j => j.applied)
    if (category !== 'All') list = list.filter(j => categoryFromJob(j) === category)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    }
    setFiltered(list)
  }, [jobs, tab, category, search, dismissed])

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
      }
    } finally {
      setApplying(null)
    }
  }

  async function enablePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    const reg = await navigator.serviceWorker.register('/sw.js')
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })
    await fetch('/api/push', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) })
    setPushEnabled(true)
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

  const stats = {
    total: jobs.length,
    highMatch: jobs.filter(j => (j.match_score ?? 0) >= 70).length,
    saved: jobs.filter(j => j.saved).length,
    applied: jobs.filter(j => j.applied).length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0d0d14] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-400" size={22} />
            <span className="text-lg font-bold tracking-tight">Job Radar</span>
            <span className="text-xs text-slate-500 hidden sm:block">Jordan Morris · Niche Match Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={pushEnabled ? undefined : enablePush}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
                pushEnabled ? 'bg-green-900/40 text-green-400' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {pushEnabled ? <Bell size={13} /> : <BellOff size={13} />}
              {pushEnabled ? 'Alerts On' : 'Enable Alerts'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'text-blue-400' },
            { label: 'High Match (70+)', value: stats.highMatch, icon: Star, color: 'text-green-400' },
            { label: 'Saved', value: stats.saved, icon: BookmarkCheck, color: 'text-yellow-400' },
            { label: 'Applied', value: stats.applied, icon: CheckCircle, color: 'text-purple-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className={`${s.color} mb-1`}><s.icon size={16} /></div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {(['discover', 'saved', 'applied', 'dream'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition flex items-center gap-1 ${
                  tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'dream' && <Building2 size={11} />}
                {t === 'dream' ? 'Dream Co.' : t}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search jobs, companies, tags…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {JOB_CATEGORIES.map(cat => {
            const Icon = cat === 'All' ? Briefcase : (CAT_ICONS[cat] ?? Briefcase)
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                  category === cat
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                <Icon size={11} />
                {cat}
              </button>
            )
          })}
        </div>

        {/* Push test button — shown when alerts enabled */}
        {pushEnabled && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={testPush}
              disabled={testingPush}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs transition disabled:opacity-50"
            >
              <Send size={11} className={testingPush ? 'animate-pulse' : ''} />
              {testingPush ? 'Sending…' : 'Test Alert'}
            </button>
            {pushTestResult && <span className="text-xs text-slate-400">{pushTestResult}</span>}
          </div>
        )}

        {/* Dream Companies tab */}
        {tab === 'dream' && (
          <div>
            <p className="text-xs text-slate-500 mb-4">
              Top stable tech companies with active openings matching your profile — scraped live from their job boards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.keys(DREAM_COMPANIES).map(company => {
                const companyJobs = jobs
                  .filter(j => j.company?.toLowerCase() === company.toLowerCase() && !dismissed.has(j.id))
                  .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
                if (companyJobs.length === 0) return null
                const topMatch = companyJobs[0]
                return (
                  <div key={company} className="bg-slate-900/60 border border-slate-600 hover:border-slate-500 rounded-xl p-4 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-blue-400" />
                        <span className="font-semibold text-sm">{company}</span>
                      </div>
                      {topMatch ? (
                        <span className={`text-xs font-bold tabular-nums ${scoreColor(topMatch.match_score ?? 0)}`}>
                          {topMatch.match_score}% match
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">No matches yet</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {companyJobs.slice(0, 3).map(j => (
                        <a
                          key={j.id}
                          href={j.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 text-xs text-slate-300 hover:text-white py-1 border-t border-slate-800 first:border-0"
                        >
                          <span className="truncate">{j.title}</span>
                          <ExternalLink size={10} className="text-slate-500 shrink-0" />
                        </a>
                      ))}
                      {companyJobs.length > 3 && (
                        <p className="text-xs text-slate-500 pt-1 border-t border-slate-800">+{companyJobs.length - 3} more open roles</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab !== 'dream' && loading ? (
          <div className="text-center py-20 text-slate-500">Loading jobs…</div>
        ) : tab !== 'dream' && filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            {jobs.length === 0 ? 'No jobs yet — click Refresh to scrape.' : 'No jobs match this filter.'}
          </div>
        ) : tab !== 'dream' ? (
          <div className="space-y-3">
            {filtered.map(job => (
              <div
                key={job.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold tabular-nums ${scoreColor(job.match_score ?? 0)}`}>
                        {job.match_score ?? 0}%
                      </span>
                      <h3 className="font-semibold text-sm truncate">{job.title}</h3>
                      {job.applied && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-400 border border-purple-800">Applied</span>
                      )}
                      {job.saved && !job.applied && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800">Saved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                      <span>{job.company}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      {salaryDisplay(job) && <><span>·</span><span className="text-green-500">{salaryDisplay(job)}</span></>}
                      <span>·</span>
                      <span className="capitalize">{job.source}</span>
                    </div>
                    {(job.match_reasons ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(job.match_reasons ?? []).slice(0, 4).map((r: string) => (
                          <span key={r} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{r}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => dismissJob(job)} className="p-2 rounded-lg hover:bg-slate-800 transition" title="Not interested">
                      <X size={14} className="text-slate-600 hover:text-red-400" />
                    </button>
                    <button onClick={() => toggleSave(job)} className="p-2 rounded-lg hover:bg-slate-800 transition">
                      <BookmarkCheck size={14} className={job.saved ? 'text-yellow-400' : 'text-slate-600'} />
                    </button>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-slate-800 transition">
                      <ExternalLink size={14} className="text-slate-500" />
                    </a>
                    <button
                      onClick={() => setExpanding(expanding === job.id ? null : job.id)}
                      className="p-2 rounded-lg hover:bg-slate-800 transition"
                    >
                      <ChevronDown size={14} className={`text-slate-500 transition-transform ${expanding === job.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded: description + apply */}
                {expanding === job.id && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-10">
                      {job.description?.replace(/<[^>]+>/g, '').slice(0, 1200)}
                    </p>
                    {!job.applied && (
                      <button
                        onClick={() => applyToJob(job)}
                        disabled={applying === job.id}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-lg text-sm font-medium transition"
                      >
                        {applying === job.id ? (
                          <><RefreshCw size={13} className="animate-spin" /> Generating cover letter…</>
                        ) : (
                          <><Zap size={13} /> Apply with AI Cover Letter</>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Cover letter */}
                {coverLetter?.id === job.id && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-green-400">Generated Cover Letter</span>
                      <button onClick={() => setCoverLetter(null)} className="text-xs text-slate-500 hover:text-slate-300">dismiss</button>
                    </div>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 rounded-lg p-3 border border-slate-800">
                      {coverLetter.text}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(coverLetter.text)}
                      className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                    >Copy to clipboard</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}
