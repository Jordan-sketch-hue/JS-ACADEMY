import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"
import BlogPostClient from "./BlogPostClient"

async function getPost(slug: string) {
  const { data } = await supabase
    .from("myshop_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    keywords: post.tags ?? [],
    openGraph: {
      title: post.title + " | Mine & Yours Journal",
      description: post.excerpt ?? post.title,
      type: "article",
      publishedTime: post.published_at,
      authors: post.author ? [post.author] : undefined,
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? post.title,
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"Article",
        "headline":post.title,
        "description":post.excerpt,
        "image":post.cover_image,
        "author":{"@type":"Person","name":post.author ?? "Mine & Yours Editorial"},
        "publisher":{"@type":"Organization","name":"Mine & Yours Shop","url":"https://mineandyoursshop.online"},
        "datePublished":post.published_at,
        "mainEntityOfPage":{"@type":"WebPage","@id":"https://mineandyoursshop.online/blog/"+post.slug}
      })}} />
      <BlogPostClient post={post} />
    </>
  )
}