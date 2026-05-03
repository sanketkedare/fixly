import { NextRequest, NextResponse } from "next/server";

// ── Public page routes — no session needed ────────────────────────────────────
const PUBLIC_PATHS = ["/", "/login", "/register"];

// ── Lightweight JWT decode (Edge Runtime — no Node crypto) ────────────────────
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Always pass: static files & assets ────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(png|jpg|jpeg|svg|ico|webp|gif|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── 2. Always pass: API routes (they verify via Firebase Admin Bearer token)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // ── 3. Always pass: public pages ─────────────────────────────────────────
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // ── 4. Protected pages: require valid __session cookie ───────────────────
  const session = request.cookies.get("__session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeJwtPayload(session);
  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("__session");
    return res;
  }

  // Firebase exp is in seconds
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  if (exp * 1000 < Date.now()) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("__session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
