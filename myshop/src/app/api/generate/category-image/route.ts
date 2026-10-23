import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { categoryId, imageUrl, field } = await req.json()

    if (!categoryId || !imageUrl || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['cover_url', 'hero_url'].includes(field)) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('myshop_categories')
      .update({ [field]: imageUrl })
      .eq('id', categoryId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
