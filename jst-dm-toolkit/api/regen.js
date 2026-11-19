const GAPS = {
  fashion: 'getting views but not converting them — no proper store, no paid campaigns, nothing closing the sale',
  beauty: 'filling their page but not booking clients — no booking system, no targeted ads, no sales flow behind the content',
  food: 'building an audience but losing orders — no online ordering, no local ad campaigns, no system behind the content',
  bakery: 'getting attention but losing custom orders — no order form, no campaign pushing people to actually book',
  furniture: 'showing great products but not capturing buyers — no catalogue, no quote flow, no ads targeting people ready to purchase',
  retail: 'driving content but losing the sale — no proper online store, no product campaigns, no checkout behind it',
  automotive: 'getting local views but not booking services — no strong booking page, no local search ads, no campaign running',
  logistics: 'doing solid work but not winning clients online — no credible web presence, no B2B outreach system, no digital pipeline',
  packaging: 'doing impressive work but not generating leads — no portfolio site, no campaign driving quote requests',
  creative: 'building a following but not closing clients — no site that sells, no outreach system, no marketing running',
  floral: 'getting seasonal attention but not capturing event leads — no booking flow, no campaign targeting weddings and events',
  accessories: 'getting good reach but losing the sale — no branded store, no ads converting that audience to buyers',
  events: 'creating buzz but not selling tickets — no proper event site, no paid campaign behind it, no sales system',
  techrepair: 'getting views but not ranking locally — no optimised site, no local ad campaign driving walk-ins',
  crafts: 'showing great work but not handling orders well — no portfolio site, no campaign, no custom order system',
  realestate: 'creating content but not capturing leads — no listing site, no targeted ad campaign, no lead pipeline',
  wellness: 'building a community but not monetising it — no membership or booking system, no campaign converting followers',
  hospitality: 'generating interest but not filling bookings — no proper booking site, no ads converting that interest',
  lifestyle: 'growing an audience but not converting it — no monetisation site, no campaign, no sales infrastructure',
  branding: 'building an audience but not converting it — no proper digital infrastructure, no marketing system, no sales flow',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { category } = req.body || {};
  const gap = GAPS[category] || 'building an audience but not converting it — no proper digital infrastructure, no marketing system, no sales flow';

  const prompt = `Write a short TikTok cold DM opener for a ${category} business on TikTok.

The gap for businesses like theirs: they are ${gap}.

J Supreme Tech builds websites, mobile apps, and runs sales/marketing campaigns for businesses.

Write exactly 2 short paragraphs:
Paragraph 1: One sentence that names the specific gap you spotted for their niche — make it feel like you noticed it on their page.
Paragraph 2: One sentence saying what J Supreme Tech does — mention websites or apps AND sales/marketing campaigns. Keep it one brief clause.

Rules:
- No pricing, no URLs, no emojis, no exclamation marks
- Do NOT start with Hi, Hey, or Hello
- Do NOT include any CTA or closing line — stop after the sell sentence
- Direct, warm, confident tone
- Output ONLY the two paragraphs, nothing else`;

  const apiKey = (process.env.ANTHROPIC_API_KEY || '').replace(/^﻿/, '').trim();
  if (!apiKey) return res.status(500).json({ error: 'API key not set' });

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 120, messages: [{ role: 'user', content: prompt }] }),
  });

  if (!r.ok) return res.status(500).json({ error: 'Claude API error' });
  const data = await r.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) return res.status(500).json({ error: 'Empty response' });

  return res.status(200).json({ text });
};
