import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

webpush.setVapidDetails(
  'mailto:jordanroad631@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function GET() {
  const { data: subs } = await supabase.from('push_subscriptions').select('*')
  if (!subs || subs.length === 0) {
    return NextResponse.json({ error: 'No subscribers — click Enable Alerts first' }, { status: 400 })
  }

  const payload = JSON.stringify({
    title: '🎯 Job Radar Test Alert',
    body: 'Push notifications are working! High-match jobs will appear here.',
    url: process.env.NEXT_PUBLIC_APP_URL,
  })

  let sent = 0
  await Promise.allSettled(
    subs.map(async (s: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        )
        sent++
      } catch (err: any) {
        if (err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
        }
      }
    })
  )

  return NextResponse.json({ sent, subscribers: subs.length })
}
