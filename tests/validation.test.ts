import { describe, expect, it } from "vitest";

import { parseSubscriptionFormData } from "@/lib/validation/subscription";

function buildSubscriptionFormData(overrides?: Record<string, string>) {
  const formData = new FormData();

  const baseValues = {
    name: "Cursor",
    provider: "Cursor",
    planName: "Pro",
    amount: "20",
    currency: "USD",
    billingPeriod: "monthly",
    customPeriodDays: "",
    nextChargeAt: "2026-03-29",
    startedAt: "2026-03-10",
    renewalType: "auto",
    status: "active",
    trialEndsAt: "",
    accountId: "",
    paymentMethodId: "",
    category: "software",
    manageUrl: "https://cursor.com/settings",
    cancelUrl: "https://cursor.com/settings",
    notes: "Testing",
    tags: "trial, ai",
    lastUsedAt: "2026-03-23",
    reviewState: "review"
  };

  for (const [key, value] of Object.entries({ ...baseValues, ...overrides })) {
    formData.set(key, value);
  }

  return formData;
}

describe("subscription validation", () => {
  it("accepts a valid active subscription payload", () => {
    const result = parseSubscriptionFormData(buildSubscriptionFormData());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(2000);
      expect(result.data.tags).toEqual(["trial", "ai"]);
    }
  });

  it("requires custom period days for custom billing", () => {
    const result = parseSubscriptionFormData(
      buildSubscriptionFormData({
        billingPeriod: "custom",
        customPeriodDays: ""
      })
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.customPeriodDays?.[0]).toContain("Custom billing requires");
    }
  });

  it("requires a trial end date and trial status when trial is enabled", () => {
    const formData = buildSubscriptionFormData({
      status: "active",
      trialEndsAt: ""
    });
    formData.set("isTrial", "on");

    const result = parseSubscriptionFormData(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.status?.[0]).toContain("Trial subscriptions");
      expect(result.error.flatten().fieldErrors.trialEndsAt?.[0]).toContain("Trial end date");
    }
  });

  it("rejects invalid URLs", () => {
    const result = parseSubscriptionFormData(
      buildSubscriptionFormData({
        manageUrl: "notaurl"
      })
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.manageUrl?.[0]).toContain("valid URL");
    }
  });
});
