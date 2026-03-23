"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emptyActionState, zodErrorToActionState, type ActionState } from "@/lib/forms";
import { prisma } from "@/lib/db/prisma";
import { parseAccountFormData } from "@/lib/validation/account";

function revalidateAccountRoutes(id?: string) {
  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath("/accounts");

  if (id) {
    revalidatePath(`/accounts/${id}/edit`);
  }
}

export async function createAccountAction(
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseAccountFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  try {
    await prisma.account.create({
      data: parsed.data
    });

    revalidateAccountRoutes();
    redirect("/accounts");
  } catch (error) {
    console.error(error);

    return {
      message: "Could not create the account. Please try again."
    };
  }
}

export async function updateAccountAction(
  id: string,
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseAccountFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  try {
    await prisma.account.update({
      where: { id },
      data: parsed.data
    });

    revalidateAccountRoutes(id);
    redirect("/accounts");
  } catch (error) {
    console.error(error);

    return {
      message: "Could not update the account. Please try again."
    };
  }
}

export async function deleteAccountAction(id: string) {
  try {
    await prisma.account.delete({
      where: { id }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirect("/accounts");
    }

    throw error;
  }

  revalidateAccountRoutes(id);
  redirect("/accounts");
}
