import {
  emptyPaymentMethodInitialValues,
  PaymentMethodForm
} from "@/components/payment-methods/PaymentMethodForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createPaymentMethodAction } from "@/lib/payment-methods/actions";

export default function NewPaymentMethodPage() {
  return (
    <div className="page">
      <PageHeader
        title="New payment method"
        description="Add a card, wallet, or other payment source used for recurring subscriptions."
      />

      <PaymentMethodForm
        action={createPaymentMethodAction}
        initialValues={emptyPaymentMethodInitialValues}
        submitLabel="Create payment method"
      />
    </div>
  );
}
