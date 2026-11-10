"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Hotspot {
  id: string
  x: number   // 0-100 percent from left
  y: number   // 0-100 percent from top
  label: string
  price: string
  slug: string
  category: string
}

interface Scene {
  id: string
  title: string
  description: string
  imageUrl: string
  theme: string
  hotspots: Hotspot[]
}

const SCENES: Scene[] = [
  {
    id: "living-room-modern",
    title: "Modern Living Room",
    description: "A warm, curated living space — click any glowing dot to shop the exact piece.",
    imageUrl: "/scenes/living-room.jpg",
    theme: "Home & Living",
    hotspots: [
      { id: "h1", x: 22, y: 68, label: "Boucle Throw Cushion", price: "J$4,500", slug: "boucle-throw-cushion", category: "Home & Living" },
      { id: "h2", x: 48, y: 55, label: "Marble Coffee Table", price: "J$32,000", slug: "marble-coffee-table", category: "Furniture" },
      { id: "h3", x: 74, y: 42, label: "Ceramic Table Lamp", price: "J$8,200", slug: "ceramic-table-lamp", category: "Home & Living" },
      { id: "h4", x: 60, y: 72, label: "Jute Area Rug 5×8", price: "J$18,500", slug: "jute-area-rug", category: "Home & Living" },
    ],
  },
  {
    id: "bedroom-luxe",
    title: "Luxe Bedroom Suite",
    description: "Sleep in style. Every piece is available — tap the dots to discover pricing.",
    imageUrl: "/scenes/bedroom.jpg",
    theme: "Home & Living",
    hotspots: [
      { id: "h5", x: 30, y: 35, label: "Linen Duvet Set — Queen", price: "J$12,800", slug: "linen-duvet-set-queen", category: "Home & Living" },
      { id: "h6", x: 65, y: 50, label: "Solid Wood Bedside Table", price: "J$22,000", slug: "solid-wood-bedside-table", category: "Furniture" },
      { id: "h7", x: 70, y: 30, label: "Nordic Pendant Light", price: "J$9,500", slug: "nordic-pendant-light", category: "Home & Living" },
      { id: "h8", x: 20, y: 60, label: "Mohair Throw Blanket", price: "J$7,200", slug: "mohair-throw-blanket", category: "Home & Living" },
    ],
  },
  {
    id: "home-office-setup",
    title: "Productive Home Office",
    description: "Your best work starts with the right setup. Shop each piece directly.",
    imageUrl: "/scenes/home-office.jpg",
    theme: "Electronics",
    hotspots: [
      { id: "h9",  x: 45, y: 40, label: "Portable Monitor 15.6\"", price: "J$28,000", slug: "portable-monitor-15", category: "Electronics & Tech" },
      { id: "h10", x: 55, y: 60, label: "Mechanical Keyboard", price: "J$9,800", slug: "mechanical-keyboard", category: "Electronics & Tech" },
      { id: "h11", x: 25, y: 48, label: "Ergonomic Desk Lamp", price: "J$5,500", slug: "ergonomic-desk-lamp", category: "Office Products" },
      { id: "h12", x: 72, y: 55, label: "Wireless Mouse Pro", price: "J$4,200", slug: "wireless-mouse-pro", category: "Electronics & Tech" },
    ],
  },
]

export default function VisualizerPage() {
  const [activeScene, setActiveScene] = useState<Scene>(SCENES[0])
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .viz-hero{background:"var(--dark)";padding:60px 24px 48px;text-align:center}
        .viz-scene-select{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px}
        .viz-scene-btn{padding:10px 24px;font-family:var(--font-sans);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;border:1px solid rgba(255,255,255,0.18);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;transition:all 0.25s}
        .viz-scene-btn:hover{border-color:rgba(200,168,75,0.5);color:rgba(200,168,75,0.8)}
        .viz-scene-btn.active{border-color:var(--gold);background:rgba(200,168,75,0.12);color:var(--gold)}
        .viz-stage{position:relative;max-width:1280px;margin:0 auto;cursor:crosshair}
        .viz-stage-img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
        .hotspot{position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.95);border:2px solid var(--gold);cursor:pointer;transform:translate(-50%,-50%);transition:var(--transition);z-index:10}
        .hotspot::before{content:'';position:absolute;inset:-8px;border-radius:50%;border:1.5px solid rgba(200,168,75,0.45);animation:pulseRing 2.2s ease-in-out infinite}
        .hotspot:hover,.hotspot.active{transform:translate(-50%,-50%) scale(1.3);background:var(--gold)}
        .hotspot-tooltip{position:absolute;background:"var(--dark)";border:1px solid rgba(200,168,75,0.35);padding:12px 16px;min-width:180px;z-index:20;pointer-events:none;opacity:0;transform:translateY(4px);transition:all 0.2s}
        .hotspot-tooltip.visible{opacity:1;transform:translateY(0);pointer-events:auto}
        .hotspot-tooltip.flip-left{right:calc(100% + 8px);left:auto}
        .hotspot-tooltip.flip-right{left:calc(100% + 8px);right:auto}
        .hotspot-tooltip.flip-up{bottom:calc(100% + 8px);top:auto}
        .hotspot-tooltip.flip-down{top:calc(100% + 8px);bottom:auto}
        .viz-sidebar{max-width:1280px;margin:0 auto;padding:40px 24px 80px;display:grid;grid-template-columns:1fr 320px;gap:48px;align-items:start}
        .viz-product-tray{background:#F5F4F0;border:1px solid var(--border)}
        .viz-tray-header{padding:20px 24px;border-bottom:1px solid var(--border)}
        .viz-tray-item{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;text-decoration:none;transition:all 0.2s}
        .viz-tray-item:hover{background:rgba(200,168,75,0.07)}
        .viz-tray-item.highlighted{background:rgba(200,168,75,0.12);border-left:2px solid var(--gold)}
        .viz-tray-dot{width:12px;height:12px;border-radius:50%;background:var(--gold);flex-shrink:0}
        .viz-info{padding:40px 0}
        .how-step{display:flex;gap:20px;margin-bottom:28px;align-items:flex-start}
        .how-num{width:36px;height:36px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-serif);font-size:15px;font-weight:900;color:var(--ink);flex-shrink:0}
        @media(max-width:900px){.viz-sidebar{grid-template-columns:1fr}}
      ` }} />

      {/* Hero */}
      <section className="viz-hero">
        <span className="stamp">AI Room Visualizer</span>
        <h1 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(28px,4vw,52px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginTop:16,marginBottom:16 }}>
          See It In <em style={{ fontStyle:"italic",color:"var(--gold)" }}>Your Space.</em>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.45)",fontSize:15,maxWidth:520,margin:"0 auto" }}>
          Every glowing dot on these AI-generated scenes links to a real product in our store. Click to discover, compare, and shop.
        </p>
        <div className="viz-scene-select">
          {SCENES.map(s => (
            <button
              key={s.id}
              className={`viz-scene-btn${activeScene.id === s.id ? " active" : ""}`}
              onClick={() => { setActiveScene(s); setActiveHotspot(null) }}
            >
              {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* Scene Stage */}
      <div style={{ background:"var(--dark)", padding:"0 0 2px" }}>
        <div className="viz-stage">
          <Image
            src={activeScene.imageUrl}
            alt={activeScene.title}
            width={1400}
            height={788}
            className="viz-stage-img"
            priority
          />
          {activeScene.hotspots.map(hs => {
            const isLeft = hs.x > 60
            const isBottom = hs.y > 60
            return (
              <div
                key={hs.id}
                className={`hotspot${activeHotspot?.id === hs.id ? " active" : ""}`}
                style={{ left:`${hs.x}%`, top:`${hs.y}%` }}
                onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
              >
                <div className={`hotspot-tooltip${activeHotspot?.id === hs.id ? " visible" : ""} ${isLeft ? "flip-left" : "flip-right"} ${isBottom ? "flip-up" : "flip-down"}`}>
                  <span className="stamp" style={{ display:"block",marginBottom:4,fontSize:9 }}>{hs.category}</span>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:13,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.3 }}>{hs.label}</p>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:16,fontWeight:900,color:"var(--gold)",marginBottom:10 }}>{hs.price}</p>
                  <Link
                    href={"/shop/" + hs.slug}
                    style={{ display:"block",textAlign:"center",padding:"8px 16px",background:"var(--gold)",color:"var(--ink)",fontFamily:"var(--font-sans)",fontSize:10,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",textDecoration:"none" }}
                    onClick={e => e.stopPropagation()}
                  >
                    Shop This
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="viz-sidebar">
        <div>
          <span className="stamp" style={{ display:"block",marginBottom:12 }}>{activeScene.theme}</span>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(22px,3vw,36px)",fontWeight:900,color:"var(--ink)",marginBottom:12 }}>{activeScene.title}</h2>
          <p style={{ fontSize:15,color:"var(--ink-muted)",lineHeight:1.8,marginBottom:32 }}>{activeScene.description}</p>

          <div className="viz-info">
            <p className="label" style={{ marginBottom:20 }}>How It Works</p>
            {[
              ["Choose a Room", "Browse our curated scene library — living rooms, bedrooms, home offices, and more coming soon."],
              ["Tap the Dots", "Every glowing hotspot links to a real, purchasable product from our catalog."],
              ["Shop Directly", "Add to cart from the popup or visit the full product page for details and reviews."],
            ].map(([title, desc], i) => (
              <div key={i} className="how-step">
                <div className="how-num">{i + 1}</div>
                <div>
                  <p style={{ fontFamily:"var(--font-serif)",fontWeight:700,color:"var(--ink)",marginBottom:4 }}>{title}</p>
                  <p style={{ fontSize:13,color:"var(--ink-muted)",lineHeight:1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/shop" className="btn-outline">Browse All Products</Link>
        </div>

        <div>
          <div className="viz-product-tray">
            <div className="viz-tray-header">
              <span className="stamp" style={{ display:"block",marginBottom:4 }}>In This Scene</span>
              <p style={{ fontSize:12,color:"var(--ink-muted)" }}>{activeScene.hotspots.length} shoppable items</p>
            </div>
            {activeScene.hotspots.map(hs => (
              <Link
                key={hs.id}
                href={"/shop/" + hs.slug}
                className={`viz-tray-item${activeHotspot?.id === hs.id ? " highlighted" : ""}`}
                onMouseEnter={() => setActiveHotspot(hs)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <div className="viz-tray-dot" />
                <div>
                  <p style={{ fontSize:12,fontWeight:600,color:"var(--ink)",lineHeight:1.3 }}>{hs.label}</p>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:14,fontWeight:900,color:"var(--ink)",marginTop:2 }}>{hs.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}