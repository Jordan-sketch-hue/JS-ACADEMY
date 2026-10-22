'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import type { CartItem } from '@/types/shop'

interface CartCtx {
  cart: CartItem[]
  itemCount: number
  totalJmd: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === item.product_id)
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product_id !== productId))
  }, [])

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product_id !== productId))
    } else {
      setCart(prev =>
        prev.map(i => (i.product_id === productId ? { ...i, quantity: qty } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const itemCount = cart.reduce((n, i) => n + i.quantity, 0)
  const totalJmd = cart.reduce((n, i) => n + i.price_jmd * i.quantity, 0)

  return (
    <Ctx.Provider value={{ cart, itemCount, totalJmd, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
