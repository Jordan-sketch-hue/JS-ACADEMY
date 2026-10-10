import { FleetScanner } from "@/components/cyber/fleet-scanner";

export const metadata = { title: "Fleet Security Scan · J Supreme" };
export const dynamic = "force-dynamic";

export default function CyberFleetPage() {
  return <FleetScanner />;
}
