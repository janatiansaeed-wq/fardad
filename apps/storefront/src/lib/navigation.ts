import "server-only";

import type { NavigationItem } from "@fardad/types";
import {
  filterNavigationItems,
  normalizeNavigationItems,
  resolveVisibleCapabilities,
} from "@fardad/utils";
import { getStorefrontProfile } from "./storefront-config";

export function resolveStorefrontNavigation(): NavigationItem[] {
  const profile = getStorefrontProfile();

  if (profile.navigation.kind !== "static") {
    throw new Error("Managed storefront navigation requires an approved API implementation.");
  }

  const visibleCapabilities = resolveVisibleCapabilities(
    profile.feature.entitled,
    profile.capabilities,
  );

  return normalizeNavigationItems(
    filterNavigationItems(profile.navigation.items, visibleCapabilities),
  );
}
