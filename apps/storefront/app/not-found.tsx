import Link from "next/link";
import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";

export default function NotFound() {
  return (
    <PageState
      title="صفحه موردنظر پیدا نشد"
      description="نشانی واردشده در دسترس نیست یا تغییر کرده است."
      action={
        <Link href="/">
          <Button>بازگشت به خانه</Button>
        </Link>
      }
    />
  );
}
