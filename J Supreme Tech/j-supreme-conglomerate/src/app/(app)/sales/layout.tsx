import { BrandBar } from "@/components/sales/brand-bar";

/**
 * Wraps every /sales page with the brand switcher + section tabs, so each
 * subpage is implicitly scoped to the active brand (cookie-based).
 */
export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <BrandBar />
      {children}
    </div>
  );
}
