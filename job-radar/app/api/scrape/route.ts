import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { scrapeRemotive, scrapeRemoteOK, enrichJobs } from '@/lib/scraper'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function runScrape() {
    // Scrape all sources in parallel
    const [remotive, remoteok] = await Promise.all([
      scrapeRemotive(),
      scrapeRemoteOK(),
    ])

    const allRaw = [...remotive, ...remoteok]
    const scored = enrichJobs(allRaw)

    if (scored.length === 0) {
      return NextResponse.json({ inserted: 0, message: 'No matching jobs found' })
    }

    // Upsert (ignore duplicates by external_id)
    const { error, data: inserted } = await supabase
      .from('jobs')
      .upsert(
        scored.map(j => ({
          external_id: j.external_id,
          title: j.title,
          company: j.company,
          location: j.location,
          url: j.url,
          description: j.description.slice(0, 5000),
          tags: j.tags,
          salary_min: j.salary_min,
          salary_max: j.salary_max,
          currency: j.currency,
          job_type: j.job_type,
          match_score: j.match_score,
          match_reasons: j.match_reasons,
          source: j.source,
          posted_at: j.posted_at,
          scraped_at: new Date().toISOString(),
        })),
        { onConflict: 'external_id', ignoreDuplicates: true }
      )
      .select('id')

    if (error) throw error

    // Send push notifications for high-match new jobs
    const topJobs = scored.filter(j => j.match_score >= 70)
    if (topJobs.length > 0) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': process.env.CRON_SECRET! },
        body: JSON.stringify({
          title: `${topJobs.length} new matching job${topJobs.length > 1 ? 's' : ''}`,
          body: topJobs.slice(0, 3).map(j => `${j.title} at ${j.company}`).join(' · '),
          url: process.env.NEXT_PUBLIC_APP_URL,
        }),
      }).catch(() => {}) // non-fatal
    }

    return NextResponse.json({ inserted: inserted?.length ?? 0, total_scraped: allRaw.length, matched: scored.length })
  } catch (err: any) {
    console.error('Scrape error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runScrape()
}

export async function GET() {
  return runScrape()
}
