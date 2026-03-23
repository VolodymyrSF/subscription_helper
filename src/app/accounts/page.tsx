import Link from "next/link";

import { DeleteButton } from "@/components/ui/DeleteButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { deleteAccountAction } from "@/lib/accounts/actions";
import { listAccounts } from "@/lib/accounts/data";
import { formatDisplayDate } from "@/lib/formatting/date";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await listAccounts();

  return (
    <div className="page">
      <PageHeader
        title="Accounts"
        description="Track which email or provider account each subscription belongs to."
        actions={
          <Link className="button" href="/accounts/new">
            New account
          </Link>
        }
      />

      {accounts.length > 0 ? (
        <section className="stack">
          {accounts.map((account) => (
            <article key={account.id} className="list-card">
              <div className="list-card-header">
                <div>
                  <Link className="title-link" href={`/accounts/${account.id}/edit`}>
                    {account.label}
                  </Link>
                  <p className="muted">
                    {account.email || "No email"}
                    {account.provider ? ` • ${account.provider}` : ""}
                  </p>
                </div>
                <div className="amount-stack">
                  <strong>{account._count.subscriptions}</strong>
                  <span className="muted">linked subscriptions</span>
                </div>
              </div>

              <div className="meta-grid">
                <div>
                  <span className="meta-label">Created</span>
                  <span>{formatDisplayDate(account.createdAt)}</span>
                </div>
                <div>
                  <span className="meta-label">Linked subscriptions</span>
                  <Link className="inline-link" href={`/subscriptions?accountId=${account.id}`}>
                    View filtered subscriptions
                  </Link>
                </div>
              </div>

              {account.notes ? <p className="description-copy">{account.notes}</p> : null}

              <div className="inline-actions">
                <Link className="button button-secondary" href={`/accounts/${account.id}/edit`}>
                  Edit
                </Link>
                <form action={deleteAccountAction.bind(null, account.id)}>
                  <DeleteButton
                    confirmMessage={
                      account._count.subscriptions > 0
                        ? `Delete ${account.label}? ${account._count.subscriptions} linked subscription(s) will be unlinked.`
                        : `Delete ${account.label}? This cannot be undone.`
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
          title="No accounts yet"
          description="Create accounts for the emails or providers you use to manage subscriptions."
          actionHref="/accounts/new"
          actionLabel="Add account"
        />
      )}
    </div>
  );
}
