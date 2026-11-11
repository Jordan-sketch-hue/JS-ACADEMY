"use client"
import { useRouter } from "next/navigation"

interface Props {
  categories: { name: string; slug: string }[]
  current?: string
}

export function CategoryDropdown({ categories, current }: Props) {
  const router = useRouter()
  return (
    <select
      className="shop-cat-select"
      value={current ?? ""}
      onChange={e => {
        const val = e.target.value
        router.push(val ? `/shop?category=${val}` : "/shop")
      }}
    >
      <option value="">All Products</option>
      {categories.map(c => (
        <option key={c.slug} value={c.slug}>{c.name}</option>
      ))}
    </select>
  )
}
