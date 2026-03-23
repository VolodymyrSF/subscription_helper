"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { emptyActionState, zodErrorToActionState, type ActionState } from "@/lib/forms";
import { prisma } from "@/lib/db/prisma";
import { parseSubscriptionFormData, type SubscriptionFormValues } from "@/lib/validation/subscription";
import { serializeTags } from "@/lib/subscriptions/tags";

async function validateRelations(accountId: string | null, paymentMethodId: string | null) {
  const fieldErrors: Record<string, string[]> = {};

  const [accountCount, paymentMethodCount] = await Promise.all([
    accountId ? prisma.account.count({ where: { id: accountId } }) : Promise.resolve(1),
    paymentMethodId ? prisma.paymentMethod.count({ where: { id: paymentMethodId } }) : Promise.resolve(1)
  ]);

  if (accountId && accountCount === 0) {
    fieldErrors.accountId = ["Select a valid account."];
  }

  if (paymentMethodId && paymentMethodCount === 0) {
    fieldErrors.paymentMethodId = ["Select a valid payment method."];
  }

  return fieldErrors;
}

function mapSubscriptionData(values: SubscriptionFormValues): Prisma.SubscriptionUncheckedCreateInput {
  return {
    name: values.name,
    provider: values.provider,
    planName: values.planName,
    amountInCents: values.amount,
    currency: values.currency,
    billingPeriod: values.billingPeriod,
    customPeriodDays: values.billingPeriod === "custom" ? values.customPeriodDays : null,
    nextChargeAt: values.nextChargeAt,
    startedAt: values.startedAt,
    renewalType: values.renewalType,
    status: values.status,
    isTrial: values.isTrial,
    trialEndsAt: values.isTrial ? values.trialEndsAt : null,
    accountId: values.accountId,
    paymentMethodId: values.paymentMethodId,
    category: values.category,
    manageUrl: values.manageUrl,
    cancelUrl: values.cancelUrl,
    notes: values.notes,
    tagsText: serializeTags(values.tags),
    lastUsedAt: values.lastUsedAt,
    reviewState: values.reviewState
  };
}

function revalidateSubscriptionRoutes(id?: string) {
  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath("/accounts");
  revalidatePath("/payment-methods");

  if (id) {
    revalidatePath(`/subscriptions/${id}`);
    revalidatePath(`/subscriptions/${id}/edit`);
  }
}

export async function createSubscriptionAction(
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseSubscriptionFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  const relationErrors = await validateRelations(parsed.data.accountId, parsed.data.paymentMethodId);

  if (Object.keys(relationErrors).length > 0) {
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: relationErrors
    };
  }

  let subscriptionId: string;

  try {
    const subscription = await prisma.subscription.create({
      data: mapSubscriptionData(parsed.data)
    });
    subscriptionId = subscription.id;
  } catch (error) {
    console.error(error);

    return {
      message: "Could not create the subscription. Please try again."
    };
  }

  revalidateSubscriptionRoutes(subscriptionId);
  redirect(`/subscriptions/${subscriptionId}`);
}

export async function updateSubscriptionAction(
  id: string,
  _state: ActionState = emptyActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseSubscriptionFormData(formData);

  if (!parsed.success) {
    return zodErrorToActionState(parsed.error);
  }

  const relationErrors = await validateRelations(parsed.data.accountId, parsed.data.paymentMethodId);

  if (Object.keys(relationErrors).length > 0) {
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: relationErrors
    };
  }

  try {
    await prisma.subscription.update({
      where: { id },
      data: mapSubscriptionData(parsed.data)
    });
  } catch (error) {
    console.error(error);

    return {
      message: "Could not update the subscription. Please try again."
    };
  }

  revalidateSubscriptionRoutes(id);
  redirect(`/subscriptions/${id}`);
}

export async function deleteSubscriptionAction(id: string) {
  try {
    await prisma.subscription.delete({
      where: { id }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      redirect("/subscriptions");
    }

    throw error;
  }

  revalidateSubscriptionRoutes(id);
  redirect("/subscriptions");
}
