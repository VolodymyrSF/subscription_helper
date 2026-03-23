import Link from "next/link";
import { notFound } from "next/navigation";

import { AccountForm } from "@/components/accounts/AccountForm";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { deleteAccountAction, updateAccountAction } from "@/lib/accounts/actions";
import { getAccountById } from "@/lib/accounts/data";

export default async function EditAccountPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }

  return (
    <div className="page">
      <PageHeader
        title={`Edit ${account.label}`}
        description="Keep account metadata up to date so subscriptions stay clearly linked."
        actions={
          <Link className="button button-ghost" href="/accounts">
            Back to accounts
          </Link>
        }
      />

      <AccountForm
        action={updateAccountAction.bind(null, account.id)}
        initialValues={{
          label: account.label,
          email: account.email ?? "",
          provider: account.provider ?? "",
          notes: account.notes ?? ""
        }}
        submitLabel="Save account"
      />

      <section className="card detail-panel">
        <div className="section-header">
          <div>
            <h2>Linked subscriptions</h2>
            <p>Deleting this account will keep the subscriptions and remove the link.</p>
          </div>
        </div>

        {account.subscriptions.length > 0 ? (
          <div className="stack">
            {account.subscriptions.map((subscription) => (
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
          <EmptyState title="No linked subscriptions" description="This account is not currently linked to any subscription." />
        )}
      </section>

      <section className="card danger-zone detail-panel">
        <div className="section-header">
          <div>
            <h2>Delete account</h2>
            <p>Linked subscriptions will remain in the database and their account link will be cleared.</p>
          </div>
        </div>

        <form action={deleteAccountAction.bind(null, account.id)}>
          <DeleteButton
            confirmMessage={
              account._count.subscriptions > 0
                ? `Delete ${account.label}? ${account._count.subscriptions} linked subscription(s) will be unlinked.`
                : `Delete ${account.label}? This cannot be undone.`
            }
            label="Delete account"
          />
        </form>
      </section>
    </div>
  );
}
