import { createServiceSupabase } from '@/lib/supabase-server'
import type { Product } from '@/types/shop'
import ProductsAdmin from './ProductsAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createServiceSupabase()
  const { data } = await supabase
    .from('myshop_products')
    .select('*')
    .order('created_at', { ascending: false })

  return <ProductsAdmin products={(data ?? []) as Product[]} />
}
