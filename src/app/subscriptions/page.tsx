import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionFilterBar } from "@/components/subscriptions/SubscriptionFilterBar";
import { hasActiveSubscriptionFilters, normalizeSubscriptionFilters } from "@/lib/subscriptions/filters";
import { listSubscriptions } from "@/lib/subscriptions/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SubscriptionsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = normalizeSubscriptionFilters(await searchParams);
  const data = await listSubscriptions(filters);

  return (
    <div className="page">
      <PageHeader
        title="Subscriptions"
        description="Search and filter by provider, category, currency, review state, billing period, account, and payment method."
        actions={
          <Link className="button" href="/subscriptions/new">
            New subscription
          </Link>
        }
      />

      <SubscriptionFilterBar
        accounts={data.accounts}
        filters={filters}
        paymentMethods={data.paymentMethods}
      />

      <section className="stack">
        {data.subscriptions.length > 0 ? (
          data.subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))
        ) : hasActiveSubscriptionFilters(filters) ? (
          <EmptyState
            title="No subscriptions match these filters"
            description="Try broadening the filters or clearing the search criteria."
            actionHref="/subscriptions"
            actionLabel="Clear filters"
          />
        ) : (
          <EmptyState
            title="No subscriptions yet"
            description="Create your first subscription to start tracking renewals, totals, accounts, and payment methods."
            actionHref="/subscriptions/new"
            actionLabel="Add subscription"
          />
        )}
      </section>
    </div>
  );
}
