import { describe, expect, it } from "vitest";

import {
  estimateMonthlyRecurringCents,
  estimateYearlyRecurringCents
} from "@/lib/calculations/recurring";

describe("recurring calculations", () => {
  it("keeps monthly subscriptions unchanged for monthly totals", () => {
    expect(
      estimateMonthlyRecurringCents({
        amountInCents: 2000,
        billingPeriod: "monthly",
        customPeriodDays: null
      })
    ).toBe(2000);
  });

  it("annualizes yearly subscriptions for monthly estimates", () => {
    expect(
      estimateMonthlyRecurringCents({
        amountInCents: 12000,
        billingPeriod: "yearly",
        customPeriodDays: null
      })
    ).toBe(1000);
  });

  it("calculates custom billing based on custom period days", () => {
    expect(
      estimateMonthlyRecurringCents({
        amountInCents: 7999,
        billingPeriod: "custom",
        customPeriodDays: 730
      })
    ).toBe(334);
  });

  it("approximates weekly and quarterly yearly totals", () => {
    expect(
      estimateYearlyRecurringCents({
        amountInCents: 500,
        billingPeriod: "weekly",
        customPeriodDays: null
      })
    ).toBe(26089);

    expect(
      estimateYearlyRecurringCents({
        amountInCents: 3000,
        billingPeriod: "quarterly",
        customPeriodDays: null
      })
    ).toBe(12000);
  });
});
