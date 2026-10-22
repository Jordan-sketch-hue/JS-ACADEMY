import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="text-2xl font-black mb-4" style={{ color: 'var(--navy)' }}>Order Confirmed</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
        Your payment was received. We will be in touch shortly.
      </p>
      <Link
        href="/shop"
        className="inline-block px-6 py-3 rounded font-semibold text-sm"
        style={{ background: 'var(--navy)', color: '#fff' }}
      >
        Keep Shopping
      </Link>
    </div>
  )
}
