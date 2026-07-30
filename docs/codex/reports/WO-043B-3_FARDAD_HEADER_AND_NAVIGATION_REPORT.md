# گزارش پیاده‌سازی WO-043B-3 — هدر و ناوبری دسکتاپ/موبایل فرداد

> پروژه: Fardad Enterprise Platform
> شناسه دستورکار: WO-043B-3 — Fardad Header, Desktop Navigation, and Mobile Navigation
> تاریخ اجرا: 2026-07-23
> نتیجه: موفق — پوسته ناوبری app-owned فرداد در محدوده مصوب پیاده‌سازی شد
> وضعیت دارایی‌ها و محتوای برند: `provisional`
> Commit / Push: انجام نشد

## 1. شناسه و نتیجه دستورکار

WO-043B-3 با موفقیت و فقط در لایه app-owned پوسته Storefront اجرا شد. هدر دسکتاپ بدون تغییر معماری config-driven پالایش شد و ناوبری موبایل به drawer دسترس‌پذیر و RTL-safe ارتقا یافت. هیچ مسیر، قابلیت، محتوا، dependency یا دارایی جدیدی ایجاد نشد.

## 2. فایل‌های بررسی‌شده و تغییرکرده

### 2.1 اسناد مبنا که کامل خوانده شدند

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`
- `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`
- `docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md`

### 2.2 فایل‌ها و مرزهای معماری بررسی‌شده

- `apps/storefront/components/layout/StorefrontHeader.tsx`
- `apps/storefront/components/layout/MobileNavigation.tsx`
- `apps/storefront/components/layout/StorefrontShellRenderer.tsx`
- `apps/storefront/src/config/brands/fardad/navigation.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `apps/storefront/src/lib/resolve-navigation.ts`
- `apps/storefront/app/layout.tsx`
- `apps/storefront/app/page.tsx`
- routeهای موجود زیر `apps/storefront/app`
- `packages/ui/src/SiteHeader.tsx` و `packages/ui/src/Navigation.tsx` فقط برای تشخیص مرز مالکیت خوانده شدند و تغییر نکردند.

### 2.3 allowlist اعلام‌شده پیش از ویرایش و فایل‌های تغییرکرده

| فایل | تغییر |
| --- | --- |
| `apps/storefront/components/layout/StorefrontHeader.tsx` | پالایش بصری محدود هدر و ناوبری دسکتاپ با نقش‌های semantic موجود |
| `apps/storefront/components/layout/MobileNavigation.tsx` | drawer موبایل RTL-safe با مدیریت فوکوس، Escape، scroll lock و پشتیبانی config-driven از nesting |
| `docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md` | همین گزارش |

فایل‌های تغییرکرده WO-043A، WO-043B-1 و WO-043B-2 به‌عنوان baseline مصوب حفظ شدند و در این دستورکار بازنویسی یا revert نشدند.

## 3. تصمیم‌های دقیق هدر، ناوبری دسکتاپ و ناوبری موبایل

### 3.1 هدر

- sticky behavior موجود در `SiteHeader` حفظ شد؛ sticky جدید یا رفتار اسکرول تازه‌ای ساخته نشد.
- یک جداکننده سایه‌ای بسیار محدود و مبتنی بر رنگ خنثی به هدر app-owned افزوده شد.
- نام موقت متنی برند حفظ شد؛ logo یا asset تازه‌ای ساخته نشد.
- سطح قابل تعامل لینک برند به حداقل `44px` افزایش یافت.
- رنگ‌ها، radius و focus ring فقط از semantic CSS variables بنیاد WO-043B-1 استفاده می‌کنند.

### 3.2 ناوبری دسکتاپ

- منبع ناوبری همان `fardadNavigation` و خروجی capability-filtered تابع `resolveNavigation` باقی ماند.
- چیدمان راست‌به‌چپ، فاصله لینک‌ها، سطح لمس/کلیک حداقل `44px` و hover/focus پالایش شد.
- ناوبری دسکتاپ فعلی flat است، زیرا هیچ دسته یا زیرمسیر publishable در تنظیمات فعلی وجود ندارد؛ بنابراین dropdown یا تعامل مصنوعی ساخته نشد.
- کنترل Escape، باز/بسته‌شدن و مدیریت فوکوس برای دسکتاپ قابل اعمال نیست، چون هیچ منوی تعاملی دسکتاپ در خروجی فعلی رندر نمی‌شود.

### 3.3 ناوبری موبایل

- دکمه بازکردن واضح با label قابل‌دسترسی، `aria-expanded`، `aria-controls` و `aria-haspopup="dialog"` فراهم شد.
- drawer از سمت منطقی `end` باز می‌شود و از propertyهای منطقی `end`، `border-s` و `ps` برای RTL استفاده می‌کند.
- dialog دارای `aria-modal` و عنوان مرتبط است.
- پس از بازشدن، فوکوس به دکمه بستن منتقل می‌شود.
- `Escape` drawer را می‌بندد و فوکوس را به trigger بازمی‌گرداند.
- `Tab` و `Shift+Tab` در عناصر قابل فوکوس drawer محصور می‌شوند.
- کلیک overlay یا دکمه بستن، drawer را می‌بندد و فوکوس trigger را بازیابی می‌کند.
- هنگام بازبودن drawer، scroll بدنه قفل و هنگام cleanup دقیقاً به مقدار قبلی بازگردانده می‌شود.
- خود panel پیمایش عمودی و `overscroll-contain` دارد.
- لینک‌ها حداقل ارتفاع `44px`، focus-visible روشن و hover مبتنی بر semantic roles دارند.
- renderer بازگشتی فقط `children` موجود در تنظیمات فیلترشده را نمایش می‌دهد؛ مسیر یا دسته‌ای hard-code نشد.
- transition رنگ موجود تحت قاعده سراسری `prefers-reduced-motion` از WO-043B-2 قرار دارد؛ animation تزئینی افزوده نشد.

## 4. تصمیم‌های RTL، کیبورد، فوکوس، لمس و دسترس‌پذیری

- ترتیب DOM تغییر بصری داده نشد و جهت سند همچنان از profile با `dir="rtl"` می‌آید.
- برای سمت‌ها و nesting از logical properties استفاده شد.
- هدف‌های لمسی اصلی، لینک‌ها و کنترل بستن حداقل `44×44px` هستند.
- focus-visible با نقش semantic `--ui-color-focus` و ring offset حفظ شد.
- dialog موبایل عنوان‌گذاری‌شده، modal و دارای focus containment است.
- بازگشت فوکوس در Escape، overlay و دکمه بستن پیاده‌سازی شد.
- ناوبری پس از انتخاب لینک بسته می‌شود و تغییر route رفتار طبیعی فوکوس صفحه مقصد را حفظ می‌کند.
- disabled state تازه‌ای ساخته نشد؛ stateهای contrast-safe بنیاد WO-043B-1 دست‌نخورده ماندند.

## 5. مقصدهای قابل مشاهده و دلیل انتشار

| عنوان | مسیر | دلیل قابل‌نمایش‌بودن |
| --- | --- | --- |
| خانه | `/` | route اصلی موجود است و capability لازم ندارد |
| محصولات | `/products` | route موجود و `catalog.products` هم entitled/enabled و هم implemented است |
| سبد خرید | `/cart` | route موجود و `catalog.shop` هم entitled/enabled و هم implemented است |

در پاسخ واقعی سرور محلی مسیر `/` نیز فقط همین سه عنوان دیده شدند.

## 6. مقصدها و قابلیت‌های عمداً حذف‌شده

- هدایای سازمانی `/corporate-gifts`: قابلیت `corporate.sales` در profile فعلی قابل انتشار نیست و route عمومی موجود نیست.
- درباره ما `/about`: capability ممکن است enabled باشد، اما implemented نیست و route عمومی موجود نیست.
- مقالات `/blog`: capability ممکن است enabled باشد، اما implemented نیست و route عمومی موجود نیست.
- تماس با ما `/contact`: capability ممکن است enabled باشد، اما implemented نیست و route عمومی موجود نیست.
- هدیه بر اساس بودجه، حساب کاربری و دسته‌های nested: مقصد publishable و پیکربندی تأییدشده فعلی ندارند.
- Search: هیچ input، icon، placeholder، route یا رفتار نمایشی برای جست‌وجو افزوده نشد.
- هیچ لینک مرده یا کنترل نمایشیِ بدون رفتار معتبر رندر نشد.

## 7. تأیید مرزهای معماری و exclusions

- فقط دو component موجود و app-owned زیر `apps/storefront/components/layout` تغییر کردند.
- هیچ فایل shared در `packages/ui`, `packages/types`, `packages/config` یا package دیگری تغییر نکرد.
- هویت، رنگ، copy یا فرض برند در shared package قرار نگرفت.
- config ناوبری، capability contract و feature profile تغییر نکردند.
- هیچ route، API، Prisma، Commerce/BFF، Cart logic، Checkout، Payment، Analytics، Infrastructure، dependency، lockfile یا test تغییر نکرد.
- Header shell موجود حفظ شد؛ Hero، Features، Categories، Footer، Card، Popup، Campaign و محتوای homepage تغییر نکردند.
- ترتیب homepage دقیقاً حفظ شد:

  ```text
  Hero → Features → Categories
  ```

- هیچ logo، font، asset خارجی، اطلاعات تماس/حقوقی، claim، trust badge، آمار، تخفیف یا testimonial ساخته نشد.

## 8. فرمان‌های validation و نتایج دقیق

### 8.1 Typecheck محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck D:\fardad\fardad\apps\storefront
> tsc --noEmit
```

Exit code: `0` — موفق، بدون خطا.

### 8.2 Lint محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint D:\fardad\fardad\apps\storefront
> eslint .
```

Exit code: `0` — موفق، بدون خطا.

### 8.3 Build محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

- Exit code: `0`
- Next.js: `15.5.20`
- production compilation: موفق در `2.1s`
- static page generation: `4/4`
- routeهای build: `/`، `/_not-found`، `/cart`، `/products`، `/products/[slug]` و `/products/category/[slug]`

هشدار غیرمسدودکننده baseline:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

### 8.4 smoke check سرور محلی و مقصدهای منتشرشده

Storefront با `corepack pnpm --filter @fardad/storefront dev` روی پورت `3000` اجرا شد و درخواست واقعی به `/` نتیجه زیر را داد:

```text
StatusCode   : 200
HasHome      : True
HasProducts  : True
HasCart      : True
HasCorporate : False
HasArticles  : False
HasContact   : False
```

فرایند dev پس از آزمون متوقف شد. مرورگر تعاملی این نشست در دسترس نبود؛ بنابراین اجرای دستی click/Tab/Escape و بررسی بصری device-level انجام نشد. منطق focus trap، Escape، بازگشت فوکوس، scroll lock، نقش dialog و logical RTL در source/diff بررسی شد.

## 9. نتیجه `git diff --check`

```text
PASSED — exit code 0; no output
```

## 10. خروجی `git status --short`

```text
 M apps/storefront/app/globals.css
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md
?? docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

تفسیر scope:

- دو فایل component و گزارش WO-043B-3 تنها تغییرات این دستورکار هستند.
- `globals.css` و سه فایل profile/theme از baseline مصوب WO-043B-1/2 پیش از شروع تغییر داشتند.
- اسناد WO-043A و گزارش‌های WO-043B-1/2 نیز پیش از شروع uncommitted/untracked بودند و حفظ شدند.
- diff نهایی بررسی شد و همه تغییرات WO-043B-3 در allowlist اعلام‌شده قرار دارند.

## 11. دارایی‌ها و تصمیم‌های provisional باقی‌مانده از فرداد

1. logo و نسخه‌های مجاز آن برای desktop/mobile.
2. فونت فارسی/لاتین نهایی دارای مجوز و weightهای تأییدشده.
3. taxonomy و دسته‌های nested نهایی همراه با route و capability قابل انتشار.
4. تصمیم نهایی درباره وجود و مقصد حساب کاربری.
5. تصمیم و قرارداد واقعی جست‌وجو، فقط پس از وجود route/API/behavior معتبر.
6. محتوا و routeهای تأییدشده درباره ما، مقالات، تماس و هدایای سازمانی.
7. تأیید نهایی palette و contrast روی محتوای واقعی.

## 12. ریسک‌ها یا blockerها

- blocker کدنویسی در محدوده این دستورکار وجود ندارد.
- نبود مرورگر تعاملی در نشست مانع QA دستی click/keyboard/device شد؛ این مورد مانع typecheck/lint/build یا smoke check سرور نبود.
- focus containment با query selector داخلی پیاده‌سازی شده است؛ افزودن نوع جدیدی از کنترل focusable در آینده باید در regression QA پوشش داده شود.
- taxonomy فعلی nested publishable ندارد؛ renderer آماده است، اما رفتار واقعی nesting فقط پس از تصویب route/config معتبر باید آزموده شود.
- نام متنی برند و system font همچنان provisional هستند.
- هشدار baseline مربوط به Next ESLint plugin باقی است.
- فایل‌های WO-043A و WO-043B-1/2/3 همچنان commit نشده‌اند.

## 13. دستورکار خرد بعدی پیشنهادی

**WO-043B-4 — Fardad Header and Navigation Accessibility Verification**

محدوده پیشنهادی:

- QA دستی در viewportهای 320px، mobile، tablet و desktop؛
- آزمون کامل Tab/Shift+Tab/Escape، بازگشت فوکوس، scroll lock و screen reader labels؛
- بررسی zoom 200%، reflow 400%، forced-colors و prefers-reduced-motion؛
- بررسی contrast و tap target با محتوای فعلی؛
- گزارش read-only و فقط اصلاح regression مستقیم در allowlist مستقل و از پیش تأییدشده؛
- بدون افزودن route، capability، search، محتوا، asset، dependency یا shared-package change.
