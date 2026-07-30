# گزارش پیاده‌سازی Hero صفحه اصلی فرداد — WO-043C

> پروژه: Fardad Enterprise Platform
> شناسه دستورکار: WO-043C — Fardad Homepage Hero Visual Implementation
> تاریخ اجرا: 2026-07-23
> نتیجه نهایی: موفق با محدودیت QA بصری مرورگر
> وضعیت محتوا، رنگ‌های محلی و art direction: `provisional`
> Commit / Push: انجام نشد

## 1. شناسه و نتیجه نهایی دستورکار

WO-043C در محدوده app-owned Storefront اجرا شد. Hero موجود به یک ترکیب آرام، RTL-first، مینیمال و دارای سلسله‌مراتب روشن تبدیل شد. تنها CTA قابل مشاهده به مسیر موجود و publishable محصولات متصل است و کنترل بدون مقصد «دریافت کاتالوگ» دیگر رندر نمی‌شود.

Typecheck، lint، build، SSR smoke check، ترتیب بخش‌ها و scope نهایی موفق بودند. مرورگر تعاملی این نشست backend فعالی نداشت؛ بنابراین visual QA واقعی در viewportهای خواسته‌شده و zoom 200% مسدود ماند و در این گزارش قبول‌شده ادعا نمی‌شود.

## 2. فایل‌های بررسی‌شده و تغییرکرده

### 2.1 اسناد الزامی خوانده‌شده

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`
- `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`
- `docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md`
- `docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md`
- `docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md`

### 2.2 implementation/configuration بررسی‌شده

- `apps/storefront/app/(public)/page.tsx`
- `apps/storefront/components/composition/HomeSectionRenderer.tsx`
- `apps/storefront/components/composition/StorefrontShellRenderer.tsx`
- `apps/storefront/components/home/Hero.tsx`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/app/globals.css`
- `apps/storefront/tailwind.config.ts`
- `apps/storefront/package.json`
- `packages/ui/src/Button.tsx` فقط برای تشخیص محدودیت CTA و بدون تغییر
- `apps/storefront/public` بررسی شد و وجود ندارد؛ بنابراین asset محلی قابل استفاده‌ای در دسترس نبود.

### 2.3 allowlist اعلام‌شده و فایل‌های تغییرکرده

| فایل | نتیجه |
| --- | --- |
| `apps/storefront/components/home/Hero.tsx` | تنها فایل source تغییرکرده؛ پالایش layout، hierarchy، composition و CTA |
| `docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md` | گزارش فعالیت |

هیچ config، stylesheet، shared package یا فایل دیگری توسط WO-043C تغییر نکرد.

## 3. تصمیم‌های دقیق Hero

### 3.1 Layout

- در mobile و tablet جریان تک‌ستونه است: محتوای متنی، CTA و سپس composition تزئینی.
- از breakpoint دسکتاپ، Hero به grid دو ستونه RTL تبدیل می‌شود؛ روایت در سمت logical start و composition بصری در ستون مقابل قرار می‌گیرد.
- فاصله عمودی Hero برابر `4rem` در mobile، `5rem` در عرض میانی و `6rem` در desktop است.
- محتوا داخل `Container` موجود باقی ماند و سقف عرض Storefront تغییر نکرد.
- section از canvas روشن استفاده می‌کند و با border semantic از بخش بعدی جدا می‌شود.
- `overflow-hidden` فقط در مرز Hero اعمال شده تا عناصر تزئینی باعث horizontal page scroll نشوند.

### 3.2 Typography

- eyebrow از محتوای provisional موجود و با اندازه کوچک، وزن semibold و alignment منطقی استفاده می‌کند.
- فقط یک `<h1>` وجود دارد.
- عنوان از نقش پایه موجود `data-typography-role="display"` استفاده می‌کند؛ فونت یا scale جدیدی اضافه نشد.
- دو بخش عنوان در spanهای block قرار گرفتند تا شکست سطر کنترل‌شده اما responsive باقی بماند.
- متن توضیح با اندازه `1.125rem` و line-height `2.25rem` نمایش داده می‌شود.
- متن از system fallback مصوب WO-043B-2 استفاده می‌کند.

### 3.3 Palette

نقش‌های foundation بدون تغییر مصرف شدند:

| نقش | مقدار provisional | کاربرد |
| --- | --- | --- |
| canvas | `#F8F4EC` | زمینه Hero |
| surface | `#FFFFFF` | سطح composition |
| ink | `#081613` | عنوان و hover CTA |
| emerald | `#0E3B2E` | بخش دوم عنوان و CTA |
| muted ink | `#4B5563` | توضیح |
| muted gold | `#C2A46B` | خطوط و accent محدود |
| copper focus | `#A97142` | focus-visible |

دو رنگ app-owned و کاملاً provisional مطابق جهت تازه این دستورکار فقط برای عناصر تزئینی بدون متن استفاده شدند:

- turquoise: `#0F766E`
- crimson: `#8A2638`

این دو مقدار به theme/shared tokens منتقل نشدند، روی متن استفاده نشدند و وضعیت نهایی برند تلقی نمی‌شوند.

### 3.4 Imagery و composition

- هیچ عکس، لوگو، stock image، generated image یا asset خارجی/محلی اضافه نشد.
- چون `apps/storefront/public` وجود ندارد، Hero از یک composition هندسی انتزاعی و `aria-hidden` استفاده می‌کند.
- composition شامل سطح سفید، قوس فیروزه‌ای، جرم زمردی، accent زرشکی و خطوط/پایه طلایی محدود است.
- این composition تصویر محصول، هنرمند، متریال، provenance یا واقعیت تجاری را بازنمایی یا ادعا نمی‌کند.
- shadow نرم و منفرد است؛ carousel، parallax، autoplay، decorative animation یا motion تازه‌ای اضافه نشد.

### 3.5 CTA

- تنها CTA قابل مشاهده: «مشاهده محصولات»
- مقصد: `/products`
- CTA با `Link` واقعی پیاده‌سازی شد، نه button نمایشی.
- CTA قبلی «دریافت کاتالوگ» حذف شد، زیرا route/asset/capability عملیاتی و قابل انتشار ندارد.

## 4. تصمیم‌های provisional محتوا و دارایی

موارد زیر بدون ادعای نهایی‌بودن حفظ شدند:

1. eyebrow انگلیسی موجود: `Persian Heritage Experience`
2. عنوان موجود Hero.
3. توضیح موجود Hero.
4. label موجود CTA محصولات.
5. پالت semantic WO-043B-1.
6. turquoise `#0F766E` و crimson `#8A2638` فقط برای تزئین app-owned Hero.
7. system fallback typography.
8. composition هندسی به‌عنوان intentional no-image state.

فیلد provisional مربوط به `secondaryAction` در content contract موجود باقی مانده، اما Hero آن را رندر نمی‌کند. حذف فیلد به تغییر shared data contract نیاز داشت و خارج از scope بود.

## 5. مقصدهای قابل مشاهده Hero

| CTA | مسیر | وضعیت |
| --- | --- | --- |
| مشاهده محصولات | `/products` | route موجود؛ `catalog.products` enabled و implemented؛ publishable |

SSR واقعی صفحه اصلی دقیقاً یک CTA قابل مشاهده با `href="/products"` نشان داد.

## 6. مقصدها و UIهای عمداً حذف‌شده

- دریافت/دانلود کاتالوگ
- corporate gifts یا consultation
- gifts-by-budget
- account
- search
- article/contact/about destinations
- secondary button بدون مقصد
- carousel، slider، campaign، discount، countdown و urgency
- trust badge، testimonial، statistic و product fact
- logo، تصویر محصول، تصویر atelier یا stock/generated image

اسکن visible markup تأیید کرد که متن «دریافت کاتالوگ» رندر نمی‌شود. این رشته فقط در profile provisional موجود است و در Flight payload داخلی ممکن است حمل شود، اما UI قابل مشاهده‌ای تولید نمی‌کند.

## 7. RTL، accessibility و responsive behavior

- section دارای heading معنایی `<h1>` است و heading order تغییر نکرد.
- همه alignmentها logical هستند و layout از `dir="rtl"` موجود تبعیت می‌کند.
- composition تزئینی `aria-hidden="true"` است و وارد accessibility tree نمی‌شود.
- CTA یک link واقعی با حداقل ارتفاع `3rem` / 48px است.
- CTA در عرض کوچک `w-full` و از `sm` به بعد auto-width است.
- focus-visible از ring مسی semantic، offset چهارپیکسلی و canvas Hero استفاده می‌کند.
- رنگ سفید CTA روی زمردی همان pairing تأییدشده WO-043B-1 است.
- turquoise، crimson و gold حامل متن یا state تعاملی نیستند.
- Hero animation تازه ندارد؛ transition رنگ CTA تحت media query موجود `prefers-reduced-motion` به `0.01ms` محدود می‌شود.
- grid فقط در `lg` فعال می‌شود؛ قبل از آن هیچ `min-width` ثابت یا ستون اجباری وجود ندارد.
- panel تزئینی `w-full`, `max-w-xl` و aspect ratio محدود دارد.
- section با `overflow-hidden` از بیرون‌زدگی accentهای منفی جلوگیری می‌کند.

بررسی source و SSR با width-independent markup موفق بود، اما reflow واقعی در `320px`، mobile، tablet، desktop و zoom `200%` به‌دلیل نبود browser backend اجرا نشد.

## 8. مرزهای معماری حفظ‌شده

- Fardad-specific styling فقط در component app-owned Hero قرار گرفت.
- shared `Button` و سایر shared packages تغییر نکردند.
- content/profile/data contracts تغییر نکردند.
- `HomeSectionRenderer` و ترتیب sectionها تغییر نکردند.
- ترتیب دقیق زیر حفظ شد:

  ```text
  Hero → Features → Categories
  ```

- هیچ route، API، Prisma، Commerce/BFF، catalog contract، cart، checkout، payment، Admin، analytics، infrastructure، dependency، lockfile یا test تغییر نکرد.
- Features، Categories، product cards، campaigns، popup، footer و سایر homepage sections تغییر نکردند.
- هیچ capability فعال یا expose نشد.
- commit و push انجام نشد.

## 9. فرمان‌های validation و نتایج دقیق

### 9.1 Typecheck محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck D:\fardad\fardad\apps\storefront
> tsc --noEmit
```

Exit code: `0`.

### 9.2 Lint محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint D:\fardad\fardad\apps\storefront
> eslint .
```

Exit code: `0`.

### 9.3 Build محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

- Exit code: `0`
- Next.js: `15.5.20`
- compilation: موفق در `3.5s`
- static page generation: `4/4`
- routeها: `/`، `/_not-found`، `/cart`، `/products`، `/products/[slug]` و `/products/category/[slug]`
- اندازه route اصلی: `164 B`
- First Load JS مسیر اصلی: `105 kB`

هشدار غیرمسدودکننده baseline:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

### 9.4 Dev/SSR smoke check

سرور موجود با فرمان repository زیر فعال بود و پس از تغییر hot-compile شد:

```powershell
corepack pnpm --filter @fardad/storefront dev
```

نتایج:

```text
GET / 200
HOME_STATUS=200
HTML_DIR_RTL=True
HERO_H1_PRESENT=True
PRODUCTS_CTA_PRESENT=True
VISIBLE_PRODUCTS_CTA_COUNT=1
VISIBLE_CATALOG_CTA_ABSENT=True
ORDER_HERO_FEATURES_CATEGORIES=True
```

visible links صفحه اصلی:

```text
#main-content  پرش به محتوای اصلی
/              فرداد
/              خانه
/products      محصولات
/cart          سبد خرید
/products      مشاهده محصولات
```

مقصدهای unavailable شامل corporate gifts، blog/articles، contact، about و account در خروجی دیده نشدند.

### 9.5 QA مرورگر

انتخاب browser برای URL محلی نتیجه داد:

```text
No browser is available
```

پس از workflow رسمی troubleshooting:

```text
available browsers: []
```

بنابراین screenshot، computed overflow، zoom و viewport visual QA اجرا نشدند. ابزار browser مستقل جایگزین استفاده نشد.

## 10. نتیجه `git diff --check`

```text
PASSED — exit code 0; no output
```

## 11. خروجی دقیق `git status --short`

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

تنها تغییر source متعلق به WO-043C فایل `Hero.tsx` است و تنها فایل جدید این دستورکار گزارش WO-043C است. سایر موارد baseline تأییدشده WO-043A تا WO-043B-4 هستند.

## 12. ورودی‌های نهایی مورد نیاز از فرداد

1. Hero photography دارای حقوق استفاده و crop/focal point جداگانه desktop/mobile.
2. alt-text ownership و تصمیم درباره decorative/meaningful بودن media نهایی.
3. palette نهایی و تصمیم رسمی درباره turquoise/crimson در کنار foundation موجود.
4. فونت فارسی/لاتین نهایی دارای مجوز و آزمون rendering.
5. eyebrow، headline، description و CTA copy نهایی.
6. logo/wordmark و قواعد استفاده.
7. campaign/collection destination فقط در صورت وجود route/data/capability قابل انتشار.
8. تصمیم نهایی درباره catalogue و corporate gifting پس از عملیاتی‌شدن workflow.

## 13. ریسک‌ها یا blockerها

- نبود browser backend مانع تأیید بصری 320px، mobile/tablet/desktop، zoom 200%، focus-visible و horizontal overflow شد.
- composition فعلی intentional no-image state است و جایگزین product photography نهایی نیست؛ بنابراین product-led بودن نهایی فقط با asset معتبر کامل می‌شود.
- turquoise و crimson محلی کاملاً provisional هستند و باید همراه palette نهایی تصویب یا حذف شوند.
- محتوای Hero همچنان provisional و برگرفته از profile موجود است.
- route `/products` publishable است، اما در محیط این نشست public catalog upstream در دسترس نبود و صفحه Products می‌تواند error foundation را نمایش دهد؛ این موضوع خارج از scope Hero است.
- هشدار baseline مربوط به Next ESLint plugin باقی است.
- همه تغییرات WO-043A تا WO-043C هنوز commit نشده‌اند.

## 14. دستورکار خرد بعدی پیشنهادی

**WO-043C-1 — Fardad Hero Responsive Visual Verification**

محدوده پیشنهادی:

- QA مرورگری فقط برای Hero در viewportهای `320px`، typical mobile، tablet و desktop؛
- zoom `200%`، reflow، horizontal overflow، focus-visible و touch target؛
- بررسی RTL composition و line wrapping فارسی؛
- بررسی `prefers-reduced-motion`;
- screenshot evidence برای intentional no-image state؛
- بدون تغییر copy، route، capability، asset، shared package یا homepage order مگر پس از defect مستقیم و قابل‌بازتولید.
