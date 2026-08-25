import { statusMeta, type PkgStatus } from "@/lib/demo-data";
import { cn } from "@/components/ui";

export function StatusBadge({ status }: { status: PkgStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        statusMeta[status].tone
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
