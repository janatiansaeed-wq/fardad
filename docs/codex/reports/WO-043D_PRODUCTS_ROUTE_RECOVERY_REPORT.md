# گزارش تشخیص و بازیابی امن مسیر محصولات Storefront فرداد — WO-043D

> پروژه: Fardad Enterprise Platform  
> دستورکار: WO-043D — Storefront Products Route Diagnosis and Safe Demo Recovery  
> تاریخ اجرا: 2026-07-23  
> نتیجه: بازیابی محدود برای دموی موقت انجام شد؛ کاتالوگ واقعی همچنان به API و دادهٔ تأییدشده نیاز دارد  
> Commit / Push: انجام نشد

## 1. خلاصه نتیجه

مسیر موجود `/products` در dev server با HTTP `200` پاسخ می‌داد، اما به‌جای صفحهٔ محصولات، error boundary فارسی را نمایش می‌داد. علت ریشه‌ای، شکست اتصال مرز server-only کاتالوگ Storefront به public catalog API پیش‌فرض روی `http://localhost:4000/api/v1` بود. در این نشست هیچ listener یا API قابل‌دسترسی روی پورت `4000` وجود نداشت.

هیچ دادهٔ محصول تأییدشده، mock یا fixture در repository موجود نیست و فایل seed عمداً خالی است. بنابراین تنها بازیابی صادقانه و مجاز برای دموی فعلی این بود که خود route ریشهٔ محصولات، شکست کنترل‌شدهٔ `PublicCatalogRequestError` را به empty state فارسی موجود و provisional فرداد تبدیل کند. این تصمیم محصول، قیمت، موجودی، تصویر، لینک جزئیات یا ادعای ساختگی ایجاد نمی‌کند. خطاهای ناشناخته و `PublicCatalogNotFoundError` همچنان پنهان نمی‌شوند و به error/not-found behavior موجود می‌رسند.

## 2. پیش‌بررسی Git و baseline

فرمان الزامی پیش از هر ویرایش:

```text
git status --short
```

خروجی اولیه:

```text
 M apps/storefront/app/globals.css
 M apps/storefront/components/home/Hero.tsx
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md
?? docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md
?? docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md
?? docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

همهٔ این موارد baseline تأییدشدهٔ موجود تلقی شدند. هیچ‌کدام revert، overwrite، commit یا push نشدند.

## 3. اسناد و فایل‌های بررسی‌شده

اسناد الزامی و گزارش‌های مستقیم:

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md`
- `docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md`
- `docs/codex/reports/WO-009_PUBLIC_PRODUCT_CATALOG_STOREFRONT_DISCOVERY_REPORT.md`

route، boundary، منبع داده و componentهای مستقیم:

- `apps/storefront/app/(public)/products/page.tsx`
- `apps/storefront/app/(public)/products/loading.tsx`
- `apps/storefront/app/(public)/products/error.tsx`
- `apps/storefront/app/(public)/products/category/[slug]/page.tsx`
- `apps/storefront/app/(public)/products/[slug]/page.tsx`
- `apps/storefront/src/lib/api/public-catalog.ts`
- `apps/storefront/src/lib/catalog-metadata.ts`
- `apps/storefront/components/catalog/CatalogEmptyState.tsx`
- `apps/storefront/components/catalog/CategoryDiscovery.tsx`
- `apps/storefront/components/catalog/ProductGrid.tsx`
- `apps/storefront/components/catalog/ProductCard.tsx`
- `apps/storefront/components/catalog/CatalogPagination.tsx`
- `apps/storefront/components/home/Hero.tsx`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `packages/types/src/catalog.ts`
- `packages/ui/src/Container.tsx`
- `apps/storefront/app/globals.css`
- `apps/api/prisma/seed.ts`
- `apps/storefront/package.json`

## 4. علت ریشه‌ای و شواهد

زنجیرهٔ شکست پیش از اصلاح:

1. `ProductsPage` با `Promise.all` دو درخواست `getPublicProducts(currentPage)` و `getPublicCategories()` را اجرا می‌کرد.
2. هر دو درخواست از `apps/storefront/src/lib/api/public-catalog.ts` به `STOREFRONT_API_BASE_URL` یا fallback محلی `http://localhost:4000/api/v1` می‌روند.
3. هیچ فایل env فعال برای Storefront وجود نداشت؛ فقط `.env.example` موجود است.
4. probe مستقیم API نتیجهٔ زیر داشت:

```text
API_UNREACHABLE: Unable to connect to the remote server
```

5. dev log پیش از اصلاح محل دقیق خطا را ثبت کرد:

```text
Error: Public catalog request failed
    at request (src\lib\api\public-catalog.ts:79:11)
    at async ProductsPage (app\(public)\products\page.tsx:39:33)
GET /products 200
```

6. `apps/api/prisma/seed.ts` هیچ دادهٔ تجاری ندارد و صریحاً seed دادهٔ کسب‌وکار و Prisma model usage را به دستورکارهای بعدی موکول می‌کند.
7. جست‌وجوی repository هیچ fixture، mock یا sample catalog قابل‌استفاده‌ای پیدا نکرد.
8. محتوای app-owned موجود در `content.fa.ts` یک empty state صادقانه و provisional دارد:

```text
هنوز محصولی برای نمایش وجود ندارد
به‌محض آماده شدن محصولات قابل انتشار، در این بخش نمایش داده می‌شوند.
```

پس شکست route ناشی از Hero، CTA، layout، React component یا contract type نبود؛ route یک upstream غایب را بدون recovery دموی محدود به error boundary می‌فرستاد.

## 5. allowlist و فایل‌های تغییرکرده

allowlist دقیق پیش از ویرایش:

1. `apps/storefront/app/(public)/products/page.tsx`
2. `docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md`

فقط همین دو فایل در WO-043D تغییر کردند:

- `apps/storefront/app/(public)/products/page.tsx` — افزودن recovery محدود برای `PublicCatalogRequestError`.
- `docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md` — ثبت شواهد، تصمیم و validation.

هیچ homepage section، Hero، Header، Cart، API، Prisma، schema، database، shared package، dependency، lockfile، backend contract، route دیگر، Admin، test یا infrastructure تغییر نکرد.

## 6. تصمیم دقیق بازیابی

تابع محلی `getCatalogPageData(page)` در همان فایل route اضافه شد:

- در حالت موفق، همان `catalog` و `categories` واقعی API را بدون تغییر render می‌کند.
- فقط `PublicCatalogRequestError` را به `null` کنترل‌شده تبدیل می‌کند.
- خطاهای ناشناخته را دوباره throw می‌کند.
- route در نبود catalog، همان `CatalogEmptyState` موجود را render می‌کند.
- دسته‌بندی‌ها در حالت نبود upstream render نمی‌شوند تا لینک دسته‌بندی تأییدنشده یا خراب ایجاد نشود.

این اصلاح cause عملی failure در دموی فعلی را در نزدیک‌ترین مرز مجاز مدیریت می‌کند، اما نبود API/داده را به‌عنوان «کاتالوگ واقعی» حل‌شده معرفی نمی‌کند. blocker واقعی در بخش 11 ثبت شده است.

## 7. تصمیم داده یا empty state

تصمیم نهایی: **empty state موجود؛ بدون catalog ساختگی**.

دلایل:

- seed عمداً خالی است.
- mock/fixture محصول تأییدشده وجود ندارد.
- نام‌های provisional دسته‌بندی homepage، محصول یا public catalog contract کامل نیستند و به دادهٔ محصول تبدیل نشدند.
- استفاده از empty state موجود با قاعدهٔ «honest absence» در WO-043A سازگار است.
- هیچ stock، discount، urgency، trust claim، testimonial، statistic، external asset، generated image، logo، customer data یا fact تأییدنشده اضافه نشد.
- چون محصولی render نمی‌شود، هیچ لینک Product Detail نیز اضافه یا نمایش داده نشد.

## 8. routeها و لینک‌های قابل‌مشاهدهٔ راستی‌آزمایی‌شده

آزمون SSR/HTTP پس از اصلاح و پس از بازراه‌اندازی dev server:

```text
HomeStatus        : 200
CtaText           : مشاهده محصولات
CtaHref           : /products
DestinationStatus : 200
DestinationTitle  : محصولات | فرداد
EmptyStateVisible : True
RouteErrorVisible : False
RetryVisible      : False
DocumentRtl       : True
```

نتیجه:

- `/` با HTTP `200` بارگذاری شد.
- CTA قابل‌مشاهدهٔ «مشاهده محصولات» در HTML واقعی `href="/products"` داشت.
- درخواست مقصد دقیق CTA یعنی `/products` با HTTP `200` پاسخ داد.
- عنوان صفحه «محصولات | فرداد» و empty state فارسی موجود بود.
- عنوان error route و دکمهٔ «تلاش دوباره» در پاسخ نبودند.
- dev log جدید فقط `GET /products 200` ثبت کرد و `Public catalog request failed` جدیدی ثبت نشد.

اتصال مرورگر تعاملی طبق workflow Browser انجام شد، اما runtime این نشست نتیجهٔ زیر را برگرداند:

```text
No browser is available
available browsers: []
```

بنابراین کلیک pointer واقعی در browser backend قابل اجرا نبود. زنجیرهٔ لینک visible SSR و درخواست دقیق مقصد به‌صورت مستقل تأیید شد؛ این محدودیت به‌عنوان مانع QA تعاملی باقی می‌ماند و با تأیید مرورگری اشتباه گرفته نمی‌شود.

## 9. تصمیم‌های RTL، دسترس‌پذیری و responsive

- سند واقعی `/products` همچنان `dir="rtl"` دارد.
- heading اصلی semantic `h1` و empty state دارای `section`، `h2` و `aria-live="polite"` باقی ماند.
- empty state از متن فارسی موجود و قابل‌انتخاب استفاده می‌کند و هیچ متن تصویری ندارد.
- `Container` در mobile از `w-full` و `px-4` استفاده می‌کند.
- empty state فقط padding داخلی `px-6` و `max-w-xl` دارد و fixed/min width اضافه نمی‌کند.
- Product grid موجود mobile-first است و فقط از `sm` به دو ستون و از `lg` به سه ستون می‌رود.
- change جدید هیچ width، position، overflow، image، asset، interaction یا DOM reordering اضافه نکرد.
- قاعدهٔ موجود global `overflow-x: hidden` حفظ شد.

به‌دلیل نبود browser backend، اندازه‌گیری واقعی `scrollWidth` در viewport `320px` قابل اجرا نبود. بازبینی source هیچ منشأ جدید horizontal overflow در route/empty state نشان نداد، اما تأیید runtime در `320px` باید در micro work order مرورگری انجام شود.

## 10. validation و نتایج دقیق

### 10.1 Typecheck

```text
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck
> tsc --noEmit
exit code 0
```

### 10.2 Lint

```text
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint
> eslint .
exit code 0
```

### 10.3 Production build

```text
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

```text
Next.js 15.5.20
Compiled successfully in 3.6s
Generating static pages (4/4)
/products: Dynamic, 176 B route size, 111 kB First Load JS
exit code 0
```

هشدار baseline و non-blocking زیر باقی است:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

build هم‌زمان با dev server از همان `.next` استفاده کرد و cache dev را ناسازگار کرد (`Cannot find module './529.js'`). dev process یک‌بار به‌صورت کنترل‌شده بازراه‌اندازی شد. پس از بازراه‌اندازی، سرور روی `http://localhost:3000` آماده ماند و `/` و `/products` دوباره با HTTP `200` پاسخ دادند.

### 10.4 Git checks

```text
git diff --check
```

نتیجه: `PASS`، بدون خروجی.

```text
git status --short
```

خروجی نهایی:

```text
 M apps/storefront/app/(public)/products/page.tsx
 M apps/storefront/app/globals.css
 M apps/storefront/components/home/Hero.tsx
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md
?? docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md
?? docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md
?? docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md
?? docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

مقایسهٔ status اولیه و نهایی نشان می‌دهد WO-043D فقط route محصولات و همین گزارش را اضافه کرده است. هیچ فایل خارج از allowlist توسط این دستورکار تغییر نکرد.

## 11. blockerهای باقی‌مانده برای کاتالوگ واقعی

1. public catalog API باید در محیط مجاز و قابل‌دسترسی اجرا و از طریق `STOREFRONT_API_BASE_URL` درست پیکربندی شود.
2. database غیرتولیدیِ تأییدشده با migrationهای اعمال‌شده لازم است.
3. category و productهای publishable باید از lifecycle/readiness policy موجود عبور کنند.
4. repository هیچ seed، fixture یا mock محصول تأییدشده ندارد.
5. Media Delivery و URLهای browser-safe برای تصاویر محصول هنوز dependency مستقل هستند.
6. browser backend برای QA تعاملی CTA، viewport `320px`، zoom و overflow در این نشست در دسترس نبود.
7. recovery فعلی ویژهٔ demo و honest empty state است؛ جایگزین observability و availability واقعی API در production نیست.

## 12. دستورکار خرد بعدی پیشنهادی

**WO-043D-1 — Products Empty-State Browser QA at 320px**

محدودهٔ پیشنهادی:

- اجرای browser QA واقعی روی `/` و `/products`;
- کلیک CTA «مشاهده محصولات»؛
- viewportهای `320px`، mobile معمول، tablet و desktop؛
- اندازه‌گیری `scrollWidth <= clientWidth`;
- keyboard focus، zoom `200%` و screen-reader landmark smoke check؛
- بدون تغییر product data، API، database، route دیگر، Hero design یا homepage order مگر پس از defect مستقیم و قابل‌بازتولید.
