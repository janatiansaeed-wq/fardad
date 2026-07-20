import type { LocalizedContentProfile, PublicProductDetail } from "@fardad/types";
import Image from "@fardad/ui/Image";

type ProductMediaGalleryProps = Readonly<{
  content: LocalizedContentProfile["productDetail"];
  product: PublicProductDetail;
}>;

export default function ProductMediaGallery({ content, product }: ProductMediaGalleryProps) {
  const galleryHeadingId = `product-gallery-${product.slug}`;
  const missingImageAlt = content.missingImageAltTemplate.replace("{productName}", product.name);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] shadow-[var(--ui-shadow-card,0_12px_32px_rgba(0,0,0,0.08))]">
        {product.mainImage ? (
          <Image
            fill
            priority
            alt={product.mainImage.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={product.mainImage.src}
          />
        ) : (
          <div
            role="img"
            aria-label={missingImageAlt}
            className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--ui-color-primary,#1f2937),var(--ui-color-secondary,#e5e7eb))] p-8 text-center text-[var(--ui-color-primary-contrast,#ffffff)]"
          >
            <div>
              <span aria-hidden="true" className="text-5xl font-bold">
                {content.missingImageMark}
              </span>
              <p className="mt-3 leading-7">{content.missingImageMessage}</p>
            </div>
          </div>
        )}
      </div>

      {product.gallery.length ? (
        <section aria-labelledby={galleryHeadingId} className="mt-8">
          <h2
            id={galleryHeadingId}
            className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]"
          >
            {content.galleryHeading}
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {product.gallery.map((image, index) => (
              <li key={`${image.src}-${index}`}>
                <div className="relative aspect-square overflow-hidden rounded-[var(--ui-radius-small,0.375rem)] bg-[var(--ui-color-surface,#ffffff)]">
                  <Image
                    fill
                    alt={image.alt}
                    loading="lazy"
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 50vw"
                    src={image.src}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
