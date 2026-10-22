import { createServerSupabase } from '@/lib/supabase-server'
import type { Product } from '@/types/shop'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

export default async function ShopPage() {
  const supabase = await createServerSupabase()
  const { data: products } = await supabase
    .from('myshop_products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-2xl font-black tracking-widest uppercase mb-10"
        style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}
      >
        All Products
      </h1>

      {!products || products.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No products yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {(products as Product[]).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
