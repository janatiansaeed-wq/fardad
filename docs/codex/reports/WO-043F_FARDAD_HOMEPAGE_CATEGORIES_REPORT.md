# گزارش بخش دسته‌بندی‌های صفحه اصلی فرداد — WO-043F

> پروژه: Fardad Enterprise Platform  
> دستورکار: WO-043F — Fardad Homepage Categories Section  
> تاریخ اجرا: 2026-07-23  
> نتیجه: پیاده‌سازی و validation کد موفق؛ QA تعاملی viewport به‌دلیل نبود browser backend مسدود  
> Commit / Push: انجام نشد

## 1. خلاصه نتیجه

همان بخش موجود `Categories` در composition تأییدشدهٔ صفحه اصلی، بدون افزودن section موازی یا تغییر ترتیب، به یک presentation آرام، RTL-first و mobile-first ارتقا یافت:

```text
Hero → Value Proposition → Categories
```

هر شش عنوان موجود در config فرداد حفظ شدند و taxonomy تازه‌ای ساخته نشد. چون دادهٔ فعلی فقط label دارد، هیچ slug تأییدشده‌ای فراهم نمی‌کند و public catalog API این نشست در دسترس نیست، همهٔ category cardها عمداً non-interactive باقی ماندند. هیچ link، button، focus target یا hover-lift فریبنده‌ای به آن‌ها افزوده نشده است.

## 2. وضعیت اولیه Git و baseline محافظت‌شده

فرمان pre-check:

```text
git status --short
```

خروجی دقیق اولیه:

```text
 M apps/storefront/app/(public)/products/page.tsx
 M apps/storefront/app/globals.css
 M apps/storefront/components/home/Features.tsx
 M apps/storefront/components/home/Hero.tsx
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/content.fa.ts
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
?? docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

همهٔ موارد بالا baseline محافظت‌شده تلقی شدند. هیچ تغییر موجودی revert، overwrite، commit یا push نشد.

## 3. فایل‌های بررسی‌شده

اسناد الزامی:

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md`
- `docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md`
- `docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md`

composition، content و conventions مستقیم:

- `apps/storefront/app/(public)/page.tsx`
- `apps/storefront/components/composition/HomeSectionRenderer.tsx`
- `apps/storefront/components/home/Hero.tsx`
- `apps/storefront/components/home/Features.tsx`
- `apps/storefront/components/home/Categories.tsx`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/navigation.ts`
- `apps/storefront/src/lib/navigation.ts`
- `apps/storefront/app/(public)/products/category/[slug]/page.tsx`
- `apps/storefront/components/catalog/CategoryDiscovery.tsx`
- `apps/storefront/src/lib/api/public-catalog.ts`
- `apps/storefront/app/globals.css`
- `packages/types/src/content.ts`
- `packages/ui/src/Card.tsx`
- `packages/ui/src/Container.tsx`
- `packages/ui/src/Heading.tsx`
- `packages/ui/src/Section.tsx`
- `packages/utils/src/index.ts`
- `apps/storefront/package.json`

## 4. composition و جایگاه دقیق

route صفحه اصلی profile را به `HomeSectionRenderer` می‌دهد. ترتیب واقعی در `experience-profile.ts` پیش و پس از WO-043F بدون تغییر چنین است:

```text
sections: ["hero", "features", "categories"]
```

پس `Categories` دقیقاً پس از Value Proposition موجود render می‌شود. یک case برای `categories` در renderer و یک `Section` در component وجود دارد؛ section تازه یا duplicate اضافه نشد.

## 5. allowlist و فایل‌های تغییرکرده

allowlist دقیق پیش از ویرایش:

1. `apps/storefront/components/home/Categories.tsx`
2. `apps/storefront/src/config/brands/fardad/content.fa.ts`
3. `docs/codex/reports/WO-043F_FARDAD_HOMEPAGE_CATEGORIES_REPORT.md`

فایل‌های تغییرکردهٔ WO-043F دقیقاً همین سه مورد هستند:

- `Categories.tsx` — semantic structure و presentation غیرتعاملی.
- `content.fa.ts` — فقط title/subtitle دسته‌بندی؛ شش label موجود تغییر نکردند.
- گزارش حاضر — تصمیم‌ها، شواهد و validation.

هیچ Hero، Features، renderer، route، products page، catalog boundary، style global، theme، shared package، dependency یا lockfile توسط WO-043F تغییر نکرد.

## 6. منبع داده و وضعیت هر دسته

منبع یگانهٔ این section:

```text
fardadLocalizedContentProfile.home.categories.items
```

profile دارای `approval: "provisional"` است و `home` نیز در `provisionalFields` قرار دارد. بنابراین این شش عنوان برای دموی جاری از baseline app-owned موجود مجازند، اما به‌عنوان taxonomy نهایی production یا fact تأییدشده معرفی نمی‌شوند.

| عنوان | وضعیت در repository | وضعیت نهایی WO-043F |
| --- | --- | --- |
| فیروزه‌کوبی | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |
| میناکاری | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |
| خاتم‌کاری | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |
| قلمزنی | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |
| هدایای مدیریتی | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |
| پک‌های هدیه | موجود در config فرداد؛ provisional | بدون تغییر، non-interactive |

هیچ category تازه، description محصول، count، image، price یا commercial claim اضافه نشد.

## 7. تصمیم مقصد و non-interactive بودن

بررسی پیش از ویرایش:

```text
ConfiguredCategoryCount     : 6
VisibleCategoryLinkCount    : 0
CategoryRouteTemplateExists : True
ContentHasCategorySlugs     : False
NO_LISTENER_ON_4000
```

route قالبی `/products/category/[slug]` در codebase وجود دارد، اما این موضوع برای ساخت مقصد امن کافی نیست:

1. شش label homepage هیچ slug یا category ID ندارند.
2. تبدیل خودکار عنوان فارسی به slug مجاز یا تأییدشده نیست.
3. public category route داده را از API می‌گیرد.
4. هیچ API روی پورت پیش‌فرض `4000` در این نشست در دسترس نبود.
5. هیچ پاسخ SSR/HTTP برای مقصد دقیق هر label قابل اثبات نبود.

بنابراین:

- هیچ category link ساخته نشد.
- هیچ `href`، `Link`، `button` یا `tabIndex` در `Categories.tsx` وجود ندارد.
- شش عنوان در HTML واقعی داخل anchor قرار نگرفتند.
- hover translation پیش‌فرض `Card` با `hover:translate-y-0` خنثی شد.
- transition مربوط به حرکت نیز با `transition-none duration-0` خنثی شد.
- ظاهر itemها card اطلاعاتی است، نه control قابل کلیک.

## 8. copy نهایی فارسی

عنوان:

```text
دسته‌بندی‌های پیشنهادی
```

زیرعنوان:

```text
نگاهی اولیه به زمینه‌های هنری و هدیه‌محور در تجربه فرداد
```

labelهای دسته‌ها بدون تغییر:

```text
فیروزه‌کوبی
میناکاری
خاتم‌کاری
قلمزنی
هدایای مدیریتی
پک‌های هدیه
```

## 9. تحلیل content honesty

- «پیشنهادی» و «نگاهی اولیه» provisional بودن presentation را روشن می‌کنند.
- متن از «محصولات موجود»، «مجموعه آماده»، availability یا قابلیت خرید سخن نمی‌گوید.
- هیچ category count، ranking، popularity، stock، delivery یا trust claim وجود ندارد.
- عنوان‌های موجود به product fact یا destination ساختگی تبدیل نشدند.
- non-interactive ماندن itemها از القای catalog قابل مرور جلوگیری می‌کند.
- هیچ asset، icon package، تصویر، لوگو یا علامت تجاری تازه‌ای اضافه نشد.

## 10. RTL، accessibility، responsive و 320px

### RTL و semantics

- سند واقعی `/` همچنان `dir="rtl"` دارد.
- `Section` موجود، landmark معنایی section را حفظ می‌کند.
- `Heading` یک `h2` ایجاد می‌کند.
- فهرست دسته‌ها از `ul` و شش `li` استفاده می‌کند.
- هر عنوان category یک `h3` است.
- متن category cardها `text-start` و مبتنی بر جهت logical است.
- dot و خط تزئینی `aria-hidden="true"` هستند.
- هیچ focus target یا keyboard interaction تازه‌ای وجود ندارد.

### Responsive و 320px

- grid در base/320px تک‌ستونه است.
- از `sm` به دو ستون و از `lg` به سه ستون می‌رود.
- هر `li` دارای `min-w-0` است.
- Card دیگر `h-56` ثابت ندارد و ارتفاع از محتوا تعیین می‌شود.
- هیچ fixed/min width برای grid، `li` یا Card و هیچ absolute positioning یا media اضافه نشد؛ تنها `w-12` مربوط به خط تزئینی `aria-hidden` داخل جریان عادی است.
- `Container` موجود در mobile از `w-full` و `px-4` استفاده می‌کند.
- Card در mobile `p-6` و از `sm` برابر `p-8` دارد.
- labelها truncation ندارند و می‌توانند طبیعی wrap شوند.

workflow رسمی Browser برای desktop و viewport `320px` اجرا شد، اما runtime پاسخ داد:

```text
No browser is available
```

بنابراین اندازه‌گیری واقعی `scrollWidth`، clipping و screenshot ممکن نبود و browser PASS ادعا نمی‌شود. شواهد source-level بالا نشان می‌دهند تغییر تازه‌ای با منشأ horizontal overflow افزوده نشده است؛ تأیید runtime همچنان به browser backend نیاز دارد.

## 11. راستی‌آزمایی homepage، CTA و `/products`

SSR/HTTP پس از پیاده‌سازی:

```text
HomeStatus                     : 200
ProductsStatus                 : 200
DocumentRtl                    : True
HeroBeforeValue                : True
ValueBeforeCategories          : True
VisibleConfiguredCategoryCount : 6
VisibleCategoryLinkCount       : 0
HeroCtaHref                    : /products
ProductsEmptyState             : True
ProductsErrorState             : False
```

نتیجه:

- `/` با HTTP `200` پاسخ داد.
- ترتیب Hero → Value Proposition → Categories در HTML واقعی حفظ شد.
- هر شش label موجود render شدند.
- هیچ category destination قابل‌مشاهده‌ای وجود نداشت.
- CTA Hero همچنان دقیقاً `href="/products"` داشت.
- `/products` با HTTP `200` و empty state صادقانهٔ WO-043D بارگذاری شد.
- error state محصولات نمایش داده نشد.
- Hero، Features و `/products` در WO-043F تغییر نکردند.

## 12. validation و نتایج دقیق

### Typecheck محدود Storefront

```text
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck
> tsc --noEmit
exit code 0
```

### Lint محدود Storefront

```text
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint
> eslint .
exit code 0
```

### Production build محدود Storefront

برای جلوگیری از collision dev/build روی `.next`، dev server پیش از build به‌صورت کنترل‌شده متوقف و بلافاصله پس از build روی پورت `3000` دوباره اجرا شد.

```text
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

```text
Next.js 15.5.20
Compiled successfully in 3.7s
Generating static pages (4/4)
/ : Static, 164 B route size, 105 kB First Load JS
/products : Dynamic, 176 B route size, 111 kB First Load JS
exit code 0
```

هشدار baseline و non-blocking زیر باقی است:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

پس از build، dev server روی `http://localhost:3000` با وضعیت Ready اجرا شد.

### Git diff check

```text
git diff --check
```

نتیجه:

```text
PASS
```

## 13. وضعیت نهایی Git

فرمان:

```text
git status --short
```

خروجی دقیق نهایی:

```text
 M apps/storefront/app/(public)/products/page.tsx
 M apps/storefront/app/globals.css
 M apps/storefront/components/home/Categories.tsx
 M apps/storefront/components/home/Features.tsx
 M apps/storefront/components/home/Hero.tsx
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/content.fa.ts
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
?? docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md
?? docs/codex/reports/WO-043F_FARDAD_HOMEPAGE_CATEGORIES_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

مقایسهٔ status اولیه و نهایی نشان می‌دهد فقط `Categories.tsx`، تغییر category copy در `content.fa.ts` و گزارش WO-043F به baseline افزوده شدند؛ هر سه داخل allowlist هستند.

## 14. وابستگی‌های باقی‌مانده برای navigation تعاملی

1. public catalog API قابل‌دسترسی در محیط مجاز.
2. category records قابل انتشار با slugهای پایدار و تأییدشده.
3. mapping صریح میان شش label provisional homepage و category recordهای API.
4. HTTP/SSR verification جداگانه برای مقصد دقیق هر category.
5. سیاست empty/not-found و unpublish برای categoryهای بدون محصول.
6. تصمیم مالک محتوا درباره taxonomy نهایی و ترتیب نمایش.
7. browser QA واقعی در desktop، `320px` و zoom `200%`.

تا فراهم‌شدن این وابستگی‌ها، non-interactive ماندن دسته‌ها تصمیم امن و صادقانه است.

## 15. دستورکار خرد بعدی پیشنهادی

**WO-043F-1 — Categories Responsive Browser Verification**

محدودهٔ پیشنهادی:

- QA فقط برای section Categories موجود؛
- desktop، `320px`، mobile معمول و tablet؛
- اندازه‌گیری `scrollWidth <= clientWidth` و بررسی wrap/clipping؛
- تأیید نبود hover/focus/click affordance فریبنده؛
- zoom `200%`، RTL reading order و screenshot evidence؛
- بدون افزودن link، taxonomy، catalog integration یا تغییر section دیگر.
