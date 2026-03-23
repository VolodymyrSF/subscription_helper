import { currencies, type CurrencyValue } from "@/lib/constants";
import { formatCurrencyFromCents } from "@/lib/formatting/currency";

export function CurrencyBreakdown({
  totals,
  emptyLabel = "No recurring spend"
}: {
  totals: Partial<Record<CurrencyValue, number>>;
  emptyLabel?: string;
}) {
  const rows = currencies
    .filter((currency) => (totals[currency] ?? 0) > 0)
    .map((currency) => ({
      currency,
      amount: totals[currency] ?? 0
    }));

  if (rows.length === 0) {
    return <span className="muted">{emptyLabel}</span>;
  }

  return (
    <ul className="currency-breakdown">
      {rows.map((row) => (
        <li key={row.currency}>
          <span>{row.currency}</span>
          <strong>{formatCurrencyFromCents(row.amount, row.currency)}</strong>
        </li>
      ))}
    </ul>
  );
}
