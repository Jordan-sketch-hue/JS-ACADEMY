export interface CertificateData {
  title: string
  track: string
  level: string
  recipient?: string
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  const lines: string[] = []
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)

  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}

export function drawCertificate(canvas: HTMLCanvasElement, data: CertificateData) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height

  ctx.fillStyle = '#faf9f6'
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = '#0a0a0a'
  ctx.lineWidth = 3
  ctx.strokeRect(24, 24, W - 48, H - 48)
  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = 1.5
  ctx.strokeRect(42, 42, W - 84, H - 84)

  ctx.textAlign = 'center'

  ctx.fillStyle = '#0a0a0a'
  ctx.font = '600 26px Georgia, "Times New Roman", serif'
  ctx.fillText('J S T   A C A D E M Y', W / 2, 140)

  ctx.fillStyle = '#c9a84c'
  ctx.font = '400 13px Arial, sans-serif'
  ctx.fillText('CERTIFICATE OF COMPLETION', W / 2, 172)

  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 70, 194)
  ctx.lineTo(W / 2 + 70, 194)
  ctx.stroke()

  ctx.fillStyle = '#0a0a0a'
  ctx.font = '600 46px Georgia, "Times New Roman", serif'
  wrapText(ctx, data.title, W / 2, 300, W - 320, 56)

  ctx.fillStyle = '#666'
  ctx.font = '400 19px Arial, sans-serif'
  ctx.fillText(`${data.track} Track · ${data.level} Level`, W / 2, 400)

  ctx.fillStyle = '#0a0a0a'
  ctx.font = '400 15px Arial, sans-serif'
  ctx.fillText('Presented to', W / 2, 470)
  ctx.font = '600 32px Georgia, "Times New Roman", serif'
  ctx.fillText(data.recipient ?? 'Jordan Morris', W / 2, 512)

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  ctx.fillStyle = '#999'
  ctx.font = '400 13px Arial, sans-serif'
  ctx.fillText(`Issued ${date}`, W / 2, H - 90)
  ctx.fillStyle = '#bbb'
  ctx.font = '400 11px Arial, sans-serif'
  ctx.fillText('academy.jsupremetech.online', W / 2, H - 66)
}

export function downloadCertificate(data: CertificateData) {
  const canvas = document.createElement('canvas')
  canvas.width = 1600
  canvas.height = 1120
  drawCertificate(canvas, data)

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `${slug}-certificate.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
