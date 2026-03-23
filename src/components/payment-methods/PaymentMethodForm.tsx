"use client";

import { useActionState } from "react";

import { paymentMethodTypeLabels } from "@/lib/constants";
import { emptyActionState, type ActionState } from "@/lib/forms";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export type PaymentMethodFormInitialValues = {
  label: string;
  type: string;
  last4: string;
  bankName: string;
  notes: string;
};

export const emptyPaymentMethodInitialValues: PaymentMethodFormInitialValues = {
  label: "",
  type: "card",
  last4: "",
  bankName: "",
  notes: ""
};

function fieldError(state: ActionState, name: string) {
  return state.fieldErrors?.[name]?.[0];
}

export function PaymentMethodForm({
  action,
  initialValues,
  submitLabel
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: PaymentMethodFormInitialValues;
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

        <FormField error={fieldError(state, "type")} htmlFor="type" label="Type" required>
          <select defaultValue={initialValues.type} id="type" name="type">
            {Object.entries(paymentMethodTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "last4")} htmlFor="last4" label="Last 4 digits">
          <input defaultValue={initialValues.last4} id="last4" maxLength={4} name="last4" type="text" />
        </FormField>

        <FormField error={fieldError(state, "bankName")} htmlFor="bankName" label="Bank name">
          <input defaultValue={initialValues.bankName} id="bankName" name="bankName" type="text" />
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
