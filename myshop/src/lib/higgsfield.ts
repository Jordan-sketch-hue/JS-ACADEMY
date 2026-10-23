const BASE = 'https://api.higgsfield.ai'
const QUALITY_SUFFIX =
  'ultra premium photography, studio lighting, precise color grading, sharp focus, cinematic color science, maximum detail, 8K resolution rendering'

function authHeader(): string {
  const creds = process.env.HF_CREDENTIALS
  if (!creds) throw new Error('HF_CREDENTIALS not set')
  return `Key ${creds}`
}

async function hfPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Higgsfield ${res.status}: ${await res.text()}`)
  return res.json() as Promise<{ status: string; request_id: string; status_url: string }>
}

export async function generateImage(prompt: string) {
  return hfPost('/higgsfield-ai/soul/v2/standard', {
    prompt: `${prompt}, ${QUALITY_SUFFIX}`,
    resolution: '720p',
    aspect_ratio: '1:1',
    enhance_prompt: true,
    batch_size: 1,
  })
}

export async function generateVideo(prompt: string) {
  return hfPost('/alibaba/wan-3.0/text-to-video', {
    prompt: `${prompt}, ${QUALITY_SUFFIX}`,
    resolution: '720p',
    duration: 5,
    enhance_prompt: true,
  })
}

export async function pollStatus(statusUrl: string): Promise<{
  status: string
  output?: string[]
  images?: { url: string }[]
  error?: string
}> {
  const res = await fetch(statusUrl, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) throw new Error(`Poll ${res.status}: ${await res.text()}`)
  const data = await res.json()
  // Normalize: Soul V2 returns images[0].url; expose as output[0] for compatibility
  if (data.images?.length && !data.output) {
    data.output = data.images.map((img: { url: string }) => img.url)
  }
  return data
}
