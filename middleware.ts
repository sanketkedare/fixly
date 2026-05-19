import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Always pass-through without authentication guards
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

