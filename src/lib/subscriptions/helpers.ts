import {
  actionableStatuses,
  reviewableStatuses,
  trialEndingThresholdDays,
  upcomingRenewalWindowDays,
  type ReviewStateValue,
  type SubscriptionStatusValue
} from "@/lib/constants";
import { compareNullableDatesAsc, isDueToday, isWithinDays } from "@/lib/calculations/dates";

export type SubscriptionTimelineLike = {
  status: SubscriptionStatusValue;
  nextChargeAt: Date | null;
  isTrial: boolean;
  trialEndsAt: Date | null;
  reviewState: ReviewStateValue;
};

export function getDueSoonLabel(nextChargeAt: Date | null | undefined, reference = new Date()) {
  if (!nextChargeAt) {
    return null;
  }

  if (isDueToday(nextChargeAt, reference)) {
    return "Due today";
  }

  if (isWithinDays(nextChargeAt, 3, reference)) {
    return "Due within 3 days";
  }

  if (isWithinDays(nextChargeAt, 7, reference)) {
    return "Due within 7 days";
  }

  return null;
}

export function isSubscriptionDueSoon(subscription: Pick<SubscriptionTimelineLike, "status" | "nextChargeAt">, reference = new Date()) {
  return actionableStatuses.has(subscription.status) && isWithinDays(subscription.nextChargeAt, upcomingRenewalWindowDays, reference);
}

export function isSubscriptionTrialEndingSoon(
  subscription: Pick<SubscriptionTimelineLike, "status" | "isTrial" | "trialEndsAt">,
  reference = new Date()
) {
  return (
    subscription.status === "trial" &&
    subscription.isTrial &&
    isWithinDays(subscription.trialEndsAt, trialEndingThresholdDays, reference)
  );
}

export function isSubscriptionMarkedForReview(
  subscription: Pick<SubscriptionTimelineLike, "status" | "reviewState">
) {
  return reviewableStatuses.has(subscription.status) && subscription.reviewState !== "keep";
}

export function sortByUpcomingDate<T extends { nextChargeAt?: Date | null; trialEndsAt?: Date | null }>(
  items: T[],
  key: "nextChargeAt" | "trialEndsAt"
) {
  return [...items].sort((first, second) => compareNullableDatesAsc(first[key] ?? null, second[key] ?? null));
}
