"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page">
      <div className="empty-state">
        <h2>Something went wrong</h2>
        <p>{error.message || "The page could not be loaded."}</p>
        <button className="button" onClick={() => reset()} type="button">
          Try again
        </button>
      </div>
    </div>
  );
}
