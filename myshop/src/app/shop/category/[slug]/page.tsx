import { createServerSupabase } from '@/lib/supabase-server'
import type { Product, Category } from '@/types/shop'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const [{ data: cat }, { data: products }] = await Promise.all([
    supabase.from('myshop_categories').select('*').eq('slug', slug).single(),
    supabase.from('myshop_products').select('*').eq('active', true).eq('category', slug).order('name'),
  ])

  if (!cat) notFound()

  const category = cat as Category
  const prods = (products ?? []) as Product[]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ─── HERO ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: 'clamp(320px, 45vw, 520px)',
          background: category.hero_url
            ? `url(${category.hero_url}) center/cover`
            : `linear-gradient(135deg, ${category.accent_color}30 0%, ${category.accent_color}60 100%)`,
        }}
      >
        {/* Dot pattern when no image */}
        {!category.hero_url && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${category.accent_color}25 1.5px, transparent 1.5px)`,
              backgroundSize: '28px 28px',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.3) 60%, transparent 100%)`,
          }}
        />

        <div
          className="relative w-full max-w-7xl mx-auto"
          style={{ padding: '0 max(1.5rem, env(safe-area-inset-left, 0px)) 3rem' }}
        >
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 mb-4"
            style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}
          >
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span>›</span>
            <Link href="/shop" style={{ color: 'inherit' }}>Shop</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{category.name}</span>
          </nav>

          {/* Category badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{
              background: `${category.accent_color}25`,
              border: `1px solid ${category.accent_color}50`,
            }}
          >
            <span style={{ color: category.accent_color, fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em' }}>
              {prods.length} PRODUCTS
            </span>
          </div>

          <h1
            className="display-font font-black"
            style={{
              color: '#fff',
              fontSize: 'var(--text-3xl)',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
            }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p
              className="mt-3 max-w-xl"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-lg)' }}
            >
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* ─── PRODUCTS ───────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto"
        style={{ padding: '3rem max(1.5rem, env(safe-area-inset-left, 0px))' }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p
              className="font-bold mb-1"
              style={{ color: category.accent_color, fontSize: 'var(--text-xs)', letterSpacing: '0.1em' }}
            >
              BROWSE
            </p>
            <h2
              className="display-font font-black"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-2xl)' }}
            >
              {category.name} Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-semibold"
            style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}
          >
            ← All categories
          </Link>
        </div>

        {prods.length > 0 ? (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}
          >
            {prods.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-3xl"
            style={{
              background: `${category.accent_color}08`,
              border: `1px dashed ${category.accent_color}30`,
            }}
          >
            <p
              className="display-font font-bold mb-2"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-xl)' }}
            >
              Coming soon
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
              Products in this category are being curated.
            </p>
          </div>
        )}
      </div>

      {/* ─── OTHER CATEGORIES ───────────────────────── */}
      <div
        style={{
          background: 'var(--bg-alt)',
          padding: '3rem max(1.5rem, env(safe-area-inset-left, 0px))',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p
            className="font-bold mb-1"
            style={{ color: 'var(--gold)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em' }}
          >
            EXPLORE MORE
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link
              href="/shop"
              className="px-4 py-2 rounded-full font-semibold"
              style={{
                background: 'var(--navy)',
                color: '#fff',
                fontSize: 'var(--text-sm)',
              }}
            >
              All products →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
