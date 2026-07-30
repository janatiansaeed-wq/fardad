import type { Metadata } from "next";
import Container from "@fardad/ui/Container";
import CatalogEmptyState from "@/components/catalog/CatalogEmptyState";
import CatalogPagination from "@/components/catalog/CatalogPagination";
import CategoryDiscovery from "@/components/catalog/CategoryDiscovery";
import ProductGrid from "@/components/catalog/ProductGrid";
import { createCatalogMetadata } from "@/src/lib/catalog-metadata";
import {
  getPublicCategories,
  getPublicProducts,
  normalizeCatalogPage,
  PublicCatalogRequestError,
} from "@/src/lib/api/public-catalog";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

type ProductsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export const dynamic = "force-dynamic";

async function getCatalogPageData(page: number) {
  try {
    const [catalog, categories] = await Promise.all([
      getPublicProducts(page),
      getPublicCategories(),
    ]);

    return { catalog, categories };
  } catch (error) {
    if (error instanceof PublicCatalogRequestError) {
      return null;
    }

    throw error;
  }
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = normalizeCatalogPage(page);
  const { catalog } = getStorefrontProfile().content;

  return createCatalogMetadata({
    canonicalPath: "/products",
    description: catalog.metadataDescription,
    page: currentPage,
    title: catalog.metadataTitle,
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams;
  const currentPage = normalizeCatalogPage(page);
  const profile = getStorefrontProfile();
  const content = profile.content.catalog;
  const pageData = await getCatalogPageData(currentPage);
  const catalog = pageData?.catalog;

  return (
    <Container className="py-12 lg:py-16">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-[var(--ui-color-primary,#1f2937)]">
          {content.heading}
        </h1>
        <p className="mt-4 leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
          {content.introduction}
        </p>
      </header>

      <CategoryDiscovery
        categories={pageData?.categories ?? []}
        ariaLabel={content.categoryNavigationLabel}
      />

      {catalog?.items.length ? (
        <>
          <ProductGrid
            products={catalog.items}
            content={content}
            variant={profile.experience.productCard}
          />
          <CatalogPagination
            basePath="/products"
            content={content}
            pagination={catalog.pagination}
          />
        </>
      ) : (
        <CatalogEmptyState content={content} />
      )}
    </Container>
  );
}
