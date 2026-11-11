import { Suspense } from "react"
import SuccessContent from "./SuccessContent"

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 900 }}>Loading…</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}