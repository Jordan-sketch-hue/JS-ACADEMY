const { createClient } = require('@supabase/supabase-js')

const CATEGORY_GAPS = {
  fashion: 'getting views but losing the sale because there is no proper online store or checkout to send people to',
  beauty: 'filling their page but struggling to convert viewers into actual bookings',
  food: 'building an audience but missing a simple way for people to order or find them online',
  bakery: 'getting attention but losing orders because there is no booking system or order form',
  furniture: 'showing great products but not capturing the people who are ready to buy',
  retail: 'driving content but missing a proper catalogue and checkout for online sales',
  automotive: 'getting local views but not showing up when people actually search for the service',
  logistics: 'doing solid work but not presenting it in a way that wins B2B clients online',
  packaging: 'doing impressive work but not having a portfolio that generates quote requests',
  creative: 'building a following but not having a site that actually closes clients passively',
  floral: 'getting seasonal attention but not capturing event and wedding leads ahead of time',
  accessories: 'getting good reach but losing the sale because the buying experience is not there yet',
  events: 'creating buzz but not having a system that actually converts it to ticket sales',
  techrepair: 'getting views but not ranking locally when people search for the repair they need',
  crafts: 'showing great work but not having a portfolio that handles custom order requests',
  realestate: 'creating content but not capturing listing leads or directing serious buyers anywhere',
  wellness: 'building a community but not having a membership or booking system behind it',
  hospitality: 'generating interest but not converting it into actual reservations or bookings',
  lifestyle: 'growing an audience but not having the infrastructure to monetise it properly',
  branding: 'doing good creative work but not presenting it in a way that attracts premium clients',
  general: 'building an audience but not having the digital infrastructure to convert it into sales',
}

const HOOK_STYLES = [
  'Lead with the gap, then say what you do about it.',
  'Open with what most businesses in their niche get wrong, then say what you fix.',
  'Name the disconnect between their content performance and their actual sales, then say what you do.',
  'Open by calling out what their competitors are doing that they might be missing, then say what you do.',
  'Start with what their audience is probably doing after watching their content, then say what you do.',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

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

  const gap = CATEGORY_GAPS[category] || CATEGORY_GAPS.general
  const hookStyle = pick(HOOK_STYLES)
  const followerCtx = followers > 10000
    ? `They have ${(followers / 1000).toFixed(0)}K followers.`
    : followers > 0 ? `They have ${followers} followers.` : ''

  const prompt = `Write a short cold TikTok DM to @${username}${display_name && display_name !== username ? ` ("${display_name}")` : ''}, who runs a ${category} business. ${followerCtx}

The common gap for businesses like theirs: they are ${gap}.

About J Supreme Tech: a Jamaican digital agency that builds websites, booking and ordering systems, and the digital infrastructure that turns social media content into actual sales.

STRUCTURE: ${hookStyle}

Write 2-3 short sentences. Put EACH sentence on its own line — do not run them together into a paragraph.

Sentence 1: Name the specific gap for their ${category} niche (make it feel like you noticed it on their page, not a generic observation)
Sentence 2: In your own words — different phrasing every time — say what J Supreme Tech does to fix it. Never use the same clause structure or wording as any previous message. Specific to what this niche needs.
Sentence 3: A soft open door — a single casual question or offer. Never repeat the same phrase. Varied, conversational.

Tone: direct but warm. Like someone who actually knows the niche and genuinely spotted an opportunity. Not a sales robot.

Rules:
- 2-3 sentences only
- Do NOT use: "free", "offer", "deal", "click", "limited", "PREVIEW", "DM me back", "reply NOW"
- Do NOT include any URLs, links, or pricing
- Do NOT use exclamation marks or emoji
- Do NOT start with "Hi", "Hey", or "Hello"
- Write like a real person: contractions fine, casual fine
- Every single sentence must feel written fresh for this specific account — no copy-paste energy

Output ONLY the message. No quotes, no labels, no explanation.`

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').replace(/^\uFEFF/, '').trim()
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })

  const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 150, messages: [{ role: 'user', content: prompt }] }),
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

