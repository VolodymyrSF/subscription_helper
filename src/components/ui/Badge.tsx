import type { ReactNode } from "react";

import {
  reviewStateLabels,
  statusLabels,
  type ReviewStateValue,
  type SubscriptionStatusValue
} from "@/lib/constants";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: SubscriptionStatusValue }) {
  const tone =
    status === "active"
      ? "success"
      : status === "trial"
        ? "accent"
        : status === "paused"
          ? "warning"
          : "neutral";

  return <Badge tone={tone}>{statusLabels[status]}</Badge>;
}

export function ReviewBadge({ reviewState }: { reviewState: ReviewStateValue }) {
  const tone = reviewState === "cancel" ? "danger" : reviewState === "review" ? "warning" : "neutral";
  return <Badge tone={tone}>{reviewStateLabels[reviewState]}</Badge>;
}
