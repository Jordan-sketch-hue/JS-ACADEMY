'use client'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { jmdToUsd } from '@/lib/paypal-client'

export default function CheckoutPage() {
  const { cart, totalJmd, clearCart } = useCart()
  const router = useRouter()

  if (cart.length === 0) {
    router.replace('/cart')
    return null
  }

  async function createOrder() {
    const res = await fetch('/api/payments/paypal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amountJmd: totalJmd,
        description: `MYSHOP order — ${cart.length} item(s)`,
      }),
    })
    const data = await res.json()
    return data.paypalOrderId as string
  }

  async function onApprove(data: { orderID: string }) {
    await fetch('/api/payments/paypal/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paypalOrderId: data.orderID, cart }),
    })
    clearCart()
    router.push('/checkout/success')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-black tracking-widest uppercase mb-2" style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}>
        Checkout
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Total: J${totalJmd.toLocaleString()} ≈ USD ${jmdToUsd(totalJmd)}
      </p>

      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  )
}
