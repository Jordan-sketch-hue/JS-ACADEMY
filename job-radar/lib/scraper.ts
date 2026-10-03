import { scoreJob } from './resume'

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

// ── Remotive API ─────────────────────────────────────────────────────────────
export async function scrapeRemotive(): Promise<RawJob[]> {
  const categories = ['software-dev', 'qa', 'data', 'devops-sysadmin', 'product', 'marketing', 'customer-support']
  const all: RawJob[] = []
  for (const cat of categories) {
    try {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${cat}&limit=50`)
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
          salary_min: null, salary_max: null, currency: null,
          job_type: 'remote',
          source: 'remotive',
          posted_at: j.publication_date ?? new Date().toISOString(),
        })
      }
    } catch (_) { /* skip */ }
  }
  return all
}

// ── RemoteOK API ─────────────────────────────────────────────────────────────
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
      url: j.url || `https://remoteok.com/remote-jobs/${j.id}`,
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

// ── Jobicy API (free, global remote jobs) ────────────────────────────────────
export async function scrapeJobicy(): Promise<RawJob[]> {
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=50&geo=worldwide', {
      headers: { 'User-Agent': 'JobRadar/1.0 (jordanroad631@gmail.com)' }
    })
    if (!res.ok) return []
    const data = await res.json()
    const jobs: any[] = data.jobs ?? []
    return jobs.map((j): RawJob => ({
      external_id: `jobicy-${j.id}`,
      title: j.jobTitle ?? '',
      company: j.companyName ?? '',
      location: j.jobGeo ?? 'Remote',
      url: j.url ?? '',
      description: `${j.jobExcerpt ?? ''} ${j.jobType ?? ''}`,
      tags: j.jobIndustry ? [j.jobIndustry] : [],
      salary_min: null, salary_max: null, currency: null,
      job_type: j.jobType ?? 'remote',
      source: 'jobicy',
      posted_at: j.pubDate ?? new Date().toISOString(),
    }))
  } catch (_) { return [] }
}

// ── Arbeitnow API (free, remote + EU-friendly) ───────────────────────────────
export async function scrapeArbeitnow(): Promise<RawJob[]> {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api?page=1')
    if (!res.ok) return []
    const { data: jobs } = await res.json()
    return (jobs ?? []).filter((j: any) => j.remote).map((j: any): RawJob => ({
      external_id: `arbeitnow-${j.slug}`,
      title: j.title ?? '',
      company: j.company_name ?? '',
      location: j.location ?? 'Remote',
      url: j.url ?? '',
      description: j.description ?? '',
      tags: j.tags ?? [],
      salary_min: null, salary_max: null, currency: null,
      job_type: 'remote',
      source: 'arbeitnow',
      posted_at: (typeof j.created_at === 'number') ? new Date(j.created_at * 1000).toISOString() : (j.created_at ?? new Date().toISOString()),
    }))
  } catch (_) { return [] }
}

// ── Working Nomads API (remote jobs, LATAM-friendly) ─────────────────────────
export async function scrapeWorkingNomads(): Promise<RawJob[]> {
  const categories = ['developer', 'design', 'quality-assurance', 'data', 'system-administrator', 'marketing']
  const all: RawJob[] = []
  for (const cat of categories) {
    try {
      const res = await fetch(`https://www.workingnomads.com/api/exposed_jobs/?category=${cat}&limit=30`)
      if (!res.ok) continue
      const jobs: any[] = await res.json()
      for (const j of jobs ?? []) {
        all.push({
          external_id: `workingnomads-${j.id}`,
          title: j.title ?? '',
          company: j.company_name ?? '',
          location: j.location ?? 'Remote',
          url: j.url ?? '',
          description: j.description ?? '',
          tags: j.tags ? j.tags.split(',').map((t: string) => t.trim()) : [],
          salary_min: null, salary_max: null, currency: null,
          job_type: 'remote',
          source: 'workingnomads',
          posted_at: j.pub_date ?? new Date().toISOString(),
        })
      }
    } catch (_) { /* skip */ }
  }
  return all
}

// ── GetOnBoard API (LATAM-focused tech jobs) ──────────────────────────────────
export async function scrapeGetOnBoard(): Promise<RawJob[]> {
  const queries = ['javascript', 'python', 'react', 'data', 'qa', 'devops']
  const seen = new Set<string>()
  const all: RawJob[] = []
  for (const q of queries) {
    try {
      const res = await fetch(`https://www.getonbrd.com/api/v0/search/jobs?q=${q}&per_page=20&page=1&expand=["company"]`)
      if (!res.ok) continue
      const { data: jobs } = await res.json()
      for (const j of jobs ?? []) {
        const id = `getonboard-${j.id}`
        if (seen.has(id)) continue
        seen.add(id)
        all.push({
          external_id: id,
          title: j.attributes?.title ?? '',
          company: j.attributes?.company?.data?.attributes?.name ?? '',
          location: j.attributes?.remote ? 'Remote / LATAM' : (j.attributes?.country ?? 'LATAM'),
          url: j.attributes?.applications_url ?? `https://www.getonbrd.com/jobs/${j.id}`,
          description: j.attributes?.description ?? '',
          tags: j.attributes?.categories ?? [],
          salary_min: j.attributes?.minSalary ?? null,
          salary_max: j.attributes?.maxSalary ?? null,
          currency: j.attributes?.currency ?? null,
          job_type: j.attributes?.remote ? 'remote' : 'hybrid',
          source: 'getonboard',
          posted_at: j.attributes?.published_at ?? new Date().toISOString(),
        })
      }
    } catch (_) { /* skip */ }
  }
  return all
}

// ── Torre.ai API (LATAM/Caribbean remote jobs) ────────────────────────────────
export async function scrapeTorre(): Promise<RawJob[]> {
  try {
    const res = await fetch('https://torre.ai/api/opportunities/_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aggregate: false,
        lang: 'en',
        remote: true,
        size: 50,
        skill: [{ name: 'JavaScript' }, { name: 'Python' }, { name: 'React' }],
      }),
    })
    if (!res.ok) return []
    const { results } = await res.json()
    return (results ?? []).map((j: any): RawJob => ({
      external_id: `torre-${j.id}`,
      title: j.objective ?? '',
      company: j.organizations?.[0]?.name ?? '',
      location: j.locations?.[0]?.name ?? 'Remote',
      url: `https://torre.ai/jobs/${j.id}`,
      description: j.details ?? '',
      tags: (j.skills ?? []).slice(0, 8).map((s: any) => s.name),
      salary_min: j.compensation?.minAmount ?? null,
      salary_max: j.compensation?.maxAmount ?? null,
      currency: j.compensation?.currency ?? null,
      job_type: 'remote',
      source: 'torre',
      posted_at: j.published_at ?? j.created_at ?? new Date().toISOString(),
    }))
  } catch (_) { return [] }
}

// ── Dream Companies — Greenhouse ATS (free public API) ───────────────────────
// Top stable Fortune 500 / major tech companies that use Greenhouse
export const DREAM_COMPANIES: Record<string, string> = {
  'Stripe':        'stripe',
  'Cloudflare':    'cloudflare',
  'HubSpot':       'hubspot',
  'Twilio':        'twilio',
  'MongoDB':       'mongodb',
  'GitLab':        'gitlab',
  'Datadog':       'datadoghq',
  'Figma':         'figma',
  'Notion':        'notion',
  'Coinbase':      'coinbase',
  'Dropbox':       'dropbox',
  'Squarespace':   'squarespace',
  'Duolingo':      'duolingo',
  'Brex':          'brex',
  'Plaid':         'plaid',
  'DoorDash':      'doordash',
  'Robinhood':     'robinhood',
  'Intercom':      'intercom',
  'Zendesk':       'zendesk',
  'PagerDuty':     'pagerduty',
  'Fastly':        'fastly',
  'Yelp':          'yelp',
  'Discord':       'discord',
  'Reddit':        'reddit',
  'Canva':         'canva',
  'Grammarly':     'grammarly',
  'Asana':         'asana',
  'Gusto':         'gusto',
  'Benchling':     'benchling',
  'Scale AI':      'scaleai',
}

export async function scrapeGreenhouse(): Promise<RawJob[]> {
  const all: RawJob[] = []
  await Promise.allSettled(
    Object.entries(DREAM_COMPANIES).map(async ([companyName, slug]) => {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, {
          headers: { 'User-Agent': 'JobRadar/1.0 (jordanroad631@gmail.com)' }
        })
        if (!res.ok) return
        const { jobs } = await res.json()
        for (const j of (jobs ?? []).slice(0, 20)) {
          all.push({
            external_id: `greenhouse-${j.id}`,
            title: j.title ?? '',
            company: companyName,
            location: j.location?.name ?? 'Remote',
            url: j.absolute_url ?? '',
            description: j.content ?? '',
            tags: (j.departments ?? []).map((d: any) => d.name),
            salary_min: null, salary_max: null, currency: null,
            job_type: (j.location?.name ?? '').toLowerCase().includes('remote') ? 'remote' : 'hybrid',
            source: 'greenhouse',
            posted_at: j.updated_at ?? new Date().toISOString(),
          })
        }
      } catch (_) { /* skip company */ }
    })
  )
  return all
}

// ── Score and filter ─────────────────────────────────────────────────────────
export function enrichJobs(jobs: RawJob[]) {
  return jobs.map(job => {
    const { score, reasons } = scoreJob(job.title, job.description)
    return { ...job, match_score: score, match_reasons: reasons }
  }).filter(j => j.match_score >= 30)
}
