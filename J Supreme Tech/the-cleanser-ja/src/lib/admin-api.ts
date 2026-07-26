import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase-server";
import { getSession, type SessionPayload } from "./session";

export type AdminContext = {
  session: SessionPayload;
};

export async function requireAdmin(): Promise<
  | { ok: true; ctx: AdminContext }
  | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, ctx: { session } };
}

export async function adminRpc<T>(
  ctx: AdminContext,
  fn: string,
  args: Record<string, unknown>,
): Promise<T> {
  // Service-role client — bypasses RLS; session auth is the gate (checked above).
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}
