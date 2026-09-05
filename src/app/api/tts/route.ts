import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export const VOICES = [
  { id: 'Marcus', name: 'Marcus', desc: 'Deep · Commanding', azureVoice: 'en-US-DavisNeural' },
  { id: 'Tony',   name: 'Tony',   desc: 'Smooth · Male',     azureVoice: 'en-US-TonyNeural' },
  { id: 'Aria',   name: 'Aria',   desc: 'Expressive · Female', azureVoice: 'en-US-AriaNeural' },
  { id: 'Nova',   name: 'Nova',   desc: 'Warm · Female',     azureVoice: 'en-US-JennyNeural' },
  { id: 'Jason',  name: 'Jason',  desc: 'Rich · Male',       azureVoice: 'en-US-JasonNeural' },
]

function getAzureKeys(): string[] {
  const multi = process.env.AZURE_SPEECH_KEYS
  if (multi) return multi.split(',').map(k => k.trim()).filter(Boolean)
  const single = process.env.AZURE_SPEECH_KEY
  return single ? [single] : []
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface KeyTerm { term: string; definition: string }

// Split text on key terms, escape each fragment, wrap matches in <emphasis>
function buildEmphasisText(text: string, keyTerms: KeyTerm[]): string {
  if (!keyTerms.length) return escapeXml(text)
  const sorted = [...keyTerms].sort((a, b) => b.term.length - a.term.length)
  const patterns = sorted.map(k => k.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${patterns.join('|')})`, 'gi')
  return text.split(re).map((part, i) =>
    i % 2 === 1
      ? `<emphasis level="moderate">${escapeXml(part)}</emphasis>`
      : escapeXml(part)
  ).join('')
}

function cleanInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/#+\s*/g, '')
}

// Converts a markdown chunk into SSML with structural prosody + key-term emphasis
function toNarrationSSML(
  md: string,
  azureVoice: string,
  courseTitle: string | undefined,
  objective: string | undefined,
  keyTerms: KeyTerm[],
  isFirstChunk: boolean
): string {
  const lines = md.split('\n')
  const parts: string[] = []

  // Every course record's `subtitle` is already written as an objective
  // statement ("Turn customers into advocates through systems that sustain
  // engagement..."), so narrating it up front — for every module, since it's
  // pulled from the shared data field rather than hand-authored per lesson —
  // tells the listener what they should walk away able to do before the
  // lesson itself starts.
  if (isFirstChunk && courseTitle) {
    parts.push(
      `<prosody rate="-15%" pitch="+5%">Welcome to ${escapeXml(courseTitle)}.</prosody>`,
      `<break time="500ms"/>`
    )
    if (objective) {
      parts.push(
        `<prosody rate="-8%">${escapeXml(objective)}</prosody>`,
        `<break time="600ms"/>`
      )
    }
    parts.push(`<break time="200ms"/>`)
  }

  let inCode = false
  let inTable = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith('```')) { inCode = !inCode; continue }
    if (inCode) continue
    if (line.startsWith('|')) { inTable = true; continue }
    if (inTable && !line.startsWith('|')) inTable = false
    if (inTable) continue
    if (/^-{3,}$/.test(line) || /^={3,}$/.test(line)) continue

    if (line.startsWith('# ')) {
      const heading = cleanInline(line.slice(2))
      parts.push(
        `<break time="700ms"/>`,
        `<prosody rate="-20%" pitch="+15%"><emphasis level="strong">${escapeXml(heading)}</emphasis></prosody>`,
        `<break time="500ms"/>`
      )
      continue
    }

    if (line.startsWith('## ')) {
      const heading = cleanInline(line.slice(3))
      parts.push(
        `<break time="600ms"/>`,
        `<prosody rate="-12%" pitch="+10%">Now — ${escapeXml(heading)}.</prosody>`,
        `<break time="400ms"/>`
      )
      continue
    }

    if (line.startsWith('### ')) {
      const heading = cleanInline(line.slice(4))
      parts.push(
        `<break time="350ms"/>`,
        `<prosody pitch="+6%">${escapeXml(heading)}:</prosody>`,
        `<break time="200ms"/>`
      )
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      const text = cleanInline(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
      parts.push(
        `<break time="120ms"/>`,
        buildEmphasisText(text, keyTerms) + '.'
      )
      continue
    }

    if (line) {
      parts.push(buildEmphasisText(cleanInline(line), keyTerms))
    } else {
      parts.push(`<break time="300ms"/>`)
    }
  }

  const inner = parts.join('\n      ')

  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' ` +
    `xmlns:mstts='http://www.w3.org/2001/mstts' xml:lang='en-US'>` +
    `<voice name='${azureVoice}'>` +
    `<mstts:express-as style='narration-professional'>` +
    inner +
    `</mstts:express-as></voice></speak>`
  )
}

const CHUNK_SIZE = 1500

interface TextChunk { text: string; start: number; end: number }

// Chunks by paragraph, same size logic as before, but also tracks each
// chunk's [start, end) character offsets within the source string so the
// client can map a playing chunk back to a highlightable range on screen.
function chunkMarkdown(md: string): TextChunk[] {
  if (md.length <= CHUNK_SIZE) return [{ text: md, start: 0, end: md.length }]

  const paragraphs = md.split(/\n\n+/).filter(Boolean)
  const chunks: TextChunk[] = []
  let current = ''
  let currentStart = 0
  let currentEnd = 0
  let cursor = 0

  for (const para of paragraphs) {
    const found = md.indexOf(para, cursor)
    const start = found === -1 ? cursor : found
    const end = start + para.length
    cursor = end

    if (!current) {
      current = para
      currentStart = start
      currentEnd = end
    } else if (current.length + 2 + para.length > CHUNK_SIZE) {
      chunks.push({ text: current, start: currentStart, end: currentEnd })
      current = para
      currentStart = start
      currentEnd = end
    } else {
      current = current + '\n\n' + para
      currentEnd = end
    }
  }
  if (current) chunks.push({ text: current, start: currentStart, end: currentEnd })
  return chunks
}

async function azureTTS(ssml: string): Promise<ArrayBuffer> {
  const keys = getAzureKeys()
  if (!keys.length) throw new Error('TTS not configured')
  const region = process.env.AZURE_SPEECH_REGION ?? 'eastus'

  let lastError = ''
  for (const key of keys) {
    const res = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3',
        },
        body: ssml,
      }
    )

    if (res.status === 401 || res.status === 403) { lastError = `Azure auth ${res.status}`; continue }
    if (!res.ok) { lastError = await res.text().catch(() => res.statusText); continue }
    return res.arrayBuffer()
  }

  throw new Error(lastError || 'All Azure TTS keys exhausted')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, voiceId, courseTitle, objective, chunk, keyTerms } = body

    if (typeof text !== 'string' || !text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const voice = VOICES.find(v => v.id === voiceId) ?? VOICES[0]
    const chunks = chunkMarkdown(text)
    const total = chunks.length

    const targetIdx = typeof chunk === 'number' ? chunk : 0
    const target = chunks[targetIdx]
    if (!target) return NextResponse.json({ error: 'Chunk out of range' }, { status: 400 })

    const terms: KeyTerm[] = Array.isArray(keyTerms) ? keyTerms : []
    const ssml = toNarrationSSML(target.text, voice.azureVoice, courseTitle, objective, terms, targetIdx === 0)
    const audioBytes = await azureTTS(ssml)

    return new NextResponse(audioBytes, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Chunk': String(targetIdx),
        'X-Total': String(total),
        'X-Chunk-Start': String(target.start),
        'X-Chunk-End': String(target.end),
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text') ?? ''
  const chunks = chunkMarkdown(text)
  return NextResponse.json({ chunks: chunks.length, preview: chunks[0]?.text.slice(0, 200) })
}
