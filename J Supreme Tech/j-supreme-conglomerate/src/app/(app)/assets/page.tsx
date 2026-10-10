import { BrandKitGallery } from "@/components/app/brand-kit-gallery";

export const dynamic = "force-dynamic";

export default function AssetsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Creative assets</h1>
        <p className="text-sm text-muted-foreground">
          Categorized SVG starters — download and refine in Adobe CC. Replace with Supabase Storage later if you want a
          live DAM.
        </p>
      </div>
      <BrandKitGallery />
    </div>
  );
}
