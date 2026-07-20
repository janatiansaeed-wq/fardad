import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@fardad/ui/Container";
import CatalogEmptyState from "@/components/catalog/CatalogEmptyState";
import CatalogPagination from "@/components/catalog/CatalogPagination";
import ProductGrid from "@/components/catalog/ProductGrid";
import { createCatalogMetadata } from "@/src/lib/catalog-metadata";
import {
  getPublicCategoryProducts,
  normalizeCatalogPage,
  PublicCatalogNotFoundError,
} from "@/src/lib/api/public-catalog";

type CategoryProductsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export const dynamic = "force-dynamic";

async function getCategoryCatalog({ params, searchParams }: CategoryProductsPageProps) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const currentPage = normalizeCatalogPage(page);

  try {
    return {
      catalog: await getPublicCategoryProducts(slug, currentPage),
      currentPage,
      slug,
    };
  } catch (error) {
    if (error instanceof PublicCatalogNotFoundError) {
      notFound();
    }

    throw error;
  }
}

export async function generateMetadata(props: CategoryProductsPageProps): Promise<Metadata> {
  const { catalog, currentPage, slug } = await getCategoryCatalog(props);
  const category = catalog.category;

  if (!category) {
    notFound();
  }

  return createCatalogMetadata({
    canonicalPath: `/products/category/${slug}`,
    description: category.description ?? `محصولات دسته‌بندی ${category.name} در فرداد.`,
    page: currentPage,
    title: category.name,
  });
}

export default async function CategoryProductsPage(props: CategoryProductsPageProps) {
  const { catalog, slug } = await getCategoryCatalog(props);
  const category = catalog.category;

  if (!category) {
    notFound();
  }

  return (
    <Container className="py-12 lg:py-16">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-medium text-[var(--ui-color-muted-text,#4b5563)]">دسته‌بندی محصولات</p>
        <h1 className="mt-2 text-4xl font-bold text-[var(--ui-color-primary,#1f2937)]">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-4 leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
            {category.description}
          </p>
        ) : null}
      </header>

      {catalog.items.length ? (
        <>
          <ProductGrid products={catalog.items} />
          <CatalogPagination
            basePath={`/products/category/${slug}`}
            pagination={catalog.pagination}
          />
        </>
      ) : (
        <CatalogEmptyState categoryName={category.name} />
      )}
    </Container>
  );
}
