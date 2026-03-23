import Link from "next/link";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { paymentMethodTypeLabels } from "@/lib/constants";
import { deletePaymentMethodAction } from "@/lib/payment-methods/actions";
import { listPaymentMethods } from "@/lib/payment-methods/data";
import { formatDisplayDate } from "@/lib/formatting/date";

export const dynamic = "force-dynamic";

export default async function PaymentMethodsPage() {
  const paymentMethods = await listPaymentMethods();

  return (
    <div className="page">
      <PageHeader
        title="Payment methods"
        description="Track the cards and wallet methods used for recurring charges."
        actions={
          <Link className="button" href="/payment-methods/new">
            New payment method
          </Link>
        }
      />

      {paymentMethods.length > 0 ? (
        <section className="stack">
          {paymentMethods.map((paymentMethod) => (
            <article key={paymentMethod.id} className="list-card">
              <div className="list-card-header">
                <div>
                  <Link className="title-link" href={`/payment-methods/${paymentMethod.id}/edit`}>
                    {paymentMethod.label}
                  </Link>
                  <p className="muted">
                    {paymentMethodTypeLabels[paymentMethod.type]}
                    {paymentMethod.last4 ? ` • •••• ${paymentMethod.last4}` : ""}
                    {paymentMethod.bankName ? ` • ${paymentMethod.bankName}` : ""}
                  </p>
                </div>
                <div className="amount-stack">
                  <strong>{paymentMethod._count.subscriptions}</strong>
                  <span className="muted">linked subscriptions</span>
                </div>
              </div>

              <div className="meta-grid">
                <div>
                  <span className="meta-label">Created</span>
                  <span>{formatDisplayDate(paymentMethod.createdAt)}</span>
                </div>
                <div>
                  <span className="meta-label">Linked subscriptions</span>
                  <Link className="inline-link" href={`/subscriptions?paymentMethodId=${paymentMethod.id}`}>
                    View filtered subscriptions
                  </Link>
                </div>
              </div>

              {paymentMethod.notes ? <p className="description-copy">{paymentMethod.notes}</p> : null}

              <div className="inline-actions">
                <Link className="button button-secondary" href={`/payment-methods/${paymentMethod.id}/edit`}>
                  Edit
                </Link>
                <form action={deletePaymentMethodAction.bind(null, paymentMethod.id)}>
                  <DeleteButton
                    confirmMessage={
                      paymentMethod._count.subscriptions > 0
                        ? `Delete ${paymentMethod.label}? ${paymentMethod._count.subscriptions} linked subscription(s) will be unlinked.`
                        : `Delete ${paymentMethod.label}? This cannot be undone.`
                    }
                    label="Delete"
                  />
                </form>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No payment methods yet"
          description="Add the cards or wallets you use for subscriptions so each charge stays traceable."
          actionHref="/payment-methods/new"
          actionLabel="Add payment method"
        />
      )}
    </div>
  );
}
