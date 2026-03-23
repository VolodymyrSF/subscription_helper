import {
  recurringStatuses,
  type BillingPeriodValue,
  type CurrencyValue,
  type SubscriptionStatusValue
} from "@/lib/constants";

const AVERAGE_DAYS_PER_MONTH = 365.25 / 12;
const AVERAGE_DAYS_PER_YEAR = 365.25;

export type RecurringInput = {
  amountInCents: number;
  billingPeriod: BillingPeriodValue;
  customPeriodDays?: number | null;
  currency: CurrencyValue;
  status: SubscriptionStatusValue;
};

export type CurrencyTotals = Partial<Record<CurrencyValue, number>>;

export function estimateMonthlyRecurringCents({
  amountInCents,
  billingPeriod,
  customPeriodDays
}: Pick<RecurringInput, "amountInCents" | "billingPeriod" | "customPeriodDays">) {
  switch (billingPeriod) {
    case "weekly":
      return Math.round((amountInCents * AVERAGE_DAYS_PER_MONTH) / 7);
    case "monthly":
      return amountInCents;
    case "quarterly":
      return Math.round(amountInCents / 3);
    case "yearly":
      return Math.round(amountInCents / 12);
    case "custom":
      return customPeriodDays ? Math.round((amountInCents * AVERAGE_DAYS_PER_MONTH) / customPeriodDays) : 0;
    default:
      return 0;
  }
}

export function estimateYearlyRecurringCents({
  amountInCents,
  billingPeriod,
  customPeriodDays
}: Pick<RecurringInput, "amountInCents" | "billingPeriod" | "customPeriodDays">) {
  switch (billingPeriod) {
    case "weekly":
      return Math.round((amountInCents * AVERAGE_DAYS_PER_YEAR) / 7);
    case "monthly":
      return amountInCents * 12;
    case "quarterly":
      return amountInCents * 4;
    case "yearly":
      return amountInCents;
    case "custom":
      return customPeriodDays ? Math.round((amountInCents * AVERAGE_DAYS_PER_YEAR) / customPeriodDays) : 0;
    default:
      return 0;
  }
}

export function shouldIncludeInRecurringTotals(status: SubscriptionStatusValue) {
  return recurringStatuses.has(status);
}

export function accumulateCurrencyTotals(items: RecurringInput[]) {
  const monthlyTotals: CurrencyTotals = {};
  const yearlyTotals: CurrencyTotals = {};

  for (const item of items) {
    if (!shouldIncludeInRecurringTotals(item.status)) {
      continue;
    }

    monthlyTotals[item.currency] =
      (monthlyTotals[item.currency] ?? 0) + estimateMonthlyRecurringCents(item);
    yearlyTotals[item.currency] =
      (yearlyTotals[item.currency] ?? 0) + estimateYearlyRecurringCents(item);
  }

  return {
    monthlyTotals,
    yearlyTotals
  };
}
