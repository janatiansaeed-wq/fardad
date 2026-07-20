import Link from "next/link";
import type {
  LocalizedContentProfile,
  ProductCardVariantId,
  PublicProductCard as PublicProductCardData,
} from "@fardad/types";
import Card from "@fardad/ui/Card";
import Image from "@fardad/ui/Image";

type ProductCardProps = {
  product: PublicProductCardData;
  content: LocalizedContentProfile["catalog"];
  variant: ProductCardVariantId;
};

export default function ProductCard({ content, product, variant }: ProductCardProps) {
  const titleId = `product-${product.slug}`;
  const missingImageAlt = content.missingImageAltTemplate.replace("{productName}", product.name);

  return (
    <article aria-labelledby={titleId} data-variant={variant}>
      <Link
        href={`/products/${encodeURIComponent(product.slug)}`}
        className="block h-full rounded-[var(--ui-radius-medium,0.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-4"
      >
        <Card className="h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.image ? (
              <Image
                fill
                alt={product.image.alt}
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={product.image.src}
              />
            ) : (
              <div
                role="img"
                aria-label={missingImageAlt}
                className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--ui-color-primary,#1f2937),var(--ui-color-secondary,#e5e7eb))] p-6 text-center text-[var(--ui-color-primary-contrast,#ffffff)]"
              >
                <div>
                  <span aria-hidden="true" className="text-4xl font-bold">
                    {content.missingImageMark}
                  </span>
                  <p className="mt-2 text-sm">{content.missingImageMessage}</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <p className="text-sm text-[var(--ui-color-muted-text,#4b5563)]">
              {product.category.name}
            </p>
            <h2
              id={titleId}
              className="mt-2 text-xl font-bold text-[var(--ui-color-primary,#1f2937)]"
            >
              {product.name}
            </h2>
            <p className="mt-3 line-clamp-3 leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
              {product.shortDescription}
            </p>
          </div>
        </Card>
      </Link>
    </article>
  );
}
