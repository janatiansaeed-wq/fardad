import "server-only";

import type {
  PublicCategorySummary,
  PublicProductDetail,
  PublicProductListResponse,
} from "@fardad/types";

const catalogRevalidationSeconds = 60;
const maximumCatalogPage = 1_000;
const apiBaseUrl = (process.env.STOREFRONT_API_BASE_URL ?? "http://localhost:4000/api/v1").replace(
  /\/$/,
  "",
);

export class PublicCatalogNotFoundError extends Error {
  constructor() {
    super("Public catalog resource not found");
  }
}

export class PublicCatalogRequestError extends Error {
  constructor() {
    super("Public catalog request failed");
  }
}

export function normalizeCatalogPage(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue);

  if (!rawValue || !Number.isInteger(page) || page < 1 || page > maximumCatalogPage) {
    return 1;
  }

  return page;
}

export async function getPublicCategories(): Promise<readonly PublicCategorySummary[]> {
  return request<readonly PublicCategorySummary[]>("public/catalog/categories", [
    "public-catalog-categories",
  ]);
}

export async function getPublicProducts(page: number): Promise<PublicProductListResponse> {
  return request<PublicProductListResponse>(`public/catalog/products?page=${page}`, [
    "public-catalog",
  ]);
}

export async function getPublicProduct(slug: string): Promise<PublicProductDetail> {
  return request<PublicProductDetail>(`public/catalog/products/${encodeURIComponent(slug)}`, [
    "public-catalog",
    `public-product-${slug}`,
  ]);
}

export async function getPublicCategoryProducts(
  slug: string,
  page: number,
): Promise<PublicProductListResponse> {
  return request<PublicProductListResponse>(
    `public/catalog/categories/${encodeURIComponent(slug)}/products?page=${page}`,
    ["public-catalog", `public-catalog-category-${slug}`],
  );
}

async function request<T>(path: string, tags: readonly string[]): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/${path}`, {
      next: {
        revalidate: catalogRevalidationSeconds,
        tags: [...tags],
      },
    });
  } catch {
    throw new PublicCatalogRequestError();
  }

  if (response.status === 404) {
    throw new PublicCatalogNotFoundError();
  }

  if (!response.ok) {
    throw new PublicCatalogRequestError();
  }

  return (await response.json()) as T;
}
