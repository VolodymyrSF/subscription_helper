import { z } from "zod";

import { parseDateInput } from "@/lib/calculations/dates";
import { normalizeTagsInput } from "@/lib/subscriptions/tags";

function stringFromFormValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function requiredString(label: string, max = 120) {
  return z.preprocess(
    stringFromFormValue,
    z
      .string()
      .trim()
      .min(1, `${label} is required.`)
      .max(max, `${label} must be ${max} characters or fewer.`)
  );
}

export function optionalString(max = 3000) {
  return z.preprocess(
    stringFromFormValue,
    z
      .string()
      .trim()
      .max(max, `Must be ${max} characters or fewer.`)
      .transform((value) => (value === "" ? null : value))
  );
}

export function optionalUrl(label: string) {
  return z.preprocess(
    stringFromFormValue,
    z
      .string()
      .trim()
      .refine((value) => value === "" || z.url().safeParse(value).success, `${label} must be a valid URL.`)
      .transform((value) => (value === "" ? null : value))
  );
}

export function optionalDate(label: string) {
  return z.preprocess(
    stringFromFormValue,
    z
      .string()
      .trim()
      .refine((value) => value === "" || parseDateInput(value) !== null, `${label} must be a valid date.`)
      .transform((value) => (value === "" ? null : parseDateInput(value)!))
  );
}

export function optionalPositiveInt(label: string) {
  return z.preprocess(
    stringFromFormValue,
    z
      .string()
      .trim()
      .refine((value) => value === "" || /^[1-9]\d*$/.test(value), `${label} must be a whole number.`)
      .transform((value) => (value === "" ? null : Number.parseInt(value, 10)))
  );
}

export const checkboxBoolean = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const amountField = z
  .preprocess(stringFromFormValue, z.string().trim().min(1, "Amount is required."))
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Amount must be a valid number with up to 2 decimals.")
  .transform((value) => Math.round(Number.parseFloat(value) * 100))
  .refine((value) => value > 0, "Amount must be greater than 0.");

export const optionalId = z.preprocess(
  stringFromFormValue,
  z
    .string()
    .trim()
    .max(191, "Identifier is too long.")
    .transform((value) => (value === "" ? null : value))
);

export const tagsField = z.preprocess(stringFromFormValue, z.string().transform(normalizeTagsInput));
