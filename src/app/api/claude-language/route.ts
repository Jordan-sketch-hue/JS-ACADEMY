import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert language tutor and linguistics coach. Your role is to:

- Teach vocabulary, grammar, pronunciation tips, and cultural context
- Correct mistakes gently and explain why the correction is needed
- Provide example sentences, mnemonics, and memory techniques
- Adapt explanations to the learner's level (beginner/intermediate/advanced)
- Answer questions about any human language
- Give concise, engaging responses that encourage continued learning

When correcting errors, always affirm what the student did right before correcting. Keep responses focused and practical.`

export async function POST(req: NextRequest) {
  const expectedKey = process.env.JST_TTS_API_KEY
  if (expectedKey) {
    const provided = req.headers.get('x-api-key')
    if (provided !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const body = await req.json()
    const { message, history, language, level, stream: wantStream } = body as {
      message: string
      history?: Array<{ role: 'user' | 'assistant'; content: string }>
      language?: string
      level?: 'beginner' | 'intermediate' | 'advanced'
      stream?: boolean
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const systemAddendum = [
      language ? `The learner is studying: ${language}.` : '',
      level ? `Their proficiency level is: ${level}.` : '',
    ].filter(Boolean).join(' ')

    const messages: Anthropic.MessageParam[] = [
      ...(history ?? []),
      { role: 'user', content: message },
    ]

    if (wantStream === false) {
      // Non-streaming path: return full JSON response
      const response = await client.messages.create({
        model: 'claude-opus-5-5',
        max_tokens: 4096,
        system: systemAddendum ? `${SYSTEM_PROMPT}\n\n${systemAddendum}` : SYSTEM_PROMPT,
        messages,
      })

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map(b => b.text)
        .join('')

      return NextResponse.json({
        reply: text,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      })
    }

    // Streaming path (default): real-time token delivery
    const stream = await client.messages.stream({
      model: 'claude-opus-5-5',
      max_tokens: 4096,
      system: systemAddendum ? `${SYSTEM_PROMPT}\n\n${systemAddendum}` : SYSTEM_PROMPT,
      messages,
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
      cancel() {
        stream.controller.abort()
      },
    })

    return new NextResponse(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/claude-language',
    description: 'AI language tutor powered by Claude',
    methods: ['POST'],
    body: {
      message: 'string (required) — user message or question',
      history: 'array (optional) — prior [{role, content}] turns',
      language: 'string (optional) — e.g. "Spanish", "Mandarin"',
      level: '"beginner" | "intermediate" | "advanced" (optional)',
      stream: 'boolean (optional, default true) — stream token-by-token',
    },
  })
}
