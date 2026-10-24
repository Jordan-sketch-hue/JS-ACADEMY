import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JARVIS_ENDPOINT = 'https://jarvis-wa-reader-production.up.railway.app/send'
const JARVIS_SECRET = process.env.JARVIS_WA_SECRET || 'jst-wa-send-2026'
const JORDAN_JID = '16582182282'

const POSITIVE = /\b(y|yes|yeah|yep|sure|interested|definitely|absolutely|ok|okay|yh|yea)\b/i
const NEGATIVE = /\b(n|no|nope|not interested|stop|unsubscribe|remove)\b/i

async function notifyJordan(from: string, body: string, sentiment: string) {
  const emoji = sentiment === 'positive' ? '🟢' : sentiment === 'negative' ? '🔴' : '🟡'
  const msg = `${emoji} SMS Reply\n\nFrom: ${from}\nMessage: "${body}"\n\nStatus: ${sentiment.toUpperCase()}`
  try {
    await fetch(JARVIS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-send-secret': JARVIS_SECRET },
      body: JSON.stringify({ jid: JORDAN_JID, text: msg })
    })
  } catch (e) {
    console.error('WA notify failed:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const event = payload?.data?.event_type

    // Handle delivery receipts — update sms_outbound delivered status
    if (event === 'message.finalized') {
      const msg = payload?.data?.payload
      const telnyxId: string = msg?.id || ''
      const status: string = msg?.to?.[0]?.status || ''
      if (telnyxId) {
        await supabase
          .from('sms_outbound')
          .update({ delivered: status === 'delivered', delivery_status: status })
          .eq('telnyx_id', telnyxId)
      }
      return NextResponse.json({ ok: true })
    }

    if (event !== 'message.received') {
      return NextResponse.json({ ok: true })
    }

    const msg = payload?.data?.payload
    const from: string = msg?.from?.phone_number || ''
    const body: string = (msg?.text || '').trim()
    const to: string = msg?.to?.[0]?.phone_number || ''

    let sentiment = 'neutral'
    if (POSITIVE.test(body)) sentiment = 'positive'
    else if (NEGATIVE.test(body)) sentiment = 'negative'

    await supabase.from('sms_replies').insert({
      from_number: from,
      to_number: to,
      body,
      sentiment,
      raw: payload,
      created_at: new Date().toISOString()
    })

    await notifyJordan(from, body, sentiment)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('sms-webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
