export default function Loading() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-copy">
          <h1>Loading...</h1>
          <p>Pulling your subscriptions, totals, and linked records.</p>
        </div>
      </div>
      <div className="stat-grid">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="stat-card" />
        ))}
      </div>
      <div className="card" style={{ minHeight: "18rem" }} />
    </div>
  );
}
