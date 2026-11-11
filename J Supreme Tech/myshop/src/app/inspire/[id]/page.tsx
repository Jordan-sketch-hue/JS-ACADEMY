export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import Link from "next/link"
import PostClient from "./PostClient"

type Post = {
  id: string; type: string; media_url: string; media_type: string
  caption: string | null; theme: string | null; mood: string | null
  tags: string[]; product_ids: string[]; likes: number; saves: number; created_at: string
}

async function getPost(id: string): Promise<Post | null> {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data } = await sb.from("myshop_inspire_posts").select("*").eq("id", id).eq("published", true).single()
  return data as Post | null
}

async function getLinkedProducts(ids: string[]) {
  if (!ids.length) return []
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data } = await sb.from("myshop_products").select("id,name,slug,price_jmd,image_url").in("id", ids).eq("active", true)
  return data ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return { title: "Inspire" }
  return {
    title: post.caption ? post.caption.slice(0, 60) + " | Mine & Yours Shop Inspire" : "Inspire | Mine & Yours Shop",
    description: post.caption ?? "Discover and shop this editorial drop from Mine & Yours Shop.",
    openGraph: {
      images: post.media_type === "image" ? [{ url: post.media_url, width: 1200, height: 800 }] : [],
      title: post.caption ?? "Inspire",
      type: "article",
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, products] = await Promise.all([getPost(id), (async () => { const p = await getPost(id); return p ? getLinkedProducts(p.product_ids) : [] })()])
  if (!post) notFound()
  return <PostClient post={post} products={products} />
}