import { NextResponse } from "next/server";
import { ACCESS } from "@/lib/access";

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete(ACCESS.admin.cookie);
  res.cookies.delete(ACCESS.portal.cookie);
  return res;
}
