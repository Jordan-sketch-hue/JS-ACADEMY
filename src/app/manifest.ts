import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JST Academy',
    short_name: 'Academy',
    description: 'Daily learning in tech, marketing & trading — J Supreme Tech',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/icon', sizes: '192x192', type: 'image/png' },
    ],
  }
}
