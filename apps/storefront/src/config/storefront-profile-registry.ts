import "server-only";

import type { StorefrontComposition } from "@fardad/types";
import { fardadStorefrontComposition } from "./brands/fardad";

const productionStorefrontProfileRegistry = {
  "fardad-production": fardadStorefrontComposition,
} as const satisfies Readonly<Record<string, StorefrontComposition>>;

export type ProductionStorefrontProfileId = keyof typeof productionStorefrontProfileRegistry;

export const productionStorefrontProfileId: ProductionStorefrontProfileId = "fardad-production";

export function getProductionStorefrontComposition(): StorefrontComposition {
  return productionStorefrontProfileRegistry[productionStorefrontProfileId];
}
