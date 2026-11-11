'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { CartItem, Product } from '@/lib/types'

interface Toast {
  id: string
  message: string
}

interface CartContextValue {
  items: CartItem[]
  cartCount: number
  itemCount: number
  cartTotal: number
  cartBounce: boolean
  loading: boolean
  toasts: Toast[]
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  dismissToast: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function getOrCreateCartId(): string {
  try {
    let id = localStorage.getItem('myshop_cart_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('myshop_cart_id', id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartBounce, setCartBounce] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  const cartIdRef = useRef<string | null>(null)

  const addToast = useCallback((message: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const loadCart = useCallback(async (cartId: string) => {
    const { data } = await supabase
      .from('myshop_cart_items')
      .select('*')
      .eq('cart_id', cartId)
    setItems((data ?? []) as CartItem[])
    setLoading(false)
  }, [])

  useEffect(() => {
    const id = getOrCreateCartId()
    cartIdRef.current = id
    loadCart(id)
  }, [loadCart])

  const addToCart = useCallback(async (product: Product) => {
    const cartId = cartIdRef.current!
    const existing = items.find(i => i.product_id === product.id)
    if (existing) {
      const newQty = existing.quantity + 1
      await supabase
        .from('myshop_cart_items')
        .update({ quantity: newQty })
        .eq('id', existing.id)
      setItems(prev => prev.map(i => i.id === existing.id ? { ...i, quantity: newQty } : i))
    } else {
      const { data } = await supabase
        .from('myshop_cart_items')
        .insert({
          cart_id: cartId,
          product_id: product.id,
          name: product.name,
          price_jmd: product.price_jmd,
          image_url: product.image_url,
          quantity: 1,
        })
        .select()
        .single()
      if (data) setItems(prev => [...prev, data as CartItem])
    }
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 400)
    addToast(`${product.name} added to cart`)
  }, [items, addToast])

  const removeFromCart = useCallback(async (itemId: string) => {
    await supabase.from('myshop_cart_items').delete().eq('id', itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }
    await supabase.from('myshop_cart_items').update({ quantity }).eq('id', itemId)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }, [removeFromCart])

  const clearCart = useCallback(async () => {
    const cartId = cartIdRef.current!
    await supabase.from('myshop_cart_items').delete().eq('cart_id', cartId)
    setItems([])
  }, [])

  const cartTotal = items.reduce((sum, i) => sum + i.price_jmd * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartCount = items.length

  return (
    <CartContext.Provider value={{
      items, cartCount, itemCount, cartTotal, cartBounce, loading, toasts,
      addToCart, removeFromCart, updateQuantity, clearCart, dismissToast,
    }}>
      {children}
    </CartContext.Provider>
  )
}