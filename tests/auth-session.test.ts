import { describe, expect, it } from "vitest";

import { createSessionToken, normalizeRedirectPath, verifyPassword, verifySessionToken } from "@/lib/auth/session";

describe("auth session helpers", () => {
  it("creates and verifies a signed session token", async () => {
    const secret = "super-secret-signing-key";
    const token = await createSessionToken(secret);

    await expect(verifySessionToken(token, secret)).resolves.toBe(true);
    await expect(verifySessionToken(token, "wrong-secret")).resolves.toBe(false);
  });

  it("normalizes redirect paths to same-site locations", () => {
    expect(normalizeRedirectPath("/subscriptions")).toBe("/subscriptions");
    expect(normalizeRedirectPath("//evil.example")).toBe("/");
    expect(normalizeRedirectPath("/auth/logout")).toBe("/");
    expect(normalizeRedirectPath("https://evil.example")).toBe("/");
  });

  it("compares passwords without exposing simple mismatch behavior", () => {
    expect(verifyPassword("secret-value", "secret-value")).toBe(true);
    expect(verifyPassword("secret-value", "secret-valuE")).toBe(false);
  });
});
