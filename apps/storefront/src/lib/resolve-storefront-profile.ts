import "server-only";

import { resolveStorefrontComposition } from "@fardad/config/storefront-profile";
import type { StorefrontProfile } from "@fardad/types";
import { getProductionStorefrontComposition } from "@/src/config/storefront-profile-registry";

let resolvedProfile: StorefrontProfile | undefined;

export function resolveStorefrontProfile(): StorefrontProfile {
  resolvedProfile ??= resolveStorefrontComposition(getProductionStorefrontComposition());
  return resolvedProfile;
}
