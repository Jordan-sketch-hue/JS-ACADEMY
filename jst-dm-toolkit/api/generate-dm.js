const { createClient } = require('@supabase/supabase-js')

const CATEGORY_ANGLES = {
  fashion: 'online store revenue and paid campaigns',
  beauty: 'bookings and new client acquisition',
  food: 'online ordering and local visibility',
  bakery: 'custom order forms and local campaigns',
  furniture: 'premium showroom site and sales funnel',
  retail: 'product catalogues and inventory campaigns',
  automotive: 'local search ads and service bookings',
  logistics: 'B2B lead generation and credibility',
  packaging: 'portfolio site and quote generation',
  creative: 'portfolio site that closes clients passively',
  floral: 'seasonal campaigns and event lead capture',
  accessories: 'branded store and conversion campaigns',
  events: 'ticket sales and advance bookings',
  techrepair: 'local search ranking and walk-in traffic',
  crafts: 'custom portfolio and targeted outreach',
  realestate: 'listing leads and agent visibility',
  wellness: 'membership site and client retention',
  hospitality: 'booking site and experience campaigns',
  lifestyle: 'monetisation site and audience conversion',
  branding: 'website, marketing, and sales systems',
  general: 'online presence and sales growth',
}

const HOOK_STRATEGIES = [
  'Open by naming a specific missed opportunity for their niche â€” something they are likely losing money on right now.',
  'Open with a direct observation about what businesses like theirs struggle with online.',
  'Open with a bold claim about what a proper digital presence does for their niche.',
  'Open by referencing what their competitors are doing that they might be missing.',
  'Open with a question that highlights a gap in their current online reach.',
  'Open by calling out the gap between their real-world quality and their online presence.',
  'Open by speaking to the frustration of getting ignored online despite having a great product.',
  'Open by naming the single biggest growth lever for their niche that most businesses ignore.',
]

function svc() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { lead_id, username, display_name, category, followers, force } = req.body
  if (!lead_id) return res.status(400).json({ error: 'lead_id required' })

  const sb = svc()

  if (!force) {
    const { data: existing } = await sb.from('tiktok_leads').select('message').eq('id', lead_id).single()
    if (existing?.message) return res.status(200).json({ message: existing.message, cached: true })
  }

  const angle = CATEGORY_ANGLES[category] || CATEGORY_ANGLES.general
  const hook = HOOK_STRATEGIES[Math.floor(Math.random() * HOOK_STRATEGIES.length)]
  const followerCtx = followers > 10000
    ? `They have ${(followers / 1000).toFixed(0)}K followers.`
    : followers > 0 ? `They have ${followers} followers.` : ''

  const prompt = `You are writing a cold TikTok DM for J Supreme Tech, a Jamaican digital agency, to send to @${username}${display_name && display_name !== username ? ` ("${display_name}")` : ''} who is in the ${category} niche. ${followerCtx}

HOOK STRATEGY (you must follow this exactly): ${hook}

Rules:
- 2-3 sentences maximum
- No emoji, no exclamation marks
- Do NOT start with "Hi", "Hello", "Hey", "Great", or any generic greeting
- Do NOT use the phrases: "needs to be found online", "deserves more than", "fully-booked", "high-ticket", "while you sleep"
- Do NOT use: "free", "reply", "click", "offer", "deal", "DM back", "limited", "PREVIEW"
- Reference J Supreme Tech's speciality in ${angle} naturally
- End with a soft conversational close — vary it each time, something like "put something together for you if you want to see it" or "happy to show you what that looks like" or "worth a look if you're open to it" — never the same phrasing twice
- Each message must feel written specifically for this account, not copy-pasted

Output ONLY the message. No quotes, no labels, no explanation.`

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').replace(/^ï»¿/, '').trim()
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })

  const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 200, messages: [{ role: 'user', content: prompt }] }),
  })

  if (!aiRes.ok) {
    const err = await aiRes.text()
    return res.status(500).json({ error: `Claude API error: ${err}` })
  }

  const aiData = await aiRes.json()
  const message = aiData.content?.[0]?.text?.trim()
  if (!message) return res.status(500).json({ error: 'Empty response from Claude' })

  await sb.from('tiktok_leads').update({ message }).eq('id', lead_id)
  return res.status(200).json({ message, cached: false })
}

