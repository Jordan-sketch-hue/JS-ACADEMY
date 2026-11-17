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

const JST_DESCRIPTIONS = [
  'We handle the whole digital side — the site, the booking or ordering flow, and the system behind it.',
  'We set up the infrastructure behind a page like theirs — the site, the sales flow, all of it.',
  'That is exactly what we build — the digital layer that sits behind the content and turns it into revenue.',
  'We put the backend in place: the site, the checkout or booking flow, the whole system.',
  'We are a digital agency out of Jamaica — we build the site and the sales or booking system behind it.',
  'We specialize in building that missing piece — the online infrastructure that actually converts.',
  'We handle websites, booking systems, and the digital setup that makes content work commercially.',
  'That is the kind of problem we solve — the gap between strong content and an actual way to sell.',
  'We build the digital side of things: the site, the checkout, the systems that capture that audience.',
  'We set up everything from the site to the ordering or booking flow — the full commercial layer.',
]

const SOFT_CLOSES = [
  'Worth a conversation?',
  'Happy to show you what that looks like.',
  'Open to a quick chat about it?',
  'Worth a look if the timing is right.',
  'Let me know if that is something you would want to explore.',
  'Could be worth a quick back and forth.',
  'Happy to walk you through what we would do.',
  'Open to talking through it if you are curious.',
  'Worth exploring if growth is on your radar.',
  'Let me know if that resonates.',
  'Happy to send over a few examples.',
  'Worth a quick conversation if you are open to it.',
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
  const jstDesc = pick(JST_DESCRIPTIONS)
  const softClose = pick(SOFT_CLOSES)
  const followerCtx = followers > 10000
    ? `They have ${(followers / 1000).toFixed(0)}K followers.`
    : followers > 0 ? `They have ${followers} followers.` : ''

  const prompt = `Write a short cold TikTok DM to @${username}${display_name && display_name !== username ? ` ("${display_name}")` : ''}, who runs a ${category} business. ${followerCtx}

The common gap for businesses like theirs: they are ${gap}.

J Supreme Tech is a Jamaican digital agency. For this message, describe what we do using ONLY this phrasing (do not rephrase or expand it): "${jstDesc}"

The closing line must be EXACTLY: "${softClose}" — use it verbatim, do not alter it.

STRUCTURE: ${hookStyle}

Write 2-3 short sentences that:
1. Name the specific gap for their ${category} niche (make it feel like you noticed it on their page, not a generic observation)
2. Use the JST description above word for word to say what we do about it
3. End with the closing line above word for word

Tone: direct but warm. Like someone who actually knows the niche and genuinely spotted an opportunity. Not a sales robot.

Rules:
- 2-3 sentences only
- Do NOT use: "free", "offer", "deal", "click", "limited", "PREVIEW", "DM me back", "reply NOW"
- Do NOT include any URLs, links, or pricing
- Do NOT use exclamation marks or emoji
- Do NOT start with "Hi", "Hey", or "Hello"
- Write like a real person: contractions fine, casual fine
- Each message must feel specific to this niche, not copy-pasted

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
