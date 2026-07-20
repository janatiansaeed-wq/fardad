-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MediaLifecycleStatus" AS ENUM ('PENDING', 'READY', 'FAILED', 'QUARANTINED', 'RETIRED');

-- CreateEnum
CREATE TYPE "MediaRenditionVariant" AS ENUM ('CARD', 'GALLERY', 'DETAIL', 'THUMBNAIL');

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "reference" VARCHAR(45) NOT NULL,
    "public_id" VARCHAR(22) NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "visibility" "MediaVisibility" NOT NULL,
    "status" "MediaLifecycleStatus" NOT NULL,
    "verified_mime_type" VARCHAR(100) NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "checksum" CHAR(64) NOT NULL,
    "original_storage_reference" VARCHAR(1024) NOT NULL,
    "content_version" INTEGER NOT NULL DEFAULT 1,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "media_assets_uuid_v7_check" CHECK ("id"::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
    CONSTRAINT "media_assets_reference_format_check" CHECK ("reference" ~ '^media:v1:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
    CONSTRAINT "media_assets_reference_identity_check" CHECK ("reference" = ('media:v1:' || "id"::text)),
    CONSTRAINT "media_assets_public_id_format_check" CHECK ("public_id" ~ '^[A-Za-z0-9_-]{22}$'),
    CONSTRAINT "media_assets_byte_size_check" CHECK ("byte_size" > 0),
    CONSTRAINT "media_assets_dimensions_check" CHECK (("kind" <> 'IMAGE') OR ("width" > 0 AND "height" > 0)),
    CONSTRAINT "media_assets_checksum_check" CHECK ("checksum" ~ '^[0-9a-f]{64}$'),
    CONSTRAINT "media_assets_content_version_check" CHECK ("content_version" > 0)
);

-- CreateTable
CREATE TABLE "media_renditions" (
    "id" UUID NOT NULL,
    "media_asset_id" UUID NOT NULL,
    "variant" "MediaRenditionVariant" NOT NULL,
    "content_version" INTEGER NOT NULL,
    "storage_reference" VARCHAR(1024) NOT NULL,
    "verified_mime_type" VARCHAR(100) NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "checksum" CHAR(64) NOT NULL,
    "status" "MediaLifecycleStatus" NOT NULL,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_renditions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "media_renditions_uuid_v7_check" CHECK ("id"::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
    CONSTRAINT "media_renditions_byte_size_check" CHECK ("byte_size" > 0),
    CONSTRAINT "media_renditions_dimensions_check" CHECK ("width" > 0 AND "height" > 0),
    CONSTRAINT "media_renditions_checksum_check" CHECK ("checksum" ~ '^[0-9a-f]{64}$'),
    CONSTRAINT "media_renditions_content_version_check" CHECK ("content_version" > 0)
);

-- AlterTable
ALTER TABLE "product_media" ADD COLUMN "media_asset_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_reference_key" ON "media_assets"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_public_id_key" ON "media_assets"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_id_reference_key" ON "media_assets"("id", "reference");

-- CreateIndex
CREATE INDEX "media_assets_kind_status_idx" ON "media_assets"("kind", "status");

-- CreateIndex
CREATE INDEX "media_assets_visibility_status_deleted_at_idx" ON "media_assets"("visibility", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "media_assets_created_by_id_idx" ON "media_assets"("created_by_id");

-- CreateIndex
CREATE INDEX "media_assets_updated_by_id_idx" ON "media_assets"("updated_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_renditions_media_asset_id_variant_content_version_key" ON "media_renditions"("media_asset_id", "variant", "content_version");

-- CreateIndex
CREATE INDEX "media_renditions_media_asset_id_status_deleted_at_idx" ON "media_renditions"("media_asset_id", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "media_renditions_created_by_id_idx" ON "media_renditions"("created_by_id");

-- CreateIndex
CREATE INDEX "media_renditions_updated_by_id_idx" ON "media_renditions"("updated_by_id");

-- CreateIndex
CREATE INDEX "product_media_media_asset_id_idx" ON "product_media"("media_asset_id");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_renditions" ADD CONSTRAINT "media_renditions_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_renditions" ADD CONSTRAINT "media_renditions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_renditions" ADD CONSTRAINT "media_renditions_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_media_asset_id_media_reference_fkey" FOREIGN KEY ("media_asset_id", "media_reference") REFERENCES "media_assets"("id", "reference") ON DELETE RESTRICT ON UPDATE CASCADE;
