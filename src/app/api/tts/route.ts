import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export const VOICES = [
  { id: 'Dan',      name: 'Dan',      desc: 'Deep · Male',      azureVoice: 'en-US-GuyNeural' },
  { id: 'Will',     name: 'Will',     desc: 'Warm · Male',      azureVoice: 'en-US-ChristopherNeural' },
  { id: 'Scarlett', name: 'Scarlett', desc: 'Clear · Female',   azureVoice: 'en-US-AriaNeural' },
  { id: 'Liv',      name: 'Liv',      desc: 'Natural · Female', azureVoice: 'en-US-JennyNeural' },
  { id: 'Amy',      name: 'Amy',      desc: 'Bright · Female',  azureVoice: 'en-US-SaraNeural' },
]

function getAzureKeys(): string[] {
  const multi = process.env.AZURE_SPEECH_KEYS
  if (multi) return multi.split(',').map(k => k.trim()).filter(Boolean)
  const single = process.env.AZURE_SPEECH_KEY
  return single ? [single] : []
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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function azureTTS(text: string, azureVoice: string): Promise<ArrayBuffer> {
  const keys = getAzureKeys()
  if (!keys.length) throw new Error('TTS not configured')
  const region = process.env.AZURE_SPEECH_REGION ?? 'eastus'

  const ssml = `<speak version='1.0' xml:lang='en-US'><voice name='${azureVoice}'>${escapeXml(text)}</voice></speak>`

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

    if (res.status === 401 || res.status === 403) {
      lastError = `Azure auth error ${res.status}`
      continue
    }

    if (!res.ok) {
      lastError = await res.text().catch(() => res.statusText)
      continue
    }

    return res.arrayBuffer()
  }

  throw new Error(lastError || 'All Azure TTS keys exhausted')
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

    const audioBytes = await azureTTS(target, voice.azureVoice)

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
