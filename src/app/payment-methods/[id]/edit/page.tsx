import Link from "next/link";
import { notFound } from "next/navigation";

import { PaymentMethodForm } from "@/components/payment-methods/PaymentMethodForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  deletePaymentMethodAction,
  updatePaymentMethodAction
} from "@/lib/payment-methods/actions";
import { getPaymentMethodById } from "@/lib/payment-methods/data";

export default async function EditPaymentMethodPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paymentMethod = await getPaymentMethodById(id);

  if (!paymentMethod) {
    notFound();
  }

  return (
    <div className="page">
      <PageHeader
        title={`Edit ${paymentMethod.label}`}
        description="Keep payment metadata current so renewal tracking stays easy to audit."
        actions={
          <Link className="button button-ghost" href="/payment-methods">
            Back to payment methods
          </Link>
        }
      />

      <PaymentMethodForm
        action={updatePaymentMethodAction.bind(null, paymentMethod.id)}
        initialValues={{
          label: paymentMethod.label,
          type: paymentMethod.type,
          last4: paymentMethod.last4 ?? "",
          bankName: paymentMethod.bankName ?? "",
          notes: paymentMethod.notes ?? ""
        }}
        submitLabel="Save payment method"
      />

      <section className="card detail-panel">
        <div className="section-header">
          <div>
            <h2>Linked subscriptions</h2>
            <p>Deleting this payment method will keep subscriptions but remove the link.</p>
          </div>
        </div>

        {paymentMethod.subscriptions.length > 0 ? (
          <div className="stack">
            {paymentMethod.subscriptions.map((subscription) => (
              <div key={subscription.id} className="mini-row">
                <div>
                  <Link className="title-link" href={`/subscriptions/${subscription.id}`}>
                    {subscription.name}
                  </Link>
                  <p className="muted">{subscription.provider}</p>
                </div>
                <span className="muted">{subscription.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No linked subscriptions"
            description="This payment method is not currently assigned to any subscription."
          />
        )}
      </section>

      <section className="card danger-zone detail-panel">
        <div className="section-header">
          <div>
            <h2>Delete payment method</h2>
            <p>Linked subscriptions will stay intact and only lose their payment method link.</p>
          </div>
        </div>

        <form action={deletePaymentMethodAction.bind(null, paymentMethod.id)}>
          <DeleteButton
            confirmMessage={
              paymentMethod._count.subscriptions > 0
                ? `Delete ${paymentMethod.label}? ${paymentMethod._count.subscriptions} linked subscription(s) will be unlinked.`
                : `Delete ${paymentMethod.label}? This cannot be undone.`
            }
            label="Delete payment method"
          />
        </form>
      </section>
    </div>
  );
}
