# گزارش بخش ارزش پیشنهادی صفحه اصلی فرداد — WO-043E

> پروژه: Fardad Enterprise Platform  
> دستورکار: WO-043E — Fardad Homepage Value Proposition Section  
> تاریخ اجرا: 2026-07-23  
> نتیجه: پیاده‌سازی و validation کد موفق؛ QA تعاملی viewport به‌دلیل نبود browser backend مسدود  
> Commit / Push: انجام نشد

## 1. خلاصه نتیجه

بخش موجود `Features` در composition تأییدشدهٔ صفحه اصلی، بدون اضافه‌کردن section موازی، به یک بخش ارزش پیشنهادی آرام، RTL-first و mobile-first ارتقا یافت. جایگاه موجود آن دقیقاً پس از Hero و پیش از Categories حفظ شد:

```text
Hero → Features / Value Proposition → Categories
```

بخش نهایی یک heading فارسی، subtitle صریحاً پیشنهادی و سه آیتم کنترل‌شده دارد. هیچ CTA، لینک، محصول، قیمت، تخفیف، عدد تجاری، testimonial، آمار، تضمین، certification، نام مشتری، delivery claim، trust badge، asset خارجی یا قابلیت عملیاتی جدیدی اضافه نشده است.

## 2. وضعیت اولیه Git و baseline محافظت‌شده

فرمان پیش از هر ویرایش:

```text
git status --short
```

خروجی دقیق اولیه:

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

همهٔ موارد بالا baseline محافظت‌شده تلقی شدند. هیچ فایل موجود revert، overwrite، commit یا push نشد.

## 3. فایل‌های بررسی‌شده

اسناد الزامی:

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md`
- `docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md`

composition، content و conventions مستقیم:

- `apps/storefront/app/(public)/page.tsx`
- `apps/storefront/components/composition/HomeSectionRenderer.tsx`
- `apps/storefront/components/home/Hero.tsx`
- `apps/storefront/components/home/Features.tsx`
- `apps/storefront/components/home/Categories.tsx`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/app/globals.css`
- `packages/types/src/content.ts`
- `packages/types/src/experience.ts`
- `packages/types/src/theme.ts`
- `packages/ui/src/Card.tsx`
- `packages/ui/src/Container.tsx`
- `packages/ui/src/Heading.tsx`
- `packages/ui/src/Section.tsx`
- `apps/storefront/package.json`

## 4. composition، insertion point و رویکرد کمینه

`apps/storefront/app/(public)/page.tsx` فقط profile را به `HomeSectionRenderer` می‌دهد. renderer بر اساس `profile.experience.home.sections` sectionها را render می‌کند. مقدار واقعی Fardad پیش از WO-043E از قبل چنین بود:

```text
sections: ["hero", "features", "categories"]
```

پس insertion point مورد نیاز از قبل وجود داشت: `Features` دقیقاً عنصر بعد از Hero است. اضافه‌کردن component/section تازه باعث تکرار Features و نقض «دقیقاً یک بخش» می‌شد.

رویکرد انتخاب‌شده:

1. حفظ کامل route، renderer و ترتیب configuration.
2. ارتقای همان component محلی `Features`.
3. جایگزینی copy features فقط در config app-owned فرداد.
4. استفاده از `Container` و `Section` موجود و tokenهای semantic فعلی.
5. عدم تغییر Hero، Categories، globals، theme، shared packages یا هر route دیگر.

## 5. allowlist و فایل‌های تغییرکرده

allowlist دقیق پیش از ویرایش:

1. `apps/storefront/components/home/Features.tsx`
2. `apps/storefront/src/config/brands/fardad/content.fa.ts`
3. `docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md`

فقط همین سه فایل توسط WO-043E تغییر کردند:

- `Features.tsx` — presentation و semantics بخش ارزش پیشنهادی.
- `content.fa.ts` — copy فارسی app-owned همین بخش.
- گزارش حاضر — شواهد و validation.

هیچ فایل خارج از allowlist توسط این دستورکار تغییر نکرد.

## 6. copy نهایی فارسی و کنترل ادعا

### عنوان

```text
هدیه، با نگاهی سنجیده
```

### زیرعنوان

```text
سه جهت‌گیری پیشنهادی برای تجربه‌ای متناسب، ایرانی و شایسته در فرداد
```

### آیتم اول

```text
متناسب با شأن مخاطب
توجه به موقعیت، نوع ارتباط و لحن هدیه، برای نزدیک‌شدن به انتخابی سنجیده و محترمانه.
```

### آیتم دوم

```text
هنر ایرانی، ارائه‌ای شایسته
ترکیب روایت هنر ایرانی با چیدمانی آرام و امروزی، با تمرکز بر فرم، بافت و جزئیات.
```

### آیتم سوم

```text
نگاه به شخصی‌سازی سازمانی
مسیری پیشنهادی برای هماهنگ‌کردن شیوه ارائه هدیه با مناسبت و هویت سازمانی.
```

کنترل ادعا:

- واژه‌های «جهت‌گیری پیشنهادی»، «برای نزدیک‌شدن» و «مسیری پیشنهادی» روشن می‌کنند که متن، جهت طراحی/تجربه است نه اعلام capability عملیاتی.
- از «امکان شخصی‌سازی» یا فعل قطعیِ ارائه خدمت استفاده نشد.
- هیچ quantity، SLA، زمان تحویل، تضمین، certification، customer، product fact یا claim قابل‌سنجش درج نشد.
- «سه» فقط تعداد آیتم‌های همین section است و آمار کسب‌وکار نیست.
- بخش هیچ لینک، CTA یا مقصدی ندارد؛ در نتیجه dead link تازه ایجاد نمی‌کند.

## 7. تصمیم‌های بصری و luxury-heritage

- زمینه از token زمردی `--ui-color-primary` استفاده می‌کند و یک transition آرام میان Hero روشن و Categories ایجاد می‌کند.
- عنوان و subtitle از `--ui-color-primary-contrast` استفاده می‌کنند.
- خط تزئینی و border کارت‌ها فقط از gold token یعنی `--ui-color-secondary` استفاده می‌کنند.
- سطح کارت‌ها `--ui-color-surface`، متن اصلی `--ui-color-text` و متن توضیحی `--ui-color-muted-text` است.
- radius فقط از `--ui-radius-medium` می‌آید.
- هیچ color literal، image، icon package، shadow اغراق‌آمیز، hover movement یا animation تازه‌ای اضافه نشد.
- کارت‌ها تعاملی نیستند و ظاهر button/link یا hover affordance ندارند.

## 8. RTL، responsive، accessibility و 320px

### RTL

- سند واقعی صفحه اصلی `dir="rtl"` دارد.
- متن کارت‌ها `text-start` است، پس جهت logical RTL را دنبال می‌کند.
- DOM order در همه breakpointها ثابت است و visual reordering وجود ندارد.
- تمام copy فارسی در config app-owned باقی ماند.

### Responsive

- `Container` موجود در mobile دارای `w-full` و gutter برابر `px-4` است.
- فهرست در base/mobile تک‌ستونه است و فقط از `md` به سه ستون تبدیل می‌شود.
- هر `li` دارای `min-w-0` است.
- کارت‌ها fixed width، min-width، absolute positioning یا media ندارند.
- padding کارت در mobile برابر `p-6` و از `sm` برابر `p-8` است.
- متن‌ها wrap طبیعی دارند و truncation اعمال نشده است.
- تغییر جدید منشأ horizontal overflow یا clipping شناخته‌شده‌ای اضافه نمی‌کند.

### Accessibility

- section فقط یک `h2` دارد.
- سه ارزش در یک `ul` با سه `li` و articleهای مستقل قرار دارند.
- عنوان هر آیتم `h3` است و hierarchy از `h1` Hero به `h2` و سپس `h3` حفظ می‌شود.
- خطوط و نقطه‌های تزئینی `aria-hidden="true"` هستند.
- هیچ کنترل تعاملی، tabindex یا focus target تازه‌ای وجود ندارد؛ بنابراین keyboard trap یا focus order تازه ایجاد نشده است.
- متن داخل تصویر نیست و همهٔ copy قابل‌انتخاب و zoomپذیر است.

### وضعیت QA مرورگر

workflow رسمی Browser برای viewportهای desktop و `320px` اجرا شد، اما runtime این نشست پاسخ داد:

```text
No browser is available
```

در بررسی قبلی همین runtime نیز فهرست backendها خالی بود:

```text
available browsers: []
```

بنابراین اندازه‌گیری واقعی `scrollWidth`، clipping و screenshot در `320px` یا desktop قابل اجرا نبود و در این گزارش PASS مرورگری ادعا نمی‌شود. شواهد source-level بالا، ریسک overflow را کنترل می‌کنند؛ پذیرش نهایی viewport واقعی به browser backend نیاز دارد.

## 9. راستی‌آزمایی صفحه اصلی، CTA و `/products`

پس از پیاده‌سازی، SSR/HTTP dev server نتایج زیر را داشت:

```text
HomeStatus            : 200
DocumentRtl           : True
HeroBeforeValue       : True
ValueBeforeCategories : True
ValueItemOne          : True
ValueItemTwo          : True
ValueItemThree        : True
HeroCtaHref           : /products
ProductsStatus        : 200
ProductsEmptyState    : True
ProductsErrorState    : False
```

نتیجه:

- `/` با HTTP `200` بارگذاری شد.
- ترتیب واقعی copy در HTML، Hero سپس value proposition و سپس Categories بود.
- هر سه عنوان value proposition در پاسخ وجود داشتند.
- CTA موجود Hero همچنان `href="/products"` داشت.
- `/products` با HTTP `200` و empty state صادقانهٔ WO-043D پاسخ داد.
- error state محصولات نمایش داده نشد.
- `apps/storefront/app/(public)/products/page.tsx` در WO-043E تغییر نکرد.

SSR ممکن است متن را در payloadهای Next تکرار کند؛ یکتایی section از source/config تأیید شد: یک `features` در array، یک case renderer و یک `Section` در `Features.tsx`.

## 10. validation و نتایج دقیق

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

برای جلوگیری از collision شناخته‌شدهٔ dev/build روی `.next`، dev server پیش از build به‌صورت کنترل‌شده متوقف و بلافاصله پس از build روی پورت `3000` دوباره اجرا شد.

```text
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

```text
Next.js 15.5.20
Compiled successfully in 3.9s
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

## 11. وضعیت نهایی Git

فرمان:

```text
git status --short
```

خروجی دقیق نهایی:

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

مقایسهٔ وضعیت اولیه و نهایی نشان می‌دهد تنها `Features.tsx`، `content.fa.ts` و گزارش WO-043E به baseline افزوده شدند؛ هر سه داخل allowlist هستند.

## 12. وابستگی‌های باقی‌ماندهٔ طراحی و محتوا

1. تصویب نهایی heading، subtitle و سه متن توسط مالک محتوا.
2. تعیین evidence/owner/review date اگر در آینده هر آیتم از «جهت‌گیری پیشنهادی» به service/trust fact تبدیل شود.
3. تصویب نهایی palette و Persian typography/font دارای مجوز.
4. QA مرورگری desktop، `320px`، zoom `200%`، focus/reflow و screenshot.
5. هر قابلیت واقعی شخصی‌سازی سازمانی نیازمند work order، route، workflow، مالک عملیات و copy مستقل است؛ این section آن را فعال نمی‌کند.

## 13. دستورکار خرد بعدی پیشنهادی

**WO-043E-1 — Value Proposition Responsive Browser Verification**

محدودهٔ پیشنهادی:

- QA فقط برای Hero → Value Proposition → Categories؛
- viewportهای `320px`، mobile معمول، tablet و desktop؛
- اندازه‌گیری `scrollWidth <= clientWidth` و بررسی clipping/wrapping؛
- zoom `200%`، RTL reading order و contrast بصری؛
- screenshot evidence و keyboard smoke check؛
- بدون تغییر copy، Hero، Categories، routeها یا section دیگر مگر پس از defect مستقیم و قابل‌بازتولید.
