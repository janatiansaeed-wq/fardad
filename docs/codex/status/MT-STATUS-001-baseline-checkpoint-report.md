# گزارش checkpoint خط مبنای فعلی فرداد — MT-STATUS-001

> نوع کار: تثبیت و حفاظت از baseline؛ بدون توسعه feature  
> تاریخ: `2026-07-30`  
> مخزن: `D:\fardad\fardad`  
> شاخه: `architecture-refactor`  
> HEAD پیش از checkpoint: `953a08ccd3b64ae397c8b12ac24bc5fa8158361a`  
> commit پیشنهادی: `chore(checkpoint): preserve WO-043A through WO-045 storefront baseline`

## ۱. خلاصه مدیریتی

Entry gate، scope review و تمام validationهای الزامی برای حفاظت از کارهای `WO-043A` تا `WO-045` پاس شدند. پیش از ایجاد این گزارش، دقیقاً ۳۴ مسیر تغییرکرده وجود داشت: ۱۳ فایل tracked و modified و ۲۱ فایل untracked. همه این مسیرها در allowlist صریح `MT-STATUS-001` بودند؛ فایل staged، conflicted، deleted یا خارج از scope وجود نداشت.

بازبینی source، configuration، اسناد و تصاویر نشان داد change-set متعلق به visual foundation، RTL typography، Header/Navigation، Homepage presentation و recovery محدود `/products` است. هیچ env file، secret، credential، private key، token، database dump، dependency artifact، lockfile، Prisma schema یا migration در scope وجود ندارد.

چهار تصویر و داده‌های مربوط به آن‌ها در source و اسناد به‌صورت روشن presentation-only معرفی شده‌اند و نباید به‌عنوان محصول، قیمت، موجودی یا catalog واقعی تفسیر شوند.

Type-check هر هفت workspace، lint مستقیم هر سه application، هر `38/38` تست موجود و build هر سه application پاس شد. این نتیجه browser QA، database readiness یا Public Catalog runtime را اثبات نمی‌کند.

## ۲. وضعیت Git قبل از checkpoint

| مورد                      | نتیجه                                      |
| ------------------------- | ------------------------------------------ |
| Current working directory | `D:\fardad\fardad`                         |
| Repository root           | `D:/fardad/fardad`                         |
| Branch                    | `architecture-refactor`                    |
| Previous HEAD             | `953a08ccd3b64ae397c8b12ac24bc5fa8158361a` |
| Upstream                  | `origin/architecture-refactor`             |
| Ahead / behind            | `ahead 1`, `behind 0`                      |
| Modified tracked          | ۱۳                                         |
| Untracked                 | ۲۱                                         |
| Staged                    | ۰                                          |
| Conflicted                | ۰                                          |
| Deleted                   | ۰                                          |
| Stash                     | ندارد                                      |

خروجی خلاصه شاخه:

```text
## architecture-refactor...origin/architecture-refactor [ahead 1]
```

مقایسه ماشینی status با allowlist:

```text
ALLOWED_COUNT=34
CURRENT_CHANGED_COUNT=34
OUTSIDE_COUNT=0
MISSING_EXPECTED_COUNT=0
STAGED_COUNT=0
CONFLICT_COUNT=0
DELETED_COUNT=0
```

## ۳. فهرست دقیق فایل‌های checkpoint

این commit باید دقیقاً ۳۵ فایل زیر، شامل همین گزارش، داشته باشد.

| وضعیت پیش از staging | مسیر                                                                                         | نوع                        |
| -------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| modified tracked     | `apps/storefront/app/(public)/products/page.tsx`                                             | source                     |
| modified tracked     | `apps/storefront/app/globals.css`                                                            | source                     |
| modified tracked     | `apps/storefront/components/composition/HomeSectionRenderer.tsx`                             | source                     |
| modified tracked     | `apps/storefront/components/home/Categories.tsx`                                             | source                     |
| new untracked        | `apps/storefront/components/home/CorporateGifting.tsx`                                       | source                     |
| new untracked        | `apps/storefront/components/home/EditorialStories.tsx`                                       | source                     |
| modified tracked     | `apps/storefront/components/home/Features.tsx`                                               | source                     |
| new untracked        | `apps/storefront/components/home/FeaturedShowcase.tsx`                                       | source                     |
| modified tracked     | `apps/storefront/components/home/Hero.tsx`                                                   | source                     |
| modified tracked     | `apps/storefront/components/layout/MobileNavigation.tsx`                                     | source                     |
| modified tracked     | `apps/storefront/components/layout/StorefrontFooter.tsx`                                     | source                     |
| modified tracked     | `apps/storefront/components/layout/StorefrontHeader.tsx`                                     | source                     |
| modified tracked     | `apps/storefront/src/config/brands/fardad/content.fa.ts`                                     | app-owned configuration    |
| modified tracked     | `apps/storefront/src/config/brands/fardad/experience-profile.ts`                             | app-owned configuration    |
| new untracked        | `apps/storefront/src/config/brands/fardad/home-presentation.ts`                              | presentation configuration |
| modified tracked     | `apps/storefront/src/config/brands/fardad/index.ts`                                          | app-owned configuration    |
| modified tracked     | `apps/storefront/src/themes/presets/luxury-heritage.ts`                                      | app-owned theme            |
| new untracked        | `apps/storefront/public/images/presentation/corporate-gifting-presentation.png`              | image asset                |
| new untracked        | `apps/storefront/public/images/presentation/fardad-hero-presentation.png`                    | image asset                |
| new untracked        | `apps/storefront/public/images/presentation/marquetry-metal-presentation.png`                | image asset                |
| new untracked        | `apps/storefront/public/images/presentation/turquoise-enamel-presentation.png`               | image asset                |
| new untracked        | `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`                      | documentation              |
| new untracked        | `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`                            | documentation              |
| new untracked        | `docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md`               | documentation              |
| new untracked        | `docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md`                        | documentation              |
| new untracked        | `docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md` | documentation              |
| new untracked        | `docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md`                                  | documentation              |
| new untracked        | `docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md`                               | documentation              |
| new untracked        | `docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md`                     | documentation              |
| new untracked        | `docs/codex/reports/WO-043F_FARDAD_HOMEPAGE_CATEGORIES_REPORT.md`                            | documentation              |
| new untracked        | `docs/codex/reports/WO-044A_CATALOG_AND_PUBLIC_API_READINESS_AUDIT.md`                       | documentation              |
| new untracked        | `docs/codex/reports/WO-045_TWO_DAY_DELIVERY_HANDOFF.md`                                      | documentation              |
| new untracked        | `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`                       | specification              |
| new untracked        | `docs/codex/status/fardad-repository-current-state-report.md`                                | status report              |
| new untracked        | `docs/codex/status/MT-STATUS-001-baseline-checkpoint-report.md`                              | checkpoint report          |

هیچ فایل خارج از این جدول مجاز به staging یا commit نیست.

## ۴. نگاشت فایل‌ها به Work Orderها

| Work Order      | فایل‌ها / دامنه                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WO-043A`       | visual design specification و pre-implementation review                                                                                                                                                      |
| `WO-043B-1`     | `luxury-heritage.ts`, `experience-profile.ts`, composition version و visual foundation report                                                                                                                |
| `WO-043B-2`     | `globals.css` و گزارش RTL typography/base rhythm                                                                                                                                                             |
| `WO-043B-3`     | `StorefrontHeader.tsx`, `MobileNavigation.tsx` و گزارش Header/Navigation                                                                                                                                     |
| `WO-043B-4`     | source موجود Header/MobileNavigation و گزارش verification؛ بدون تغییر جدید برای رفع blocker                                                                                                                  |
| `WO-043C`       | `Hero.tsx`, copy مرتبط، hero image و گزارش Hero                                                                                                                                                              |
| `WO-043D`       | `products/page.tsx` و گزارش recovery صادقانه `/products`                                                                                                                                                     |
| `WO-043E`       | `Features.tsx`, copy مرتبط و گزارش value proposition                                                                                                                                                         |
| `WO-043F`       | `Categories.tsx`, presentation mapping مرتبط و گزارش Categories                                                                                                                                              |
| `WO-044A`       | audit آمادگی Catalog/Public API؛ report-only                                                                                                                                                                 |
| `WO-045`        | `HomeSectionRenderer.tsx`, `CorporateGifting.tsx`, `EditorialStories.tsx`, `FeaturedShowcase.tsx`, `StorefrontFooter.tsx`, بخش‌های تکمیلی Header/Hero/Categories، `home-presentation.ts`، چهار PNG و handoff |
| `MT-STATUS-001` | current-state report و همین checkpoint report                                                                                                                                                                |

تغییر tracked source برابر `711 insertions` و `116 deletions` در ۱۳ فایل است. هیچ تغییر API، Admin، package مشترک، Prisma، migration، dependency یا lockfile در diff وجود ندارد.

## ۵. hash و اندازه تصاویر

هر چهار فایل پیش از checkpoint توسط Git track نمی‌شدند. تصاویر تغییر یا recompress نشدند.

| فایل                                 | اندازه bytes | SHA-256                                                            | tracked پیش از checkpoint |
| ------------------------------------ | -----------: | ------------------------------------------------------------------ | ------------------------- |
| `corporate-gifting-presentation.png` |  `2,406,014` | `6E161695476738288830E46A4AC8997DD1241BCB691C16F10570B34738B11441` | خیر                       |
| `fardad-hero-presentation.png`       |  `2,418,680` | `F2AB15628AEBFD2B531F166BCCCB1B7E5038C0CAC1BE41A96000F86A862941F3` | خیر                       |
| `marquetry-metal-presentation.png`   |  `2,267,029` | `AB3512B613C815FF08BF5B66D41131CB89489B023E8986A302EED4452F92BF5E` | خیر                       |
| `turquoise-enamel-presentation.png`  |  `2,441,202` | `E77CE53775991823A742E500FC86AE4E26AF2C1A12F2C8D7949CCFE66C146B35` | خیر                       |

Presentation-only بودن:

- `home-presentation.ts` صریحاً showcase را فاقد دلالت موجودی یا محصول قطعی معرفی می‌کند.
- Hero، Categories، Featured Showcase، Corporate Gifting و Footer disclosureهای visible دارند.
- هیچ price، discount، stock، product ID، offer یا availability ساختگی به این داده‌ها اضافه نشده است.

## ۶. نتایج type-check

همه فرمان‌ها در `D:\fardad\fardad` و با binary محلی repository اجرا شدند.

| فرمان                                                                   | نتیجه  |
| ----------------------------------------------------------------------- | ------ |
| `.\node_modules\.bin\tsc.CMD -p packages/types/tsconfig.json --noEmit`  | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p packages/config/tsconfig.json --noEmit` | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p packages/utils/tsconfig.json --noEmit`  | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p packages/ui/tsconfig.json --noEmit`     | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p apps/storefront/tsconfig.json --noEmit` | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p apps/admin/tsconfig.json --noEmit`      | `PASS` |
| `.\node_modules\.bin\tsc.CMD -p apps/api/tsconfig.json --noEmit`        | `PASS` |

نتیجه: `7/7 PASS`.

## ۷. نتایج lint

فرمان root مسدودشده `corepack pnpm lint` عمداً اجرا نشد. validation مستقیم:

| فرمان                                                   | cwd             | نتیجه  |
| ------------------------------------------------------- | --------------- | ------ |
| `.\node_modules\.bin\eslint.CMD apps/storefront`        | repository root | `PASS` |
| `.\node_modules\.bin\eslint.CMD apps/admin`             | repository root | `PASS` |
| `.\node_modules\.bin\eslint.CMD apps/api/src --ext .ts` | repository root | `PASS` |

نتیجه: `3/3 PASS`، بدون diagnostic.

## ۸. نتایج tests

### API

در `D:\fardad\fardad\apps\api`:

```powershell
.\node_modules\.bin\tsc.CMD -p tsconfig.test.json
node --require ./test/setup-env.cjs --test '.test-dist/test/unit/*.spec.js' 'test/*.test.cjs'
```

نتیجه:

```text
tests 32
pass 32
fail 0
```

### Storefront

در `D:\fardad\fardad\apps\storefront`:

```powershell
node --test test/*.test.mjs
```

نتیجه:

```text
tests 6
pass 6
fail 0
```

نتیجه کل: `38/38 PASS`.

## ۹. نتایج build

| فرمان                                | cwd               | نتیجه  |
| ------------------------------------ | ----------------- | ------ |
| `.\node_modules\.bin\nest.CMD build` | `apps/api`        | `PASS` |
| `.\node_modules\.bin\next.CMD build` | `apps/admin`      | `PASS` |
| `.\node_modules\.bin\next.CMD build` | `apps/storefront` | `PASS` |

Admin route:

```text
○ /dashboard
```

Storefront routes:

```text
○ /
ƒ /cart
ƒ /products
ƒ /products/[slug]
ƒ /products/category/[slug]
```

هشدار non-blocking زیر در هر دو Next build باقی است:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

این هشدار موجب failure نشد و در این task اصلاح نشد.

`git diff --check` پیش و پس از validation: `PASS`.

## ۱۰. مشکلات شناخته‌شده‌ای که عمداً اصلاح نشدند

1. Browser QA برای mobile viewport، keyboard-only navigation، zoom `200%`، focus behavior، overflow و reduced motion کامل نشده است.
2. `HomeSectionRenderer.tsx` سه بخش `FeaturedShowcase`, `CorporateGifting`, `EditorialStories` را خارج از typed `home.sections` composition profile اضافه می‌کند.
3. anchor `#organizational-orders` در Header/Footer روی routeهای خارج از homepage ممکن است مقصدی در همان document نداشته باشد.
4. `/products` یک `PublicCatalogRequestError` شناخته‌شده را به همان user-facing state کاتالوگ خالی تبدیل می‌کند.
5. تصاویر و رکوردهای presentation، محصول یا موجودی واقعی نیستند.
6. Public Catalog در این checkout با PostgreSQL زنده و API در حال اجرا validation نشده است.
7. drift nullability میان Prisma schema و migration history وجود دارد و در این task نباید اصلاح شود.

این checkpoint وجود این مشکلات را ثبت و حفظ می‌کند؛ هیچ‌کدام را resolved یا passed اعلام نمی‌کند.

## ۱۱. بررسی عدم وجود secret یا فایل خارج از scope

اسکن high-risk روی تمام فایل‌های متنی checkpoint انجام شد:

| الگو                             | hit |
| -------------------------------- | --: |
| PEM private key                  |   ۰ |
| AWS access key                   |   ۰ |
| GitHub token                     |   ۰ |
| Slack token                      |   ۰ |
| Stripe live key                  |   ۰ |
| compact JWT                      |   ۰ |
| database URL دارای credential    |   ۰ |
| secret/password/token assignment |   ۰ |

بررسی path:

| نوع ممنوع                                    | تعداد |
| -------------------------------------------- | ----: |
| `.env` و environment file                    |     ۰ |
| lockfile                                     |     ۰ |
| Prisma/schema/migration                      |     ۰ |
| `node_modules` / dependency artifact         |     ۰ |
| `.next`, `dist`, `.test-dist` build artifact |     ۰ |
| SQL/database dump                            |     ۰ |
| مسیر خارج allowlist                          |     ۰ |

Sourceهای Storefront هیچ `@prisma`, `process.env`, database credential یا import خارج از مرزهای موجود اضافه نمی‌کنند. مقصدهای visible جدید به `/`, `/products`, `#showcase` و `#organizational-orders` محدودند؛ navigation capability-filtered موجود مسیر `/cart` را نیز در صورت publication نمایش می‌دهد.

## ۱۲. آمادگی برای commit محلی

شرایط لازم برقرار است:

- entry gate پاس شد؛
- scope دقیقاً با allowlist برابر است؛
- source/config/docs/images بررسی شدند؛
- secret و فایل ممنوع یافت نشد؛
- presentation-only بودن صریح است؛
- type-check، lint، tests، builds و whitespace check پاس شدند؛
- blockerهای شناخته‌شده ثبت شده و اصلاح/پنهان نشده‌اند.

پس از اضافه‌شدن همین گزارش، staged allowlist باید دقیقاً ۳۵ فایل داشته باشد. staging فقط با نام صریح هر path انجام می‌شود؛ `git add .`, `git add -A`, `git commit -a` مجاز نیست.

## ۱۳. نام commit پیشنهادی

نام دقیق مجاز:

```text
chore(checkpoint): preserve WO-043A through WO-045 storefront baseline
```

این commit فقط یک checkpoint محلی است؛ approval یا production readiness ایجاد نمی‌کند.

## ۱۴. تأکید بر عدم push

در این task pull، push، merge، rebase، branch switch، tag، reset، clean، stash یا delete انجام نمی‌شود.

**PUSH NOT PERFORMED**
