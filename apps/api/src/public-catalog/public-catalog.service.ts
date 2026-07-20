import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductDataQualityService } from "../product";
import {
  PublicCatalogCandidate,
  PublicCatalogRepository,
  PublicCategoryRecord,
} from "./public-catalog.repository";

const publicCatalogPageSize = 12;

type PublicCategorySummary = {
  description?: string;
  name: string;
  slug: string;
};

type PublicProductCard = {
  category: Pick<PublicCategorySummary, "name" | "slug">;
  image: { alt: string; src: string } | null;
  name: string;
  shortDescription: string;
  slug: string;
};

type PublicProductListResponse = {
  category?: PublicCategorySummary;
  items: PublicProductCard[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

@Injectable()
export class PublicCatalogService {
  constructor(
    private readonly productDataQualityService: ProductDataQualityService,
    private readonly publicCatalogRepository: PublicCatalogRepository,
  ) {}

  async getCategories(): Promise<PublicCategorySummary[]> {
    const categories = await this.publicCatalogRepository.findActiveCategories();
    return categories.map((category) => this.toPublicCategory(category));
  }

  async getProducts(page: number): Promise<PublicProductListResponse> {
    const candidates = await this.publicCatalogRepository.findLifecycleEligibleProducts();
    return this.toPublicProductList(candidates, page);
  }

  async getCategoryProducts(slug: string, page: number): Promise<PublicProductListResponse> {
    const category = await this.publicCatalogRepository.findActiveCategory(slug);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const candidates = await this.publicCatalogRepository.findLifecycleEligibleProducts(slug);
    return this.toPublicProductList(candidates, page, this.toPublicCategory(category));
  }

  private async toPublicProductList(
    candidates: readonly PublicCatalogCandidate[],
    page: number,
    category?: PublicCategorySummary,
  ): Promise<PublicProductListResponse> {
    const items = await this.getPublishableCards(candidates);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / publicCatalogPageSize);
    const offset = (page - 1) * publicCatalogPageSize;

    return {
      ...(category ? { category } : {}),
      items: items.slice(offset, offset + publicCatalogPageSize),
      pagination: {
        page,
        pageSize: publicCatalogPageSize,
        totalItems,
        totalPages,
      },
    };
  }

  private async getPublishableCards(
    candidates: readonly PublicCatalogCandidate[],
  ): Promise<PublicProductCard[]> {
    const qualityResults = await Promise.all(
      candidates.map(async (candidate) => ({
        candidate,
        quality: await this.productDataQualityService.evaluate(candidate.id),
      })),
    );

    return qualityResults.flatMap(({ candidate, quality }) => {
      if (!quality.isPublicationReady) {
        return [];
      }

      const card = this.toPublicProductCard(candidate);
      return card ? [card] : [];
    });
  }

  private toPublicCategory(category: PublicCategoryRecord): PublicCategorySummary {
    return {
      ...(category.description ? { description: category.description } : {}),
      name: category.name,
      slug: category.slug,
    };
  }

  private toPublicProductCard(candidate: PublicCatalogCandidate): PublicProductCard | null {
    if (!candidate.category || !candidate.name || !candidate.shortDescription || !candidate.slug) {
      return null;
    }

    return {
      category: {
        name: candidate.category.name,
        slug: candidate.category.slug,
      },
      // Media references are provider-neutral internal values. Public delivery is deferred.
      image: null,
      name: candidate.name,
      shortDescription: candidate.shortDescription,
      slug: candidate.slug,
    };
  }
}
