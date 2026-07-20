import { Injectable, Logger } from "@nestjs/common";
import { MediaRenditionVariant } from "@prisma/client";
import { env } from "../config";
import { parseMediaReference } from "./media-reference";
import { MediaRepository, PublicMediaAssetRecord } from "./media.repository";
import { PublicMediaDescriptor, PublicMediaPurpose } from "./media.types";

const allowedPublicImageMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const publicIdPattern = /^[A-Za-z0-9_-]{22}$/;
const checksumPattern = /^[0-9a-f]{64}$/;
const maximumPublicRenditionBytes = 20n * 1024n * 1024n;

const renditionByPurpose: Record<PublicMediaPurpose, MediaRenditionVariant> = {
  card: MediaRenditionVariant.CARD,
  detail: MediaRenditionVariant.DETAIL,
  gallery: MediaRenditionVariant.GALLERY,
};

@Injectable()
export class PublicMediaResolverService {
  private readonly logger = new Logger(PublicMediaResolverService.name);

  constructor(private readonly mediaRepository: MediaRepository) {}

  async resolveMany(
    references: readonly string[],
    purpose: PublicMediaPurpose,
  ): Promise<ReadonlyMap<string, PublicMediaDescriptor | null>> {
    const uniqueReferences = [...new Set(references)];
    const resolved = new Map<string, PublicMediaDescriptor | null>(
      uniqueReferences.map((reference) => [reference, null]),
    );

    if (env.MEDIA_DELIVERY_MODE === "disabled" || !env.MEDIA_PUBLIC_ORIGIN) {
      return resolved;
    }

    const canonicalReferences = uniqueReferences.filter(
      (reference) => parseMediaReference(reference) !== null,
    );

    if (canonicalReferences.length === 0) {
      return resolved;
    }

    try {
      const assets = await this.mediaRepository.findPublicAssets(
        canonicalReferences,
        renditionByPurpose[purpose],
      );

      for (const asset of assets) {
        const descriptor = this.toPublicDescriptor(asset, purpose);
        resolved.set(asset.reference, descriptor);
      }
    } catch {
      this.logger.warn("Public media resolution failed closed");
    }

    return resolved;
  }

  private toPublicDescriptor(
    asset: PublicMediaAssetRecord,
    purpose: PublicMediaPurpose,
  ): PublicMediaDescriptor | null {
    const rendition = asset.renditions.find(
      (candidate) =>
        candidate.variant === renditionByPurpose[purpose] &&
        candidate.contentVersion === asset.contentVersion,
    );

    if (
      parseMediaReference(asset.reference) === null ||
      !publicIdPattern.test(asset.publicId) ||
      !allowedPublicImageMimeTypes.has(asset.verifiedMimeType) ||
      asset.byteSize <= 0n ||
      !asset.width ||
      asset.width <= 0 ||
      !asset.height ||
      asset.height <= 0 ||
      asset.contentVersion < 1 ||
      !rendition ||
      !allowedPublicImageMimeTypes.has(rendition.verifiedMimeType) ||
      rendition.byteSize <= 0n ||
      rendition.byteSize > maximumPublicRenditionBytes ||
      rendition.width <= 0 ||
      rendition.height <= 0 ||
      !checksumPattern.test(rendition.checksum)
    ) {
      return null;
    }

    try {
      const origin = new URL(env.MEDIA_PUBLIC_ORIGIN!);
      const basePath = origin.pathname.replace(/\/$/, "");
      origin.pathname = `${basePath}/public/media/${asset.publicId}/v/${asset.contentVersion}/${purpose}`;
      origin.search = "";
      origin.hash = "";
      return { src: origin.toString() };
    } catch {
      return null;
    }
  }
}
