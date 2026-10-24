import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SENTIMENT_LABEL: Record<string, { label: string; color: string }> = {
  positive: { label: 'INTERESTED', color: '#22c55e' },
  negative: { label: 'NOT INTERESTED', color: '#ef4444' },
  neutral:  { label: 'UNCLEAR', color: '#f59e0b' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export const revalidate = 30

export default async function SmsLeadsPage() {
  const { data: replies } = await supabase
    .from('sms_replies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const all = replies || []
  const positive = all.filter(r => r.sentiment === 'positive')
  const negative = all.filter(r => r.sentiment === 'negative')
  const neutral  = all.filter(r => r.sentiment === 'neutral')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase', marginBottom: 6 }}>J Supreme Tech</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>SMS Replies</h1>
          <p style={{ color: '#555', margin: '6px 0 0', fontSize: 13 }}>Inbound replies to Telnyx outreach — auto-refreshes every 30s</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Interested', count: positive.length, color: '#22c55e' },
            { label: 'Not Interested', count: negative.length, color: '#ef4444' },
            { label: 'Unclear', count: neutral.length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {all.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>No replies yet — send the SMS blast first.</p>
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  {['Number', 'Message', 'Status', 'Time'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {all.map((r, i) => {
                  const s = SENTIMENT_LABEL[r.sentiment] || SENTIMENT_LABEL.neutral
                  return (
                    <tr key={r.id} style={{ borderBottom: i < all.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#ccc', whiteSpace: 'nowrap' }}>{r.from_number}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#fff', maxWidth: 320 }}>{r.body}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: s.color, background: `${s.color}18`, padding: '3px 8px', borderRadius: 4 }}>{s.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#555', whiteSpace: 'nowrap' }}>{timeAgo(r.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
