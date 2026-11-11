"use client"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { __openAuthModal?: () => void } }
import { useState } from "react"
import dynamic from "next/dynamic"

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false })

export default function AuthTrigger() {
  const [open, setOpen] = useState(false)

  // Listen for custom open event so any component can trigger the modal
  if (typeof window !== "undefined") {
    window.__openAuthModal = () => setOpen(true)
  }

  return (
    <>
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  )
}

