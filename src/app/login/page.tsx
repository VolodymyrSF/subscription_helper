import Link from "next/link";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getMessage(errorCode: string, loggedOut: string) {
  if (loggedOut === "1") {
    return "You have been signed out.";
  }

  switch (errorCode) {
    case "missing":
      return "Enter the app password to continue.";
    case "invalid":
      return "That password did not match.";
    case "config":
      return "Authentication is not configured correctly.";
    default:
      return "";
  }
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = firstValue(params.error);
  const next = firstValue(params.next);
  const loggedOut = firstValue(params.loggedOut);
  const message = getMessage(error, loggedOut);

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <p className="auth-eyebrow">SubsVault</p>
        <h1>Private access</h1>
        <p className="auth-copy">
          This instance is protected with a single-user password gate so your subscriptions and payment data are
          not publicly visible.
        </p>

        <form action="/auth/login" className="auth-form" method="post">
          <input name="next" type="hidden" value={next} />

          <label className="field" htmlFor="password">
            <span className="field-label">Password</span>
            <input autoComplete="current-password" id="password" name="password" required type="password" />
          </label>

          {message ? <div className="form-message">{message}</div> : null}

          <button className="button" type="submit">
            Unlock SubsVault
          </button>
        </form>

        <p className="auth-note">
          If you deploy on Vercel, keep the password and session secret only in environment variables.
        </p>

        <Link className="button-link" href="https://vercel.com/docs/security/deployment-protection/methods-to-protect-deployments/vercel-authentication">
          Vercel deployment protection docs
        </Link>
      </section>
    </div>
  );
}
