import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type Job = {
  id: string
  title: string
  company: string
  location: string
  url: string
  description: string
  tags: string[]
  salary_min: number | null
  salary_max: number | null
  currency: string | null
  job_type: string // remote | hybrid | onsite
  match_score: number | null
  match_reasons: string[]
  source: string
  posted_at: string
  scraped_at: string
  applied: boolean
  saved: boolean
}

export type ApplicationRecord = {
  id: string
  job_id: string
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'ghosted'
  cover_letter: string
  applied_at: string
  notes: string
  job?: Job
}
