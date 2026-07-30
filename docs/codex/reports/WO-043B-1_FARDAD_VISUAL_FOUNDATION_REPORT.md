# گزارش پیاده‌سازی WO-043B-1 — بنیان بصری فرداد

> پروژه: Fardad Enterprise Platform  
> شناسه دستورکار: WO-043B-1 — Fardad Visual Foundation Only  
> تاریخ اجرا: 2026-07-23  
> نتیجه: موفق — بنیان بصری محدود و app-owned پیاده‌سازی شد  
> وضعیت مقادیر برند: همچنان `provisional`  
> Commit / Push: انجام نشد

## 1. نتیجه دستورکار

WO-043B-1 با موفقیت و در محدوده تعیین‌شده اجرا شد. تغییرات فقط بنیان بصری app-owned فروشگاه فرداد را اصلاح می‌کنند و هیچ Header، Navigation، Footer، توسعه صفحه اصلی، Popup، Search، جریان هدایای سازمانی، Article، Campaign، Route، API، Data Contract یا Analytics جدیدی ایجاد نشده است.

جهت بصری پیاده‌شده همان «Luxury Heritage with Commercial Clarity» مصوب در WO-043A است:

- پس‌زمینه عاجی/سفید مایل به گرم؛
- زمردی برای نقش primary و اقتدار بصری؛
- جوهر تیره برای خوانایی متن؛
- طلایی برای نقش secondary و accent محدود؛
- مسی برای focus-visible؛
- border گرم و قابل‌تشخیص؛
- سایه و radius کنترل‌شده‌تر برای جلوگیری از ظاهر قالبی و تزئین افراطی.

هیچ‌کدام از این مقادیر به وضعیت نهایی یا `approved` ارتقا داده نشده‌اند.

## 2. فایل‌های بررسی‌شده و تغییرکرده

### 2.1 اسناد مبنا که به‌طور کامل خوانده شدند

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`

### 2.2 فایل‌های معماری و پیکربندی بررسی‌شده

- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/src/themes/theme-preset-registry.ts`
- `apps/storefront/src/config/brands/fardad/brand-profile.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/index.ts`
- `apps/storefront/src/lib/storefront-config.ts`
- `apps/storefront/src/lib/resolve-storefront-profile.ts`
- `apps/storefront/src/lib/theme-css-variables.ts`
- `apps/storefront/app/layout.tsx`
- `apps/storefront/app/globals.css`
- `apps/storefront/tailwind.config.ts`
- `packages/config/src/storefront-profile.ts`
- `packages/types/src/theme.ts`
- `packages/types/src/brand.ts`
- `packages/ui/src/Button.tsx`
- `packages/ui/src/Card.tsx`
- `packages/ui/src/Navigation.tsx`
- `package.json`
- `apps/storefront/package.json`
- `turbo.json`
- `pnpm-workspace.yaml`

### 2.3 فایل‌های تغییرکرده توسط WO-043B-1

| فایل | تغییر |
| --- | --- |
| `apps/storefront/src/themes/presets/luxury-heritage.ts` | ارتقای preset به نسخه 2، ثبت provenance مربوط به WO-043B-1، اصلاح border، radius و elevation با حفظ پالت و typography موقت |
| `apps/storefront/src/config/brands/fardad/experience-profile.ts` | ارتقای Experience Profile به نسخه 2 و همگام‌سازی ارجاع آن با `luxury-heritage@2` |
| `apps/storefront/src/config/brands/fardad/index.ts` | ارتقای نسخه composition فرداد به 2 برای ردیابی تغییرات |
| `apps/storefront/app/globals.css` | تعریف محدود حالت disabled برای کنترل‌های فرم با توکن‌های semantic و کنتراست قابل‌قبول |
| `docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md` | ثبت محدوده، تصمیم‌ها، validation و ریسک‌های این دستورکار |

فایل‌های WO-043A پیش از شروع این دستورکار در وضعیت Git به‌صورت untracked وجود داشتند و در WO-043B-1 ویرایش نشدند.

## 3. تصمیم‌های دقیق semantic visual

### 3.1 نقش‌های رنگ

| نقش semantic | مقدار provisional | نتیجه کنتراست |
| --- | --- | --- |
| `background` / canvas عاجی | `#F8F4EC` | مبنای سطح گرم و روشن |
| `surface` | `#FFFFFF` | سطح خواندن و کارت |
| `text` / dark ink | `#081613` | 18.51:1 روی surface و 16.87:1 روی canvas |
| `mutedText` | `#4B5563` | 7.56:1 روی surface و 6.89:1 روی canvas |
| `primary` / emerald | `#0E3B2E` | متن سفید روی primary برابر 12.47:1 |
| `secondary` / restrained gold | `#C2A46B` | dark ink روی gold برابر 7.77:1 |
| `focus` / copper | `#A97142` | 4.10:1 روی surface و 3.73:1 روی canvas |
| `border` / warm structural border | `#8C8273` | 3.78:1 روی surface و 3.45:1 روی canvas |

مقدار قبلی border یعنی `#E5E7EB` روی surface فقط 1.24:1 کنتراست داشت. مقدار جدید برای مرز کنترل‌ها و focus-adjacent structure حداقل 3:1 را تأمین می‌کند. طلایی و مسی همچنان accent هستند و برای body text استفاده نشده‌اند.

### 3.2 حالت‌های تعاملی

- **Default:** ترکیب‌های primary، secondary، text و muted text همگی حداقل معیار متن خود را پاس کردند.
- **Hover primary:** رفتار موجود opacity روی surface معادل 9.20:1 باقی می‌ماند.
- **Hover secondary:** dark ink/gold در رفتار opacity موجود معادل 6.59:1 باقی می‌ماند.
- **Focus-visible:** مسی موجود حفظ شد و روی surface و canvas از حداقل 3:1 بالاتر است.
- **Disabled:** کنترل‌های disabled از canvas، muted text و border semantic استفاده می‌کنند؛ متن disabled روی canvas برابر 6.89:1 است، cursor برابر `not-allowed` است و hover opacity نمی‌تواند حالت را مبهم کند.
- **Text on surface:** متن اصلی و متن ثانویه به‌ترتیب 18.51:1 و 7.56:1 هستند.

حالت disabled در `apps/storefront/app/globals.css` تعریف شد تا هیچ تغییر یا فرض برند در componentهای shared لازم نباشد.

### 3.3 شکل، elevation و typography

- `radius.medium` از `1.5rem` به `1rem` کاهش یافت تا کارت‌ها و کنترل‌ها ظاهر آرام‌تر و کمتر تزئینی داشته باشند.
- `elevation.card` از `raised` به `soft` تغییر کرد تا سایه‌ها محدود و کاربردی باشند.
- `radius.small` برابر `0.5rem` حفظ شد.
- `contentMaxWidth` برابر `90rem` حفظ شد.
- نقش‌های typography همچنان `system-sans` برای body و display هستند.
- هیچ font package، فایل فونت، CDN یا asset خارجی اضافه نشد.

### 3.4 نسخه و provenance

- `luxury-heritage` از نسخه 1 به نسخه 2 ارتقا یافت.
- `fardadExperienceProfile` از نسخه 1 به نسخه 2 ارتقا یافت.
- ارجاع Experience Profile به `luxury-heritage@2` همگام شد.
- نسخه `fardadStorefrontComposition` به 2 ارتقا یافت.
- `sourceVersion` برابر `wo-043b-1-visual-foundation` ثبت شد.
- وضعیت preset و Experience Profile همچنان `provisional` است.

## 4. تأیید مرزهای معماری

- `apps/storefront` تنها مالک مقادیر بصری تغییرکرده است.
- هیچ فایل در `packages/ui`، `packages/config` یا `packages/types` تغییر نکرد.
- اسکن shared packages هیچ نام فرداد، متن فارسی یا hexهای پالت فرداد را در تغییرات واردشده نشان نداد.
- Theme Registry بررسی شد و چون همان ID نسخه‌گذاری‌شده را resolve می‌کند، نیازی به تغییر نداشت.
- CSS variables همچنان از مسیر typed موجود تولید می‌شوند:

  ```text
  luxury-heritage preset
    → Fardad Storefront composition
    → resolveStorefrontComposition
    → createThemeCssVariables
    → body CSS variables
  ```

- ترتیب صفحه اصلی دقیقاً `hero → features → categories` باقی ماند.
- allowlist مربوط به `homeSections` نیز دقیقاً `hero`, `features`, `categories` باقی ماند.
- هیچ Brand Profile content، identity، navigation، feature/capability یا localized content تغییر نکرد.
- هیچ logo، font، claim، trust badge، statistic، discount، testimonial، legal fact، contact یا social value ساخته نشد.
- هیچ dependency، lockfile، API، Prisma، Commerce/BFF، Cart، Checkout، Payment، Infrastructure یا Test تغییر نکرد.
- تغییر stylesheet از propertyهای جهت‌دار فیزیکی استفاده نمی‌کند و با `dir="rtl"` موجود سازگار است.

## 5. فرمان‌های Validation و نتایج دقیق

### 5.1 Typecheck محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront typecheck
```

نتیجه:

```text
> @fardad/storefront@1.0.0 typecheck D:\fardad\fardad\apps\storefront
> tsc --noEmit
```

Exit code: `0` — بدون خطا.

### 5.2 Lint محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront lint
```

نتیجه:

```text
> @fardad/storefront@1.0.0 lint D:\fardad\fardad\apps\storefront
> eslint .
```

Exit code: `0` — بدون خطا.

### 5.3 Build محدود Storefront

```powershell
corepack pnpm --filter @fardad/storefront build
```

نتیجه:

- Exit code: `0`
- Next.js: `15.5.20`
- Production compilation: موفق در `4.1s`
- Type/lint validation داخل build: موفق
- Static page generation: `4/4`
- مسیرهای `/`, `/cart`, `/products`, `/products/[slug]` و `/products/category/[slug]` با موفقیت تولید/ثبت شدند.

هشدار غیرمسدودکننده موجود:

```text
The Next.js plugin was not detected in your ESLint configuration.
```

این هشدار از محدوده visual foundation خارج است و build را ناموفق نکرد.

### 5.4 ماتریس کنتراست

یک فرمان inline با Node و الگوریتم relative luminance/contrast ratio برای زوج‌های semantic اجرا شد. همه موارد زیر `PASS` شدند:

```text
text/surface 18.51 PASS
text/canvas 16.87 PASS
muted/surface 7.56 PASS
muted/canvas 6.89 PASS
white/primary 12.47 PASS
text/gold 7.77 PASS
focus/surface 4.10 PASS
focus/canvas 3.73 PASS
border/surface 3.78 PASS
border/canvas 3.45 PASS
disabled-text/canvas 6.89 PASS
primary-hover/surface 9.20 PASS
gold-hover/surface 6.59 PASS
```

فرمان‌های repository-wide، test، format، dependency installation، database و API اجرا نشدند؛ برای این تغییر app-owned ضرورت نداشتند.

## 6. نتیجه `git diff --check`

```text
PASSED — exit code 0; no output
```

## 7. خروجی `git status --short`

```text
 M apps/storefront/app/globals.css
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

دو فایل WO-043A در pre-check اولیه نیز دقیقاً به همین صورت untracked بودند. فایل گزارش WO-043B-1 در این دستورکار ایجاد شد.

## 8. دارایی‌ها و محتوای provisional باقی‌مانده

فرداد همچنان باید موارد زیر را فراهم یا تأیید کند:

1. لوگو و lockupهای نهایی همراه با حقوق استفاده و قواعد اندازه/فاصله.
2. تصمیم نهایی درباره پالت و ماتریس کامل stateها با QA روی محتوای واقعی.
3. فونت‌های فارسی/لاتین دارای مجوز، weightهای مجاز، fallback و حقوق web redistribution.
4. تصاویر دارای مجوز برای Hero، محصول، دسته‌بندی، مجموعه، فرایند و هدایای سازمانی.
5. محتوای فارسی نهایی، CTAها، نام‌گذاری دسته‌ها و SEO copy.
6. اطلاعات حقوقی، canonical domain، contact، copyright، privacy، terms و returns.
7. social accountهای رسمی و تصمیم عملیاتی newsletter.
8. evidence و wording تأییدشده برای هر ادعای اصالت، متریال، فرایند، خدمات یا ضمانت.

هیچ‌یک از موارد فوق در WO-043B-1 جعل، تکمیل یا نهایی فرض نشد.

## 9. ریسک‌ها و Blockerهای باقی‌مانده

- پالت هنوز provisional است و باید با assetها و محتوای واقعی بررسی شود.
- border جدید برای قابلیت تشخیص کنترل‌ها عمداً پرکنتراست‌تر است؛ توازن ظاهری آن باید در visual QA واقعی تأیید شود.
- فونت system fallback از نظر معماری امن است، اما هویت تایپوگرافیک نهایی فرداد را تأمین نمی‌کند.
- build موفق، صحت بصری روی browser/device واقعی، zoom، forced-colors یا screen reader را اثبات نمی‌کند.
- تست screenshot/visual regression مصوبی برای این preset وجود ندارد.
- هشدار موجود Next ESLint plugin همچنان باقی است و مربوط به این تغییر نیست.
- اسناد WO-043A و گزارش حاضر هنوز untracked هستند؛ commit/push طبق دستور انجام نشده است.

## 10. دستورکار خرد بعدی پیشنهادی

پیشنهاد:

**WO-043B-2 — Fardad RTL Typography and Base Rhythm**

محدوده پیشنهادی:

- تعریف app-owned scale تایپوگرافی با همان system fallback؛
- line-height و reading measure مناسب فارسی؛
- spacing/rhythm پایه و logical properties برای RTL؛
- validation در عرض 320px، zoom 200%، reflow و `prefers-reduced-motion`;
- بدون اضافه‌کردن font asset، Header، Navigation، Footer یا بخش جدید صفحه اصلی.

شروع WO-043B-2 باید پس از تأیید مستقل مالک/CTO انجام شود.

