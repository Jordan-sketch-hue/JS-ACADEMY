import { NextRequest, NextResponse } from 'next/server'
import { generateVideo } from '@/lib/higgsfield'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 })

    const result = await generateVideo(prompt)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
