import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-28"
        style={{ background: 'var(--navy)' }}
      >
        <svg
          width="72" height="72" viewBox="0 0 100 100" fill="none"
          className="mb-8 opacity-90"
        >
          <polygon points="4,4 96,4 4,96" fill="#1A2744" />
          <polygon points="96,4 96,96 4,96" fill="#C9A84C" />
          <polygon points="52,0 100,0 100,4 96,4 48,100 4,100 4,96 56,4" fill="white" />
          <line x1="22" y1="10" x2="88" y2="76" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="square" opacity="0.35" />
        </svg>
        <h1
          className="text-white font-black text-4xl md:text-6xl tracking-widest mb-4"
          style={{ letterSpacing: '0.14em' }}
        >
          MYSHOP
        </h1>
        <p className="text-white/60 text-lg mb-10 tracking-wide">Everything. Delivered.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold text-sm tracking-wider transition-all hover:opacity-90"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}
        >
          Shop Now
        </Link>
      </section>

      {/* Value props */}
      <section className="max-w-4xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-10 text-center">
        {[
          { icon: '⚡', title: 'Fast Finds', desc: 'Everything in one place — no jumping between sites.' },
          { icon: '📦', title: 'Fast Delivery', desc: 'Straight to your door, every time.' },
          { icon: '🛡️', title: 'Secure Checkout', desc: 'PayPal-powered payments. Buy with confidence.' },
        ].map(v => (
          <div key={v.title}>
            <div className="text-4xl mb-4">{v.icon}</div>
            <h3
              className="font-bold text-sm tracking-widest uppercase mb-2"
              style={{ color: 'var(--navy)' }}
            >
              {v.title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{v.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
