'use client'

import { useCart } from '@/context/CartContext'

export function ToastContainer() {
  const { toasts, dismissToast } = useCart()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto animate-slide-in bg-[#0a0f1e] border border-[#c8a84b]/40 text-white rounded-xl px-4 py-3 shadow-2xl min-w-[260px] max-w-[320px] flex items-start gap-3"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t.message}</p>
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-white/30 hover:text-white/60 ml-1 shrink-0 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}