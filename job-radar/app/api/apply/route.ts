import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateCoverLetter } from '@/lib/ai'
import type { Job } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { job_id } = await req.json()
  if (!job_id) return NextResponse.json({ error: 'job_id required' }, { status: 400 })

  // Fetch the job
  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', job_id)
    .single()

  if (jobErr || !job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  // Generate cover letter
  const cover_letter = await generateCoverLetter(job as Job)

  // Save application record
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .insert({ job_id, cover_letter, status: 'applied' })
    .select()
    .single()

  if (appErr) return NextResponse.json({ error: appErr.message }, { status: 500 })

  // Mark job as applied
  await supabase.from('jobs').update({ applied: true }).eq('id', job_id)

  return NextResponse.json({ application: app, cover_letter })
}
