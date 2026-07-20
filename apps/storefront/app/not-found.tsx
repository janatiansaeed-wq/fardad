import Link from "next/link";
import Button from "@fardad/ui/Button";
import PageState from "@fardad/ui/PageState";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function NotFound() {
  const { states } = getStorefrontProfile().content;

  return (
    <PageState
      title={states.notFoundTitle}
      description={states.notFoundDescription}
      action={
        <Link href="/">
          <Button>{states.homeAction}</Button>
        </Link>
      }
    />
  );
}
