import { createSubscriptionAction } from "@/lib/subscriptions/actions";
import { getSubscriptionFormOptions } from "@/lib/subscriptions/data";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  emptySubscriptionInitialValues,
  SubscriptionForm
} from "@/components/subscriptions/SubscriptionForm";

export const dynamic = "force-dynamic";

export default async function NewSubscriptionPage() {
  const { accounts, paymentMethods } = await getSubscriptionFormOptions();

  return (
    <div className="page">
      <PageHeader
        title="New subscription"
        description="Add a subscription with its cost, billing cadence, linked account, payment method, renewal dates, and review state."
      />

      <SubscriptionForm
        action={createSubscriptionAction}
        accounts={accounts}
        initialValues={emptySubscriptionInitialValues}
        paymentMethods={paymentMethods}
        submitLabel="Create subscription"
      />
    </div>
  );
}
