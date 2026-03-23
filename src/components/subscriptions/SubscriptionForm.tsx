"use client";

import { useActionState, useState } from "react";
import type { PaymentMethodTypeValue } from "@/lib/constants";

import {
  billingPeriodLabels,
  categoryLabels,
  renewalTypeLabels,
  reviewStateLabels,
  statusLabels
} from "@/lib/constants";
import { emptyActionState, type ActionState } from "@/lib/forms";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export type SubscriptionFormInitialValues = {
  name: string;
  provider: string;
  planName: string;
  amount: string;
  currency: string;
  billingPeriod: string;
  customPeriodDays: string;
  nextChargeAt: string;
  startedAt: string;
  renewalType: string;
  status: string;
  isTrial: boolean;
  trialEndsAt: string;
  accountId: string;
  paymentMethodId: string;
  category: string;
  manageUrl: string;
  cancelUrl: string;
  notes: string;
  tags: string;
  lastUsedAt: string;
  reviewState: string;
};

export const emptySubscriptionInitialValues: SubscriptionFormInitialValues = {
  name: "",
  provider: "",
  planName: "",
  amount: "",
  currency: "USD",
  billingPeriod: "monthly",
  customPeriodDays: "",
  nextChargeAt: "",
  startedAt: "",
  renewalType: "auto",
  status: "active",
  isTrial: false,
  trialEndsAt: "",
  accountId: "",
  paymentMethodId: "",
  category: "software",
  manageUrl: "",
  cancelUrl: "",
  notes: "",
  tags: "",
  lastUsedAt: "",
  reviewState: "keep"
};

function fieldError(state: ActionState, name: string) {
  return state.fieldErrors?.[name]?.[0];
}

export function SubscriptionForm({
  action,
  initialValues,
  submitLabel,
  accounts,
  paymentMethods
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: SubscriptionFormInitialValues;
  submitLabel: string;
  accounts: Array<{ id: string; label: string; email: string | null; provider: string | null }>;
  paymentMethods: Array<{ id: string; label: string; type: PaymentMethodTypeValue; last4: string | null }>;
}) {
  const [state, formAction] = useActionState(action, emptyActionState);
  const [billingPeriod, setBillingPeriod] = useState(initialValues.billingPeriod);
  const [isTrial, setIsTrial] = useState(initialValues.isTrial);

  return (
    <form action={formAction} className="card form-card">
      {state.message ? <div className="form-message">{state.message}</div> : null}

      <div className="form-grid">
        <FormField error={fieldError(state, "name")} htmlFor="name" label="Name" required>
          <input defaultValue={initialValues.name} id="name" name="name" type="text" />
        </FormField>

        <FormField error={fieldError(state, "provider")} htmlFor="provider" label="Provider" required>
          <input defaultValue={initialValues.provider} id="provider" name="provider" type="text" />
        </FormField>

        <FormField error={fieldError(state, "planName")} htmlFor="planName" label="Plan name">
          <input defaultValue={initialValues.planName} id="planName" name="planName" type="text" />
        </FormField>

        <FormField error={fieldError(state, "amount")} htmlFor="amount" label="Amount" required>
          <input defaultValue={initialValues.amount} id="amount" min="0" name="amount" placeholder="19.99" step="0.01" type="number" />
        </FormField>

        <FormField error={fieldError(state, "currency")} htmlFor="currency" label="Currency" required>
          <select defaultValue={initialValues.currency} id="currency" name="currency">
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="PLN">PLN</option>
            <option value="GBP">GBP</option>
          </select>
        </FormField>

        <FormField error={fieldError(state, "billingPeriod")} htmlFor="billingPeriod" label="Billing period" required>
          <select
            defaultValue={initialValues.billingPeriod}
            id="billingPeriod"
            name="billingPeriod"
            onChange={(event) => setBillingPeriod(event.target.value)}
          >
            {Object.entries(billingPeriodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        {billingPeriod === "custom" ? (
          <FormField
            error={fieldError(state, "customPeriodDays")}
            htmlFor="customPeriodDays"
            hint="Number of days between charges."
            label="Custom period days"
            required
          >
            <input
              defaultValue={initialValues.customPeriodDays}
              id="customPeriodDays"
              min="1"
              name="customPeriodDays"
              type="number"
            />
          </FormField>
        ) : null}

        <FormField error={fieldError(state, "nextChargeAt")} htmlFor="nextChargeAt" label="Next charge date">
          <input defaultValue={initialValues.nextChargeAt} id="nextChargeAt" name="nextChargeAt" type="date" />
        </FormField>

        <FormField error={fieldError(state, "startedAt")} htmlFor="startedAt" label="Started date">
          <input defaultValue={initialValues.startedAt} id="startedAt" name="startedAt" type="date" />
        </FormField>

        <FormField error={fieldError(state, "renewalType")} htmlFor="renewalType" label="Renewal type" required>
          <select defaultValue={initialValues.renewalType} id="renewalType" name="renewalType">
            {Object.entries(renewalTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "status")} htmlFor="status" label="Status" required>
          <select defaultValue={initialValues.status} id="status" name="status">
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="checkbox-field">
          <label className="checkbox-label" htmlFor="isTrial">
            <input
              defaultChecked={initialValues.isTrial}
              id="isTrial"
              name="isTrial"
              onChange={(event) => setIsTrial(event.target.checked)}
              type="checkbox"
            />
            <span>Subscription is currently in trial</span>
          </label>
          {fieldError(state, "isTrial") ? <span className="field-error">{fieldError(state, "isTrial")}</span> : null}
        </div>

        {isTrial ? (
          <FormField
            error={fieldError(state, "trialEndsAt")}
            htmlFor="trialEndsAt"
            label="Trial end date"
            required
          >
            <input defaultValue={initialValues.trialEndsAt} id="trialEndsAt" name="trialEndsAt" type="date" />
          </FormField>
        ) : null}

        <FormField error={fieldError(state, "accountId")} htmlFor="accountId" label="Linked account">
          <select defaultValue={initialValues.accountId} id="accountId" name="accountId">
            <option value="">No linked account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.label}
                {account.email ? ` • ${account.email}` : ""}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "paymentMethodId")} htmlFor="paymentMethodId" label="Payment method">
          <select defaultValue={initialValues.paymentMethodId} id="paymentMethodId" name="paymentMethodId">
            <option value="">No linked payment method</option>
            {paymentMethods.map((paymentMethod) => (
              <option key={paymentMethod.id} value={paymentMethod.id}>
                {paymentMethod.label}
                {paymentMethod.last4 ? ` • ${paymentMethod.last4}` : ""}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "category")} htmlFor="category" label="Category" required>
          <select defaultValue={initialValues.category} id="category" name="category">
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "reviewState")} htmlFor="reviewState" label="Review state" required>
          <select defaultValue={initialValues.reviewState} id="reviewState" name="reviewState">
            {Object.entries(reviewStateLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={fieldError(state, "manageUrl")} htmlFor="manageUrl" label="Manage URL">
          <input defaultValue={initialValues.manageUrl} id="manageUrl" name="manageUrl" type="url" />
        </FormField>

        <FormField error={fieldError(state, "cancelUrl")} htmlFor="cancelUrl" label="Cancel URL">
          <input defaultValue={initialValues.cancelUrl} id="cancelUrl" name="cancelUrl" type="url" />
        </FormField>

        <FormField error={fieldError(state, "lastUsedAt")} htmlFor="lastUsedAt" label="Last used date">
          <input defaultValue={initialValues.lastUsedAt} id="lastUsedAt" name="lastUsedAt" type="date" />
        </FormField>

        <FormField
          error={fieldError(state, "tags")}
          htmlFor="tags"
          hint="Comma-separated tags for quick grouping."
          label="Tags"
        >
          <input defaultValue={initialValues.tags} id="tags" name="tags" type="text" />
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
