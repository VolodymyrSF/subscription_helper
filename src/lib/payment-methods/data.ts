import { prisma } from "@/lib/db/prisma";

export async function listPaymentMethods() {
  return prisma.paymentMethod.findMany({
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

export async function getPaymentMethodById(id: string) {
  return prisma.paymentMethod.findUnique({
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
