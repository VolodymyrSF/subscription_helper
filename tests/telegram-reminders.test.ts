import { describe, expect, it } from "vitest";

import { parseDateInput } from "@/lib/calculations/dates";
import {
  collectTelegramReminderGroups,
  formatTelegramReminderMessage,
  parseReminderDays
} from "@/lib/notifications/telegram";

const referenceDate = parseDateInput("2026-03-23")!;

describe("telegram reminders", () => {
  it("parses reminder days and removes duplicates", () => {
    expect(parseReminderDays("10, 7, 10, invalid, -1")).toEqual([10, 7]);
    expect(parseReminderDays(undefined)).toEqual([10, 7]);
  });

  it("groups renewals and trials by configured day offsets", () => {
    const groups = collectTelegramReminderGroups(
      [
        {
          id: "sub_1",
          name: "ChatGPT Plus",
          provider: "OpenAI",
          planName: "Plus",
          amountInCents: 2000,
          currency: "USD",
          status: "active",
          nextChargeAt: parseDateInput("2026-04-02"),
          isTrial: false,
          trialEndsAt: null
        },
        {
          id: "sub_2",
          name: "Cursor",
          provider: "Cursor",
          planName: "Trial",
          amountInCents: 2000,
          currency: "USD",
          status: "trial",
          nextChargeAt: parseDateInput("2026-03-30"),
          isTrial: true,
          trialEndsAt: parseDateInput("2026-03-30")
        }
      ],
      [10, 7],
      referenceDate
    );

    expect(groups).toHaveLength(2);
    expect(groups[0]?.daysAhead).toBe(10);
    expect(groups[0]?.renewals[0]?.name).toBe("ChatGPT Plus");
    expect(groups[1]?.daysAhead).toBe(7);
    expect(groups[1]?.trials[0]?.name).toBe("Cursor");
  });

  it("formats a human-readable Telegram digest", () => {
    const message = formatTelegramReminderMessage(
      [
        {
          daysAhead: 7,
          renewals: [
            {
              id: "sub_1",
              name: "Spotify",
              provider: "Spotify",
              planName: "Premium",
              amountInCents: 49900,
              currency: "UAH",
              status: "active",
              nextChargeAt: parseDateInput("2026-03-30"),
              isTrial: false,
              trialEndsAt: null
            }
          ],
          trials: []
        }
      ],
      referenceDate
    );

    expect(message).toContain("SubsVault reminders");
    expect(message).toContain("In 7 days");
    expect(message).toContain("Spotify");
  });
});
