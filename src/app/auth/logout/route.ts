import { NextResponse } from "next/server";

import { authCookieName, isAuthConfigured } from "@/lib/auth/config";

export async function POST(request: Request) {
  const redirectUrl = new URL(isAuthConfigured() ? "/login?loggedOut=1" : "/", request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: authCookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
