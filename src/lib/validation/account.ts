import { z } from "zod";

import { optionalString, requiredString } from "@/lib/validation/helpers";

export const accountFormSchema = z.object({
  label: requiredString("Label"),
  email: optionalString(200).refine(
    (value) => value === null || z.email().safeParse(value).success,
    "Email must be valid."
  ),
  provider: optionalString(120),
  notes: optionalString(3000)
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export function parseAccountFormData(formData: FormData) {
  return accountFormSchema.safeParse({
    label: formData.get("label"),
    email: formData.get("email"),
    provider: formData.get("provider"),
    notes: formData.get("notes")
  });
}
