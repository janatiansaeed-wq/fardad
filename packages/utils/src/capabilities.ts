import type { CapabilityAvailability, CommerceCapability } from "@fardad/types";

export function resolveVisibleCapabilities(
  entitled: ReadonlySet<CommerceCapability>,
  availability: CapabilityAvailability,
): ReadonlySet<CommerceCapability> {
  return new Set(
    [...entitled].filter(
      (capability) => availability.enabled.has(capability) && availability.implemented.has(capability),
    ),
  );
}

export function isCapabilityVisible(
  capability: CommerceCapability,
  visibleCapabilities: ReadonlySet<CommerceCapability>,
): boolean {
  return visibleCapabilities.has(capability);
}
