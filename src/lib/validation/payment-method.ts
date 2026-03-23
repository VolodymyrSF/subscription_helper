import { z } from "zod";

import { paymentMethodTypes } from "@/lib/constants";
import { optionalString, requiredString } from "@/lib/validation/helpers";

export const paymentMethodFormSchema = z.object({
  label: requiredString("Label"),
  type: z.enum(paymentMethodTypes, {
    error: "Payment method type is required."
  }),
  last4: optionalString(4).refine(
    (value) => value === null || /^\d{4}$/.test(value),
    "Last 4 must contain exactly four digits."
  ),
  bankName: optionalString(120),
  notes: optionalString(3000)
});

export type PaymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>;

export function parsePaymentMethodFormData(formData: FormData) {
  return paymentMethodFormSchema.safeParse({
    label: formData.get("label"),
    type: formData.get("type"),
    last4: formData.get("last4"),
    bankName: formData.get("bankName"),
    notes: formData.get("notes")
  });
}
