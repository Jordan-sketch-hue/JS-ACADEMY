import { monogramIcon } from "@/lib/brand/monogram-image";

export const runtime = "edge";

export function GET() {
  return monogramIcon(192);
}
