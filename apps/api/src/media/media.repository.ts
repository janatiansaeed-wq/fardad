import { Injectable } from "@nestjs/common";
import {
  MediaKind,
  MediaLifecycleStatus,
  MediaRenditionVariant,
  MediaVisibility,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../database";

const publicAssetSelect = Prisma.validator<Prisma.MediaAssetSelect>()({
  byteSize: true,
  contentVersion: true,
  height: true,
  publicId: true,
  reference: true,
  renditions: {
    select: {
      byteSize: true,
      checksum: true,
      contentVersion: true,
      height: true,
      variant: true,
      verifiedMimeType: true,
      width: true,
    },
  },
  verifiedMimeType: true,
  width: true,
});

const localDeliverySelect = Prisma.validator<Prisma.MediaAssetSelect>()({
  byteSize: true,
  height: true,
  kind: true,
  renditions: {
    select: {
      byteSize: true,
      checksum: true,
      height: true,
      storageReference: true,
      verifiedMimeType: true,
      width: true,
    },
    take: 1,
  },
  verifiedMimeType: true,
  width: true,
});

export type PublicMediaAssetRecord = Prisma.MediaAssetGetPayload<{
  select: typeof publicAssetSelect;
}>;

export type LocalMediaDeliveryRecord = Prisma.MediaAssetGetPayload<{
  select: typeof localDeliverySelect;
}>;

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPublicAssets(
    references: readonly string[],
    variant: MediaRenditionVariant,
  ): Promise<PublicMediaAssetRecord[]> {
    return this.prisma.mediaAsset.findMany({
      where: {
        deletedAt: null,
        kind: MediaKind.IMAGE,
        reference: { in: [...references] },
        status: MediaLifecycleStatus.READY,
        visibility: MediaVisibility.PUBLIC,
        renditions: {
          some: {
            deletedAt: null,
            status: MediaLifecycleStatus.READY,
            variant,
          },
        },
      },
      select: {
        ...publicAssetSelect,
        renditions: {
          where: {
            deletedAt: null,
            status: MediaLifecycleStatus.READY,
            variant,
          },
          select: publicAssetSelect.renditions.select,
        },
      },
    });
  }

  findLocalDelivery(
    publicId: string,
    contentVersion: number,
    variant: MediaRenditionVariant,
  ): Promise<LocalMediaDeliveryRecord | null> {
    return this.prisma.mediaAsset.findFirst({
      where: {
        contentVersion,
        deletedAt: null,
        kind: MediaKind.IMAGE,
        publicId,
        status: MediaLifecycleStatus.READY,
        visibility: MediaVisibility.PUBLIC,
      },
      select: {
        ...localDeliverySelect,
        renditions: {
          where: {
            contentVersion,
            deletedAt: null,
            status: MediaLifecycleStatus.READY,
            variant,
          },
          select: localDeliverySelect.renditions.select,
          take: 1,
        },
      },
    });
  }
}
