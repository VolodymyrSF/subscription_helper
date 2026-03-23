import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const log: Prisma.LogLevel[] = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim() || "";
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim() || "";

  if (tursoUrl) {
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken || undefined
    });

    return new PrismaClient({
      adapter,
      log
    });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "TURSO_DATABASE_URL is missing in production. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel project environment variables and redeploy."
    );
  }

  return new PrismaClient({ log });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
