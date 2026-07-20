import "server-only";

import { resolveStorefrontProfile } from "@/src/lib/resolve-storefront-profile";

// Temporary WO-008 compatibility export. New code should use getStorefrontProfile().
export const fardadProfile = resolveStorefrontProfile();
