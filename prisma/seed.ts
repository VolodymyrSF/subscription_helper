import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { addDays, parseDateInput } from "../src/lib/calculations/dates";
import { serializeTags } from "../src/lib/subscriptions/tags";

const prisma = new PrismaClient();

function date(value: string) {
  const parsed = parseDateInput(value);

  if (!parsed) {
    throw new Error(`Invalid seed date: ${value}`);
  }

  return parsed;
}

async function main() {
  await prisma.subscription.deleteMany();
  await prisma.account.deleteMany();
  await prisma.paymentMethod.deleteMany();

  const [personalGmail, workGoogle, appleId, hostingLogin] = await Promise.all([
    prisma.account.create({
      data: {
        label: "Personal Gmail",
        email: "alex.personal@gmail.com",
        provider: "Google",
        notes: "Primary personal account for entertainment and personal SaaS."
      }
    }),
    prisma.account.create({
      data: {
        label: "Work Google",
        email: "alex@workmail.dev",
        provider: "Google Workspace",
        notes: "Used for productivity and engineering subscriptions."
      }
    }),
    prisma.account.create({
      data: {
        label: "Apple ID",
        email: "alex@icloud.com",
        provider: "Apple",
        notes: "Shared across Apple ecosystem subscriptions."
      }
    }),
    prisma.account.create({
      data: {
        label: "Hosting login",
        email: "infra@subsvault.local",
        provider: "Hetzner",
        notes: "Infrastructure-related subscriptions and renewals."
      }
    })
  ]);

  const [monoCard, wiseVirtual, paypalWallet, applePay] = await Promise.all([
    prisma.paymentMethod.create({
      data: {
        label: "Monobank Black",
        type: "card",
        last4: "4242",
        bankName: "Monobank",
        notes: "Primary UAH card for day-to-day recurring payments."
      }
    }),
    prisma.paymentMethod.create({
      data: {
        label: "Wise Virtual",
        type: "card",
        last4: "1129",
        bankName: "Wise",
        notes: "Used for USD and EUR software subscriptions."
      }
    }),
    prisma.paymentMethod.create({
      data: {
        label: "PayPal Balance",
        type: "paypal",
        notes: "Backup wallet for online services."
      }
    }),
    prisma.paymentMethod.create({
      data: {
        label: "Apple Pay",
        type: "apple",
        notes: "Used for iOS ecosystem and family subscriptions."
      }
    })
  ]);

  const today = date("2026-03-23");

  await prisma.subscription.createMany({
    data: [
      {
        name: "ChatGPT Plus",
        provider: "OpenAI",
        planName: "Plus",
        amountInCents: 2000,
        currency: "USD",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 4),
        startedAt: date("2025-08-11"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: wiseVirtual.id,
        category: "software",
        manageUrl: "https://chatgpt.com",
        cancelUrl: "https://chatgpt.com",
        notes: "Used daily for drafting and research.",
        tagsText: serializeTags(["ai", "productivity"]),
        lastUsedAt: addDays(today, -1),
        reviewState: "keep"
      },
      {
        name: "GitHub Copilot",
        provider: "GitHub",
        planName: "Individual",
        amountInCents: 1000,
        currency: "USD",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 2),
        startedAt: date("2025-02-14"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: workGoogle.id,
        paymentMethodId: wiseVirtual.id,
        category: "software",
        manageUrl: "https://github.com/settings/billing",
        cancelUrl: "https://github.com/settings/billing",
        notes: "Engineering assistant subscription.",
        tagsText: serializeTags(["coding", "team"]),
        lastUsedAt: today,
        reviewState: "review"
      },
      {
        name: "Cursor",
        provider: "Cursor",
        planName: "Pro Trial",
        amountInCents: 2000,
        currency: "USD",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 6),
        startedAt: date("2026-03-10"),
        renewalType: "auto",
        status: "trial",
        isTrial: true,
        trialEndsAt: addDays(today, 6),
        accountId: workGoogle.id,
        paymentMethodId: wiseVirtual.id,
        category: "software",
        manageUrl: "https://cursor.com/settings",
        cancelUrl: "https://cursor.com/settings",
        notes: "Evaluating against existing editor setup.",
        tagsText: serializeTags(["trial", "ide"]),
        lastUsedAt: today,
        reviewState: "review"
      },
      {
        name: "Spotify",
        provider: "Spotify",
        planName: "Premium",
        amountInCents: 49900,
        currency: "UAH",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 1),
        startedAt: date("2024-05-01"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: monoCard.id,
        category: "music",
        manageUrl: "https://www.spotify.com/account",
        cancelUrl: "https://www.spotify.com/account/subscription",
        notes: "Family plan paid from primary card.",
        tagsText: serializeTags(["music", "family"]),
        lastUsedAt: addDays(today, -1),
        reviewState: "keep"
      },
      {
        name: "YouTube Premium",
        provider: "Google",
        planName: "Individual",
        amountInCents: 149900,
        currency: "UAH",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 7),
        startedAt: date("2024-11-17"),
        renewalType: "auto",
        status: "paused",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: monoCard.id,
        category: "streaming",
        manageUrl: "https://myaccount.google.com/payments-and-subscriptions",
        cancelUrl: "https://myaccount.google.com/payments-and-subscriptions",
        notes: "Paused while comparing value vs Spotify podcasts.",
        tagsText: serializeTags(["video", "paused"]),
        lastUsedAt: addDays(today, -11),
        reviewState: "cancel"
      },
      {
        name: "Netflix",
        provider: "Netflix",
        planName: "Standard",
        amountInCents: 1599,
        currency: "PLN",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 8),
        startedAt: date("2023-09-03"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: wiseVirtual.id,
        category: "streaming",
        manageUrl: "https://www.netflix.com/account",
        cancelUrl: "https://www.netflix.com/cancelplan",
        notes: "Shared household streaming subscription.",
        tagsText: serializeTags(["tv"]),
        lastUsedAt: addDays(today, -2),
        reviewState: "review"
      },
      {
        name: "iCloud+",
        provider: "Apple",
        planName: "200 GB",
        amountInCents: 299,
        currency: "USD",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 3),
        startedAt: date("2024-06-12"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: appleId.id,
        paymentMethodId: applePay.id,
        category: "cloud",
        manageUrl: "https://appleid.apple.com",
        cancelUrl: "https://appleid.apple.com",
        notes: "Photo backup and device backup storage.",
        tagsText: serializeTags(["storage", "backup"]),
        lastUsedAt: today,
        reviewState: "keep"
      },
      {
        name: "Apple One",
        provider: "Apple",
        planName: "Family",
        amountInCents: 2495,
        currency: "USD",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 5),
        startedAt: date("2025-07-08"),
        renewalType: "auto",
        status: "canceled",
        isTrial: false,
        accountId: appleId.id,
        paymentMethodId: applePay.id,
        category: "utilities",
        manageUrl: "https://appleid.apple.com",
        cancelUrl: "https://appleid.apple.com",
        notes: "Canceled after moving family members to separate plans.",
        tagsText: serializeTags(["bundle"]),
        lastUsedAt: addDays(today, -20),
        reviewState: "cancel"
      },
      {
        name: "Hetzner Cloud",
        provider: "Hetzner",
        planName: "CX22 VPS",
        amountInCents: 499,
        currency: "EUR",
        billingPeriod: "monthly",
        nextChargeAt: addDays(today, 2),
        startedAt: date("2025-03-18"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: hostingLogin.id,
        paymentMethodId: wiseVirtual.id,
        category: "hosting",
        manageUrl: "https://console.hetzner.cloud",
        cancelUrl: "https://console.hetzner.cloud",
        notes: "Hosts a personal side project and staging environment.",
        tagsText: serializeTags(["infra", "server"]),
        lastUsedAt: today,
        reviewState: "keep"
      },
      {
        name: "Domain Renewal",
        provider: "Namecheap",
        planName: "alexwrites.dev",
        amountInCents: 1298,
        currency: "USD",
        billingPeriod: "yearly",
        nextChargeAt: date("2026-04-02"),
        startedAt: date("2021-04-02"),
        renewalType: "manual",
        status: "active",
        isTrial: false,
        accountId: hostingLogin.id,
        paymentMethodId: paypalWallet.id,
        category: "hosting",
        manageUrl: "https://ap.www.namecheap.com/Domains/DomainControlPanel",
        cancelUrl: "https://ap.www.namecheap.com/",
        notes: "Annual renewal for portfolio domain.",
        tagsText: serializeTags(["domain", "annual"]),
        lastUsedAt: addDays(today, -33),
        reviewState: "keep"
      },
      {
        name: "NordVPN",
        provider: "Nord Security",
        planName: "2-year plan",
        amountInCents: 7999,
        currency: "USD",
        billingPeriod: "custom",
        customPeriodDays: 730,
        nextChargeAt: date("2027-01-12"),
        startedAt: date("2025-01-12"),
        renewalType: "auto",
        status: "active",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: paypalWallet.id,
        category: "utilities",
        manageUrl: "https://my.nordaccount.com",
        cancelUrl: "https://my.nordaccount.com",
        notes: "Long-cycle subscription tracked with a custom billing period.",
        tagsText: serializeTags(["privacy"]),
        lastUsedAt: addDays(today, -5),
        reviewState: "keep"
      },
      {
        name: "MasterClass",
        provider: "MasterClass",
        planName: "Individual",
        amountInCents: 12000,
        currency: "USD",
        billingPeriod: "yearly",
        nextChargeAt: date("2026-06-14"),
        startedAt: date("2025-06-14"),
        renewalType: "auto",
        status: "expired",
        isTrial: false,
        accountId: personalGmail.id,
        paymentMethodId: wiseVirtual.id,
        category: "education",
        manageUrl: "https://www.masterclass.com/account",
        cancelUrl: "https://www.masterclass.com/account",
        notes: "Expired after one year, kept for purchase history.",
        tagsText: serializeTags(["learning"]),
        lastUsedAt: date("2025-10-04"),
        reviewState: "keep"
      }
    ]
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
