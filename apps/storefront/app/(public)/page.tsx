import HomeSectionRenderer from "@/components/composition/HomeSectionRenderer";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function HomePage() {
  return <HomeSectionRenderer profile={getStorefrontProfile()} />;
}
