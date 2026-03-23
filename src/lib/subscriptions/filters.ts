import type { Prisma } from "@prisma/client";

import {
  billingPeriods,
  currencies,
  reviewStates,
  subscriptionCategories,
  subscriptionStatuses
} from "@/lib/constants";

export const subscriptionSortOptions = [
  "nextChargeAsc",
  "nameAsc",
  "amountDesc",
  "updatedDesc"
] as const;

export type SubscriptionSort = (typeof subscriptionSortOptions)[number];

export type SubscriptionFilters = {
  q: string;
  status: string;
  category: string;
  currency: string;
  reviewState: string;
  accountId: string;
  paymentMethodId: string;
  billingPeriod: string;
  sort: SubscriptionSort;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isAllowedValue<T extends readonly string[]>(value: string, options: T) {
  return options.includes(value);
}

export function normalizeSubscriptionFilters(searchParams: Record<string, string | string[] | undefined>): SubscriptionFilters {
  const sort = firstValue(searchParams.sort);

  return {
    q: firstValue(searchParams.q).trim(),
    status: isAllowedValue(firstValue(searchParams.status), subscriptionStatuses)
      ? firstValue(searchParams.status)
      : "",
    category: isAllowedValue(firstValue(searchParams.category), subscriptionCategories)
      ? firstValue(searchParams.category)
      : "",
    currency: isAllowedValue(firstValue(searchParams.currency), currencies)
      ? firstValue(searchParams.currency)
      : "",
    reviewState: isAllowedValue(firstValue(searchParams.reviewState), reviewStates)
      ? firstValue(searchParams.reviewState)
      : "",
    accountId: firstValue(searchParams.accountId),
    paymentMethodId: firstValue(searchParams.paymentMethodId),
    billingPeriod: isAllowedValue(firstValue(searchParams.billingPeriod), billingPeriods)
      ? firstValue(searchParams.billingPeriod)
      : "",
    sort: subscriptionSortOptions.includes(sort as SubscriptionSort) ? (sort as SubscriptionSort) : "nextChargeAsc"
  };
}

export function hasActiveSubscriptionFilters(filters: SubscriptionFilters) {
  return Boolean(
    filters.q ||
      filters.status ||
      filters.category ||
      filters.currency ||
      filters.reviewState ||
      filters.accountId ||
      filters.paymentMethodId ||
      filters.billingPeriod
  );
}

export function buildSubscriptionWhere(filters: SubscriptionFilters): Prisma.SubscriptionWhereInput {
  const andConditions: Prisma.SubscriptionWhereInput[] = [];

  if (filters.q) {
    andConditions.push({
      OR: [
        { name: { contains: filters.q } },
        { provider: { contains: filters.q } },
        { planName: { contains: filters.q } }
      ]
    });
  }

  if (filters.status) {
    andConditions.push({ status: filters.status as Prisma.EnumSubscriptionStatusFilter["equals"] });
  }

  if (filters.category) {
    andConditions.push({ category: filters.category as Prisma.EnumSubscriptionCategoryFilter["equals"] });
  }

  if (filters.currency) {
    andConditions.push({ currency: filters.currency as Prisma.EnumCurrencyFilter["equals"] });
  }

  if (filters.reviewState) {
    andConditions.push({ reviewState: filters.reviewState as Prisma.EnumReviewStateFilter["equals"] });
  }

  if (filters.accountId) {
    andConditions.push({ accountId: filters.accountId });
  }

  if (filters.paymentMethodId) {
    andConditions.push({ paymentMethodId: filters.paymentMethodId });
  }

  if (filters.billingPeriod) {
    andConditions.push({ billingPeriod: filters.billingPeriod as Prisma.EnumBillingPeriodFilter["equals"] });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
}

export function getSubscriptionOrderBy(sort: SubscriptionSort): Prisma.SubscriptionOrderByWithRelationInput[] {
  switch (sort) {
    case "nameAsc":
      return [{ name: "asc" }];
    case "amountDesc":
      return [{ amountInCents: "desc" }, { name: "asc" }];
    case "updatedDesc":
      return [{ updatedAt: "desc" }];
    case "nextChargeAsc":
    default:
      return [{ nextChargeAt: "asc" }, { name: "asc" }];
  }
}
