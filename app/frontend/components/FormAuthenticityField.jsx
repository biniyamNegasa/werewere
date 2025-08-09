import { usePage } from "@inertiajs/react";

export default function FormAuthenticityField() {
  const { csrf } = usePage().props;
  const { param, token } = csrf;
  return <input type="hidden" name={param} value={token} />;
}
