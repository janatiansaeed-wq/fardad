import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { MediaKind, MediaRenditionVariant } from "@prisma/client";
import { env } from "../config";
import { LocalMediaDeliveryRecord, MediaRepository } from "./media.repository";
import { MEDIA_STORAGE_ADAPTER, MediaStorageAdapter } from "./storage/media-storage.adapter";

const allowedPublicImageMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const publicIdPattern = /^[A-Za-z0-9_-]{22}$/;
const checksumPattern = /^[0-9a-f]{64}$/;
const maximumLocalMediaBytes = 20 * 1024 * 1024;
const variantByPath = new Map<string, MediaRenditionVariant>([
  ["card", MediaRenditionVariant.CARD],
  ["gallery", MediaRenditionVariant.GALLERY],
  ["detail", MediaRenditionVariant.DETAIL],
  ["thumbnail", MediaRenditionVariant.THUMBNAIL],
]);

type HeaderResponse = {
  setHeader(name: string, value: string): void;
};

@Controller("public/media")
export class PublicMediaDeliveryController {
  private readonly logger = new Logger(PublicMediaDeliveryController.name);

  constructor(
    private readonly mediaRepository: MediaRepository,
    @Inject(MEDIA_STORAGE_ADAPTER) private readonly mediaStorage: MediaStorageAdapter,
  ) {}

  @Get(":publicId/v/:contentVersion/:variant")
  async getLocalMedia(
    @Param("publicId") publicId: string,
    @Param("contentVersion") contentVersionValue: string,
    @Param("variant") variantValue: string,
    @Res({ passthrough: true }) response: HeaderResponse,
  ): Promise<StreamableFile> {
    const delivery = await this.resolveLocalDelivery(publicId, contentVersionValue, variantValue);

    if (!delivery) {
      throw new NotFoundException("Media not found");
    }

    response.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
    response.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    response.setHeader("X-Content-Type-Options", "nosniff");

    return new StreamableFile(delivery.stream, {
      length: delivery.byteSize,
      type: delivery.mimeType,
    });
  }

  private async resolveLocalDelivery(
    publicId: string,
    contentVersionValue: string,
    variantValue: string,
  ) {
    if (env.NODE_ENV !== "development" || env.MEDIA_DELIVERY_MODE !== "local") {
      return null;
    }

    const contentVersion = parseContentVersion(contentVersionValue);
    const variant = variantByPath.get(variantValue);

    if (!publicIdPattern.test(publicId) || contentVersion === null || !variant) {
      return null;
    }

    try {
      const record = await this.mediaRepository.findLocalDelivery(
        publicId,
        contentVersion,
        variant,
      );

      if (!record || !isSafeLocalDeliveryRecord(record)) {
        return null;
      }

      const rendition = record.renditions[0];
      const expectedByteSize = Number(rendition.byteSize);
      const file = await this.mediaStorage.read({
        expectedByteSize,
        storageReference: rendition.storageReference,
      });

      if (!file) {
        return null;
      }

      return {
        byteSize: file.byteSize,
        mimeType: rendition.verifiedMimeType,
        stream: file.stream,
      };
    } catch {
      this.logger.warn("Local media delivery failed closed");
      return null;
    }
  }
}

function parseContentVersion(value: string): number | null {
  if (!/^[1-9][0-9]{0,8}$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function isSafeLocalDeliveryRecord(record: LocalMediaDeliveryRecord): boolean {
  const rendition = record.renditions[0];

  if (!rendition || record.kind !== MediaKind.IMAGE) {
    return false;
  }

  return (
    allowedPublicImageMimeTypes.has(record.verifiedMimeType) &&
    allowedPublicImageMimeTypes.has(rendition.verifiedMimeType) &&
    record.byteSize > 0n &&
    record.width !== null &&
    record.width > 0 &&
    record.height !== null &&
    record.height > 0 &&
    rendition.byteSize > 0n &&
    rendition.byteSize <= BigInt(maximumLocalMediaBytes) &&
    rendition.width > 0 &&
    rendition.height > 0 &&
    checksumPattern.test(rendition.checksum)
  );
}
