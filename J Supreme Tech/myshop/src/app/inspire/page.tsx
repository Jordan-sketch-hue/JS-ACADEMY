export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import InspireFeed from "./InspireFeed"

export const metadata: Metadata = {
  title: "Inspire — Discover & Shop | Mine & Yours Shop",
  description: "Curated editorial drops, shoppable inspo, and community style from Mine & Yours Shop. Discover trends across beauty, home, jewelry and more. Delivered across Jamaica.",
  keywords: ["shop inspo", "editorial style", "home decor inspiration", "jewelry inspo", "lifestyle feed", "shoppable content", "Jamaica style"],
  openGraph: {
    title: "Inspire — Mine & Yours Shop",
    description: "Curated shoppable inspo. Editorial drops. Community style.",
    type: "website",
  },
}

export default function InspirePage() {
  return <InspireFeed />
}
