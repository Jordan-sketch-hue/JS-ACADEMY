'use client'
import { useState } from 'react'
import type { Product } from '@/types/shop'

type GenState = {
  status: 'idle' | 'generating' | 'polling' | 'done' | 'error'
  statusUrl?: string
  imageUrl?: string
  videoUrl?: string
  error?: string
}

export default function ProductsAdmin({ products: initial }: { products: Product[] }) {
  const [products, setProducts] = useState(initial)
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [genState, setGenState] = useState<Record<string, GenState>>({})

  function updateGen(id: string, patch: Partial<GenState>) {
    setGenState(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function pollUntilDone(
    statusUrl: string,
    productId: string,
    type: 'image' | 'video'
  ) {
    updateGen(productId, { status: 'polling', statusUrl })
    let attempts = 0
    while (attempts < 60) {
      await new Promise(r => setTimeout(r, 3000))
      const res = await fetch('/api/generate/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusUrl,
          productId: type === 'image' ? productId : undefined,
          saveImage: type === 'image',
        }),
      })
      const data = await res.json()

      if (data.status === 'completed' && data.output?.[0]) {
        if (type === 'image') {
          setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, image_url: data.output[0] } : p)
          )
          updateGen(productId, { status: 'done', imageUrl: data.output[0] })
        } else {
          updateGen(productId, { status: 'done', videoUrl: data.output[0] })
        }
        return
      }

      if (data.status === 'failed' || data.error) {
        updateGen(productId, { status: 'error', error: data.error ?? 'Generation failed' })
        return
      }
      attempts++
    }
    updateGen(productId, { status: 'error', error: 'Timed out after 3 minutes' })
  }

  async function generateImage(product: Product) {
    const prompt = prompts[product.id] || `${product.name}${product.description ? ', ' + product.description : ''}, product hero shot`
    updateGen(product.id, { status: 'generating' })
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await pollUntilDone(data.status_url, product.id, 'image')
    } catch (err) {
      updateGen(product.id, { status: 'error', error: err instanceof Error ? err.message : 'Failed' })
    }
  }

  async function generateVideo(product: Product) {
    const prompt = prompts[product.id] || `${product.name}${product.description ? ', ' + product.description : ''}, cinematic product reveal`
    updateGen(product.id, { status: 'generating' })
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await pollUntilDone(data.status_url, product.id, 'video')
    } catch (err) {
      updateGen(product.id, { status: 'error', error: err instanceof Error ? err.message : 'Failed' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black tracking-widest uppercase mb-2" style={{ color: 'var(--navy)' }}>
        Product Assets
      </h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
        Generate AI images (Soul V2 · $0.003/img) and videos (Wan 3.0 · $0.10/clip)
      </p>

      <div className="flex flex-col gap-8">
        {products.map(product => {
          const gs = genState[product.id] ?? { status: 'idle' }
          const busy = gs.status === 'generating' || gs.status === 'polling'
          return (
            <div
              key={product.id}
              className="rounded-2xl p-6 grid gap-4"
              style={{
                background: 'var(--surface)',
                gridTemplateColumns: '160px 1fr',
              }}
            >
              {/* Image */}
              <div
                className="rounded-xl overflow-hidden aspect-square flex items-center justify-center"
                style={{ background: 'var(--surface-2, #e5e7eb)' }}
              >
                {gs.status === 'done' && gs.imageUrl ? (
                  <img src={gs.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
                    No Image
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3">
                <div>
                  <div className="font-black text-lg tracking-wide" style={{ color: 'var(--navy)' }}>
                    {product.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    J${product.price_jmd.toLocaleString()} · {product.category ?? 'Uncategorised'} · {product.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Prompt input */}
                <textarea
                  rows={2}
                  placeholder={`Prompt for ${product.name}…`}
                  value={prompts[product.id] ?? ''}
                  onChange={e => setPrompts(prev => ({ ...prev, [product.id]: e.target.value }))}
                  disabled={busy}
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none"
                  style={{
                    background: 'var(--bg)',
                    border: '1.5px solid var(--gold)',
                    color: 'var(--navy)',
                    outline: 'none',
                    opacity: busy ? 0.6 : 1,
                  }}
                />

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => generateImage(product)}
                    disabled={busy}
                    className="px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-opacity"
                    style={{
                      background: 'var(--navy)',
                      color: '#fff',
                      opacity: busy ? 0.5 : 1,
                      cursor: busy ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {gs.status === 'generating' || (busy && !gs.videoUrl) ? 'Generating…' : 'Gen Image'}
                  </button>
                  <button
                    onClick={() => generateVideo(product)}
                    disabled={busy}
                    className="px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-opacity"
                    style={{
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      opacity: busy ? 0.5 : 1,
                      cursor: busy ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Gen Video
                  </button>
                </div>

                {/* Status */}
                {gs.status === 'polling' && (
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Processing… checking every 3s
                  </p>
                )}
                {gs.status === 'done' && gs.videoUrl && (
                  <video
                    src={gs.videoUrl}
                    controls
                    className="rounded-lg mt-1"
                    style={{ maxHeight: '120px' }}
                  />
                )}
                {gs.status === 'error' && (
                  <p className="text-xs" style={{ color: '#c0392b' }}>{gs.error}</p>
                )}
                {gs.status === 'done' && !gs.videoUrl && (
                  <p className="text-xs font-bold" style={{ color: 'var(--navy)' }}>
                    Image saved to product
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
