import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: '#0a0a0a',
        borderRadius: 38,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 2, background: '#c9a84c', borderRadius: 1, display: 'flex' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, width: 2, height: 16, background: '#c9a84c', borderRadius: 1, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 2, background: '#c9a84c', borderRadius: 1, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 2, height: 16, background: '#c9a84c', borderRadius: 1, display: 'flex' }} />

      <div style={{ fontSize: 108, fontWeight: 800, color: '#c9a84c', lineHeight: 1, fontFamily: 'Georgia, serif', display: 'flex', marginBottom: -4 }}>A</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: 7, opacity: 0.35, display: 'flex' }}>JST</div>
    </div>,
    { ...size }
  )
}
