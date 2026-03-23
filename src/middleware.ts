import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authCookieName, getSessionSecret, isAuthConfigured, isProductionEnvironment } from "@/lib/auth/config";
import { normalizeRedirectPath, verifySessionToken } from "@/lib/auth/session";

function isPublicPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/auth/") || pathname.startsWith("/api/cron/");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  if (!isAuthConfigured()) {
    if (isProductionEnvironment()) {
      return new NextResponse(
        "SubsVault authentication is not configured. Set SUBSVAULT_APP_PASSWORD and SUBSVAULT_SESSION_SECRET.",
        {
          status: 503,
          headers: {
            "content-type": "text/plain; charset=utf-8"
          }
        }
      );
    }

    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookieName)?.value;

  if (await verifySessionToken(token, getSessionSecret())) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const nextPath = normalizeRedirectPath(`${pathname}${request.nextUrl.search}`);

  if (nextPath !== "/") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)"]
};
