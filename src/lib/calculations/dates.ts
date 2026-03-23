const DAY_IN_MS = 24 * 60 * 60 * 1000;

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

export function parseDateInput(value: string) {
  const trimmed = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const [year, month, day] = trimmed.split("-").map((part) => Number.parseInt(part, 10));
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  if (!isValidDate(date)) {
    return null;
  }

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function toUtcDayStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatDateInput(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const utcDayStart = toUtcDayStart(date);
  return new Date(utcDayStart.getTime() + days * DAY_IN_MS);
}

export function daysUntil(target: Date, reference = new Date()) {
  const diff = toUtcDayStart(target).getTime() - toUtcDayStart(reference).getTime();
  return Math.round(diff / DAY_IN_MS);
}

export function isDueToday(target: Date | null | undefined, reference = new Date()) {
  return !!target && daysUntil(target, reference) === 0;
}

export function isWithinDays(target: Date | null | undefined, days: number, reference = new Date()) {
  if (!target) {
    return false;
  }

  const diff = daysUntil(target, reference);
  return diff >= 0 && diff <= days;
}

export function compareNullableDatesAsc(first: Date | null | undefined, second: Date | null | undefined) {
  if (!first && !second) {
    return 0;
  }

  if (!first) {
    return 1;
  }

  if (!second) {
    return -1;
  }

  return first.getTime() - second.getTime();
}
