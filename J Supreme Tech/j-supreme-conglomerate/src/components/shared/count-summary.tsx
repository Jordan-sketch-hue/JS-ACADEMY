import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  value: number;
  emphasis?: boolean;
};

export function CountSummary({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => (
        <Badge
          key={item.label}
          variant={item.emphasis ? "default" : "secondary"}
          className="gap-1.5 px-2.5 py-1 font-normal tabular-nums"
        >
          <span className="text-base font-semibold leading-none">{item.value}</span>
          <span className="text-[11px] uppercase tracking-wide opacity-90">{item.label}</span>
        </Badge>
      ))}
    </div>
  );
}
