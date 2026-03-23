import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { accumulateCurrencyTotals, shouldIncludeInRecurringTotals } from "@/lib/calculations/recurring";
import { categoryLabels, type SubscriptionCategoryValue } from "@/lib/constants";
import {
  getDueSoonLabel,
  isSubscriptionDueSoon,
  isSubscriptionMarkedForReview,
  isSubscriptionTrialEndingSoon,
  sortByUpcomingDate
} from "@/lib/subscriptions/helpers";
import { buildSubscriptionWhere, getSubscriptionOrderBy, type SubscriptionFilters } from "@/lib/subscriptions/filters";

export const subscriptionListInclude = {
  account: {
    select: {
      id: true,
      label: true,
      email: true,
      provider: true
    }
  },
  paymentMethod: {
    select: {
      id: true,
      label: true,
      type: true,
      last4: true,
      bankName: true
    }
  }
} satisfies Prisma.SubscriptionInclude;

export type SubscriptionRecord = Prisma.SubscriptionGetPayload<{
  include: typeof subscriptionListInclude;
}>;

export async function getSubscriptionFormOptions() {
  const [accounts, paymentMethods] = await Promise.all([
    prisma.account.findMany({
      orderBy: { label: "asc" },
      select: {
        id: true,
        label: true,
        email: true,
        provider: true
      }
    }),
    prisma.paymentMethod.findMany({
      orderBy: { label: "asc" },
      select: {
        id: true,
        label: true,
        type: true,
        last4: true
      }
    })
  ]);

  return {
    accounts,
    paymentMethods
  };
}

export async function listSubscriptions(filters: SubscriptionFilters) {
  const [subscriptions, accounts, paymentMethods] = await Promise.all([
    prisma.subscription.findMany({
      where: buildSubscriptionWhere(filters),
      include: subscriptionListInclude,
      orderBy: getSubscriptionOrderBy(filters.sort)
    }),
    prisma.account.findMany({
      orderBy: { label: "asc" },
      select: { id: true, label: true }
    }),
    prisma.paymentMethod.findMany({
      orderBy: { label: "asc" },
      select: { id: true, label: true }
    })
  ]);

  return {
    subscriptions,
    accounts,
    paymentMethods
  };
}

export async function getSubscriptionById(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
    include: subscriptionListInclude
  });
}

export async function getDashboardData() {
  const subscriptions = await prisma.subscription.findMany({
    include: subscriptionListInclude,
    orderBy: { createdAt: "desc" }
  });

  const recurringTotals = accumulateCurrencyTotals(subscriptions);
  const upcomingRenewals = sortByUpcomingDate(
    subscriptions.filter((subscription) => isSubscriptionDueSoon(subscription)),
    "nextChargeAt"
  ).slice(0, 6);
  const trialsEndingSoon = sortByUpcomingDate(
    subscriptions.filter((subscription) => isSubscriptionTrialEndingSoon(subscription)),
    "trialEndsAt"
  ).slice(0, 6);
  const recentSubscriptions = subscriptions.slice(0, 6);
  const reviewCount = subscriptions.filter((subscription) => isSubscriptionMarkedForReview(subscription)).length;
  const activeCount = subscriptions.filter((subscription) => subscription.status === "active").length;

  const categorySummaryMap = new Map<
    SubscriptionCategoryValue,
    {
      category: SubscriptionCategoryValue;
      count: number;
      monthlyTotals: ReturnType<typeof accumulateCurrencyTotals>["monthlyTotals"];
    }
  >();

  for (const subscription of subscriptions) {
    if (!shouldIncludeInRecurringTotals(subscription.status)) {
      continue;
    }

    const existing = categorySummaryMap.get(subscription.category) ?? {
      category: subscription.category as SubscriptionCategoryValue,
      count: 0,
      monthlyTotals: {}
    };

    existing.count += 1;
    existing.monthlyTotals[subscription.currency] =
      (existing.monthlyTotals[subscription.currency] ?? 0) +
      accumulateCurrencyTotals([subscription]).monthlyTotals[subscription.currency]!;

    categorySummaryMap.set(subscription.category as SubscriptionCategoryValue, existing);
  }

  const categories = [...categorySummaryMap.values()].sort((first, second) => {
    if (second.count !== first.count) {
      return second.count - first.count;
    }

    return categoryLabels[first.category].localeCompare(categoryLabels[second.category]);
  });

  return {
    subscriptions,
    activeCount,
    recurringTotals,
    upcomingRenewals,
    trialsEndingSoon,
    reviewCount,
    categories,
    recentSubscriptions,
    dueTodayCount: subscriptions.filter((subscription) => getDueSoonLabel(subscription.nextChargeAt) === "Due today").length
  };
}
