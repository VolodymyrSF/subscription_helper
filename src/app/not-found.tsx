import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <h2>Not found</h2>
        <p>The item you tried to open does not exist or may have been removed.</p>
        <Link className="button" href="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
