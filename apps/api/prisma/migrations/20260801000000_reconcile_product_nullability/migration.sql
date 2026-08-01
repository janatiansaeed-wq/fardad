-- MT-DB-001: reconcile Product-domain nullability with the canonical Prisma schema.
BEGIN;

DO $mt_db_001$
DECLARE
    null_category_count BIGINT;
BEGIN
    SELECT COUNT(*)
    INTO null_category_count
    FROM "product_categories"
    WHERE "name" IS NULL;

    IF null_category_count > 0 THEN
        RAISE EXCEPTION USING
            MESSAGE = format(
                'MT-DB-001: cannot enforce NOT NULL on product_categories.name; %s row(s) have a NULL name.',
                null_category_count
            ),
            DETAIL = 'No category names were modified or backfilled.',
            HINT = 'Run SELECT "id", "slug" FROM "product_categories" WHERE "name" IS NULL ORDER BY "id"; assign verified category names under separate approval, then rerun prisma migrate deploy.';
    END IF;
END
$mt_db_001$;

ALTER TABLE "products"
    ALTER COLUMN "name" DROP NOT NULL;

ALTER TABLE "product_categories"
    ALTER COLUMN "name" SET NOT NULL;

COMMIT;
