import { Module } from "@nestjs/common";
import { PrismaModule } from "../database";
import { MediaRepository } from "./media.repository";
import { PublicMediaDeliveryController } from "./public-media-delivery.controller";
import { PublicMediaResolverService } from "./public-media-resolver.service";
import { LocalFilesystemMediaStorageAdapter } from "./storage/local-filesystem-media-storage.adapter";
import { MEDIA_STORAGE_ADAPTER } from "./storage/media-storage.adapter";

@Module({
  controllers: [PublicMediaDeliveryController],
  exports: [PublicMediaResolverService],
  imports: [PrismaModule],
  providers: [
    MediaRepository,
    PublicMediaResolverService,
    LocalFilesystemMediaStorageAdapter,
    {
      provide: MEDIA_STORAGE_ADAPTER,
      useExisting: LocalFilesystemMediaStorageAdapter,
    },
  ],
})
export class MediaModule {}
