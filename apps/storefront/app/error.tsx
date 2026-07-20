"use client";

import { useEffect } from "react";
import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";
import { fardadLocalizedContentProfile } from "@/src/config/brands/fardad/content.fa";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const { states } = fardadLocalizedContentProfile;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageState
      title={states.globalErrorTitle}
      description={states.retryDescription}
      action={<Button onClick={reset}>{states.retryAction}</Button>}
    />
  );
}
