import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  try {
    const { message, language, languageCode, level, conversationHistory } = await req.json()

    const client = new Anthropic({ apiKey })

    const systemPrompt = `You are an expert ${language} language tutor. The student is studying at the ${level} level.

Your role:
- Answer questions about ${language} grammar, vocabulary, pronunciation, and culture
- Provide word translations and usage examples
- Explain grammar rules with clear examples in ${language} and English
- Give pronunciation guidance (describe how sounds are made)
- Correct mistakes kindly with explanations
- When giving vocabulary: always show the word in ${language} script, romanization (if applicable), and English meaning
- Keep responses concise but complete — use bullet points and formatting for clarity
- If asked to pronounce something, describe the pronunciation clearly (e.g. "stress on second syllable", "the 'r' is trilled")

Language code: ${languageCode}
Always include the ${language} script when giving examples, not just romanization.`

    const messages = [
      ...(conversationHistory || []),
      { role: 'user' as const, content: message }
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({
      response: text,
      usage: response.usage
    })
  } catch (err: unknown) {
    console.error('Claude API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
