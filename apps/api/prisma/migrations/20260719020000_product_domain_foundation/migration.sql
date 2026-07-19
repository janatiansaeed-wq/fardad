-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductPublicationState" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'UNPUBLISHED');

-- CreateEnum
CREATE TYPE "ProductLevel" AS ENUM ('ECONOMIC', 'STANDARD', 'LUXURY', 'SUPER_LUXURY', 'VIP', 'LIMITED_EDITION');

-- CreateEnum
CREATE TYPE "ProductLabelType" AS ENUM ('NEW', 'FEATURED', 'BEST_SELLER', 'MANAGER_RECOMMENDATION', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "ProductMediaType" AS ENUM ('MAIN_IMAGE', 'GALLERY_IMAGE', 'DETAIL_IMAGE', 'PACKAGING_IMAGE', 'LIFESTYLE_IMAGE', 'VIDEO_REFERENCE');

-- CreateEnum
CREATE TYPE "ProductAttributeDataType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'COLOR', 'MEASUREMENT', 'DATE');

-- CreateEnum
CREATE TYPE "ProductChecklistCategory" AS ENUM ('BASIC_INFORMATION', 'CLASSIFICATION', 'TECHNICAL_SPECIFICATIONS', 'MEDIA', 'SEO');

-- CreateEnum
CREATE TYPE "ProductChecklistCompletionSource" AS ENUM ('AUTOMATED', 'MANUAL');

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_groups" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" UUID NOT NULL,
    "group_id" UUID,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "data_type" "ProductAttributeDataType" NOT NULL,
    "unit" VARCHAR(50),
    "is_filterable" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "english_name" VARCHAR(255),
    "slug" VARCHAR(255),
    "short_description" TEXT,
    "description" TEXT,
    "product_type" VARCHAR(100),
    "level" "ProductLevel",
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "publication_state" "ProductPublicationState" NOT NULL DEFAULT 'DRAFT',
    "meta_title" VARCHAR(255),
    "meta_description" VARCHAR(500),
    "category_id" UUID,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_attributes" (
    "category_id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("category_id","attribute_id")
);

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "attribute_id" UUID NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_labels" (
    "product_id" UUID NOT NULL,
    "label" "ProductLabelType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_labels_pkey" PRIMARY KEY ("product_id","label")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "media_reference" VARCHAR(500) NOT NULL,
    "type" "ProductMediaType" NOT NULL,
    "alt_text" VARCHAR(500),
    "title" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_checklist_rules" (
    "id" UUID NOT NULL,
    "category_id" UUID,
    "code" VARCHAR(150) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" "ProductChecklistCategory" NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "is_critical" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_checklist_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_checklist_statuses" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "rule_id" UUID NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "source" "ProductChecklistCompletionSource" NOT NULL DEFAULT 'AUTOMATED',
    "completed_by_user_id" UUID,
    "completed_at" TIMESTAMP(3),
    "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_checklist_statuses_pkey" PRIMARY KEY ("id")
);

-- Seed only domain-intrinsic quality rules. Sales and inventory rules are deferred.
INSERT INTO "product_checklist_rules" ("id", "code", "name", "category", "weight", "is_required", "is_critical", "is_active", "sort_order", "created_at", "updated_at") VALUES
    ('2cc74c88-8e14-4aac-a7e1-06213848e001', 'basic.name', 'Product name completed', 'BASIC_INFORMATION', 8.00, true, true, true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e002', 'basic.slug', 'Product slug completed', 'BASIC_INFORMATION', 4.00, true, true, true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e003', 'basic.short-description', 'Short description completed', 'BASIC_INFORMATION', 8.00, true, true, true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e004', 'basic.full-description', 'Full description completed', 'BASIC_INFORMATION', 12.00, true, true, true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e005', 'basic.category', 'Category selected', 'BASIC_INFORMATION', 10.00, true, true, true, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e006', 'classification.level', 'Product level selected', 'CLASSIFICATION', 5.00, true, false, true, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e007', 'attributes.required', 'Required category attributes completed', 'TECHNICAL_SPECIFICATIONS', 15.00, true, true, true, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e008', 'media.main-image', 'Main image attached', 'MEDIA', 15.00, true, true, true, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e009', 'media.gallery-image', 'Gallery image attached', 'MEDIA', 5.00, true, false, true, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e010', 'media.detail-image', 'Detail image attached', 'MEDIA', 4.00, true, false, true, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e011', 'media.packaging-image', 'Packaging image attached', 'MEDIA', 3.00, true, false, true, 110, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e012', 'media.lifestyle-image', 'Lifestyle image attached', 'MEDIA', 3.00, true, false, true, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e013', 'media.alt-text', 'Media alt text completed', 'MEDIA', 4.00, true, false, true, 130, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e014', 'seo.meta-title', 'SEO title completed', 'SEO', 2.00, true, false, true, 140, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('2cc74c88-8e14-4aac-a7e1-06213848e015', 'seo.meta-description', 'SEO description completed', 'SEO', 2.00, true, false, true, 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");

-- CreateIndex
CREATE INDEX "product_categories_parent_id_sort_order_idx" ON "product_categories"("parent_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_groups_code_key" ON "product_attribute_groups"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_code_key" ON "product_attributes"("code");

-- CreateIndex
CREATE INDEX "product_attributes_group_id_sort_order_idx" ON "product_attributes"("group_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_status_idx" ON "products"("category_id", "status");

-- CreateIndex
CREATE INDEX "products_publication_state_idx" ON "products"("publication_state");

-- CreateIndex
CREATE INDEX "category_attributes_attribute_id_idx" ON "category_attributes"("attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_product_id_attribute_id_key" ON "product_attribute_values"("product_id", "attribute_id");

-- CreateIndex
CREATE INDEX "product_attribute_values_attribute_id_idx" ON "product_attribute_values"("attribute_id");

-- CreateIndex
CREATE INDEX "product_labels_label_idx" ON "product_labels"("label");

-- CreateIndex
CREATE UNIQUE INDEX "product_media_product_id_media_reference_key" ON "product_media"("product_id", "media_reference");

-- CreateIndex
CREATE INDEX "product_media_product_id_type_sort_order_idx" ON "product_media"("product_id", "type", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_checklist_rules_code_key" ON "product_checklist_rules"("code");

-- CreateIndex
CREATE INDEX "product_checklist_rules_category_id_is_active_sort_order_idx" ON "product_checklist_rules"("category_id", "is_active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "product_checklist_statuses_product_id_rule_id_key" ON "product_checklist_statuses"("product_id", "rule_id");

-- CreateIndex
CREATE INDEX "product_checklist_statuses_rule_id_is_completed_idx" ON "product_checklist_statuses"("rule_id", "is_completed");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "product_attribute_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_labels" ADD CONSTRAINT "product_labels_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_checklist_rules" ADD CONSTRAINT "product_checklist_rules_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_checklist_statuses" ADD CONSTRAINT "product_checklist_statuses_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_checklist_statuses" ADD CONSTRAINT "product_checklist_statuses_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_checklist_statuses" ADD CONSTRAINT "product_checklist_statuses_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "product_checklist_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
