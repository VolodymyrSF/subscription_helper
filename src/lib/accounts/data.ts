import { prisma } from "@/lib/db/prisma";

export async function listAccounts() {
  return prisma.account.findMany({
    orderBy: { label: "asc" },
    include: {
      _count: {
        select: {
          subscriptions: true
        }
      }
    }
  });
}

export async function getAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: {
      subscriptions: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          provider: true,
          status: true
        }
      },
      _count: {
        select: {
          subscriptions: true
        }
      }
    }
  });
}
