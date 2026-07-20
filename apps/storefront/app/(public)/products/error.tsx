"use client";

import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";
import { fardadLocalizedContentProfile } from "@/src/config/brands/fardad/content.fa";

export default function ProductsError({ reset }: Readonly<{ error: Error; reset: () => void }>) {
  const { states } = fardadLocalizedContentProfile;

  return (
    <PageState
      title={states.productsErrorTitle}
      description={states.retryDescription}
      action={<Button onClick={reset}>{states.retryAction}</Button>}
    />
  );
}
