export type PublicCategorySummary = Readonly<{
  name: string;
  slug: string;
  description?: string;
}>;

export type PublicProductCard = Readonly<{
  name: string;
  slug: string;
  shortDescription: string;
  category: Pick<PublicCategorySummary, "name" | "slug">;
  image: Readonly<{
    src: string;
    alt: string;
  }> | null;
}>;

export type CatalogPagination = Readonly<{
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}>;

export type PublicProductListResponse = Readonly<{
  category?: PublicCategorySummary;
  items: readonly PublicProductCard[];
  pagination: CatalogPagination;
}>;
