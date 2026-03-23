import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, ReviewBadge, StatusBadge } from "@/components/ui/Badge";
import { deleteSubscriptionAction } from "@/lib/subscriptions/actions";
import { getSubscriptionById } from "@/lib/subscriptions/data";
import { billingPeriodLabels, categoryLabels, renewalTypeLabels, reviewStateLabels } from "@/lib/constants";
import { formatCurrencyFromCents } from "@/lib/formatting/currency";
import { formatDisplayDate } from "@/lib/formatting/date";
import { getDueSoonLabel } from "@/lib/subscriptions/helpers";
import { parseStoredTags } from "@/lib/subscriptions/tags";

export const dynamic = "force-dynamic";

export default async function SubscriptionDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subscription = await getSubscriptionById(id);

  if (!subscription) {
    notFound();
  }

  const tags = parseStoredTags(subscription.tagsText);
  const deleteAction = deleteSubscriptionAction.bind(null, subscription.id);

  return (
    <div className="page">
      <PageHeader
        title={subscription.name}
        description={`${subscription.provider}${subscription.planName ? ` • ${subscription.planName}` : ""}`}
        actions={
          <>
            <Link className="button button-secondary" href={`/subscriptions/${subscription.id}/edit`}>
              Edit subscription
            </Link>
            <Link className="button button-ghost" href="/subscriptions">
              Back to list
            </Link>
          </>
        }
      />

      <section className="card detail-panel">
        <div className="summary-bar">
          <StatusBadge status={subscription.status} />
          <ReviewBadge reviewState={subscription.reviewState} />
          {getDueSoonLabel(subscription.nextChargeAt) ? <Badge tone="warning">{getDueSoonLabel(subscription.nextChargeAt)!}</Badge> : null}
          {subscription.isTrial && subscription.trialEndsAt ? (
            <Badge tone="accent">Trial ends {formatDisplayDate(subscription.trialEndsAt)}</Badge>
          ) : null}
        </div>

        <div className="detail-grid">
          <div>
            <span className="meta-label">Amount</span>
            <strong>{formatCurrencyFromCents(subscription.amountInCents, subscription.currency)}</strong>
          </div>
          <div>
            <span className="meta-label">Billing period</span>
            <span>{billingPeriodLabels[subscription.billingPeriod]}</span>
          </div>
          <div>
            <span className="meta-label">Renewal type</span>
            <span>{renewalTypeLabels[subscription.renewalType]}</span>
          </div>
          <div>
            <span className="meta-label">Category</span>
            <span>{categoryLabels[subscription.category]}</span>
          </div>
          <div>
            <span className="meta-label">Review state</span>
            <span>{reviewStateLabels[subscription.reviewState]}</span>
          </div>
          <div>
            <span className="meta-label">Custom period days</span>
            <span>{subscription.customPeriodDays ?? "Not used"}</span>
          </div>
          <div>
            <span className="meta-label">Next charge</span>
            <span>{formatDisplayDate(subscription.nextChargeAt)}</span>
          </div>
          <div>
            <span className="meta-label">Started</span>
            <span>{formatDisplayDate(subscription.startedAt)}</span>
          </div>
          <div>
            <span className="meta-label">Last used</span>
            <span>{formatDisplayDate(subscription.lastUsedAt)}</span>
          </div>
          <div>
            <span className="meta-label">Account</span>
            {subscription.account ? (
              <Link className="inline-link" href={`/accounts/${subscription.account.id}/edit`}>
                {subscription.account.label}
              </Link>
            ) : (
              <span className="muted">No linked account</span>
            )}
          </div>
          <div>
            <span className="meta-label">Payment method</span>
            {subscription.paymentMethod ? (
              <Link className="inline-link" href={`/payment-methods/${subscription.paymentMethod.id}/edit`}>
                {subscription.paymentMethod.label}
              </Link>
            ) : (
              <span className="muted">No linked payment method</span>
            )}
          </div>
          <div>
            <span className="meta-label">Created</span>
            <span>{formatDisplayDate(subscription.createdAt)}</span>
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <span className="meta-label">Manage URL</span>
            {subscription.manageUrl ? (
              <a className="inline-link" href={subscription.manageUrl} rel="noreferrer" target="_blank">
                Open manage page
              </a>
            ) : (
              <span className="muted">Not set</span>
            )}
          </div>
          <div>
            <span className="meta-label">Cancel URL</span>
            {subscription.cancelUrl ? (
              <a className="inline-link" href={subscription.cancelUrl} rel="noreferrer" target="_blank">
                Open cancel page
              </a>
            ) : (
              <span className="muted">Not set</span>
            )}
          </div>
        </div>

        <div>
          <span className="meta-label">Tags</span>
          {tags.length > 0 ? (
            <div className="pill-list">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : (
            <p className="muted">No tags added.</p>
          )}
        </div>

        <div>
          <span className="meta-label">Notes</span>
          {subscription.notes ? (
            <p className="description-copy">{subscription.notes}</p>
          ) : (
            <p className="muted">No notes recorded.</p>
          )}
        </div>
      </section>

      <section className="card danger-zone detail-panel">
        <div className="section-header">
          <div>
            <h2>Delete subscription</h2>
            <p>This removes the subscription record but keeps linked accounts and payment methods intact.</p>
          </div>
        </div>

        <form action={deleteAction}>
          <DeleteButton
            confirmMessage={`Delete ${subscription.name}? This cannot be undone.`}
            label="Delete subscription"
          />
        </form>
      </section>
    </div>
  );
}
