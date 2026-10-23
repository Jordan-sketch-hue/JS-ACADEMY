import { createServerSupabase } from '@/lib/supabase-server'
import type { Category } from '@/types/shop'
import CategoriesAdmin from './CategoriesAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('myshop_categories').select('*').order('name')
  return <CategoriesAdmin initialCategories={(data ?? []) as Category[]} />
}
