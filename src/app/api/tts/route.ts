import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, voice, rate = '0%', pitch = '0%' } = await req.json()
  const key = process.env.AZURE_SPEECH_KEY!
  const region = process.env.AZURE_SPEECH_REGION || 'eastus'

  // derive lang from voice name e.g. zh-CN-XiaoxiaoNeural → zh-CN
  const xmlLang = voice.split('-').slice(0, 2).join('-') || 'en-US'

  const ssml = `<speak version='1.0' xml:lang='${xmlLang}'>
    <voice name='${voice}'>
      <prosody rate='${rate}' pitch='${pitch}'>${text}</prosody>
    </voice>
  </speak>`

  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
    },
    body: ssml,
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'TTS failed', status: res.status }, { status: 500 })
  }

  const audio = await res.arrayBuffer()
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
