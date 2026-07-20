import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductMediaType } from "@prisma/client";
import { PublicMediaDescriptor, PublicMediaResolverService } from "../media";
import { ProductDataQualityService } from "../product";
import {
  PublicCatalogCandidate,
  PublicCatalogRepository,
  PublicCategoryRecord,
  PublicProductDetailCandidate,
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

type PublicProductImage = {
  alt: string;
  src: string;
};

type PublicProductDetail = {
  category: Pick<PublicCategorySummary, "name" | "slug">;
  description: string;
  englishName?: string;
  gallery: PublicProductImage[];
  mainImage: PublicProductImage | null;
  name: string;
  seo: {
    description?: string;
    title?: string;
  };
  shortDescription: string;
  slug: string;
};

@Injectable()
export class PublicCatalogService {
  constructor(
    private readonly publicMediaResolver: PublicMediaResolverService,
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

  async getProductBySlug(slug: string): Promise<PublicProductDetail> {
    const candidate = await this.publicCatalogRepository.findLifecycleEligibleProductBySlug(slug);

    if (!candidate) {
      throw productNotFound();
    }

    let isPublicationReady: boolean;

    try {
      const quality = await this.productDataQualityService.evaluate(candidate.id);
      isPublicationReady = quality.isPublicationReady;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw productNotFound();
      }

      throw error;
    }

    if (!isPublicationReady) {
      throw productNotFound();
    }

    return this.toPublicProductDetail(candidate);
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

    const publishableCandidates = qualityResults.flatMap(({ candidate, quality }) =>
      quality.isPublicationReady ? [candidate] : [],
    );
    const linkedReferences = publishableCandidates.flatMap((candidate) => {
      const mainImage = candidate.media[0];
      return mainImage?.mediaAssetId ? [mainImage.mediaReference] : [];
    });
    const resolvedImages = await this.publicMediaResolver.resolveMany(linkedReferences, "card");

    return publishableCandidates.flatMap((candidate) => {
      const mainImage = candidate.media[0];
      const resolvedImage = mainImage?.mediaAssetId
        ? (resolvedImages.get(mainImage.mediaReference) ?? null)
        : null;

      const card = this.toPublicProductCard(candidate, resolvedImage);
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

  private async toPublicProductDetail(
    candidate: PublicProductDetailCandidate,
  ): Promise<PublicProductDetail> {
    const name = candidate.name?.trim();
    const slug = candidate.slug?.trim();
    const shortDescription = candidate.shortDescription?.trim();
    const description = candidate.description?.trim();
    const categoryName = candidate.category?.name.trim();
    const categorySlug = candidate.category?.slug.trim();

    if (
      !candidate.category ||
      !categoryName ||
      !categorySlug ||
      !name ||
      !slug ||
      !shortDescription ||
      !description
    ) {
      throw productNotFound();
    }

    const mainMedia = candidate.media.find((media) => media.type === ProductMediaType.MAIN_IMAGE);
    const galleryMedia = candidate.media.filter(
      (media) => media.type === ProductMediaType.GALLERY_IMAGE,
    );
    const mainReferences = mainMedia?.mediaAssetId ? [mainMedia.mediaReference] : [];
    const galleryReferences = galleryMedia.flatMap((media) =>
      media.mediaAssetId ? [media.mediaReference] : [],
    );
    const [resolvedMain, resolvedGallery] = await Promise.all([
      this.publicMediaResolver.resolveMany(mainReferences, "detail"),
      this.publicMediaResolver.resolveMany(galleryReferences, "gallery"),
    ]);
    const mainDescriptor = mainMedia?.mediaAssetId
      ? (resolvedMain.get(mainMedia.mediaReference) ?? null)
      : null;
    const englishName = candidate.englishName?.trim();
    const metaTitle = candidate.metaTitle?.trim();
    const metaDescription = candidate.metaDescription?.trim();

    return {
      category: {
        name: categoryName,
        slug: categorySlug,
      },
      description,
      ...(englishName ? { englishName } : {}),
      gallery: galleryMedia.flatMap((media) => {
        if (!media.mediaAssetId) {
          return [];
        }

        const descriptor = resolvedGallery.get(media.mediaReference) ?? null;
        return descriptor ? [this.toPublicProductImage(media, name, descriptor)] : [];
      }),
      mainImage:
        mainMedia && mainDescriptor
          ? this.toPublicProductImage(mainMedia, name, mainDescriptor)
          : null,
      name,
      seo: {
        ...(metaTitle ? { title: metaTitle } : {}),
        ...(metaDescription ? { description: metaDescription } : {}),
      },
      shortDescription,
      slug,
    };
  }

  private toPublicProductImage(
    media: PublicProductDetailCandidate["media"][number],
    productName: string,
    descriptor: PublicMediaDescriptor,
  ): PublicProductImage {
    return {
      alt: media.altText?.trim() || productName,
      src: descriptor.src,
    };
  }

  private toPublicProductCard(
    candidate: PublicCatalogCandidate,
    resolvedImage: PublicMediaDescriptor | null,
  ): PublicProductCard | null {
    if (!candidate.category || !candidate.name || !candidate.shortDescription || !candidate.slug) {
      return null;
    }

    const explicitAlt = candidate.media[0]?.altText?.trim();

    return {
      category: {
        name: candidate.category.name,
        slug: candidate.category.slug,
      },
      image: resolvedImage
        ? {
            alt: explicitAlt || candidate.name,
            src: resolvedImage.src,
          }
        : null,
      name: candidate.name,
      shortDescription: candidate.shortDescription,
      slug: candidate.slug,
    };
  }
}

function productNotFound(): NotFoundException {
  return new NotFoundException("Product not found");
}
