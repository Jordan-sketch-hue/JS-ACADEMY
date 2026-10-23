'use client'
import { useState, useCallback } from 'react'
import type { Category } from '@/types/shop'
import Link from 'next/link'

type GenState = 'idle' | 'generating' | 'done' | 'error'

const catPrompts: Record<string, { cover: string; hero: string }> = {
  jewelry: {
    cover: 'Elegant gold and diamond jewelry flat lay on white marble, luxury minimalist photography, soft natural light, premium fashion editorial style',
    hero:  'Glamorous close-up of gold jewelry pieces, luxury fashion editorial, bokeh background, warm golden light, high-end dropship store',
  },
  electronics: {
    cover: 'Modern consumer electronics flat lay, sleek dark background, smartphones and wireless earbuds, tech product photography, cinematic lighting',
    hero:  'Premium electronics setup on dark surface, futuristic ambient lighting, tech lifestyle photography, high-contrast clean aesthetic',
  },
  'home-living': {
    cover: 'Cozy minimalist home decor flat lay, neutral tones, candles plants and ceramics, interior lifestyle photography, warm ambient lighting',
    hero:  'Stylish modern living room corner with curated decor, soft natural light, Scandinavian aesthetic, premium home goods photography',
  },
  beauty: {
    cover: 'Luxury beauty and skincare product flat lay, pink and gold tones, soft petals and cream textures, high-end cosmetics photography',
    hero:  'Elegant beauty products on white marble with roses, premium skincare editorial, pastel tones, luxury dropship store aesthetic',
  },
  lifestyle: {
    cover: 'Trendy lifestyle accessories flat lay, vibrant colors, sunglasses bags and accessories, fashion editorial photography, modern aesthetic',
    hero:  'Aspirational lifestyle flat lay with trendy accessories and fashion items, bold colors, social media ready product photography',
  },
}

function CategoryCard({ cat, onUpdate }: { cat: Category; onUpdate: (updated: Category) => void }) {
  const [coverState, setCoverState] = useState<GenState>('idle')
  const [heroState, setHeroState] = useState<GenState>('idle')
  const [coverMsg, setCoverMsg] = useState('')
  const [heroMsg, setHeroMsg] = useState('')

  const prompts = catPrompts[cat.slug] ?? {
    cover: `Curated ${cat.name} products flat lay, premium dropship photography, clean aesthetic`,
    hero:  `Beautiful ${cat.name} lifestyle photography, editorial quality, modern ecommerce aesthetic`,
  }

  const generate = useCallback(async (type: 'cover' | 'hero') => {
    const setState  = type === 'cover' ? setCoverState : setHeroState
    const setMsg    = type === 'cover' ? setCoverMsg   : setHeroMsg
    const prompt    = type === 'cover' ? prompts.cover : prompts.hero

    setState('generating')
    setMsg('Sending to Higgsfield Soul V2...')

    try {
      // Step 1: kick off generation
      const genRes = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!genRes.ok) throw new Error(`Gen failed: ${genRes.statusText}`)
      const { status_url } = await genRes.json()

      // Step 2: poll status
      setMsg('Processing image (~10-30s)...')
      let imageUrl: string | null = null
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const pollRes = await fetch('/api/generate/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statusUrl: status_url }),
        })
        const pollData = await pollRes.json()
        if (pollData.status === 'completed' && pollData.output_url) {
          imageUrl = pollData.output_url
          break
        }
        if (pollData.status === 'failed') throw new Error('Generation failed')
        setMsg(`Processing... (${(i + 1) * 3}s)`)
      }

      if (!imageUrl) throw new Error('Timed out')

      // Step 3: save to category
      const saveRes = await fetch('/api/generate/category-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: cat.id, imageUrl, field: type === 'cover' ? 'cover_url' : 'hero_url' }),
      })
      if (!saveRes.ok) throw new Error('Save failed')

      onUpdate({ ...cat, [type === 'cover' ? 'cover_url' : 'hero_url']: imageUrl })
      setState('done')
      setMsg('✓ Generated & saved')
    } catch (e) {
      setState('error')
      setMsg(`Error: ${(e as Error).message}`)
    }
  }, [cat, prompts, onUpdate])

  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Preview strip */}
      <div
        className="flex"
        style={{ height: 160 }}
      >
        {/* Cover */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{
            background: cat.cover_url
              ? `url(${cat.cover_url}) center/cover`
              : `linear-gradient(135deg, ${cat.accent_color}15, ${cat.accent_color}30)`,
            borderRight: '1px solid var(--border)',
          }}
        >
          {!cat.cover_url && (
            <span style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>No cover</span>
          )}
          <span
            className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: '0.65rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            COVER
          </span>
        </div>
        {/* Hero */}
        <div
          className="relative flex-1 flex items-center justify-center"
          style={{
            background: cat.hero_url
              ? `url(${cat.hero_url}) center/cover`
              : `linear-gradient(135deg, ${cat.accent_color}15, ${cat.accent_color}30)`,
          }}
        >
          {!cat.hero_url && (
            <span style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>No hero</span>
          )}
          <span
            className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: '0.65rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            HERO
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${cat.accent_color}20` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: cat.accent_color }} />
          </div>
          <div>
            <h3
              className="display-font font-bold"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-base)' }}
            >
              {cat.name}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)' }}>{cat.slug}</p>
          </div>
          <Link
            href={`/shop/category/${cat.slug}`}
            className="ml-auto text-xs font-semibold"
            style={{ color: cat.accent_color }}
          >
            View →
          </Link>
        </div>

        {/* Cost note */}
        <div
          className="px-3 py-2 rounded-xl mb-4"
          style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
            fontSize: 'var(--text-xs)',
            color: 'var(--muted)',
          }}
        >
          ✦ Soul V2 · ~$0.0032/img · Approximate cost per click
        </div>

        {/* Gen buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cover */}
          <div>
            <button
              onClick={() => generate('cover')}
              disabled={coverState === 'generating'}
              className="w-full py-2.5 rounded-xl font-semibold transition-all text-sm"
              style={{
                background: coverState === 'done' ? '#10B981' : coverState === 'error' ? '#EF4444' : cat.accent_color,
                color: '#fff',
                fontSize: 'var(--text-xs)',
                opacity: coverState === 'generating' ? 0.7 : 1,
                cursor: coverState === 'generating' ? 'wait' : 'pointer',
              }}
            >
              {coverState === 'generating' ? '⏳ Generating...' :
               coverState === 'done' ? '✓ Cover Done' :
               coverState === 'error' ? '✗ Retry Cover' :
               '⬛ Generate Cover'}
            </button>
            {coverMsg && (
              <p style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
                {coverMsg}
              </p>
            )}
          </div>

          {/* Hero */}
          <div>
            <button
              onClick={() => generate('hero')}
              disabled={heroState === 'generating'}
              className="w-full py-2.5 rounded-xl font-semibold transition-all"
              style={{
                background: heroState === 'done' ? '#10B981' : heroState === 'error' ? '#EF4444' : 'var(--navy)',
                color: '#fff',
                fontSize: 'var(--text-xs)',
                opacity: heroState === 'generating' ? 0.7 : 1,
                cursor: heroState === 'generating' ? 'wait' : 'pointer',
              }}
            >
              {heroState === 'generating' ? '⏳ Generating...' :
               heroState === 'done' ? '✓ Hero Done' :
               heroState === 'error' ? '✗ Retry Hero' :
               '⬛ Generate Hero'}
            </button>
            {heroMsg && (
              <p style={{ color: 'var(--muted)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
                {heroMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesAdmin({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)

  const updateCategory = useCallback((updated: Category) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--navy)',
          padding: '2rem max(1.5rem, env(safe-area-inset-left, 0px))',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 mb-4" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/admin" style={{ color: 'inherit' }}>Admin</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Categories</span>
          </nav>
          <h1 className="display-font font-black" style={{ color: '#fff', fontSize: 'var(--text-2xl)' }}>
            Category Images
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
            Generate cover and hero images for each category using Higgsfield Soul V2 AI.
            Each click triggers a generation — approve spend before clicking.
          </p>
        </div>
      </div>

      <div
        className="max-w-6xl mx-auto"
        style={{ padding: '2.5rem max(1.5rem, env(safe-area-inset-left, 0px))' }}
      >
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}
        >
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onUpdate={updateCategory}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
