# SubsVault

SubsVault is a personal subscription tracking app built with Next.js, TypeScript, Prisma, and SQLite-compatible storage. It gives one place to track active subscriptions, recurring totals, renewal dates, trial periods, linked accounts, payment methods, and keep/review/cancel decisions.

## Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- SQLite for local development
- Turso-compatible runtime support for deployment
- Zod validation
- Vitest for business-logic tests
- Plain CSS for a lightweight responsive UI

## What the app does

- Dashboard with KPI cards for active subscriptions, monthly/yearly recurring totals, upcoming renewals, trials ending soon, and review/cancel counts
- CRUD flows for subscriptions, accounts, and payment methods
- Search and filtering on the subscriptions page
- Status management for active, trial, paused, canceled, and expired subscriptions
- Review-state management for keep, review, and cancel
- Explicit links between subscriptions, accounts, and payment methods
- Empty, loading, and error states
- Seed data with realistic sample services

## Project structure

```text
src/
  app/                  Next.js App Router pages
  components/           Layout, UI, dashboard, and form components
  lib/
    calculations/       Recurring total and date helpers
    db/                 Prisma client singleton
    formatting/         Currency and date formatting
    subscriptions/      Queries, actions, filters, tags, and business helpers
    accounts/           Queries and actions
    payment-methods/    Queries and actions
    validation/         Zod schemas and form parsers
prisma/
  schema.prisma         SQLite schema
  seed.ts               Realistic seed dataset
tests/                  Core business logic tests
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment if you need a fresh local `.env`:

```bash
cp .env.example .env
```

3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Create and apply the initial migration:

```bash
npm run db:migrate -- --name init
```

5. Seed the database:

```bash
npm run db:seed
```

6. Run the development server:

```bash
npm run dev
```

7. Run tests:

```bash
npm test
```

## Database and seed commands

- `npm run db:generate` generates the Prisma client
- `npm run db:migrate -- --name init` creates and applies a local migration
- `npm run db:push` pushes schema changes without a migration
- `npm run db:seed` resets the sample data inside the existing database
- `npm run db:reset` resets the database with Prisma

## Local environment variables

For local development, keep `DATABASE_URL` pointed at the SQLite file:

```bash
DATABASE_URL="file:./dev.db"
TURSO_DATABASE_URL=""
TURSO_AUTH_TOKEN=""
SUBSVAULT_APP_PASSWORD=""
SUBSVAULT_SESSION_SECRET=""
CRON_SECRET=""
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
TELEGRAM_REMINDER_DAYS="10,7"
```

At runtime, SubsVault uses Turso automatically when `TURSO_DATABASE_URL` is set. If that variable is empty, it falls back to local SQLite.

## Access protection

The original MVP was intentionally auth-free, which means a public deployment would expose your subscription data to anyone who can open the URL. The app now includes a lightweight single-user password gate designed for personal use.

Set these variables in production:

```bash
SUBSVAULT_APP_PASSWORD="choose-a-long-random-password"
SUBSVAULT_SESSION_SECRET="choose-a-long-random-secret"
```

Behavior:

- when both values are set, all app routes are protected by middleware
- successful login creates an `HttpOnly` session cookie
- logout clears the cookie
- in production, if auth variables are missing, the app returns `503` instead of silently exposing data
- in local development, auth stays disabled by default unless you set the variables yourself

## Deploy to Vercel + Turso

This app is ready for the `Vercel + Turso` free-tier setup:

- Vercel hosts the Next.js app
- Turso stores the production database
- Prisma still uses local SQLite for local migrations, because Prisma's Turso guide notes that `prisma migrate dev` and `prisma db push` are for the local SQLite workflow, while remote Turso schema changes should be applied with SQL through the Turso CLI

### 1. Create or import your Turso database

If you want to publish the current local app data, the simplest path is importing the existing SQLite file:

```bash
turso auth signup
turso db create subsvault-prod --from-file ./prisma/dev.db
```

If you prefer a clean empty database, create it first and apply the checked-in SQL migration manually:

```bash
turso auth signup
turso db create subsvault-prod
turso db shell subsvault-prod < ./prisma/migrations/20260323132000_init/migration.sql
```

Then create a database token and inspect the connection URL:

```bash
turso db show subsvault-prod
turso db tokens create subsvault-prod
```

### 2. Add Vercel environment variables

In your Vercel project settings, add:

```bash
DATABASE_URL=file:./dev.db
TURSO_DATABASE_URL=libsql://your-database-name-your-account.turso.io
TURSO_AUTH_TOKEN=your-generated-token
SUBSVAULT_APP_PASSWORD=choose-a-long-random-password
SUBSVAULT_SESSION_SECRET=choose-a-long-random-secret
CRON_SECRET=choose-a-random-secret-for-vercel-cron
TELEGRAM_BOT_TOKEN=botfather-issued-token
TELEGRAM_CHAT_ID=your-private-chat-id
TELEGRAM_REMINDER_DAYS=10,7
```

`DATABASE_URL` stays as a harmless local placeholder for Prisma's schema configuration during build, while runtime reads from Turso through the Prisma libSQL adapter.

### 3. Deploy the app

Push the repository to GitHub and import it into Vercel, or deploy with the Vercel CLI:

```bash
npm install -g vercel
vercel
```

The existing `postinstall` script already runs `prisma generate`, which Prisma's Vercel deployment guide recommends so Prisma Client stays in sync during builds.

### 4. Roll out future schema changes

For later schema changes, keep using the local migration workflow:

```bash
npm run db:migrate -- --name add-something
```

Then apply the generated SQL file to Turso:

```bash
turso db shell subsvault-prod < ./prisma/migrations/<timestamp>_add-something/migration.sql
```

## Telegram reminders

SubsVault now includes a Vercel Cron endpoint at `/api/cron/telegram-reminders` that sends one daily Telegram digest for subscriptions whose `nextChargeAt` or `trialEndsAt` falls exactly on the configured reminder days.

Default reminder days:

```bash
TELEGRAM_REMINDER_DAYS=10,7
```

The checked-in [vercel.json](/Users/user/IdeaProjects/subscription_helper/vercel.json) schedules this endpoint once per day at `07:00 UTC`.

### Telegram bot setup

1. Create a bot with `@BotFather` and copy the bot token.
2. Open a private chat with the bot and send any message like `/start`.
3. Get your chat ID:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates"
```

4. Copy the numeric `chat.id` into `TELEGRAM_CHAT_ID`.

### Manual reminder test

After deployment, you can test the cron endpoint yourself:

```bash
curl -H "Authorization: Bearer <YOUR_CRON_SECRET>" https://<your-vercel-domain>/api/cron/telegram-reminders
```

If nothing matches the current reminder days, the route returns JSON with `"sent": false`.

## Key business rules

- Recurring totals are calculated in cents to avoid floating-point drift.
- Totals are grouped by currency instead of combining mixed currencies into one misleading number.
- Monthly and yearly estimates use these rules:
  - `monthly` contributes its full amount to monthly totals and `x12` to yearly totals.
  - `yearly` contributes its full amount to yearly totals and `annual / 12` to monthly totals.
  - `quarterly` contributes `quarterly / 3` to monthly totals and `x4` to yearly totals.
  - `weekly` uses an average year of `365.25` days.
  - `custom` billing uses `customPeriodDays` and the same average-day approximation.
- Recurring totals include `active` and `trial` subscriptions. `paused`, `canceled`, and `expired` do not contribute to recurring spend estimates.
- Due soon logic treats a subscription as upcoming when `nextChargeAt` is today or within the next 7 days and the status is `active`, `trial`, or `paused`.
- Trial ending soon logic requires `isTrial = true`, `status = trial`, and a `trialEndsAt` date within the next 7 days.
- Deleting an account or payment method does not delete subscriptions. The subscription link is cleared explicitly via Prisma `onDelete: SetNull`.
- Tags use a pragmatic MVP storage model: they are entered as comma-separated values in the UI and stored as newline-separated text in SQLite.
- In deployed mode, the app talks to Turso through Prisma's libSQL adapter while preserving the same Prisma schema and query layer.

## Known limitations

- No authentication or multi-user support
- No currency conversion or FX normalization
- No email parsing, OCR, or automatic imports
- No charts beyond lightweight grouped summaries
- Turso deployments use manual SQL application for schema changes rather than direct `prisma migrate dev` against the remote database

## Next iteration ideas

- Bulk edit or archive flows
- Custom reminders and notification channels
- CSV import/export
- Subscription usage history and audit notes
- More detailed lifecycle timelines and billing analytics
