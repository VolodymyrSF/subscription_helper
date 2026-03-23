import { NextResponse } from "next/server";

import { getAuthPassword, getSessionSecret, authCookieName, isAuthConfigured, isProductionEnvironment } from "@/lib/auth/config";
import { createSessionToken, normalizeRedirectPath, verifyPassword } from "@/lib/auth/session";

function redirectWithParams(request: Request, error: string, nextPath: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", error);

  if (nextPath !== "/") {
    url.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const passwordField = formData.get("password");
  const nextField = formData.get("next");
  const password = typeof passwordField === "string" ? passwordField.trim() : "";
  const nextPath = normalizeRedirectPath(
    typeof nextField === "string" ? nextField : ""
  );

  if (!isAuthConfigured()) {
    if (isProductionEnvironment()) {
      return new NextResponse("Authentication is not configured.", { status: 503 });
    }

    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  if (!password) {
    return redirectWithParams(request, "missing", nextPath);
  }

  if (!verifyPassword(password, getAuthPassword())) {
    return redirectWithParams(request, "invalid", nextPath);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set({
    name: authCookieName,
    value: await createSessionToken(getSessionSecret()),
    httpOnly: true,
    secure: isProductionEnvironment(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
