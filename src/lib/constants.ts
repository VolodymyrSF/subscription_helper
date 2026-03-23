export const currencies = ["UAH", "USD", "EUR", "PLN", "GBP"] as const;
export const billingPeriods = ["weekly", "monthly", "quarterly", "yearly", "custom"] as const;
export const renewalTypes = ["auto", "manual"] as const;
export const subscriptionStatuses = ["active", "trial", "paused", "canceled", "expired"] as const;
export const subscriptionCategories = [
  "streaming",
  "software",
  "cloud",
  "gaming",
  "music",
  "education",
  "utilities",
  "hosting",
  "other"
] as const;
export const reviewStates = ["keep", "review", "cancel"] as const;
export const paymentMethodTypes = ["card", "paypal", "apple", "google", "crypto", "other"] as const;

export type CurrencyValue = (typeof currencies)[number];
export type BillingPeriodValue = (typeof billingPeriods)[number];
export type RenewalTypeValue = (typeof renewalTypes)[number];
export type SubscriptionStatusValue = (typeof subscriptionStatuses)[number];
export type SubscriptionCategoryValue = (typeof subscriptionCategories)[number];
export type ReviewStateValue = (typeof reviewStates)[number];
export type PaymentMethodTypeValue = (typeof paymentMethodTypes)[number];

export const recurringStatuses = new Set<SubscriptionStatusValue>(["active", "trial"]);
export const actionableStatuses = new Set<SubscriptionStatusValue>(["active", "trial", "paused"]);
export const reviewableStatuses = new Set<SubscriptionStatusValue>(["active", "trial", "paused"]);

export const trialEndingThresholdDays = 7;
export const upcomingRenewalWindowDays = 7;
export const dueSoonThresholds = {
  today: 0,
  threeDays: 3,
  sevenDays: 7
} as const;

export const billingPeriodLabels: Record<BillingPeriodValue, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  custom: "Custom"
};

export const renewalTypeLabels: Record<RenewalTypeValue, string> = {
  auto: "Auto renew",
  manual: "Manual renew"
};

export const statusLabels: Record<SubscriptionStatusValue, string> = {
  active: "Active",
  trial: "Trial",
  paused: "Paused",
  canceled: "Canceled",
  expired: "Expired"
};

export const reviewStateLabels: Record<ReviewStateValue, string> = {
  keep: "Keep",
  review: "Review",
  cancel: "Cancel"
};

export const categoryLabels: Record<SubscriptionCategoryValue, string> = {
  streaming: "Streaming",
  software: "Software",
  cloud: "Cloud",
  gaming: "Gaming",
  music: "Music",
  education: "Education",
  utilities: "Utilities",
  hosting: "Hosting",
  other: "Other"
};

export const paymentMethodTypeLabels: Record<PaymentMethodTypeValue, string> = {
  card: "Card",
  paypal: "PayPal",
  apple: "Apple",
  google: "Google",
  crypto: "Crypto",
  other: "Other"
};
