import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const HERO_IMAGE = 'https://d3u0tzju9qaucj.cloudfront.net/6b92ed1e-f628-44cd-902f-cc0ffa9be3dd/d52c0156-f214-45c5-97e2-f36fd25cac93/c2b6e796-5009-4262-9067-41b946830323.png'

const CATEGORIES = [
  { name: 'Baby & Toddler',        slug: 'baby',             desc: 'Safe and fun products for your little ones',              image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80' },
  { name: 'Beauty & Wellness',     slug: 'beauty',           desc: 'Skincare, tools and beauty essentials for your ritual',   image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { name: 'Cellphone Accessories', slug: 'cellphone',        desc: 'Cases, chargers and must-have phone accessories',         image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80' },
  { name: 'Electronics & Tech',    slug: 'electronics',      desc: 'Gadgets, devices and cutting-edge technology',            image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80' },
  { name: 'Fitness & Outdoor',     slug: 'fitness',          desc: 'Gear for workouts and outdoor adventures',                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
  { name: 'Furniture',             slug: 'furniture',        desc: 'Stylish pieces for every room in your home',              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Patio & Garden',        slug: 'garden',           desc: 'Outdoor living and garden essentials',                    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' },
  { name: 'Home Improvement',      slug: 'home-improvement', desc: 'Tools and supplies for every DIY project',                image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
  { name: 'Home & Living',         slug: 'home-living',      desc: 'Decor, lighting and everything to elevate your space',    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { name: 'Jewelry & Accessories', slug: 'jewelry',          desc: 'Statement pieces and everyday essentials',                image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80' },
  { name: 'Lifestyle Finds',       slug: 'lifestyle',        desc: 'Viral picks, trending items and our must-haves',          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
  { name: 'Office Products',       slug: 'office',           desc: 'Everything for a productive workspace',                   image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
  { name: 'Pet Supplies',          slug: 'pets',             desc: 'Toys, treats and essentials for your pets',               image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80' },
]

async function getNewArrivals(): Promise<Product[]> {
  const { data } = await supabase
    .from('myshop_products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as Product[]
}

export default async function HomePage() {
  const products = await getNewArrivals()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-[#0a0f1e] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #1a3a6e 0%, transparent 60%), radial-gradient(circle at 80% 20%, #c8a84b22 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-6 text-[#c8a84b] tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-[#c8a84b] rounded-full animate-pulse" />
                PREMIUM DROPSHIP STORE
              </div>
              <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] mb-6 max-w-xl">
                Shop The <span className="text-[#c8a84b]">Vibe.</span>
              </h1>
              <p className="text-white/60 text-lg max-w-md mb-10 leading-relaxed">
                Trending finds, curated collections, and premium goods ΓÇö delivered from worldwide to your door.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-2 bg-[#c8a84b] hover:bg-[#d4b455] text-[#0a0f1e] font-bold px-6 py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#c8a84b]/30">
                  Shop All ΓåÆ
                </Link>
                <Link href="/shop?category=jewelry" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-full transition-all hover:scale-105">
                  Shop Jewelry
                </Link>
              </div>

              <div className="flex gap-8 mt-16 pt-8 border-t border-white/10">
                <div><p className="text-2xl font-black">25+</p><p className="text-white/50 text-xs mt-0.5">Curated products</p></div>
                <div><p className="text-2xl font-black">13</p><p className="text-white/50 text-xs mt-0.5">Categories</p></div>
                <div><p className="text-2xl font-black">JAΓåÆUS</p><p className="text-white/50 text-xs mt-0.5">Worldwide shipping</p></div>
              </div>
            </div>

            {/* Right: hero product image */}
            <div className="relative hidden lg:block">
              <div
                className="relative rounded-3xl overflow-hidden aspect-[4/3]"
                style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)' }}
              >
                <Image
                  src={HERO_IMAGE}
                  alt="Premium products ΓÇö jewelry, electronics, home decor and more"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.25) 0%, transparent 60%)' }} />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-4 glass-dark rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <span className="text-2xl font-black text-[#c8a84b]">13</span>
                <div>
                  <p className="text-white text-xs font-bold leading-tight">Categories</p>
                  <p className="text-white/50 text-[10px]">Everything you need</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-1">EXPLORE</p>
            <h2 className="text-2xl sm:text-3xl font-black">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#0a0f1e] hover:text-[#c8a84b] transition-colors flex items-center gap-1">
            View all <span>ΓåÆ</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="animate-fade-in relative rounded-2xl overflow-hidden aspect-[4/3] group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-white/90 text-xs font-semibold mt-2">SHOP NOW ΓåÆ</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-1">TRENDING</p>
            <h2 className="text-2xl sm:text-3xl font-black">New Arrivals</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#0a0f1e] hover:text-[#c8a84b] transition-colors flex items-center gap-1">
            All products ΓåÆ
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  )
}
