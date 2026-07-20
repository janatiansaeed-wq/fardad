export type PublicCategorySummary = Readonly<{
  name: string;
  slug: string;
  description?: string;
}>;

export type PublicProductImage = Readonly<{
  src: string;
  alt: string;
}>;

export type PublicProductCard = Readonly<{
  name: string;
  slug: string;
  shortDescription: string;
  category: Pick<PublicCategorySummary, "name" | "slug">;
  image: PublicProductImage | null;
}>;

export type PublicProductDetail = Readonly<{
  name: string;
  englishName?: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: Pick<PublicCategorySummary, "name" | "slug">;
  mainImage: PublicProductImage | null;
  gallery: readonly PublicProductImage[];
  seo: Readonly<{
    title?: string;
    description?: string;
  }>;
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
