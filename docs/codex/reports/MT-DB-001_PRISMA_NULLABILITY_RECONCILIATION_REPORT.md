# گزارش تطبیق nullability در Prisma برای MT-DB-001

> شناسهٔ کار: `MT-DB-001`  
> عنوان: Reconcile Prisma product nullability drift  
> شاخه: `task/mt-db-001-prisma-nullability-drift`  
> commit مبنا: `51e53b174b67d6bed4a45214979910a95bfea771`  
> وضعیت: پیاده‌سازی کامل؛ validation محلی موفق؛ اجرای PostgreSQL تازه به CI سپرده شده است

## خلاصهٔ مدیریتی

تاریخچهٔ migration با قرارداد canonical در دو ستون همگرا نبود:

- `Product.name` در `schema.prisma` اختیاری است، اما migration تاریخی ستون
  `"products"."name"` را `NOT NULL` ساخته بود.
- `ProductCategory.name` در `schema.prisma` اجباری است، اما migration تاریخی ستون
  `"product_categories"."name"` را nullable ساخته بود.

یک migration اصلاحی forward-only و اتمیک اضافه شد. هیچ migration تاریخی، دادهٔ
کسب‌وکار، seed، dependency، lockfile یا application feature تغییر نکرد.

## تصمیم‌های canonical

- نام Product nullable باقی می‌ماند تا draft ناقص قابل ذخیره باشد.
- نام ProductCategory در database اجباری و `NOT NULL` است.
- هیچ نام category ساخته، استنتاج، transliterate یا backfill نمی‌شود.
- وجود هر category با نام null، migration را با پیام عملیاتی روشن متوقف می‌کند.

`apps/api/prisma/schema.prisma` از قبل همین تصمیم‌ها را بیان می‌کرد و بدون تغییر
باقی ماند.

## فایل‌های تغییرکرده

1. `.github/workflows/ci.yml`
2. `apps/api/prisma/migrations/20260801000000_reconcile_product_nullability/migration.sql`
3. `docs/codex/reports/MT-DB-001_PRISMA_NULLABILITY_RECONCILIATION_REPORT.md`
4. `docs/codex/status/latest.md`

`docs/codex/decisions/pending.md` بدون تغییر و با `Status: NONE` باقی ماند.

## migration اصلاحی

مسیر:

```text
apps/api/prisma/migrations/20260801000000_reconcile_product_nullability/migration.sql
```

رفتار migration:

1. یک transaction صریح آغاز می‌کند.
2. تعداد رکوردهای `product_categories` با `name IS NULL` را می‌شمارد.
3. اگر رکوردی پیدا شود، با `RAISE EXCEPTION` متوقف می‌شود، اعلام می‌کند که هیچ
   backfill انجام نشده و query زیر را برای شناسایی رکوردها ارائه می‌دهد:

```sql
SELECT "id", "slug"
FROM "product_categories"
WHERE "name" IS NULL
ORDER BY "id";
```

4. فقط پس از عبور guard، `NOT NULL` را از `products.name` حذف می‌کند.
5. `product_categories.name` را `NOT NULL` می‌کند.
6. transaction را commit می‌کند؛ خطا باعث می‌شود تغییر schema نیمه‌کاره باقی
   نماند.

## gate همگرایی در CI

workflow از PostgreSQL `16-alpine` به‌عنوان service database تازه استفاده می‌کند
و این ترتیب را enforce می‌کند:

1. نصب dependencyها با lockfile موجود؛
2. `pnpm db:validate`؛
3. `pnpm db:generate`؛
4. `pnpm db:migrate:deploy` روی database تازه؛
5. query از `information_schema.columns` و اثبات:
   - `products.name` برابر `YES` برای `is_nullable`؛
   - `product_categories.name` برابر `NO` برای `is_nullable`؛
6. اجرای Prisma migration diff با command پشتیبانی‌شدهٔ نسخهٔ محلی:

```text
pnpm --filter @fardad/api exec prisma migrate diff \
  --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma \
  --exit-code
```

گزینه‌ها از خروجی واقعی `prisma migrate diff --help` در Prisma `6.19.3` انتخاب
شدند. exit code غیرصفر برای drift باعث شکست CI خواهد شد.

## نتایج validation محلی

| کنترل                          | نتیجه | شاهد ضروری                                            |
| ------------------------------ | ----- | ----------------------------------------------------- |
| Prisma CLI/version             | PASS  | `prisma 6.19.3`                                       |
| `prisma migrate diff --help`   | PASS  | flagهای استفاده‌شده پشتیبانی می‌شوند                  |
| Prisma validate                | PASS  | schema معتبر است                                      |
| Prisma generate                | PASS  | Client نسخهٔ `6.19.3` تولید شد                        |
| ساختار migration               | PASS  | یک migration جدید، transaction، guard و دو ALTER دقیق |
| historical migration integrity | PASS  | هیچ migration تاریخی تغییر نکرد                       |
| canonical schema integrity     | PASS  | `schema.prisma` تغییر نکرد                            |
| Type-check                     | PASS  | هر ۷ workspace                                        |
| Lint                           | PASS  | Storefront، Admin و API؛ هر ۳ application             |
| API tests                      | PASS  | `32/32`                                               |
| Storefront tests               | PASS  | `6/6`                                                 |
| API build                      | PASS  | exit code `0`                                         |
| Admin build                    | PASS  | exit code `0`                                         |
| Storefront build               | PASS  | exit code `0`                                         |
| Prettier workflow check        | PASS  | `.github/workflows/ci.yml`                            |
| `git diff --check`             | PASS  | بدون خطای whitespace                                  |

هشدار شناخته‌شدهٔ Next.js دربارهٔ شناسایی نشدن plugin اختصاصی ESLint در buildهای
Admin و Storefront غیرمسدودکننده بود؛ lint مستقیم هر دو application موفق است.

## محدودیت verification محلی PostgreSQL

Docker CLI نصب است، اما daemon در این محیط در حال اجرا نیست؛ `psql` و
`pg_isready` محلی نیز نصب نیستند. بنابراین موارد زیر محلی اجرا نشدند و PASS
اعلام نمی‌شوند:

- `prisma migrate deploy` روی PostgreSQL تازه؛
- queryهای واقعی nullability؛
- migration-diff مبتنی بر database.

این محدودیت طبق قرارداد blocker نیست. gate اجباری GitHub CI هر سه مورد را روی
PostgreSQL تازه اجرا می‌کند و نتیجهٔ نهایی پس از ایجاد Draft PR باید بررسی شود.

## اثر عملیاتی و preflight

پیش از deploy روی هر database موجود، اپراتور باید backup قابل‌بازیابی بگیرد و
query زیر را اجرا کند:

```sql
SELECT "id", "slug"
FROM "product_categories"
WHERE "name" IS NULL
ORDER BY "id";
```

اگر نتیجه خالی نیست، deploy باید متوقف بماند. نام‌های verified باید در یک task
جداگانه و با تأیید مالک داده اصلاح شوند؛ این migration هیچ مقدار جایگزین تولید
نمی‌کند.

## rollback و بازیابی

این migration پس از publication نباید ویرایش یا حذف شود و تاریخچه نباید rewrite
شود. اگر guard شکست بخورد، transaction schema را بدون تغییر نگه می‌دارد. پس از
اصلاح دستی و تأییدشدهٔ داده‌ها، همان `prisma migrate deploy` دوباره اجرا می‌شود.
برای محیط production، backup و restore test پیش‌شرط deploy هستند؛ rollback
مخرب یا تغییر migration تاریخی مجاز نیست.

## تصمیم‌های معلق و اقدام بعدی

- تصمیم مسدودکننده: `NONE`
- blocker: `NONE`
- اقدام بعدی: push شاخهٔ task، ایجاد Draft PR توسط ChatGPT، و بررسی موفقیت gate
  PostgreSQL/migration-convergence در CI؛ PR نباید بدون تأیید انسانی merge شود.
