import { createServerSupabase } from '@/lib/supabase-server'
import type { Product } from '@/types/shop'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('myshop_products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!data) notFound()
  const p = data as Product

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="rounded-xl overflow-hidden aspect-square" style={{ background: 'var(--surface)' }}>
          {p.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          {p.category && (
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
              {p.category}
            </p>
          )}
          <h1 className="text-3xl font-black mb-4" style={{ color: 'var(--navy)' }}>{p.name}</h1>
          <p className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            J${p.price_jmd.toLocaleString()}
          </p>
          {p.description && (
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
              {p.description}
            </p>
          )}
          <AddToCartButton product={p} />
        </div>
      </div>
    </div>
  )
}
