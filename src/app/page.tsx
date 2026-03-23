import Link from "next/link";

import { CurrencyBreakdown } from "@/components/ui/CurrencyBreakdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { SubscriptionMiniRow } from "@/components/subscriptions/SubscriptionCard";
import { categoryLabels } from "@/lib/constants";
import { formatDisplayDate } from "@/lib/formatting/date";
import { getDashboardData } from "@/lib/subscriptions/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        description="A focused view of active subscriptions, recurring totals, upcoming renewals, and items that deserve a keep-or-cancel check."
        actions={
          <Link className="button" href="/subscriptions/new">
            Add subscription
          </Link>
        }
      />

      <section className="stat-grid">
        <StatCard label="Active subscriptions" value={`${data.activeCount}`} />
        <StatCard
          label="Estimated monthly recurring"
          value={`${Object.keys(data.recurringTotals.monthlyTotals).length} currencies`}
          detail={<CurrencyBreakdown totals={data.recurringTotals.monthlyTotals} />}
        />
        <StatCard
          label="Estimated yearly recurring"
          value={`${Object.keys(data.recurringTotals.yearlyTotals).length} currencies`}
          detail={<CurrencyBreakdown totals={data.recurringTotals.yearlyTotals} />}
        />
        <StatCard label="Trials ending soon" value={`${data.trialsEndingSoon.length}`} />
        <StatCard label="Marked for review or cancel" value={`${data.reviewCount}`} detail={<span className="muted">{data.dueTodayCount} due today</span>} />
      </section>

      <div className="dashboard-grid">
        <section className="card dashboard-main detail-panel">
          <div className="section-header">
            <div>
              <h2>Upcoming renewals</h2>
              <p>Subscriptions due within the next 7 days.</p>
            </div>
            <Link className="button-link" href="/subscriptions">
              View all
            </Link>
          </div>

          {data.upcomingRenewals.length > 0 ? (
            data.upcomingRenewals.map((subscription) => (
              <SubscriptionMiniRow
                key={subscription.id}
                subscription={subscription}
                dateLabel={formatDisplayDate(subscription.nextChargeAt)}
              />
            ))
          ) : (
            <EmptyState
              title="Nothing due soon"
              description="No active, trial, or paused subscriptions are scheduled within the upcoming 7-day window."
            />
          )}
        </section>

        <section className="card dashboard-side detail-panel">
          <div className="section-header">
            <div>
              <h2>Trials ending soon</h2>
              <p>Subscriptions still in trial with an end date inside the 7-day threshold.</p>
            </div>
          </div>

          {data.trialsEndingSoon.length > 0 ? (
            data.trialsEndingSoon.map((subscription) => (
              <SubscriptionMiniRow
                key={subscription.id}
                subscription={subscription}
                dateLabel={formatDisplayDate(subscription.trialEndsAt)}
              />
            ))
          ) : (
            <EmptyState
              title="No urgent trials"
              description="You do not have any trial subscriptions expiring in the near term."
            />
          )}
        </section>

        <section className="card dashboard-main detail-panel">
          <div className="section-header">
            <div>
              <h2>Subscriptions by category</h2>
              <p>Recurring subscriptions grouped by category with monthly estimates split by currency.</p>
            </div>
          </div>

          {data.categories.length > 0 ? (
            data.categories.map((category) => (
              <div key={category.category} className="mini-row">
                <div>
                  <strong>{categoryLabels[category.category]}</strong>
                  <p className="muted">{category.count} recurring subscriptions</p>
                </div>
                <div className="mini-row-side">
                  <CurrencyBreakdown totals={category.monthlyTotals} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No recurring subscriptions yet"
              description="Once subscriptions are added, category totals will appear here."
            />
          )}
        </section>

        <section className="card dashboard-side detail-panel">
          <div className="section-header">
            <div>
              <h2>Recent subscriptions</h2>
              <p>The most recently created records in your vault.</p>
            </div>
          </div>

          {data.recentSubscriptions.length > 0 ? (
            data.recentSubscriptions.map((subscription) => (
              <SubscriptionMiniRow
                key={subscription.id}
                subscription={subscription}
                dateLabel={formatDisplayDate(subscription.createdAt)}
              />
            ))
          ) : (
            <EmptyState
              title="Nothing here yet"
              description="Seed the database or add your first subscription to populate the dashboard."
            />
          )}
        </section>
      </div>
    </div>
  );
}
