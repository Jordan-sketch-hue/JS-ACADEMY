"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BRAND_KIT_CATEGORIES, BRAND_KIT_ITEMS, type BrandKitCategoryId } from "@/lib/data/brand-kit";
import { Download, Filter } from "lucide-react";

export function BrandKitGallery() {
  const [cat, setCat] = useState<BrandKitCategoryId | "all">("all");
  const items = useMemo(
    () => (cat === "all" ? BRAND_KIT_ITEMS : BRAND_KIT_ITEMS.filter((i) => i.category === cat)),
    [cat],
  );

  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader>
          <CardTitle className="text-base">Use with AI + Adobe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            These <strong className="text-foreground">SVG</strong> starters open in Illustrator, Photoshop, or Express.
            Pair them with a{" "}
            <strong className="text-foreground">workspace snapshot</strong> from{" "}
            <a href="/need-to-know" className="text-primary underline">
              Need to know → Cursor &amp; ChatGPT
            </a>{" "}
            so external models know your real roster and tasks.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Category
        </span>
        <Button size="sm" variant={cat === "all" ? "default" : "outline"} onClick={() => setCat("all")}>
          All
        </Button>
        {BRAND_KIT_CATEGORIES.map((c) => (
          <Button key={c.id} size="sm" variant={cat === c.id ? "default" : "outline"} onClick={() => setCat(c.id)}>
            {c.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(cat === "all" ? BRAND_KIT_CATEGORIES : BRAND_KIT_CATEGORIES.filter((c) => c.id === cat)).map((bucket) => (
          <Card key={bucket.id} className="h-full border-border/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{bucket.label}</CardTitle>
              <p className="text-xs text-muted-foreground">{bucket.blurb}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {items
                .filter((i) => i.category === bucket.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card/40 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted/30 sm:h-24 sm:w-40">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG previews */}
                      <img src={item.file} alt={item.title} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium leading-tight">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <Button size="sm" variant="secondary" className="mt-1 gap-1" asChild>
                        <a href={item.file} download>
                          <Download className="h-3.5 w-3.5" />
                          Download .{item.ext}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
