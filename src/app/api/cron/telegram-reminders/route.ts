import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import {
  collectTelegramReminderGroups,
  formatTelegramReminderMessage,
  parseReminderDays,
  sendTelegramMessage
} from "@/lib/notifications/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim() || "";
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return unauthorized();
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim() || "";

  if (!botToken || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        error: "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be configured."
      },
      { status: 503 }
    );
  }

  const reminderDays = parseReminderDays(process.env.TELEGRAM_REMINDER_DAYS);
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: {
        in: ["active", "trial", "paused"]
      },
      OR: [{ nextChargeAt: { not: null } }, { trialEndsAt: { not: null } }]
    },
    select: {
      id: true,
      name: true,
      provider: true,
      planName: true,
      amountInCents: true,
      currency: true,
      status: true,
      nextChargeAt: true,
      isTrial: true,
      trialEndsAt: true
    }
  });

  const groups = collectTelegramReminderGroups(subscriptions, reminderDays);
  const message = formatTelegramReminderMessage(groups);

  if (!message) {
    return NextResponse.json({
      ok: true,
      sent: false,
      reminderDays,
      matchedGroups: 0
    });
  }

  await sendTelegramMessage({
    botToken,
    chatId,
    text: message
  });

  return NextResponse.json({
    ok: true,
    sent: true,
    reminderDays,
    matchedGroups: groups.length
  });
}
