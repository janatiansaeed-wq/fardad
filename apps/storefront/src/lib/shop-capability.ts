import "server-only";

import type { StorefrontProfile } from "@fardad/types";
import { isCapabilityVisible, resolveVisibleCapabilities } from "@fardad/utils";

export function isShopPublished(profile: StorefrontProfile): boolean {
  return isCapabilityVisible(
    "catalog.shop",
    resolveVisibleCapabilities(profile.feature.entitled, profile.capabilities),
  );
}
