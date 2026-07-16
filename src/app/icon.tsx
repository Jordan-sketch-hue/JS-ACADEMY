import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 512,
        height: 512,
        background: '#0a0a0a',
        borderRadius: 116,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Gold corner accent — top left */}
      <div style={{
        position: 'absolute',
        top: 36,
        left: 36,
        width: 48,
        height: 3,
        background: '#c9a84c',
        borderRadius: 2,
        display: 'flex',
      }} />
      <div style={{
        position: 'absolute',
        top: 36,
        left: 36,
        width: 3,
        height: 48,
        background: '#c9a84c',
        borderRadius: 2,
        display: 'flex',
      }} />

      {/* Gold corner accent — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        right: 36,
        width: 48,
        height: 3,
        background: '#c9a84c',
        borderRadius: 2,
        display: 'flex',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 36,
        right: 36,
        width: 3,
        height: 48,
        background: '#c9a84c',
        borderRadius: 2,
        display: 'flex',
      }} />

      {/* Main A glyph */}
      <div style={{
        fontSize: 300,
        fontWeight: 800,
        color: '#c9a84c',
        lineHeight: 1,
        fontFamily: 'Georgia, serif',
        letterSpacing: -8,
        marginBottom: -8,
        display: 'flex',
      }}>
        A
      </div>

      {/* JST label */}
      <div style={{
        fontSize: 56,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: 18,
        opacity: 0.35,
        display: 'flex',
        marginTop: 0,
      }}>
        JST
      </div>
    </div>,
    { ...size }
  )
}
