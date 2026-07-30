# گزارش راستی‌آزمایی دسترس‌پذیری هدر و ناوبری فرداد — WO-043B-4

> پروژه: Fardad Enterprise Platform
> شناسه دستورکار: WO-043B-4 — Fardad Header and Navigation Accessibility Verification
> تاریخ اجرا: 2026-07-23
> نتیجه نهایی: ناقص/مسدود — بررسی سرور و source موفق بود، اما QA تعاملی مرورگر در این نشست قابل اجرا نبود
> تغییر source code: ندارد
> Commit / Push: انجام نشد

## 1. شناسه و نتیجه نهایی دستورکار

WO-043B-4 به‌صورت QA و read-only اجرا شد. Storefront با فرمان موجود repository اجرا شد و HTML واقعی صفحه اصلی، مقصدهای منتشرشده، جهت RTL و ویژگی‌های اولیه trigger بررسی شدند. همچنین پیاده‌سازی فعلی focus، keyboard، drawer، touch target و reduced-motion در source بازبینی شد.

مرورگر تعاملی در این نشست در دسترس نبود. اتصال طبق workflow رسمی Browser و مسیر troubleshooting انجام شد، اما فهرست browser backendها خالی بود:

```text
No browser is available
available browsers: []
```

بنابراین viewportهای واقعی، interactionهای pointer/keyboard، zoom 200% و visual reflow قابل اجرا نبودند. این موارد در گزارش «مسدود» ثبت شده‌اند و قبول‌شده تلقی نمی‌شوند. هیچ نقص دسترس‌پذیری مستقیم و قابل‌بازتولید اثبات نشد؛ در نتیجه مطابق دستور، source code تغییر نکرد.

## 2. فایل‌های بررسی‌شده و تغییرکرده

### 2.1 اسناد الزامی که کامل خوانده شدند

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md`
- `docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md`
- `docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md`

### 2.2 فایل‌های implementation/config بررسی‌شده

- `apps/storefront/components/layout/StorefrontHeader.tsx`
- `apps/storefront/components/layout/MobileNavigation.tsx`
- `apps/storefront/src/config/brands/fardad/navigation.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/brand-profile.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/lib/navigation.ts`
- `apps/storefront/app/globals.css` فقط برای قاعده `prefers-reduced-motion`
- `apps/storefront/package.json` فقط برای شناسایی فرمان اجرای موجود

### 2.3 فایل‌های تغییرکرده

تنها فایل ایجادشده:

- `docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md`

هیچ فایل source، config، shared package، dependency یا lockfile تغییر نکرد.

## 3. ماتریس دقیق QA

وضعیت‌ها:

- **PASS:** با خروجی واقعی سرور یا شاهد مستقیم source تأیید شد.
- **SOURCE ONLY:** منطق در source وجود دارد، اما اجرای تعاملی آن ممکن نشد.
- **BLOCKED:** به browser backend نیاز داشت و در این نشست قابل اجرا نبود.
- **N/A:** در پیکربندی publishable فعلی مصداقی ندارد.

### 3.1 viewport، zoom و reflow

| مورد | وضعیت | شاهد/نتیجه |
| --- | --- | --- |
| Desktop عملی، `1440×900` | BLOCKED | browser backend در دسترس نبود؛ بررسی بصری یا computed layout انجام نشد |
| Mobile عملی، `390×844` | BLOCKED | browser backend در دسترس نبود |
| Mobile حداقلی، عرض `320px` | BLOCKED | نبود horizontal overflow یا clipping به‌صورت runtime اثبات نشد |
| Zoom `200%` | BLOCKED | browser zoom/computed reflow قابل اجرا نبود |
| reflow پایه در narrow width | BLOCKED | فقط وجود `w-full max-w-sm` و gutterهای responsive در source مشاهده شد؛ نتیجه بصری تأیید نشد |
| پاسخ واقعی `/` | PASS | HTTP `200` |
| جهت سند | PASS | HTML واقعی شامل `<html ... dir="rtl">` بود |

### 3.2 trigger، drawer، keyboard و focus

| مورد | وضعیت | شاهد/نتیجه |
| --- | --- | --- |
| trigger دارای accessible label | PASS | SSR شامل `aria-label="باز کردن …"` بود |
| `aria-expanded` اولیه | PASS | SSR شامل `aria-expanded="false"` بود |
| `aria-controls` | PASS | SSR دارای ID کنترل‌شده بود |
| open control | SOURCE ONLY | `onClick={() => setIsOpen(true)}` وجود دارد؛ click runtime مسدود بود |
| close control | SOURCE ONLY | دکمه labelled با `min-h-11 min-w-11` وجود دارد |
| overlay close | SOURCE ONLY | overlay button با handler بستن و بازیابی فوکوس وجود دارد |
| role/name drawer | SOURCE ONLY | `role="dialog"`, `aria-modal="true"` و `aria-labelledby` وجود دارد |
| انتقال فوکوس هنگام بازشدن | SOURCE ONLY | `requestAnimationFrame(() => closeRef.current?.focus())` وجود دارد |
| Escape close | SOURCE ONLY | handler برای `Escape`، بستن و focus trigger وجود دارد |
| بازگشت فوکوس بعد از close | SOURCE ONLY | برای Escape، overlay و close control پیاده‌سازی شده است |
| containment با Tab | SOURCE ONLY | last-to-first cycle در source وجود دارد |
| containment با Shift+Tab | SOURCE ONLY | first-to-last cycle در source وجود دارد |
| scroll lock هنگام بازشدن | SOURCE ONLY | `document.body.style.overflow = "hidden"` وجود دارد |
| restoration scroll lock | SOURCE ONLY | مقدار قبلی overflow در cleanup بازگردانده می‌شود |
| focus-visible واقعی با keyboard | BLOCKED | کلاس‌های ring وجود دارند، اما حالت computed/visual آزموده نشد |

### 3.3 RTL، nesting، touch target و reduced motion

| مورد | وضعیت | شاهد/نتیجه |
| --- | --- | --- |
| بازشدن drawer از سمت منطقی RTL | SOURCE ONLY | panel از `end-0` و `border-s` استفاده می‌کند؛ جایگاه بصری runtime آزموده نشد |
| indentation منطقی nesting | SOURCE ONLY | `border-s` و `ps-3` در renderer بازگشتی وجود دارد |
| nesting واقعی | N/A | هیچ `children` یا nested category publishable در تنظیمات فعلی وجود ندارد |
| هدف لمسی trigger/close | SOURCE ONLY | `min-h-11 min-w-11` معادل حداقل 44px در scale فعلی |
| هدف لمسی لینک‌ها/brand | SOURCE ONLY | `min-h-11` وجود دارد؛ اندازه computed آزموده نشد |
| reduced-motion rule | PASS | media query موجود، smooth scroll را خاموش و transition/animation را به `0.01ms` محدود می‌کند |
| reduced-motion runtime | BLOCKED | emulation مرورگر در دسترس نبود |
| visual contrast/focus ring روی صفحه | BLOCKED | ماتریس رنگ WO-043B-1 موجود است، اما browser visual QA این دستورکار اجرا نشد |

## 4. مقصدهای قابل مشاهده و عمداً غایب

### 4.1 مقصدهای قابل مشاهده

HTML واقعی صفحه اصلی این مقصدها را نشان داد:

| عنوان | مسیر | نتیجه |
| --- | --- | --- |
| خانه | `/` | visible |
| محصولات | `/products` | visible |
| سبد خرید | `/cart` | visible |

درخواست HTTP به `/products` و `/cart` هر دو status `200` برگرداند. در اجرای dev، درخواست `/products` به‌دلیل در دسترس نبودن public catalog upstream خطای `Public catalog request failed` را در log ثبت کرد و سپس response `200` از error foundation دریافت شد. این وضعیت، نقص دسترس‌پذیری هدر/ناوبری نیست و اصلاح API/محصولات خارج از scope است.

### 4.2 مقصدها و affordanceهای عمداً غایب

اسکن HTML واقعی نتیجه زیر را داد:

```text
ABSENT_CorporateGifts=True
ABSENT_Articles=True
ABSENT_Contact=True
ABSENT_About=True
ABSENT_Budget=True
ABSENT_Account=True
ABSENT_SearchInput=True
ABSENT_NestedConfiguredNav=True
```

بنابراین هدایای سازمانی، مقالات/وبلاگ، تماس، درباره ما، هدیه بر اساس بودجه، حساب کاربری، search و nested categories در خروجی فعلی ظاهر نشدند.

## 5. نقص قابل‌بازتولید و resolution

هیچ نقص دسترس‌پذیری مستقیم و قابل‌بازتولید در بخش قابل‌اجرای این نشست پیدا نشد. در نتیجه:

- اعلام defect پیش از edit لازم نشد؛
- correction source پیشنهاد یا اعمال نشد؛
- typecheck/lint/build دوباره اجرا نشدند.

موارد تعاملی مسدودشده «بدون نقص» محسوب نمی‌شوند؛ برای نتیجه قطعی باید در محیط دارای browser backend دوباره اجرا شوند.

## 6. مرزهای معماری حفظ‌شده

- همه baselineهای uncommitted مربوط به WO-043A تا WO-043B-3 دست‌نخورده ماندند.
- هیچ source code، shared package، navigation config یا capability state تغییر نکرد.
- هیچ route، search، account، nested category، corporate flow، article، contact یا budget destination فعال نشد.
- هیچ logo، font، content، marketing copy، asset، analytics، test، dependency یا lockfile افزوده نشد.
- API، Prisma، Commerce/BFF، cart، checkout، payment، footer، Hero، homepage section، popup، campaign و infrastructure تغییر نکردند.
- ترتیب `Hero → Features → Categories` حفظ شد.
- commit و push انجام نشد.

## 7. فرمان‌های validation و نتایج دقیق

### 7.1 پیش‌بررسی Git

```powershell
git status --short
```

baseline مورد انتظار WO-043A تا WO-043B-3 را نشان داد و هیچ فایل WO-043B-4 در شروع وجود نداشت.

### 7.2 اجرای Storefront

```powershell
corepack pnpm --filter @fardad/storefront dev
```

نتیجه:

```text
Next.js 15.5.20
Local: http://localhost:3000
Ready in 1946ms
GET / 200
GET /products 200
GET /cart 200
```

در log مسیر `/products` خطای upstream زیر ثبت شد:

```text
Error: Public catalog request failed
```

فرایند local dev پس از بررسی متوقف شد.

### 7.3 اتصال مرورگر

نتیجه تلاش انتخاب URL محلی:

```text
No browser is available
```

پس از اجرای troubleshooting و فهرست‌کردن browserها:

```text
[]
```

طبق محدودیت ابزار، Playwright مستقل یا browser backend جایگزین استفاده نشد.

### 7.4 بررسی HTTP/SSR

اجرای اصلاح‌شده:

```text
HOME_STATUS=200
HTML_DIR_RTL=True
MOBILE_TRIGGER_LABELLED=True
MOBILE_TRIGGER_EXPANDED_FALSE=True
MOBILE_TRIGGER_CONTROLS=True
```

و لینک‌های مجاز:

```text
/         خانه
/         فرداد
/cart     سبد خرید
/products محصولات
```

یک اجرای کمکی اولیه به‌اشتباه از نام متغیر PowerShell `$home` استفاده کرد که به‌دلیل case-insensitive بودن PowerShell با متغیر read-only سیستمی برخورد کرد:

```text
Cannot overwrite variable HOME because it is read-only or constant.
```

فرمان بلافاصله با متغیر task-specific یعنی `$storefrontHomeResponse` تکرار شد و نتایج صحیح بالا را تولید کرد. این خطای کمکی هیچ فایل یا runtime state پروژه را تغییر نداد.

### 7.5 typecheck، lint و build

اجرا نشدند. این دستورکار هیچ source codeای تغییر نداد و الزام صریح WO-043B-4 اجرای دوباره این فرمان‌ها را فقط در صورت تغییر source تعیین کرده بود.

## 8. نتیجه `git diff --check`

```text
PASSED — exit code 0; no output
```

## 9. خروجی دقیق `git status --short`

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
?? docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

تنها فایل جدید WO-043B-4 همین گزارش است. سایر موارد baseline تأییدشده و موجود پیش از این دستورکار هستند.

## 10. دارایی‌ها و تصمیم‌های provisional باقی‌مانده فرداد

1. logo و lockupهای نهایی دارای مجوز.
2. فونت فارسی/لاتین نهایی دارای مجوز و آزمون glyph/baseline.
3. taxonomy و nested categoryهای نهایی با route و capability قابل انتشار.
4. تصمیم و workflow معتبر search.
5. تصمیم و route معتبر account.
6. route و محتوای تأییدشده corporate gifts، articles، about و contact.
7. policy معتبر gifts-by-budget مبتنی بر pricing/currency authority.
8. تأیید نهایی palette و contrast روی محتوای واقعی.

## 11. ریسک‌ها یا blockerها

- blocker اصلی: نبود browser backend، که آزمون واقعی viewport، click، Tab، Shift+Tab، Escape، focus return، overlay، scroll lock، zoom، reflow و reduced-motion emulation را ناممکن کرد.
- width `320px`، zoom `200%` و desktop/mobile visual state قبول‌شده اعلام نمی‌شوند.
- focus trap فعلی با selector داخلی کنترل‌های focusable کار می‌کند؛ هر نوع کنترل جدید در آینده نیازمند regression QA است.
- nested category publishable وجود ندارد؛ خوانایی nesting و Back/context واقعی قابل آزمون نبود.
- public catalog upstream در این نشست در دسترس نبود و مسیر محصولات error foundation را با status `200` نمایش داد.
- system font، text identity و palette همچنان provisional هستند.
- baseline و گزارش حاضر همچنان commit نشده‌اند.

## 12. دستورکار خرد بعدی پیشنهادی

**WO-043B-4A — Fardad Header and Navigation Interactive Browser Verification**

محدوده پیشنهادی:

- تکرار فقط موارد BLOCKED این گزارش در نشست دارای browser backend؛
- viewportهای `1440×900`، `390×844` و عرض `320px`;
- click/overlay، Tab/Shift+Tab، Escape، focus entry/return و body scroll restoration؛
- zoom `200%`، narrow reflow، reduced-motion و بررسی visual focus؛
- ثبت screenshot/evidence بدون تغییر source؛
- هر اصلاح احتمالی فقط پس از ارائه defect قابل‌بازتولید و allowlist مستقل.
