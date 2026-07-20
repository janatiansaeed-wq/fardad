-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CommerceCurrency" AS ENUM ('IRR');

-- CreateEnum
CREATE TYPE "ProductOfferStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductOfferSalesMode" AS ENUM ('ONLINE', 'PRICE_HIDDEN', 'INQUIRY_ONLY');

-- CreateEnum
CREATE TYPE "ProductOfferAvailability" AS ENUM ('AVAILABLE_TO_ORDER', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CartMutationKind" AS ENUM ('ADD_LINE', 'SET_LINE_QUANTITY', 'REMOVE_LINE', 'REFRESH_QUOTE');

-- CreateEnum
CREATE TYPE "CommerceAuditActorType" AS ENUM ('SYSTEM', 'GUEST');

-- CreateEnum
CREATE TYPE "CommerceAuditEventType" AS ENUM ('STORE_CREATED', 'OFFER_CREATED', 'OFFER_ACTIVATED', 'OFFER_DEACTIVATED', 'CART_CREATED', 'CART_LINE_ADDED', 'CART_LINE_QUANTITY_SET', 'CART_LINE_REMOVED', 'CART_QUOTE_REFRESHED', 'CART_EXPIRED');

-- CreateEnum
CREATE TYPE "CommerceAuditSubjectType" AS ENUM ('STORE', 'PRODUCT_OFFER', 'CART', 'CART_LINE');

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "profile_key" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "status" "StoreStatus" NOT NULL DEFAULT 'INACTIVE',
    "currency" "CommerceCurrency" NOT NULL DEFAULT 'IRR',
    "quote_ttl_seconds" INTEGER NOT NULL DEFAULT 900,
    "guest_cart_idle_ttl_seconds" INTEGER NOT NULL DEFAULT 2592000,
    "guest_cart_absolute_ttl_seconds" INTEGER NOT NULL DEFAULT 7776000,
    "max_cart_lines" INTEGER NOT NULL DEFAULT 50,
    "max_line_quantity" INTEGER NOT NULL DEFAULT 99,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "stores_key_format_check" CHECK ("key" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT "stores_profile_key_check" CHECK (length(btrim("profile_key")) > 0),
    CONSTRAINT "stores_display_name_check" CHECK (length(btrim("display_name")) > 0),
    CONSTRAINT "stores_quote_ttl_seconds_check" CHECK ("quote_ttl_seconds" BETWEEN 60 AND 86400),
    CONSTRAINT "stores_guest_cart_idle_ttl_seconds_check" CHECK ("guest_cart_idle_ttl_seconds" BETWEEN 3600 AND 7776000),
    CONSTRAINT "stores_guest_cart_absolute_ttl_seconds_check" CHECK ("guest_cart_absolute_ttl_seconds" >= "guest_cart_idle_ttl_seconds" AND "guest_cart_absolute_ttl_seconds" <= 31536000),
    CONSTRAINT "stores_max_cart_lines_check" CHECK ("max_cart_lines" BETWEEN 1 AND 200),
    CONSTRAINT "stores_max_line_quantity_check" CHECK ("max_line_quantity" BETWEEN 1 AND 1000),
    CONSTRAINT "stores_version_check" CHECK ("version" >= 1)
);

-- CreateTable
CREATE TABLE "product_offers" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ProductOfferStatus" NOT NULL DEFAULT 'DRAFT',
    "sales_mode" "ProductOfferSalesMode" NOT NULL,
    "availability" "ProductOfferAvailability" NOT NULL DEFAULT 'UNAVAILABLE',
    "price_amount_rial" BIGINT,
    "currency" "CommerceCurrency" NOT NULL DEFAULT 'IRR',
    "min_quantity" INTEGER NOT NULL DEFAULT 1,
    "max_quantity" INTEGER NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "effective_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_offers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "product_offers_version_check" CHECK ("version" >= 1),
    CONSTRAINT "product_offers_quantity_check" CHECK ("min_quantity" >= 1 AND "max_quantity" >= "min_quantity" AND "max_quantity" <= 1000),
    CONSTRAINT "product_offers_effective_window_check" CHECK ("effective_until" IS NULL OR "effective_until" > "effective_from"),
    CONSTRAINT "product_offers_price_amount_check" CHECK ("price_amount_rial" IS NULL OR ("price_amount_rial" >= 0 AND "price_amount_rial" <= 9000000000000000000)),
    CONSTRAINT "product_offers_online_price_check" CHECK (("sales_mode" = 'ONLINE' AND "price_amount_rial" IS NOT NULL AND "price_amount_rial" > 0) OR "sales_mode" IN ('PRICE_HIDDEN', 'INQUIRY_ONLY'))
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "token_hash" BYTEA NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "revision" INTEGER NOT NULL DEFAULT 1,
    "currency" "CommerceCurrency" NOT NULL DEFAULT 'IRR',
    "subtotal_amount_rial" BIGINT NOT NULL DEFAULT 0,
    "quote_fingerprint" BYTEA,
    "quoted_at" TIMESTAMP(3),
    "quote_expires_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "absolute_expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "carts_token_hash_length_check" CHECK (octet_length("token_hash") = 32),
    CONSTRAINT "carts_revision_check" CHECK ("revision" >= 1),
    CONSTRAINT "carts_subtotal_amount_check" CHECK ("subtotal_amount_rial" >= 0 AND "subtotal_amount_rial" <= 9000000000000000000),
    CONSTRAINT "carts_quote_fingerprint_length_check" CHECK ("quote_fingerprint" IS NULL OR octet_length("quote_fingerprint") = 32),
    CONSTRAINT "carts_quote_timestamps_check" CHECK ("quote_expires_at" IS NULL OR ("quoted_at" IS NOT NULL AND "quote_expires_at" > "quoted_at")),
    CONSTRAINT "carts_expiry_check" CHECK ("expires_at" <= "absolute_expires_at")
);

-- CreateTable
CREATE TABLE "cart_lines" (
    "id" UUID NOT NULL,
    "public_reference" VARCHAR(22) NOT NULL,
    "store_id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "offer_id" UUID NOT NULL,
    "offer_version" INTEGER NOT NULL,
    "equivalence_key" BYTEA NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_slug_snapshot" VARCHAR(255) NOT NULL,
    "product_name_snapshot" VARCHAR(255) NOT NULL,
    "unit_price_amount_rial" BIGINT NOT NULL,
    "line_subtotal_amount_rial" BIGINT NOT NULL,
    "quote_expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_lines_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cart_lines_public_reference_format_check" CHECK ("public_reference" ~ '^[A-Za-z0-9_-]{22}$'),
    CONSTRAINT "cart_lines_offer_version_check" CHECK ("offer_version" >= 1),
    CONSTRAINT "cart_lines_equivalence_key_length_check" CHECK (octet_length("equivalence_key") = 32),
    CONSTRAINT "cart_lines_quantity_check" CHECK ("quantity" BETWEEN 1 AND 1000),
    CONSTRAINT "cart_lines_product_snapshot_check" CHECK (length(btrim("product_slug_snapshot")) > 0 AND length(btrim("product_name_snapshot")) > 0),
    CONSTRAINT "cart_lines_unit_price_check" CHECK ("unit_price_amount_rial" > 0 AND "unit_price_amount_rial" <= 9000000000000000000),
    CONSTRAINT "cart_lines_subtotal_check" CHECK ("line_subtotal_amount_rial" > 0 AND "line_subtotal_amount_rial" <= 9000000000000000000 AND "line_subtotal_amount_rial"::numeric = "unit_price_amount_rial"::numeric * "quantity")
);

-- CreateTable
CREATE TABLE "cart_mutation_records" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "kind" "CartMutationKind" NOT NULL,
    "key_hash" BYTEA NOT NULL,
    "request_hash" BYTEA NOT NULL,
    "resulting_revision" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_mutation_records_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cart_mutation_records_key_hash_length_check" CHECK (octet_length("key_hash") = 32),
    CONSTRAINT "cart_mutation_records_request_hash_length_check" CHECK (octet_length("request_hash") = 32),
    CONSTRAINT "cart_mutation_records_revision_check" CHECK ("resulting_revision" >= 1),
    CONSTRAINT "cart_mutation_records_expiry_check" CHECK ("expires_at" > "created_at")
);

-- CreateTable
CREATE TABLE "commerce_audit_events" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "event_type" "CommerceAuditEventType" NOT NULL,
    "subject_type" "CommerceAuditSubjectType" NOT NULL,
    "subject_reference" VARCHAR(64) NOT NULL,
    "actor_type" "CommerceAuditActorType" NOT NULL,
    "request_id" VARCHAR(100),
    "cart_revision" INTEGER,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_audit_events_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "commerce_audit_events_subject_reference_check" CHECK (length(btrim("subject_reference")) > 0),
    CONSTRAINT "commerce_audit_events_cart_revision_check" CHECK ("cart_revision" IS NULL OR "cart_revision" >= 1)
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_key_key" ON "stores"("key");
CREATE INDEX "stores_status_idx" ON "stores"("status");
CREATE UNIQUE INDEX "product_offers_id_store_id_key" ON "product_offers"("id", "store_id");
CREATE UNIQUE INDEX "product_offers_store_id_product_id_version_key" ON "product_offers"("store_id", "product_id", "version");
CREATE UNIQUE INDEX "product_offers_one_active_per_store_product" ON "product_offers"("store_id", "product_id") WHERE "status" = 'ACTIVE';
CREATE INDEX "product_offers_store_id_product_id_status_idx" ON "product_offers"("store_id", "product_id", "status");
CREATE INDEX "product_offers_store_id_status_effective_from_effective_until_idx" ON "product_offers"("store_id", "status", "effective_from", "effective_until");
CREATE UNIQUE INDEX "carts_token_hash_key" ON "carts"("token_hash");
CREATE UNIQUE INDEX "carts_id_store_id_key" ON "carts"("id", "store_id");
CREATE INDEX "carts_store_id_status_expires_at_idx" ON "carts"("store_id", "status", "expires_at");
CREATE INDEX "carts_store_id_last_activity_at_idx" ON "carts"("store_id", "last_activity_at");
CREATE UNIQUE INDEX "cart_lines_public_reference_key" ON "cart_lines"("public_reference");
CREATE UNIQUE INDEX "cart_lines_cart_id_equivalence_key_key" ON "cart_lines"("cart_id", "equivalence_key");
CREATE INDEX "cart_lines_store_id_cart_id_idx" ON "cart_lines"("store_id", "cart_id");
CREATE INDEX "cart_lines_store_id_offer_id_idx" ON "cart_lines"("store_id", "offer_id");
CREATE INDEX "cart_lines_product_id_idx" ON "cart_lines"("product_id");
CREATE UNIQUE INDEX "cart_mutation_records_store_id_key_hash_key" ON "cart_mutation_records"("store_id", "key_hash");
CREATE INDEX "cart_mutation_records_store_id_cart_id_created_at_idx" ON "cart_mutation_records"("store_id", "cart_id", "created_at");
CREATE INDEX "cart_mutation_records_expires_at_idx" ON "cart_mutation_records"("expires_at");
CREATE INDEX "commerce_audit_events_store_id_occurred_at_idx" ON "commerce_audit_events"("store_id", "occurred_at");
CREATE INDEX "commerce_audit_events_store_id_subject_type_subject_reference_occurred_at_idx" ON "commerce_audit_events"("store_id", "subject_type", "subject_reference", "occurred_at");
CREATE INDEX "commerce_audit_events_request_id_idx" ON "commerce_audit_events"("request_id");

-- AddForeignKey
ALTER TABLE "product_offers" ADD CONSTRAINT "product_offers_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_offers" ADD CONSTRAINT "product_offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "carts" ADD CONSTRAINT "carts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_cart_id_store_id_fkey" FOREIGN KEY ("cart_id", "store_id") REFERENCES "carts"("id", "store_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_offer_id_store_id_fkey" FOREIGN KEY ("offer_id", "store_id") REFERENCES "product_offers"("id", "store_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cart_mutation_records" ADD CONSTRAINT "cart_mutation_records_cart_id_store_id_fkey" FOREIGN KEY ("cart_id", "store_id") REFERENCES "carts"("id", "store_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "commerce_audit_events" ADD CONSTRAINT "commerce_audit_events_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
