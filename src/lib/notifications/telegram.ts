import { actionableStatuses, type CurrencyValue, type SubscriptionStatusValue } from "@/lib/constants";
import { daysUntil } from "@/lib/calculations/dates";

export type ReminderSubscriptionLike = {
  id: string;
  name: string;
  provider: string;
  planName: string | null;
  amountInCents: number;
  currency: CurrencyValue;
  status: SubscriptionStatusValue;
  nextChargeAt: Date | null;
  isTrial: boolean;
  trialEndsAt: Date | null;
};

export type TelegramReminderGroup = {
  daysAhead: number;
  renewals: ReminderSubscriptionLike[];
  trials: ReminderSubscriptionLike[];
};

export function parseReminderDays(input: string | undefined) {
  const values = (input || "10,7")
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 365);

  return [...new Set(values)].sort((first, second) => second - first);
}

export function collectTelegramReminderGroups(
  subscriptions: ReminderSubscriptionLike[],
  reminderDays: number[],
  referenceDate = new Date()
) {
  return reminderDays
    .map((daysAhead) => {
      const renewals = subscriptions.filter((subscription) => {
        if (!actionableStatuses.has(subscription.status)) {
          return false;
        }

        return subscription.nextChargeAt ? daysUntil(subscription.nextChargeAt, referenceDate) === daysAhead : false;
      });

      const trials = subscriptions.filter((subscription) => {
        if (!(subscription.status === "trial" && subscription.isTrial && subscription.trialEndsAt)) {
          return false;
        }

        return daysUntil(subscription.trialEndsAt, referenceDate) === daysAhead;
      });

      return {
        daysAhead,
        renewals,
        trials
      } satisfies TelegramReminderGroup;
    })
    .filter((group) => group.renewals.length > 0 || group.trials.length > 0);
}

function formatAmount(amountInCents: number, currency: CurrencyValue) {
  return `${(amountInCents / 100).toFixed(2)} ${currency}`;
}

function formatDate(date: Date | null) {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatSubscriptionLine(subscription: ReminderSubscriptionLike, targetDate: Date | null) {
  const planSuffix = subscription.planName ? ` (${subscription.planName})` : "";
  return `- ${subscription.name}${planSuffix} • ${formatAmount(subscription.amountInCents, subscription.currency)} • ${formatDate(targetDate)}`;
}

export function formatTelegramReminderMessage(groups: TelegramReminderGroup[], referenceDate = new Date()) {
  if (groups.length === 0) {
    return null;
  }

  const headerDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(referenceDate);

  const lines = [`SubsVault reminders`, `Generated: ${headerDate}`];

  for (const group of groups) {
    lines.push("");
    lines.push(group.daysAhead === 0 ? "Today" : `In ${group.daysAhead} days`);

    if (group.renewals.length > 0) {
      lines.push("Renewals:");
      for (const subscription of group.renewals) {
        lines.push(formatSubscriptionLine(subscription, subscription.nextChargeAt));
      }
    }

    if (group.trials.length > 0) {
      lines.push("Trials ending:");
      for (const subscription of group.trials) {
        lines.push(formatSubscriptionLine(subscription, subscription.trialEndsAt));
      }
    }
  }

  return lines.join("\n");
}

export async function sendTelegramMessage({
  botToken,
  chatId,
  text
}: {
  botToken: string;
  chatId: string;
  text: string;
}) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram sendMessage failed: ${response.status} ${body}`);
  }

  return response.json();
}
