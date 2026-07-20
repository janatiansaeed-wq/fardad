import "server-only";

import type { StorefrontProfile } from "@fardad/types";
import { fardadProfile } from "@/src/config/fardad-store";

export function getStorefrontProfile(): StorefrontProfile {
  return fardadProfile;
}
