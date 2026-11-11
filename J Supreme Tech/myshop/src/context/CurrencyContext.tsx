"use client"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "JMD" | "USD"

interface CurrencyCtx {
  currency: Currency
  toggle: () => void
  toDisplay: (priceJmdCents: number) => string
}

const CurrencyContext = createContext<CurrencyCtx>({
  currency: "JMD",
  toggle: () => {},
  toDisplay: (p) => `J$${(p / 100).toLocaleString()}`,
})

const RATE = parseFloat(process.env.NEXT_PUBLIC_JMD_TO_USD_RATE ?? "157")

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("JMD")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("my-currency") as Currency | null
      if (saved === "USD" || saved === "JMD") setCurrency(saved)
    } catch {}
  }, [])

  function toggle() {
    setCurrency(c => {
      const next = c === "JMD" ? "USD" : "JMD"
      try { localStorage.setItem("my-currency", next) } catch {}
      return next
    })
  }

  function toDisplay(priceJmdCents: number): string {
    if (currency === "USD") {
      const usd = priceJmdCents / 100 / RATE
      return `$${usd.toFixed(2)}`
    }
    return `J$${(priceJmdCents / 100).toLocaleString()}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggle, toDisplay }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() { return useContext(CurrencyContext) }
