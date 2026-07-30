# گزارش پیاده‌سازی WO-043B-2 — تایپوگرافی RTL و ریتم پایه فرداد

> پروژه: Fardad Enterprise Platform  
> شناسه دستورکار: WO-043B-2 — Fardad RTL Typography and Base Rhythm  
> تاریخ اجرا: 2026-07-23  
> نتیجه: موفق — بنیان تایپوگرافی RTL و ریتم پایه به‌صورت محدود و app-owned پیاده‌سازی شد  
> وضعیت تایپوگرافی: `provisional` و مبتنی بر system fallback  
> Commit / Push: انجام نشد

## 1. نتیجه دستورکار

WO-043B-2 با موفقیت و بدون عبور از محدوده app-owned Storefront اجرا شد. یک scale تایپوگرافی RTL، line-heightهای مناسب خواندن فارسی، وزن‌های محدود، ریتم چهارپیکسلی، reading measure، gutterهای responsive، رفتار فرم‌های RTL و reduced-motion در stylesheet سراسری خود Storefront تعریف شد.

هیچ font dependency، فونت خارجی، asset، component، route یا بخش جدیدی ایجاد نشد. این نتیجه نهایی تلقی نمی‌شود و برای جایگزینی بعدی با فونت فارسی دارای مجوز آماده باقی مانده است.

## 2. فایل‌های بررسی‌شده و تغییرکرده

### 2.1 اسناد مبنا که کامل خوانده شدند

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`
- `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`

### 2.2 فایل‌های Storefront و معماری بررسی‌شده

- `apps/storefront/app/globals.css`
- `apps/storefront/app/layout.tsx`
- `apps/storefront/tailwind.config.ts`
- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/src/themes/theme-preset-registry.ts`
- `apps/storefront/src/config/brands/fardad/brand-profile.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `apps/storefront/src/lib/theme-css-variables.ts`
- `packages/ui/src/Container.tsx` — فقط خوانده شد
- `packages/ui/src/Section.tsx` — فقط خوانده شد
- `packages/ui/src/Button.tsx` — فقط خوانده شد
- `packages/ui/src/Heading.tsx` — فقط خوانده شد
- componentهای موجود Storefront برای بررسی کلاس‌های `font-*`، `leading-*`، `text-*`، RTL و motion — فقط خوانده شدند

### 2.3 allowlist نهایی و فایل‌های تغییرکرده توسط WO-043B-2

| فایل | تغییر |
| --- | --- |
| `apps/storefront/app/globals.css` | افزودن scale تایپوگرافی provisional، line-height/weight/letter-spacing، ریتم فاصله، reading measure، gutter responsive، قواعد RTL فرم و reduced-motion |
| `docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md` | ثبت تصمیم‌ها، validation، محدوده و ریسک‌ها |

فایل‌های زیر پیش از شروع WO-043B-2 در working tree تغییر داشتند و متعلق به WO-043B-1 هستند؛ در این دستورکار ویرایش نشدند:

- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`

دو سند WO-043A نیز پیش از pre-check این دستورکار untracked بودند و تغییر نکردند.

## 3. سلسله‌مراتب دقیق تایپوگرافی و ریتم پایه

### 3.1 خانواده فونت

- Body: همان نقش typed موجود `system-sans`
- Display: همان نقش typed موجود `system-sans`
- fallback واقعی موجود:

  ```text
  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
  ```

- هیچ `@font-face`، `next/font`، Google Fonts، CDN، فایل `woff/woff2/ttf/otf` یا نام فونت فارسی خارجی اضافه نشد.

### 3.2 scale تایپوگرافی provisional

| نقش | اندازه | Line height | Weight |
| --- | --- | --- | --- |
| Display / Hero foundation | `clamp(2.5rem, 1.5rem + 3.5vw, 5.5rem)` | `1.2` | `700` |
| H1 | `clamp(2rem, 1.5rem + 2vw, 3.5rem)` | `1.3` | `700` |
| H2 | `clamp(1.625rem, 1.25rem + 1.5vw, 2.5rem)` | `1.4` | `700` |
| H3 | `clamp(1.25rem, 1.125rem + 0.75vw, 1.625rem)` | `1.5` | `700` |
| Body | `1rem` | `1.9` | `400` |
| Small / Meta | `0.875rem` | `1.7` | inherited/regular |
| Button / Label | `0.9375rem` | `1.6` | `600` |

نقش Display از طریق `[data-typography-role="display"]` در foundation در دسترس است، اما در این دستورکار به Hero یا component موجودی متصل نشد؛ تغییر Hero صراحتاً خارج از محدوده بود.

### 3.3 قواعد خوانایی فارسی

- `letter-spacing: normal` برای جلوگیری از spacing مصنوعی حروف فارسی.
- headingها از display role system fallback استفاده می‌کنند.
- `text-wrap: balance` برای headingهای پایه و `text-wrap: pretty` برای paragraphهای پایه تعریف شد.
- reading measure برابر `70ch` برای paragraphهای فاقد محدودیت صریح component تعریف شد.
- متن Body دارای `line-height: 1.9` است.
- headingها و paragraphها با propertyهای منطقی مانند `margin-block` و `max-inline-size` کنترل می‌شوند.
- فاصله heading تا paragraph بعدی `1rem` است.
- فاصله paragraph/list تا H2 یا H3 بعدی `2rem` است.
- utility classهای موجود componentها به‌دلیل specificity خود همچنان قادرند موارد محلی مصوب را override کنند؛ هیچ redesign سراسری اجباری نشده است.

### 3.4 scale فاصله

ریتم پایه چهارپیکسلی:

```text
4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px
```

معادل CSS variables:

```text
--ui-space-1: 0.25rem
--ui-space-2: 0.5rem
--ui-space-3: 0.75rem
--ui-space-4: 1rem
--ui-space-6: 1.5rem
--ui-space-8: 2rem
--ui-space-12: 3rem
--ui-space-16: 4rem
--ui-space-20: 5rem
--ui-space-24: 6rem
--ui-space-32: 8rem
```

### 3.5 container، gutter و section rhythm

| breakpoint | Gutter پایه |
| --- | --- |
| Mobile، کمتر از `40rem` | `1rem` / 16px |
| Tablet، از `40rem` | `1.5rem` / 24px |
| Desktop، از `64rem` | `2rem` / 32px |

- `--ui-section-block-space` روی Mobile برابر `4rem` / 64px و از Desktop برابر `6rem` / 96px است.
- این مقادیر با رفتار موجود `Container` (`px-4 sm:px-6 lg:px-8`) و `Section` (`py-16 lg:py-24`) همسو هستند.
- `contentMaxWidth` موجود برابر `90rem` حفظ شد.
- هیچ shared `Container` یا `Section` تغییر نکرد و هیچ layout/component بازطراحی نشد.

## 4. تصمیم‌های RTL و دسترس‌پذیری

### 4.1 جهت و alignment

- Root Layout موجود همچنان `lang` و `dir` را از Fardad profile دریافت می‌کند.
- Fardad Brand Profile همچنان `direction: "rtl"` دارد.
- Body از `text-align: start` استفاده می‌کند؛ بنابراین alignment وابسته به جهت سند است، نه `left/right`.
- `button`, `input`, `textarea` و `select` از `direction: inherit` و `text-align: start` استفاده می‌کنند.
- spacingهای جدید با `margin-block`, `max-inline-size` و propertyهای منطقی تعریف شدند.
- هیچ visual reordering یا تغییر DOM order انجام نشد.

### 4.2 فرم‌ها و متن تعاملی

- اندازه پایه input/select/textarea برابر `1rem` است تا خوانایی موبایل حفظ و zoom ناخواسته مرورگر کاهش یابد.
- line-height کنترل‌ها و labelها برابر `1.6` است.
- Button/Label وزن `600` دارند؛ وزن 900 یا spacing مصنوعی جدیدی اعمال نشد.
- Placeholder از `mutedText` موجود استفاده می‌کند و opacity آن `1` است تا کنتراست آن قابل پیش‌بینی بماند.
- Disabled state کنتراست‌امن WO-043B-1 بدون تغییر حفظ شد.
- Focus color و تمام مقادیر semantic visual WO-043B-1 بدون تغییر باقی ماندند.

### 4.3 Reduced motion

در `prefers-reduced-motion: reduce`:

- `scroll-behavior` از smooth به `auto` تغییر می‌کند.
- animation فقط یک iteration بسیار کوتاه دارد.
- transition duration به `0.01ms` و delay به صفر محدود می‌شود.
- هیچ animation تزئینی جدیدی اضافه نشد.

این قاعده فقط حرکت‌های موجود را برای کاربرانی که reduced motion درخواست کرده‌اند محدود می‌کند.

## 5. تأیید مرزهای معماری و exclusions

- تنها فایل source تغییرکرده در WO-043B-2، `apps/storefront/app/globals.css` است.
- هیچ فایل در `packages/ui`, `packages/config`, `packages/types` یا shared package دیگری تغییر نکرد.
- هیچ dependency، lockfile، font dependency یا external asset تغییر نکرد.
- هیچ Header، Navigation، Footer، Hero، Homepage Section، Card، Popup، Search یا Route تغییر نکرد.
- هیچ Content، API، Prisma، Commerce/BFF، Cart، Checkout، Payment، Test، Infrastructure یا Analytics تغییر نکرد.
- `luxury-heritage` همچنان نسخه 2، `provisional` و مبتنی بر `system-sans` است.
- `fardadExperienceProfile` همچنان نسخه 2 و `provisional` است.
- ترتیب homepage دقیقاً حفظ شد:

  ```text
  hero → features → categories
  ```

- `homeSections` allowlist نیز دقیقاً همین سه مقدار را حفظ کرد.
- هیچ logo، legal fact، contact، marketing claim، trust badge، statistic، discount یا testimonial ساخته نشد.
- هیچ font یا typography نهایی برای فرداد ادعا نشد.

## 6. فرمان‌های Validation و نتایج دقیق

### 6.1 Typecheck محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck D:\fardad\fardad\apps\storefront
> tsc --noEmit
```

Exit code: `0` — بدون خطا.

### 6.2 Lint محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint D:\fardad\fardad\apps\storefront
> eslint .
```

Exit code: `0` — بدون خطا.

### 6.3 Build محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

- Exit code: `0`
- Next.js: `15.5.20`
- Production compilation: موفق در `3.7s`
- Type/lint validation داخل build: موفق
- Static page generation: `4/4`
- Route table بدون تغییر معماری و شامل `/`, `/cart`, `/products`, `/products/[slug]` و `/products/category/[slug]` بود.

هشدار غیرمسدودکننده موجود:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

این هشدار متعلق به baseline موجود است و build را ناموفق نکرد.

### 6.4 اسکن فونت و مرزهای ثابت

اسکن اصلاح‌شده با exit code `0` تأیید کرد:

```text
body: "system-sans"
display: "system-sans"
sections: ["hero", "features", "categories"]
homeSections: ["hero", "features", "categories"]
```

هیچ match برای `@font-face`, `next/font`, Google font domains، فایل‌های font خارجی یا نام‌های فونت فارسی خارجی در allowlist بررسی‌شده یافت نشد.

یک اجرای اولیه همین scan کمکی به‌دلیل quoting نامناسب PowerShell برای عبارت `system-sans` خطای مسیر داد. فرمان با quoting امن بلافاصله تکرار شد و نتیجه صحیح بالا را با exit code `0` تولید کرد. این خطای کمکی هیچ فایل یا validation اصلی را تغییر نداد.

Test، format، migration، database، API یا validation سراسری repository اجرا نشد؛ برای scope محدود stylesheet ضرورت نداشت.

## 7. نتیجه `git diff --check`

```text
PASSED — exit code 0; no output
```

## 8. خروجی `git status --short`

```text
 M apps/storefront/app/globals.css
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

تفسیر scope:

- تغییر جدید source در WO-043B-2 فقط `globals.css` است.
- گزارش WO-043B-2 تنها فایل جدید این دستورکار است.
- سه config/theme modification و گزارش WO-043B-1 در pre-check اولیه وجود داشتند.
- دو سند WO-043A نیز در pre-check اولیه untracked بودند.

## 9. دارایی‌ها و تصمیم‌های provisional باقی‌مانده فرداد

1. فونت فارسی و لاتین نهایی دارای مجوز، weightهای مجاز و web redistribution rights.
2. تصمیم درباره Persian/Latin numeral style و رفتار mixed-script.
3. QA واقعی glyph coverage، baseline، اعراب، نیم‌فاصله، علائم و اعداد.
4. تصویب نهایی scale، weight و line-height پس از آزمایش فونت نهایی.
5. لوگو و assetهای بصری نهایی دارای حقوق استفاده.
6. تأیید نهایی پالت و contrast matrix روی محتوای واقعی.
7. محتوای فارسی، SEO، اطلاعات حقوقی و contact تأییدشده.

## 10. ریسک‌ها و Blockerها

- system fallback از نظر عملکرد و دسترس‌پذیری امن است، اما هویت تایپوگرافی نهایی فرداد را ایجاد نمی‌کند.
- scale پایه در componentهایی که utility class صریح دارند عمداً override می‌شود؛ یکپارچه‌سازی component-level خارج از این دستورکار است.
- CSS variables مربوط به gutter و section rhythm با Container/Section موجود همسو هستند، اما shared componentها برای مصرف مستقیم این variables تغییر نکردند.
- Build موفق، کیفیت بصری فارسی در browser/device واقعی، zoom 200%، reflow 400%، forced-colors یا screen reader را به‌تنهایی اثبات نمی‌کند.
- `text-wrap: balance/pretty` باید در browser matrix واقعی بررسی شود؛ در نبود پشتیبانی، fallback طبیعی مرورگر باقی می‌ماند.
- فونت نهایی می‌تواند metricها و شکست خطوط را تغییر دهد و نیازمند بازبینی مجدد scale/rhythm خواهد بود.
- هشدار baseline مربوط به Next ESLint plugin همچنان باقی است.
- فایل‌های WO-043A، WO-043B-1 و WO-043B-2 هنوز commit نشده‌اند.

## 11. دستورکار خرد بعدی پیشنهادی

پیشنهاد:

**WO-043B-3 — Fardad RTL Typography Verification Matrix**

محدوده پیشنهادی:

- مستندسازی و اجرای QA دستی/مرورگری در 320px، Tablet و Desktop؛
- بررسی zoom 200% و reflow 400%;
- بررسی نیم‌فاصله، اعراب، اعداد فارسی/لاتین و mixed-direction نمونه‌های غیرواقعی/آزمایشی؛
- بررسی keyboard focus، forced-colors و reduced-motion؛
- بدون تغییر component، route، content production، font asset یا shared package.

شروع WO-043B-3 نیازمند تأیید مستقل مالک/CTO است.

