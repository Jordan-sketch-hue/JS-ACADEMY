import { createServerSupabase } from '@/lib/supabase-server'
import type { Product, Category } from '@/types/shop'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

const catEmoji: Record<string, string> = {
  jewelry:       '✦',
  electronics:   '◈',
  'home-living': '◉',
  beauty:        '◆',
  lifestyle:     '◐',
}

export default async function HomePage() {
  const supabase = await createServerSupabase()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('myshop_categories').select('*').order('name'),
    supabase.from('myshop_products').select('*').eq('active', true).order('created_at', { ascending: false }).limit(8),
  ])

  const cats = (categories ?? []) as Category[]
  const prods = (products ?? []) as Product[]

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ─── HERO ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: 'min(92vh, 860px)',
          background: 'linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 50%, var(--navy-mid) 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute animate-float"
            style={{
              width: 'clamp(300px,40vw,600px)',
              height: 'clamp(300px,40vw,600px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0) 70%)',
              top: '-15%',
              right: '-10%',
            }}
          />
          <div
            className="absolute animate-float-delayed"
            style={{
              width: 'clamp(200px,25vw,400px)',
              height: 'clamp(200px,25vw,400px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 70%)',
              bottom: '5%',
              left: '5%',
            }}
          />
          <div
            className="absolute"
            style={{
              width: 'clamp(150px,20vw,300px)',
              height: 'clamp(150px,20vw,300px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0) 70%)',
              top: '40%',
              left: '40%',
              animation: 'pulse-glow 4s ease-in-out infinite',
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div
          className="relative w-full max-w-7xl mx-auto"
          style={{ padding: '4rem max(1.5rem, env(safe-area-inset-left, 0px))' }}
        >
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em' }}>
                ✦ PREMIUM DROPSHIP STORE
              </span>
            </div>

            {/* Headline */}
            <h1
              className="display-font font-black mb-6"
              style={{
                fontSize: 'var(--text-hero)',
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
              }}
            >
              Shop The{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Vibe.
              </span>
            </h1>

            <p
              className="mb-10 max-w-xl"
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 'var(--text-xl)',
                lineHeight: 1.5,
              }}
            >
              Trending finds, curated collections, and premium goods — delivered from worldwide to your door.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  fontSize: 'var(--text-base)',
                  boxShadow: 'var(--shadow-gold)',
                  letterSpacing: '0.02em',
                }}
              >
                Shop All
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              {cats[0] && (
                <Link
                  href={`/shop/category/${cats[0].slug}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: 'var(--text-base)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Shop {cats[0].name}
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { n: '25+', l: 'Curated products' },
                { n: '5', l: 'Categories' },
                { n: 'JA→US', l: 'Worldwide shipping' },
              ].map(s => (
                <div key={s.n}>
                  <div
                    className="display-font font-black"
                    style={{ color: 'var(--gold)', fontSize: 'var(--text-2xl)' }}
                  >
                    {s.n}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 80, overflow: 'hidden', lineHeight: 0 }}
        >
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ──────────────────────────── */}
      <section
        className="max-w-7xl mx-auto"
        style={{ padding: '5rem max(1.5rem, env(safe-area-inset-left, 0px))' }}
      >
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p
              className="font-bold mb-2"
              style={{ color: 'var(--gold)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em' }}
            >
              EXPLORE
            </p>
            <h2
              className="display-font font-black"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-3xl)' }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}
          >
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Category grid — 2 large + 3 small */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gridTemplateRows: 'auto',
          }}
        >
          {cats.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/shop/category/${cat.slug}`}
              className="group relative overflow-hidden flex flex-col justify-end transition-all"
              style={{
                borderRadius: 'var(--r-xl)',
                minHeight: i < 2 ? 'min(340px, 45vw)' : '220px',
                background: cat.hero_url
                  ? `url(${cat.hero_url}) center/cover`
                  : `linear-gradient(135deg, ${cat.accent_color}20 0%, ${cat.accent_color}40 100%)`,
                boxShadow: 'var(--shadow-md)',
                gridColumn: i < 2 ? 'span 1' : undefined,
              }}
            >
              {/* No-image placeholder pattern */}
              {!cat.hero_url && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(${cat.accent_color}20 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity"
                style={{
                  background: `linear-gradient(to top, ${cat.accent_color}CC 0%, ${cat.accent_color}44 50%, transparent 100%)`,
                  opacity: 0.85,
                }}
              />

              {/* Content */}
              <div className="relative p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{catEmoji[cat.slug] ?? '◈'}</span>
                </div>
                <h3
                  className="display-font font-black mb-1"
                  style={{ color: '#fff', fontSize: 'var(--text-xl)', lineHeight: 1.1 }}
                >
                  {cat.name}
                </h3>
                <p
                  className="line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-xs)' }}
                >
                  {cat.description}
                </p>
                <div
                  className="inline-flex items-center gap-1.5 mt-3 font-semibold transition-all"
                  style={{ color: '#fff', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}
                >
                  SHOP NOW
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-alt)',
          padding: '5rem max(1.5rem, env(safe-area-inset-left, 0px))',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p
                className="font-bold mb-2"
                style={{ color: 'var(--gold)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em' }}
              >
                TRENDING
              </p>
              <h2
                className="display-font font-black"
                style={{ color: 'var(--fg)', fontSize: 'var(--text-3xl)' }}
              >
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-semibold"
              style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}
            >
              All products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))' }}
          >
            {prods.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {prods.length === 0 && (
            <div
              className="text-center py-20"
              style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}
            >
              Products loading soon — check back shortly.
            </div>
          )}
        </div>
      </section>

      {/* ─── SHOP THE VIBE BANNER ──────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
          padding: '5rem max(1.5rem, env(safe-area-inset-left, 0px))',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p
            className="font-bold mb-4"
            style={{ color: 'var(--gold)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em' }}
          >
            ✦ COMING SOON
          </p>
          <h2
            className="display-font font-black mb-6"
            style={{ color: '#fff', fontSize: 'var(--text-3xl)' }}
          >
            Shop The Look. Style The Space.
          </h2>
          <p
            className="mx-auto mb-8 max-w-xl"
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}
          >
            Soon you&apos;ll be able to upload a photo of your outfit or your room and shop every item in it instantly — powered by AI.
          </p>
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--gold)',
              fontSize: 'var(--text-sm)',
            }}
          >
            Join the waitlist — coming soon
          </div>
        </div>
      </section>

    </div>
  )
}
