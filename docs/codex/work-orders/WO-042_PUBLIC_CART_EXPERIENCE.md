# دستور کار WO-042

# تجربه عمومی سبد خرید

> شناسه: WO-042

> عنوان: Public Cart Experience

> وضعیت: Ready for Validation

> محدوده محصول: Storefront عمومی

## هدف و دلیل

هدف این دستور کار، اعتبارسنجی تجربه عمومی سبد خریدی است که در گزارش‌های WO-042 ثبت شده است. این تجربه باید فقط داده‌ها و عملیات عمومی و ایمن سبد خرید مهمان را نمایش دهد، مسیر خرید محصول تا سبد را کامل کند و مرزهای Server Action و قابلیت انتشار `catalog.shop` را حفظ کند.

دلیل این کار، آماده‌سازی changeset موجود برای ارزیابی انسانی و فنی است؛ بدون افزودن قابلیت تجاری جدید یا گسترش به فرایند checkout.

## محدوده مجاز

- Public Cart در `apps/storefront`
- مسیر عمومی `/cart` و وضعیت‌های loading، error، خالی و دارای آیتم
- کنترل افزودن محصول به سبد، تغییر تعداد، حذف آیتم و به‌روزرسانی quote از طریق Server Actionهای موجود
- قابلیت انتشار `catalog.shop` در Storefront و محتوای محلی Cart
- تست‌های ساختاری و اعتبارسنجی‌های مربوط به Storefront و `@fardad/types`

## خارج از محدوده

- `apps/api` و هرگونه تغییر API
- Prisma، migration و پایگاه داده
- checkout، payment و order
- package manifestها و `pnpm-lock.yaml`
- نصب پکیج، تنظیمات زیرساخت، استقرار، commit و push

## فایل‌های درگیر فعلی Cart

فهرست زیر فقط از دو گزارش موجود WO-042 استخراج شده است:

- `apps/storefront/app/(public)/cart/page.tsx`
- `apps/storefront/app/(public)/cart/loading.tsx`
- `apps/storefront/app/(public)/cart/error.tsx`
- `apps/storefront/components/commerce/CartExperience.tsx`
- `apps/storefront/components/commerce/ProductPurchaseControl.tsx`
- `apps/storefront/app/(public)/products/[slug]/page.tsx`
- `apps/storefront/components/catalog/ProductDetail.tsx`
- `apps/storefront/src/lib/commerce/cart-actions.ts`
- `apps/storefront/src/lib/commerce/cart-session.ts`
- `apps/storefront/src/lib/shop-capability.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/navigation.ts`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `packages/types/src/content.ts`
- `apps/storefront/test/commerce-boundary.test.mjs`
- `docs/codex/reports/WO-042_PRE_IMPLEMENTATION_CART_EXPERIENCE_REVIEW.md`
- `docs/codex/reports/WO-042_PUBLIC_CART_EXPERIENCE_IMPLEMENTATION_REPORT.md`

## معیارهای پذیرش

1. مسیر `/cart` فقط هنگام انتشار قابلیت `catalog.shop` قابل دسترسی باشد و در غیر این صورت not found برگرداند.
2. صفحه Cart حالت‌های loading، error، خالی و دارای آیتم را با متن عمومی و قابل‌دسترس ارائه دهد.
3. افزودن، تغییر تعداد، حذف و refresh quote فقط از Server Actionهای موجود استفاده کنند و داده یا خطای داخلی را به مرورگر افشا نکنند.
4. Product Detail فقط برای گزینه خرید عمومی، در دسترس و دارای قیمت، کنترل افزودن به سبد را ارائه دهد.
5. UI فقط قراردادهای عمومی Cart و purchasing option را مصرف کند؛ token، API origin، BFF proof و شناسه‌های داخلی در کد client ظاهر نشوند.
6. هیچ تغییر خارج از محدوده، به‌ویژه در API، Prisma، checkout، payment، order، manifestها یا lockfile ایجاد نشود.

## تست‌های موردنیاز برای WO-042B

پیش از تأیید نهایی WO-042B، این بررسی‌ها باید اجرا و نتیجه‌شان ثبت شود:

- `pnpm.cmd --filter @fardad/storefront test`
- `pnpm.cmd --filter @fardad/storefront typecheck`
- `pnpm.cmd --filter @fardad/storefront lint`
- `pnpm.cmd --filter @fardad/storefront build`
- `pnpm.cmd --filter @fardad/types typecheck`
- `git diff --check`
- بررسی ساختاری عدم افشای مقادیر خصوصی در کد client و خروجی static Storefront

## ریسک‌ها و پیش‌نیازهای محیطی

- اجرای کامل Cart در زمان اجرا به پیکربندی معتبر Storefront Commerce و مسیر BFF موجود وابسته است؛ مقادیر محرمانه نباید در گزارش، props یا کد client ثبت شوند.
- build و تست Storefront به Node و وابستگی‌های lock‌شدهٔ موجود نیاز دارند و ممکن است artifactهای محلی مانند `.next` تولید کنند.
- کار هم‌زمان روی فایل‌های Cart می‌تواند نتایج اعتبارسنجی را تغییر دهد؛ قبل از اجرای WO-042B باید changeset مجدداً بررسی شود.
- این دستور کار جایگزین هیچ validation مربوط به API یا migration نیست، زیرا آن‌ها خارج از محدوده‌اند.

## تصمیم ردیابی

`WO-016_MEDIA_MANAGEMENT.md` منحصراً متعلق به Media Management است. تمام مستندات و تغییرات مربوط به Public Cart Experience فقط با شناسهٔ WO-042 ردیابی می‌شوند.
