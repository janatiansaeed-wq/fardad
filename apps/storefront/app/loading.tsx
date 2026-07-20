import PageState from "@fardad/ui/PageState";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function Loading() {
  const { states } = getStorefrontProfile().content;
  return <PageState title={states.loadingTitle} description={states.loadingDescription} />;
}
