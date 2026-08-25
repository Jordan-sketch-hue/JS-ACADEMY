import { NextResponse, type NextRequest } from "next/server";
import { ACCESS } from "@/lib/access";

const AREAS = [ACCESS.admin, ACCESS.portal];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const area = AREAS.find(
    (a) => pathname === a.home || pathname.startsWith(a.home + "/")
  );
  if (!area) return NextResponse.next();

  const providedKey = searchParams.get("key");
  const cookieVal = req.cookies.get(area.cookie)?.value;

  // 1) Magic link with the correct key → set cookie, strip key from URL.
  if (providedKey && providedKey === area.key) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("key");
    const res = NextResponse.redirect(clean);
    res.cookies.set(area.cookie, area.key, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  }

  // 2) Already has a valid cookie → allow.
  if (cookieVal && cookieVal === area.key) return NextResponse.next();

  // 3) No access → bounce home so the area isn't discoverable.
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/back-office/:path*", "/portal/:path*"],
};
