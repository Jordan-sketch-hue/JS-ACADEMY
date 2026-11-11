import { NextRequest } from "next/server"

export function checkAdminAuth(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-key") ?? ""
  const secret = process.env.ADMIN_SECRET ?? ""
  if (!secret) return false
  return auth === secret
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}
