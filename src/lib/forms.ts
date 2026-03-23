import type { ZodError } from "zod";

export type ActionState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const emptyActionState: ActionState = {
  message: undefined,
  fieldErrors: {}
};

export function zodErrorToActionState(error: ZodError, message = "Please correct the highlighted fields.") {
  return {
    message,
    fieldErrors: error.flatten().fieldErrors
  } satisfies ActionState;
}
