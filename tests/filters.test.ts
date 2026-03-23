import { describe, expect, it } from "vitest";

import {
  buildSubscriptionWhere,
  normalizeSubscriptionFilters
} from "@/lib/subscriptions/filters";

describe("subscription filters", () => {
  it("normalizes allowed search params and defaults unsupported values", () => {
    const filters = normalizeSubscriptionFilters({
      q: "copilot",
      status: "active",
      category: "software",
      currency: "USD",
      reviewState: "review",
      sort: "nameAsc",
      billingPeriod: "monthly"
    });

    expect(filters).toEqual({
      q: "copilot",
      status: "active",
      category: "software",
      currency: "USD",
      reviewState: "review",
      accountId: "",
      paymentMethodId: "",
      billingPeriod: "monthly",
      sort: "nameAsc"
    });
  });

  it("builds a Prisma where clause from the normalized filters", () => {
    const where = buildSubscriptionWhere({
      q: "netflix",
      status: "active",
      category: "",
      currency: "PLN",
      reviewState: "",
      accountId: "account_123",
      paymentMethodId: "",
      billingPeriod: "",
      sort: "nextChargeAsc"
    });

    expect(where).toMatchObject({
      AND: [
        {
          OR: [
            { name: { contains: "netflix" } },
            { provider: { contains: "netflix" } },
            { planName: { contains: "netflix" } }
          ]
        },
        { status: "active" },
        { currency: "PLN" },
        { accountId: "account_123" }
      ]
    });
  });
});
