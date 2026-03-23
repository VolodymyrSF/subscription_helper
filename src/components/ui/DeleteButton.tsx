"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({
  label,
  confirmMessage
}: {
  label: string;
  confirmMessage: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className="button button-danger"
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : label}
    </button>
  );
}
