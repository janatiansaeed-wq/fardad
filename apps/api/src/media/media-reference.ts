const mediaReferencePrefix = "media:v1:";
const lowercaseUuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function parseMediaReference(reference: string): string | null {
  if (!reference.startsWith(mediaReferencePrefix)) {
    return null;
  }

  const assetId = reference.slice(mediaReferencePrefix.length);
  return lowercaseUuidPattern.test(assetId) ? assetId : null;
}

export function formatMediaReference(assetId: string): string {
  if (!lowercaseUuidPattern.test(assetId)) {
    throw new TypeError("Media asset ID must be a lowercase UUID");
  }

  return `${mediaReferencePrefix}${assetId}`;
}
