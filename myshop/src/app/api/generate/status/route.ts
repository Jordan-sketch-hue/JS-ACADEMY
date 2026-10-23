import { NextRequest, NextResponse } from 'next/server'
import { pollStatus } from '@/lib/higgsfield'
import { createServiceSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { statusUrl, productId, saveImage } = await req.json()
    if (!statusUrl) return NextResponse.json({ error: 'statusUrl required' }, { status: 400 })

    const result = await pollStatus(statusUrl)

    if (result.status === 'completed' && saveImage && productId && result.output?.[0]) {
      const supabase = await createServiceSupabase()
      await supabase.from('myshop_products')
        .update({ image_url: result.output[0] })
        .eq('id', productId)
    }

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Poll failed' },
      { status: 500 }
    )
  }
}
