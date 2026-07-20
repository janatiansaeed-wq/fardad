import type { PublicProductCard as PublicProductCardData } from "@fardad/types";
import Card from "@fardad/ui/Card";
import Image from "@fardad/ui/Image";

type ProductCardProps = {
  product: PublicProductCardData;
};

export default function ProductCard({ product }: ProductCardProps) {
  const titleId = `product-${product.slug}`;

  return (
    <article aria-labelledby={titleId}>
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
              aria-label={`تصویر محصول ${product.name} در دسترس نیست`}
              className="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--ui-color-primary,#1f2937),var(--ui-color-secondary,#e5e7eb))] p-6 text-center text-[var(--ui-color-primary-contrast,#ffffff)]"
            >
              <div>
                <span aria-hidden="true" className="text-4xl font-bold">
                  ف
                </span>
                <p className="mt-2 text-sm">تصویر محصول به‌زودی در دسترس خواهد بود</p>
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
    </article>
  );
}
