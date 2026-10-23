import { createServerSupabase } from '@/lib/supabase-server'
import type { Product, Category } from '@/types/shop'
import ShopClient from './ShopClient'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const supabase = await createServerSupabase()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('myshop_categories').select('*').order('name'),
    supabase.from('myshop_products').select('*').eq('active', true).order('name'),
  ])

  return (
    <ShopClient
      categories={(categories ?? []) as Category[]}
      products={(products ?? []) as Product[]}
    />
  )
}
