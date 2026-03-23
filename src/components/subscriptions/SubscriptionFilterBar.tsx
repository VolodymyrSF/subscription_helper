import Link from "next/link";

import {
  billingPeriodLabels,
  categoryLabels,
  reviewStateLabels,
  statusLabels
} from "@/lib/constants";
import type { SubscriptionFilters } from "@/lib/subscriptions/filters";
import { FormField } from "@/components/ui/FormField";

export function SubscriptionFilterBar({
  filters,
  accounts,
  paymentMethods
}: {
  filters: SubscriptionFilters;
  accounts: Array<{ id: string; label: string }>;
  paymentMethods: Array<{ id: string; label: string }>;
}) {
  return (
    <form className="card filter-card">
      <div className="filter-grid">
        <FormField htmlFor="q" label="Search">
          <input defaultValue={filters.q} id="q" name="q" placeholder="Name, provider, or plan" type="search" />
        </FormField>

        <FormField htmlFor="status" label="Status">
          <select defaultValue={filters.status} id="status" name="status">
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="category" label="Category">
          <select defaultValue={filters.category} id="category" name="category">
            <option value="">All categories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="currency" label="Currency">
          <select defaultValue={filters.currency} id="currency" name="currency">
            <option value="">All currencies</option>
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="PLN">PLN</option>
            <option value="GBP">GBP</option>
          </select>
        </FormField>

        <FormField htmlFor="reviewState" label="Review state">
          <select defaultValue={filters.reviewState} id="reviewState" name="reviewState">
            <option value="">All review states</option>
            {Object.entries(reviewStateLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="accountId" label="Account">
          <select defaultValue={filters.accountId} id="accountId" name="accountId">
            <option value="">All accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="paymentMethodId" label="Payment method">
          <select defaultValue={filters.paymentMethodId} id="paymentMethodId" name="paymentMethodId">
            <option value="">All payment methods</option>
            {paymentMethods.map((paymentMethod) => (
              <option key={paymentMethod.id} value={paymentMethod.id}>
                {paymentMethod.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="billingPeriod" label="Billing period">
          <select defaultValue={filters.billingPeriod} id="billingPeriod" name="billingPeriod">
            <option value="">All billing periods</option>
            {Object.entries(billingPeriodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField htmlFor="sort" label="Sort by">
          <select defaultValue={filters.sort} id="sort" name="sort">
            <option value="nextChargeAsc">Next charge</option>
            <option value="nameAsc">Name</option>
            <option value="amountDesc">Highest amount</option>
            <option value="updatedDesc">Recently updated</option>
          </select>
        </FormField>
      </div>

      <div className="inline-actions">
        <button className="button" type="submit">
          Apply filters
        </button>
        <Link className="button button-ghost" href="/subscriptions">
          Clear
        </Link>
      </div>
    </form>
  );
}
