"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emptyActionState, zodErrorToActionState, type ActionState } from "@/lib/forms";
import { prisma } from "@/lib/db/prisma";
import { parsePaymentMethodFormData } from "@/lib/validation/payment-method";

function revalidatePaymentMethodRoutes(id?: string) {
  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath("/payment-methods");

  if (id) {
    revalidatePath(`/payment-methods/${id}/edit`);
  }
}

export async function createPaymentMethodAction(
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parsePaymentMethodFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  try {
    await prisma.paymentMethod.create({
      data: parsed.data
    });
  } catch (error) {
    console.error(error);

    return {
      message: "Could not create the payment method. Please try again."
    };
  }

  revalidatePaymentMethodRoutes();
  redirect("/payment-methods");
}

export async function updatePaymentMethodAction(
  id: string,
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parsePaymentMethodFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  try {
    await prisma.paymentMethod.update({
      where: { id },
      data: parsed.data
    });
  } catch (error) {
    console.error(error);

    return {
      message: "Could not update the payment method. Please try again."
    };
  }

  revalidatePaymentMethodRoutes(id);
  redirect("/payment-methods");
}

export async function deletePaymentMethodAction(id: string) {
  try {
    await prisma.paymentMethod.delete({
      where: { id }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirect("/payment-methods");
    }

    throw error;
  }

  revalidatePaymentMethodRoutes(id);
  redirect("/payment-methods");
}
