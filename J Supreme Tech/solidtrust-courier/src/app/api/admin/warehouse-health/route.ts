/**
 * GET /api/admin/warehouse-health
 * Live connectivity test against every configured warehouse.
 * For Aone: hits the packages endpoint, returns HTTP status + count.
 * Auth: active staff session OR x-health-secret header.
 */
import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/staff";
import { allWarehouses } from "@/lib/warehouses";
import { aoneListPackages } from "@/lib/aone";
import { listCourierPackages } from "@/lib/sethwan";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const secret = process.env.WA_HEALTH_SECRET?.trim();
  const headerOk = !!secret && req.headers.get("x-health-secret") === secret;
  if (!headerOk) {
    const { staff } = await getSessionStaff();
    if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warehouses = allWarehouses();
  const results = await Promise.all(
    warehouses.map(async (wh) => {
      const base = {
        id: wh.id,
        name: wh.shortName,
        protocol: wh.protocol,
        configured: wh.configured,
        slug: wh.protocol === "aone" ? (wh.aoneEndpoint?.apiSlug?.slice(0, 8) + "...") : undefined,
        baseUrl: wh.protocol === "aone" ? wh.aoneEndpoint?.baseUrl : wh.endpoint?.baseUrl,
      };

      if (!wh.configured) return { ...base, ok: false, error: "not_configured" };

      try {
        if (wh.protocol === "aone" && wh.aoneEndpoint) {
          const res = await aoneListPackages(wh.aoneEndpoint);
          return { ...base, ok: res.ok, count: res.ok ? res.data?.length : undefined, error: res.ok ? undefined : res.error };
        } else {
          const res = await listCourierPackages(wh.endpoint, "", 1);
          return { ...base, ok: res.ok, error: res.ok ? undefined : res.error };
        }
      } catch (e) {
        return { ...base, ok: false, error: String(e instanceof Error ? e.message : e) };
      }
    })
  );

  return NextResponse.json({ checkedAt: new Date().toISOString(), warehouses: results });
}