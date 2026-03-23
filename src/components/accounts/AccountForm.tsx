"use client";

import { useActionState } from "react";

import { emptyActionState, type ActionState } from "@/lib/forms";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export type AccountFormInitialValues = {
  label: string;
  email: string;
  provider: string;
  notes: string;
};

export const emptyAccountInitialValues: AccountFormInitialValues = {
  label: "",
  email: "",
  provider: "",
  notes: ""
};

function fieldError(state: ActionState, name: string) {
  return state.fieldErrors?.[name]?.[0];
}

export function AccountForm({
  action,
  initialValues,
  submitLabel
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: AccountFormInitialValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, emptyActionState);

  return (
    <form action={formAction} className="card form-card">
      {state.message ? <div className="form-message">{state.message}</div> : null}

      <div className="form-grid">
        <FormField error={fieldError(state, "label")} htmlFor="label" label="Label" required>
          <input defaultValue={initialValues.label} id="label" name="label" type="text" />
        </FormField>

        <FormField error={fieldError(state, "email")} htmlFor="email" label="Email">
          <input defaultValue={initialValues.email} id="email" name="email" type="email" />
        </FormField>

        <FormField error={fieldError(state, "provider")} htmlFor="provider" label="Provider">
          <input defaultValue={initialValues.provider} id="provider" name="provider" type="text" />
        </FormField>

        <div className="field field-span-2">
          <span className="field-label">Notes</span>
          <textarea defaultValue={initialValues.notes} id="notes" name="notes" rows={5} />
          {fieldError(state, "notes") ? <span className="field-error">{fieldError(state, "notes")}</span> : null}
        </div>
      </div>

      <div className="inline-actions">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
