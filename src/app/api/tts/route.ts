import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

// Friendly voice list — IDs are Cartesia voice UUIDs from their public library
export const VOICES = [
  { id: 'Dan',      name: 'Dan',      desc: 'Deep · Male',      cartesiaId: 'a0e99841-438c-4a64-b679-ae501e7d6091' },
  { id: 'Will',     name: 'Will',     desc: 'Warm · Male',      cartesiaId: 'bf991597-6135-4bfd-babb-78934514df88' },
  { id: 'Scarlett', name: 'Scarlett', desc: 'Clear · Female',   cartesiaId: '694f9389-aac1-45b6-b726-9d9369183238' },
  { id: 'Liv',      name: 'Liv',      desc: 'Natural · Female', cartesiaId: 'b7d50908-b17c-442d-ad8d-810c63997ed9' },
  { id: 'Amy',      name: 'Amy',      desc: 'Bright · Female',  cartesiaId: '79a125e8-cd45-4c13-8a67-188112f4dd22' },
]

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

function toNarrationScript(md: string, courseTitle?: string): string {
  if (typeof md !== 'string') return ''
  const lines = md.split('\n')
  const out: string[] = []

  if (courseTitle) { out.push(`Welcome to ${courseTitle}.`); out.push('') }

  let inCode = false
  let inTable = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith('```')) { inCode = !inCode; continue }
    if (inCode) continue

    if (line.startsWith('|')) { inTable = true; continue }
    if (inTable && !line.startsWith('|')) inTable = false
    if (inTable) continue

    if (line.startsWith('## ')) {
      out.push(''); out.push(`Now, ${line.slice(3).replace(/[*_`]/g, '')}.`); out.push(''); continue
    }
    if (line.startsWith('### ')) {
      out.push(''); out.push(`${line.slice(4).replace(/[*_`]/g, '')}:`); out.push(''); continue
    }
    if (/^-{3,}$/.test(line) || /^={3,}$/.test(line)) continue

    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      out.push(cleanInline(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')) + '.'); continue
    }

    if (line) out.push(cleanInline(line))
    else out.push('')
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const CHUNK_SIZE = 2800

function chunkScript(script: string): string[] {
  if (script.length <= CHUNK_SIZE) return [script]
  const chunks: string[] = []
  const paragraphs = script.split(/\n\n+/)
  let current = ''
  for (const para of paragraphs) {
    const joined = current ? current + '\n\n' + para : para
    if (joined.length > CHUNK_SIZE && current) {
      chunks.push(current.trim())
      current = para
    } else {
      current = joined
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

function getCartesiaKeys(): string[] {
  const multi = process.env.CARTESIA_API_KEYS
  if (multi) return multi.split(',').map(k => k.trim()).filter(Boolean)
  const single = process.env.CARTESIA_API_KEY
  return single ? [single] : []
}

async function cartesiaTTS(text: string, cartesiaVoiceId: string): Promise<ArrayBuffer> {
  const keys = getCartesiaKeys()
  if (!keys.length) throw new Error('TTS not configured')

  let lastError = ''
  for (const key of keys) {
    const res = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': key,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2',
        transcript: text,
        voice: { mode: 'id', id: cartesiaVoiceId },
        output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
      }),
    })

    if (res.status === 401 || res.status === 402) {
      lastError = `Cartesia error ${res.status}`
      continue
    }

    if (!res.ok) {
      lastError = await res.text().catch(() => res.statusText)
      continue
    }

    return res.arrayBuffer()
  }

  throw new Error(lastError || 'All Cartesia keys exhausted')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, voiceId, courseTitle, chunk } = body

    if (typeof text !== 'string' || !text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const voice = VOICES.find(v => v.id === voiceId) ?? VOICES[0]
    const script = toNarrationScript(text, courseTitle)
    if (!script) return NextResponse.json({ error: 'No content to narrate' }, { status: 400 })

    const chunks = chunkScript(script)
    const total = chunks.length

    const targetIdx = typeof chunk === 'number' ? chunk : 0
    const target = chunks[targetIdx]
    if (!target) return NextResponse.json({ error: 'Chunk out of range' }, { status: 400 })

    const audioBytes = await cartesiaTTS(target, voice.cartesiaId)

    return new NextResponse(audioBytes, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Chunk': String(targetIdx),
        'X-Total': String(total),
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text') ?? ''
  const title = req.nextUrl.searchParams.get('title') ?? undefined
  return NextResponse.json({ script: toNarrationScript(text, title) })
}
