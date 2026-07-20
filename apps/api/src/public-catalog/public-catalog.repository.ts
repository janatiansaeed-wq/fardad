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

export type PublicCategoryRecord = Prisma.ProductCategoryGetPayload<{
  select: typeof publicCategorySelect;
}>;

export type PublicCatalogCandidate = Prisma.ProductGetPayload<{
  select: typeof publicCatalogCandidateSelect;
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
      where: {
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
      },
      select: publicCatalogCandidateSelect,
      orderBy: [{ publishedAt: "desc" }, { slug: "asc" }],
    });
  }
}
