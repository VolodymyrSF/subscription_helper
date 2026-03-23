import { AccountForm, emptyAccountInitialValues } from "@/components/accounts/AccountForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createAccountAction } from "@/lib/accounts/actions";

export default function NewAccountPage() {
  return (
    <div className="page">
      <PageHeader
        title="New account"
        description="Add an email or provider account so subscriptions can be linked explicitly."
      />

      <AccountForm action={createAccountAction} initialValues={emptyAccountInitialValues} submitLabel="Create account" />
    </div>
  );
}
