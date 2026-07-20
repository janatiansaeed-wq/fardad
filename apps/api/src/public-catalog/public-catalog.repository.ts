import { Injectable } from "@nestjs/common";
import { Prisma, ProductMediaType, ProductPublicationState, ProductStatus } from "@prisma/client";
import { PrismaService } from "../database";

const publicCategorySelect = Prisma.validator<Prisma.ProductCategorySelect>()({
  description: true,
  name: true,
  slug: true,
  sortOrder: true,
});

const publicCatalogCandidateSelect = Prisma.validator<Prisma.ProductSelect>()({
  category: {
    select: publicCategorySelect,
  },
  id: true,
  media: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      altText: true,
      mediaAssetId: true,
      mediaReference: true,
    },
    take: 1,
    where: {
      type: ProductMediaType.MAIN_IMAGE,
    },
  },
  name: true,
  shortDescription: true,
  slug: true,
});

const publicProductDetailCandidateSelect = Prisma.validator<Prisma.ProductSelect>()({
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  description: true,
  englishName: true,
  id: true,
  media: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      altText: true,
      mediaAssetId: true,
      mediaReference: true,
      type: true,
    },
    where: {
      type: {
        in: [ProductMediaType.MAIN_IMAGE, ProductMediaType.GALLERY_IMAGE],
      },
    },
  },
  metaDescription: true,
  metaTitle: true,
  name: true,
  shortDescription: true,
  slug: true,
});

export type PublicCategoryRecord = Prisma.ProductCategoryGetPayload<{
  select: typeof publicCategorySelect;
}>;

export type PublicCatalogCandidate = Prisma.ProductGetPayload<{
  select: typeof publicCatalogCandidateSelect;
}>;

export type PublicProductDetailCandidate = Prisma.ProductGetPayload<{
  select: typeof publicProductDetailCandidateSelect;
}>;

@Injectable()
export class PublicCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveCategories(): Promise<PublicCategoryRecord[]> {
    return this.prisma.productCategory.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      select: publicCategorySelect,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  findActiveCategory(slug: string): Promise<PublicCategoryRecord | null> {
    return this.prisma.productCategory.findFirst({
      where: {
        deletedAt: null,
        isActive: true,
        slug,
      },
      select: publicCategorySelect,
    });
  }

  findLifecycleEligibleProducts(categorySlug?: string): Promise<PublicCatalogCandidate[]> {
    const now = new Date();

    return this.prisma.product.findMany({
      where: publicProductLifecycleWhere(now, categorySlug),
      select: publicCatalogCandidateSelect,
      orderBy: [{ publishedAt: "desc" }, { slug: "asc" }],
    });
  }

  findLifecycleEligibleProductBySlug(slug: string): Promise<PublicProductDetailCandidate | null> {
    const now = new Date();

    return this.prisma.product.findFirst({
      where: {
        ...publicProductLifecycleWhere(now),
        slug,
      },
      select: publicProductDetailCandidateSelect,
    });
  }
}

export function publicProductLifecycleWhere(
  now: Date,
  categorySlug?: string,
): Prisma.ProductWhereInput {
  return {
    category: {
      is: {
        deletedAt: null,
        ...(categorySlug ? { slug: categorySlug } : {}),
        isActive: true,
      },
    },
    deletedAt: null,
    publicationState: ProductPublicationState.PUBLISHED,
    publishedAt: {
      lte: now,
      not: null,
    },
    status: ProductStatus.ACTIVE,
  };
}
