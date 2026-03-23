import { describe, expect, it } from "vitest";

import { parseDateInput } from "@/lib/calculations/dates";
import {
  getDueSoonLabel,
  isSubscriptionDueSoon,
  isSubscriptionMarkedForReview,
  isSubscriptionTrialEndingSoon
} from "@/lib/subscriptions/helpers";

const referenceDate = parseDateInput("2026-03-23")!;

describe("due soon and review helpers", () => {
  it("labels due dates across today, 3 day, and 7 day thresholds", () => {
    expect(getDueSoonLabel(parseDateInput("2026-03-23"), referenceDate)).toBe("Due today");
    expect(getDueSoonLabel(parseDateInput("2026-03-25"), referenceDate)).toBe("Due within 3 days");
    expect(getDueSoonLabel(parseDateInput("2026-03-29"), referenceDate)).toBe("Due within 7 days");
    expect(getDueSoonLabel(parseDateInput("2026-04-02"), referenceDate)).toBeNull();
  });

  it("only marks actionable subscriptions as due soon", () => {
    expect(
      isSubscriptionDueSoon(
        {
          status: "active",
          nextChargeAt: parseDateInput("2026-03-24")
        },
        referenceDate
      )
    ).toBe(true);

    expect(
      isSubscriptionDueSoon(
        {
          status: "canceled",
          nextChargeAt: parseDateInput("2026-03-24")
        },
        referenceDate
      )
    ).toBe(false);
  });

  it("detects trial ending soon based on the 7-day threshold", () => {
    expect(
      isSubscriptionTrialEndingSoon(
        {
          status: "trial",
          isTrial: true,
          trialEndsAt: parseDateInput("2026-03-30")
        },
        referenceDate
      )
    ).toBe(true);

    expect(
      isSubscriptionTrialEndingSoon(
        {
          status: "active",
          isTrial: true,
          trialEndsAt: parseDateInput("2026-03-30")
        },
        referenceDate
      )
    ).toBe(false);
  });

  it("treats only active, trial, and paused subscriptions as reviewable", () => {
    expect(
      isSubscriptionMarkedForReview({
        status: "paused",
        reviewState: "cancel"
      })
    ).toBe(true);

    expect(
      isSubscriptionMarkedForReview({
        status: "expired",
        reviewState: "review"
      })
    ).toBe(false);
  });
});
