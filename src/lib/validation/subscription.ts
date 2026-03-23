import { z } from "zod";

import {
  billingPeriods,
  currencies,
  renewalTypes,
  reviewStates,
  subscriptionCategories,
  subscriptionStatuses
} from "@/lib/constants";
import {
  amountField,
  checkboxBoolean,
  optionalDate,
  optionalId,
  optionalPositiveInt,
  optionalString,
  optionalUrl,
  requiredString,
  tagsField
} from "@/lib/validation/helpers";

export const subscriptionFormSchema = z
  .object({
    name: requiredString("Name"),
    provider: requiredString("Provider"),
    planName: optionalString(120),
    amount: amountField,
    currency: z.enum(currencies, {
      error: "Currency is required."
    }),
    billingPeriod: z.enum(billingPeriods, {
      error: "Billing period is required."
    }),
    customPeriodDays: optionalPositiveInt("Custom period days"),
    nextChargeAt: optionalDate("Next charge date"),
    startedAt: optionalDate("Started date"),
    renewalType: z.enum(renewalTypes, {
      error: "Renewal type is required."
    }),
    status: z.enum(subscriptionStatuses, {
      error: "Status is required."
    }),
    isTrial: checkboxBoolean,
    trialEndsAt: optionalDate("Trial end date"),
    accountId: optionalId,
    paymentMethodId: optionalId,
    category: z.enum(subscriptionCategories, {
      error: "Category is required."
    }),
    manageUrl: optionalUrl("Manage URL"),
    cancelUrl: optionalUrl("Cancel URL"),
    notes: optionalString(5000),
    tags: tagsField,
    lastUsedAt: optionalDate("Last used date"),
    reviewState: z.enum(reviewStates, {
      error: "Review state is required."
    })
  })
  .superRefine((value, context) => {
    if (value.billingPeriod === "custom" && !value.customPeriodDays) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customPeriodDays"],
        message: "Custom billing requires custom period days."
      });
    }

    if (value.billingPeriod !== "custom" && value.customPeriodDays) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customPeriodDays"],
        message: "Custom period days are only used with custom billing."
      });
    }

    if (value.isTrial && value.status !== "trial") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["status"],
        message: "Trial subscriptions must use trial status."
      });
    }

    if (!value.isTrial && value.status === "trial") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isTrial"],
        message: "Trial status requires the trial toggle."
      });
    }

    if (value.isTrial && !value.trialEndsAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["trialEndsAt"],
        message: "Trial end date is required when a subscription is in trial."
      });
    }

    if (!value.isTrial && value.trialEndsAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["trialEndsAt"],
        message: "Trial end date should be empty when the trial toggle is off."
      });
    }
  });

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export function parseSubscriptionFormData(formData: FormData) {
  return subscriptionFormSchema.safeParse({
    name: formData.get("name"),
    provider: formData.get("provider"),
    planName: formData.get("planName"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    billingPeriod: formData.get("billingPeriod"),
    customPeriodDays: formData.get("customPeriodDays"),
    nextChargeAt: formData.get("nextChargeAt"),
    startedAt: formData.get("startedAt"),
    renewalType: formData.get("renewalType"),
    status: formData.get("status"),
    isTrial: formData.get("isTrial"),
    trialEndsAt: formData.get("trialEndsAt"),
    accountId: formData.get("accountId"),
    paymentMethodId: formData.get("paymentMethodId"),
    category: formData.get("category"),
    manageUrl: formData.get("manageUrl"),
    cancelUrl: formData.get("cancelUrl"),
    notes: formData.get("notes"),
    tags: formData.get("tags"),
    lastUsedAt: formData.get("lastUsedAt"),
    reviewState: formData.get("reviewState")
  });
}
