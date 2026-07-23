"use client";

import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";
import { fardadLocalizedContentProfile } from "@/src/config/brands/fardad/content.fa";

export default function CartError({ reset }: Readonly<{ error: Error; reset: () => void }>) {
  const { cart } = fardadLocalizedContentProfile;

  return (
    <PageState
      title={cart.errorTitle}
      description={cart.errorDescription}
      action={<Button onClick={reset}>{cart.retryAction}</Button>}
    />
  );
}
