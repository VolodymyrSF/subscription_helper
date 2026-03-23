import { daysUntil } from "@/lib/calculations/dates";

export function formatDisplayDate(date: Date | null | undefined) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC"
  }).format(date);
}

export function formatShortDate(date: Date | null | undefined) {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function formatRelativeDateLabel(date: Date | null | undefined, reference = new Date()) {
  if (!date) {
    return "No date";
  }

  const diff = daysUntil(date, reference);

  if (diff === 0) {
    return "Today";
  }

  if (diff === 1) {
    return "Tomorrow";
  }

  if (diff > 1) {
    return `In ${diff} days`;
  }

  if (diff === -1) {
    return "Yesterday";
  }

  return `${Math.abs(diff)} days ago`;
}
