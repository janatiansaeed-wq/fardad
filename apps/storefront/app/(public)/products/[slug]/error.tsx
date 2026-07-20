"use client";

import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";
import { fardadLocalizedContentProfile } from "@/src/config/brands/fardad/content.fa";

export default function ProductDetailError({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  const { productDetail, states } = fardadLocalizedContentProfile;

  return (
    <PageState
      title={productDetail.errorTitle}
      description={states.retryDescription}
      action={<Button onClick={reset}>{states.retryAction}</Button>}
    />
  );
}
