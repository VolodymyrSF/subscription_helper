import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui/PageHeader";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { formatDateInput } from "@/lib/calculations/dates";
import { updateSubscriptionAction } from "@/lib/subscriptions/actions";
import { getSubscriptionById, getSubscriptionFormOptions } from "@/lib/subscriptions/data";
import { formatTagsForInput } from "@/lib/subscriptions/tags";

export default async function EditSubscriptionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subscription, options] = await Promise.all([getSubscriptionById(id), getSubscriptionFormOptions()]);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="page">
      <PageHeader
        title={`Edit ${subscription.name}`}
        description="Update lifecycle state, renewal information, linked records, URLs, tags, and notes."
      />

      <SubscriptionForm
        action={updateSubscriptionAction.bind(null, subscription.id)}
        accounts={options.accounts}
        initialValues={{
          name: subscription.name,
          provider: subscription.provider,
          planName: subscription.planName ?? "",
          amount: (subscription.amountInCents / 100).toFixed(2),
          currency: subscription.currency,
          billingPeriod: subscription.billingPeriod,
          customPeriodDays: subscription.customPeriodDays ? String(subscription.customPeriodDays) : "",
          nextChargeAt: formatDateInput(subscription.nextChargeAt),
          startedAt: formatDateInput(subscription.startedAt),
          renewalType: subscription.renewalType,
          status: subscription.status,
          isTrial: subscription.isTrial,
          trialEndsAt: formatDateInput(subscription.trialEndsAt),
          accountId: subscription.accountId ?? "",
          paymentMethodId: subscription.paymentMethodId ?? "",
          category: subscription.category,
          manageUrl: subscription.manageUrl ?? "",
          cancelUrl: subscription.cancelUrl ?? "",
          notes: subscription.notes ?? "",
          tags: formatTagsForInput(subscription.tagsText),
          lastUsedAt: formatDateInput(subscription.lastUsedAt),
          reviewState: subscription.reviewState
        }}
        paymentMethods={options.paymentMethods}
        submitLabel="Save changes"
      />
    </div>
  );
}
