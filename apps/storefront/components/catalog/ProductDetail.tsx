import Link from "next/link";
import type {
  LayoutDensityId,
  LocalizedContentProfile,
  PublicProductDetail as PublicProductDetailData,
} from "@fardad/types";
import Container from "@fardad/ui/Container";
import ProductMediaGallery from "./ProductMediaGallery";

type ProductDetailProps = Readonly<{
  content: LocalizedContentProfile["productDetail"];
  density: LayoutDensityId;
  product: PublicProductDetailData;
}>;

export default function ProductDetail({ content, density, product }: ProductDetailProps) {
  const descriptionHeadingId = `product-description-${product.slug}`;

  return (
    <Container className="py-10 lg:py-16">
      <nav aria-label={content.breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--ui-color-muted-text,#4b5563)]">
          <li>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              {content.productsLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/products/category/${encodeURIComponent(product.category.slug)}`}
              className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--ui-color-text,#111827)]">
            {product.name}
          </li>
        </ol>
      </nav>

      <article data-density={density} className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductMediaGallery content={content} product={product} />

        <div>
          <p className="text-sm font-medium text-[var(--ui-color-muted-text,#4b5563)]">
            {content.categoryLabel}
          </p>
          <Link
            href={`/products/category/${encodeURIComponent(product.category.slug)}`}
            className="mt-2 inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] text-[var(--ui-color-primary,#1f2937)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-5 text-4xl font-black leading-tight text-[var(--ui-color-primary,#1f2937)] lg:text-5xl">
            {product.name}
          </h1>
          {product.englishName ? (
            <p
              lang="en"
              dir="ltr"
              className="mt-3 text-left text-lg text-[var(--ui-color-muted-text,#4b5563)]"
            >
              {product.englishName}
            </p>
          ) : null}
          <p className="mt-7 text-lg leading-9 text-[var(--ui-color-text,#111827)]">
            {product.shortDescription}
          </p>

          <section
            aria-labelledby={descriptionHeadingId}
            className="mt-10 border-t border-[var(--ui-color-border,#d1d5db)] pt-8"
          >
            <h2
              id={descriptionHeadingId}
              className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]"
            >
              {content.descriptionHeading}
            </h2>
            <p className="mt-5 whitespace-pre-line leading-9 text-[var(--ui-color-muted-text,#4b5563)]">
              {product.description}
            </p>
          </section>
        </div>
      </article>
    </Container>
  );
}
