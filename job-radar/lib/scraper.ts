// Job scraper — pulls from free APIs and RSS feeds
// Runs as a Railway cron (POST /api/scrape with CRON_SECRET header)

import { scoreJob, RESUME } from './resume'

export interface RawJob {
  external_id: string
  title: string
  company: string
  location: string
  url: string
  description: string
  tags: string[]
  salary_min: number | null
  salary_max: number | null
  currency: string | null
  job_type: string
  source: string
  posted_at: string
}

// ── Remotive API (free, no key needed) ──────────────────────────────────────
export async function scrapeRemotive(): Promise<RawJob[]> {
  const categories = ['software-dev', 'qa', 'data', 'devops-sysadmin', 'product']
  const all: RawJob[] = []

  for (const cat of categories) {
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${cat}&limit=30`)
      if (!res.ok) continue
      const { jobs } = await res.json()
      for (const j of jobs ?? []) {
        all.push({
          external_id: `remotive-${j.id}`,
          title: j.title ?? '',
          company: j.company_name ?? '',
          location: j.candidate_required_location ?? 'Worldwide',
          url: j.url ?? '',
          description: j.description ?? '',
          tags: j.tags ?? [],
          salary_min: null,
          salary_max: null,
          currency: null,
          job_type: 'remote',
          source: 'remotive',
          posted_at: j.publication_date ?? new Date().toISOString(),
        })
      }
    } catch (_) { /* skip category on error */ }
  }
  return all
}

// ── RemoteOK API (free) ──────────────────────────────────────────────────────
export async function scrapeRemoteOK(): Promise<RawJob[]> {
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'JobRadar/1.0 (jordanroad631@gmail.com)' }
    })
    if (!res.ok) return []
    const data = await res.json()
    const jobs = Array.isArray(data) ? data.filter((j: any) => j.id) : []

    return jobs.map((j: any): RawJob => ({
      external_id: `remoteok-${j.id}`,
      title: j.position ?? '',
      company: j.company ?? '',
      location: j.location ?? 'Remote',
      url: `https://remoteok.com/remote-jobs/${j.slug}`,
      description: j.description ?? '',
      tags: j.tags ?? [],
      salary_min: j.salary_min ? parseInt(j.salary_min) : null,
      salary_max: j.salary_max ? parseInt(j.salary_max) : null,
      currency: j.salary_min ? 'USD' : null,
      job_type: 'remote',
      source: 'remoteok',
      posted_at: j.date ?? new Date().toISOString(),
    }))
  } catch (_) { return [] }
}

// ── Score and filter ─────────────────────────────────────────────────────────
export function enrichJobs(jobs: RawJob[]) {
  return jobs.map(job => {
    const { score, reasons } = scoreJob(job.title, job.description)
    return { ...job, match_score: score, match_reasons: reasons }
  }).filter(j => j.match_score >= 30) // only keep relevant jobs
}
