import "server-only";

import type { StorefrontProfile } from "@fardad/types";
import { resolveStorefrontProfile } from "./resolve-storefront-profile";

export function getStorefrontProfile(): StorefrontProfile {
  return resolveStorefrontProfile();
}
