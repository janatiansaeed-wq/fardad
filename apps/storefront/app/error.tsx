"use client";

import { useEffect } from "react";
import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageState
      title="خطایی رخ داد"
      description="لطفاً دوباره تلاش کنید."
      action={<Button onClick={reset}>تلاش دوباره</Button>}
    />
  );
}
