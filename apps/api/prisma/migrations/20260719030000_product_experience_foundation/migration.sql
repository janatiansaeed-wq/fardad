-- CreateEnum
CREATE TYPE "CommerceExtensionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductConfigurationStatus" AS ENUM ('DRAFT', 'COMPLETED', 'ABANDONED', 'EXPIRED');

-- CreateTable
CREATE TABLE "gift_boxes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "material" VARCHAR(255),
    "dimensions" VARCHAR(100),
    "length" DECIMAL(12,2),
    "width" DECIMAL(12,2),
    "height" DECIMAL(12,2),
    "weight" DECIMAL(12,2),
    "dimension_unit" CHAR(3) NOT NULL DEFAULT 'CM',
    "weight_unit" CHAR(3) NOT NULL DEFAULT 'KG',
    "price" DECIMAL(18,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "status" "CommerceExtensionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_boxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_box_media" (
    "id" UUID NOT NULL,
    "gift_box_id" UUID NOT NULL,
    "media_reference" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_box_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addon_services" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(100) NOT NULL,
    "configuration_schema" JSONB,
    "price" DECIMAL(18,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IRR',
    "status" "CommerceExtensionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addon_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_gift_boxes" (
    "product_id" UUID NOT NULL,
    "gift_box_id" UUID NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_gift_boxes_pkey" PRIMARY KEY ("product_id","gift_box_id")
);

-- CreateTable
CREATE TABLE "product_addon_services" (
    "product_id" UUID NOT NULL,
    "addon_service_id" UUID NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_addon_services_pkey" PRIMARY KEY ("product_id","addon_service_id")
);

-- CreateTable
CREATE TABLE "product_configurations" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "gift_box_id" UUID,
    "personalization_data" JSONB,
    "external_reference" VARCHAR(100),
    "status" "ProductConfigurationStatus" NOT NULL DEFAULT 'DRAFT',
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_configuration_addon_services" (
    "configuration_id" UUID NOT NULL,
    "addon_service_id" UUID NOT NULL,
    "configuration_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_configuration_addon_services_pkey" PRIMARY KEY ("configuration_id","addon_service_id")
);

-- CreateTable
CREATE TABLE "product_bundle_rules" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "code" VARCHAR(150) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "condition_definition" JSONB NOT NULL,
    "action_definition" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "CommerceExtensionStatus" NOT NULL DEFAULT 'DRAFT',
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_bundle_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_logistics" (
    "product_id" UUID NOT NULL,
    "length" DECIMAL(12,2),
    "width" DECIMAL(12,2),
    "height" DECIMAL(12,2),
    "weight" DECIMAL(12,2),
    "package_length" DECIMAL(12,2),
    "package_width" DECIMAL(12,2),
    "package_height" DECIMAL(12,2),
    "package_weight" DECIMAL(12,2),
    "final_shipping_weight" DECIMAL(12,2),
    "dimension_unit" CHAR(3) NOT NULL DEFAULT 'CM',
    "weight_unit" CHAR(3) NOT NULL DEFAULT 'KG',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_logistics_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "product_experience_event_definitions" (
    "id" UUID NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "payload_schema" JSONB,
    "is_anonymous_only" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_experience_event_definitions_pkey" PRIMARY KEY ("id")
);

-- Rebalance the existing quality rules and reserve 20% for logistics readiness.
UPDATE "product_checklist_rules"
SET "weight" = CASE "code"
    WHEN 'basic.name' THEN 6.00
    WHEN 'basic.slug' THEN 3.00
    WHEN 'basic.short-description' THEN 6.00
    WHEN 'basic.full-description' THEN 11.00
    WHEN 'basic.category' THEN 8.00
    WHEN 'classification.level' THEN 4.00
    WHEN 'attributes.required' THEN 12.00
    WHEN 'media.main-image' THEN 12.00
    WHEN 'media.gallery-image' THEN 4.00
    WHEN 'media.detail-image' THEN 3.00
    WHEN 'media.packaging-image' THEN 2.00
    WHEN 'media.lifestyle-image' THEN 2.00
    WHEN 'media.alt-text' THEN 3.00
    WHEN 'seo.meta-title' THEN 2.00
    WHEN 'seo.meta-description' THEN 2.00
    ELSE "weight"
END,
"updated_at" = CURRENT_TIMESTAMP;

-- Seed only logistics quality rules. They extend the reusable Product checklist to 100%.
INSERT INTO "product_checklist_rules" ("id", "code", "name", "category", "weight", "is_required", "is_critical", "is_active", "sort_order", "created_at", "updated_at") VALUES
    ('3dd85d99-9f25-4bbd-b8f2-17324959f001', 'logistics.product-dimensions', 'Product dimensions completed', 'TECHNICAL_SPECIFICATIONS', 5.00, true, true, true, 160, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3dd85d99-9f25-4bbd-b8f2-17324959f002', 'logistics.product-weight', 'Product weight completed', 'TECHNICAL_SPECIFICATIONS', 4.00, true, true, true, 170, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3dd85d99-9f25-4bbd-b8f2-17324959f003', 'logistics.package-dimensions', 'Package dimensions completed', 'TECHNICAL_SPECIFICATIONS', 4.00, true, true, true, 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3dd85d99-9f25-4bbd-b8f2-17324959f004', 'logistics.package-weight', 'Package weight completed', 'TECHNICAL_SPECIFICATIONS', 3.00, true, true, true, 190, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('3dd85d99-9f25-4bbd-b8f2-17324959f005', 'logistics.final-shipping-weight', 'Final shipping weight completed', 'TECHNICAL_SPECIFICATIONS', 4.00, true, true, true, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Event definitions are anonymous-only metadata; this work order does not collect event payloads.
INSERT INTO "product_experience_event_definitions" ("id", "code", "name", "description", "is_anonymous_only", "is_active", "created_at", "updated_at") VALUES
    ('4ee96eaa-af36-4cce-c9f3-28435a6af001', 'gift_box.viewed', 'GiftBoxViewed', 'Gift box option viewed during product exploration.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4ee96eaa-af36-4cce-c9f3-28435a6af002', 'gift_box.selected', 'GiftBoxSelected', 'Gift box option selected for a product configuration.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4ee96eaa-af36-4cce-c9f3-28435a6af003', 'addon_service.selected', 'AddonSelected', 'Add-on service selected for a product configuration.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4ee96eaa-af36-4cce-c9f3-28435a6af004', 'product_configuration.started', 'ProductConfigurationStarted', 'Product configuration process started.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4ee96eaa-af36-4cce-c9f3-28435a6af005', 'product_configuration.completed', 'ProductConfigurationCompleted', 'Product configuration process completed.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('4ee96eaa-af36-4cce-c9f3-28435a6af006', 'product_configuration.abandoned', 'ConfigurationAbandoned', 'Product configuration process abandoned.', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateIndex
CREATE INDEX "gift_boxes_status_idx" ON "gift_boxes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "gift_box_media_gift_box_id_media_reference_key" ON "gift_box_media"("gift_box_id", "media_reference");

-- CreateIndex
CREATE INDEX "gift_box_media_gift_box_id_sort_order_idx" ON "gift_box_media"("gift_box_id", "sort_order");

-- CreateIndex
CREATE INDEX "addon_services_status_type_idx" ON "addon_services"("status", "type");

-- CreateIndex
CREATE INDEX "product_gift_boxes_gift_box_id_idx" ON "product_gift_boxes"("gift_box_id");

-- CreateIndex
CREATE INDEX "product_addon_services_addon_service_id_idx" ON "product_addon_services"("addon_service_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_configurations_external_reference_key" ON "product_configurations"("external_reference");

-- CreateIndex
CREATE INDEX "product_configurations_product_id_status_idx" ON "product_configurations"("product_id", "status");

-- CreateIndex
CREATE INDEX "product_configurations_expires_at_idx" ON "product_configurations"("expires_at");

-- CreateIndex
CREATE INDEX "product_configuration_addon_services_addon_service_id_idx" ON "product_configuration_addon_services"("addon_service_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_bundle_rules_code_key" ON "product_bundle_rules"("code");

-- CreateIndex
CREATE INDEX "product_bundle_rules_product_id_status_priority_idx" ON "product_bundle_rules"("product_id", "status", "priority");

-- CreateIndex
CREATE INDEX "product_bundle_rules_starts_at_ends_at_idx" ON "product_bundle_rules"("starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_experience_event_definitions_code_key" ON "product_experience_event_definitions"("code");

-- CreateIndex
CREATE INDEX "product_experience_event_definitions_is_active_idx" ON "product_experience_event_definitions"("is_active");

-- AddForeignKey
ALTER TABLE "gift_box_media" ADD CONSTRAINT "gift_box_media_gift_box_id_fkey" FOREIGN KEY ("gift_box_id") REFERENCES "gift_boxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gift_boxes" ADD CONSTRAINT "product_gift_boxes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gift_boxes" ADD CONSTRAINT "product_gift_boxes_gift_box_id_fkey" FOREIGN KEY ("gift_box_id") REFERENCES "gift_boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_services" ADD CONSTRAINT "product_addon_services_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_services" ADD CONSTRAINT "product_addon_services_addon_service_id_fkey" FOREIGN KEY ("addon_service_id") REFERENCES "addon_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_configurations" ADD CONSTRAINT "product_configurations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_configurations" ADD CONSTRAINT "product_configurations_gift_box_id_fkey" FOREIGN KEY ("gift_box_id") REFERENCES "gift_boxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_configuration_addon_services" ADD CONSTRAINT "product_configuration_addon_services_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "product_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_configuration_addon_services" ADD CONSTRAINT "product_configuration_addon_services_addon_service_id_fkey" FOREIGN KEY ("addon_service_id") REFERENCES "addon_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_bundle_rules" ADD CONSTRAINT "product_bundle_rules_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_logistics" ADD CONSTRAINT "product_logistics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
