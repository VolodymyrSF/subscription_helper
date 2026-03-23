-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "planName" TEXT,
    "amountInCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "billingPeriod" TEXT NOT NULL,
    "customPeriodDays" INTEGER,
    "nextChargeAt" DATETIME,
    "startedAt" DATETIME,
    "renewalType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "isTrial" BOOLEAN NOT NULL DEFAULT false,
    "trialEndsAt" DATETIME,
    "accountId" TEXT,
    "paymentMethodId" TEXT,
    "category" TEXT NOT NULL,
    "manageUrl" TEXT,
    "cancelUrl" TEXT,
    "notes" TEXT,
    "tagsText" TEXT NOT NULL DEFAULT '',
    "lastUsedAt" DATETIME,
    "reviewState" TEXT NOT NULL DEFAULT 'keep',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Subscription_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "email" TEXT,
    "provider" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT,
    "bankName" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_reviewState_idx" ON "Subscription"("reviewState");

-- CreateIndex
CREATE INDEX "Subscription_category_idx" ON "Subscription"("category");

-- CreateIndex
CREATE INDEX "Subscription_nextChargeAt_idx" ON "Subscription"("nextChargeAt");

-- CreateIndex
CREATE INDEX "Subscription_accountId_idx" ON "Subscription"("accountId");

-- CreateIndex
CREATE INDEX "Subscription_paymentMethodId_idx" ON "Subscription"("paymentMethodId");

-- CreateIndex
CREATE INDEX "Account_label_idx" ON "Account"("label");

-- CreateIndex
CREATE INDEX "PaymentMethod_label_idx" ON "PaymentMethod"("label");

