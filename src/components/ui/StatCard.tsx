import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail?: ReactNode;
}) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {detail ? <div className="stat-detail">{detail}</div> : null}
    </div>
  );
}
