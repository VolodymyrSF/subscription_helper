import type { CurrencyValue } from "@/lib/constants";

export function formatCurrencyFromCents(amountInCents: number, currency: CurrencyValue) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountInCents / 100);
}
