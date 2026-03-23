import Link from "next/link";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { billingPeriodLabels, renewalTypeLabels, type BillingPeriodValue } from "@/lib/constants";
import { formatCurrencyFromCents } from "@/lib/formatting/currency";
import { formatDisplayDate } from "@/lib/formatting/date";
import { deleteSubscriptionAction } from "@/lib/subscriptions/actions";
import { getDueSoonLabel } from "@/lib/subscriptions/helpers";
import { parseStoredTags } from "@/lib/subscriptions/tags";
import type { SubscriptionRecord } from "@/lib/subscriptions/data";
import { ReviewBadge, StatusBadge, Badge } from "@/components/ui/Badge";

export function SubscriptionCard({ subscription }: { subscription: SubscriptionRecord }) {
  const dueLabel = getDueSoonLabel(subscription.nextChargeAt);
  const tags = parseStoredTags(subscription.tagsText);
  const deleteAction = deleteSubscriptionAction.bind(null, subscription.id);

  return (
    <article className="list-card">
      <div className="list-card-header">
        <div>
          <div className="headline-row">
            <Link className="title-link" href={`/subscriptions/${subscription.id}`}>
              {subscription.name}
            </Link>
            <StatusBadge status={subscription.status} />
            {subscription.reviewState !== "keep" ? <ReviewBadge reviewState={subscription.reviewState} /> : null}
          </div>
          <p className="muted">
            {subscription.provider}
            {subscription.planName ? ` • ${subscription.planName}` : ""}
          </p>
        </div>

        <div className="amount-stack">
          <strong>{formatCurrencyFromCents(subscription.amountInCents, subscription.currency)}</strong>
          <span className="muted">
            {billingPeriodLabels[subscription.billingPeriod as BillingPeriodValue]} •{" "}
            {renewalTypeLabels[subscription.renewalType]}
          </span>
        </div>
      </div>

      <div className="meta-grid">
        <div>
          <span className="meta-label">Next charge</span>
          <span>{formatDisplayDate(subscription.nextChargeAt)}</span>
        </div>
        <div>
          <span className="meta-label">Category</span>
          <span>{subscription.category}</span>
        </div>
        <div>
          <span className="meta-label">Account</span>
          {subscription.account ? (
            <Link className="inline-link" href={`/accounts/${subscription.account.id}/edit`}>
              {subscription.account.label}
            </Link>
          ) : (
            <span className="muted">None linked</span>
          )}
        </div>
        <div>
          <span className="meta-label">Payment method</span>
          {subscription.paymentMethod ? (
            <Link className="inline-link" href={`/payment-methods/${subscription.paymentMethod.id}/edit`}>
              {subscription.paymentMethod.label}
            </Link>
          ) : (
            <span className="muted">None linked</span>
          )}
        </div>
      </div>

      <div className="list-card-footer">
        <div className="badge-row">
          {dueLabel ? <Badge tone="warning">{dueLabel}</Badge> : null}
          {subscription.isTrial && subscription.trialEndsAt ? (
            <Badge tone="accent">Trial ends {formatDisplayDate(subscription.trialEndsAt)}</Badge>
          ) : null}
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="inline-actions">
          <Link className="button button-secondary" href={`/subscriptions/${subscription.id}`}>
            View details
          </Link>
          <Link className="button button-ghost" href={`/subscriptions/${subscription.id}/edit`}>
            Edit
          </Link>
          <form action={deleteAction}>
            <DeleteButton
              confirmMessage={`Delete ${subscription.name}? This cannot be undone.`}
              label="Delete"
            />
          </form>
        </div>
      </div>
    </article>
  );
}

export function SubscriptionMiniRow({
  subscription,
  dateLabel
}: {
  subscription: SubscriptionRecord;
  dateLabel: string;
}) {
  return (
    <div className="mini-row">
      <div>
        <Link className="title-link" href={`/subscriptions/${subscription.id}`}>
          {subscription.name}
        </Link>
        <p className="muted">
          {subscription.provider}
          {subscription.planName ? ` • ${subscription.planName}` : ""}
        </p>
      </div>

      <div className="mini-row-side">
        <strong>{formatCurrencyFromCents(subscription.amountInCents, subscription.currency)}</strong>
        <span className="muted">{dateLabel}</span>
      </div>
    </div>
  );
}
