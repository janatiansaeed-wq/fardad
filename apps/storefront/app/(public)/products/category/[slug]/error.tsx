"use client";

import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";

export default function CategoryProductsError({ reset }: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <PageState
      title="نمایش این دسته‌بندی با مشکل روبه‌رو شد"
      description="لطفاً دوباره تلاش کنید."
      action={<Button onClick={reset}>تلاش دوباره</Button>}
    />
  );
}
