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
} from "@/src/lib/api/public-catalog";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

type ProductsPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export const dynamic = "force-dynamic";

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
  const [catalog, categories] = await Promise.all([
    getPublicProducts(currentPage),
    getPublicCategories(),
  ]);

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

      <CategoryDiscovery categories={categories} ariaLabel={content.categoryNavigationLabel} />

      {catalog.items.length ? (
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
