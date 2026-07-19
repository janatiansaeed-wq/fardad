import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProductMediaType } from "@prisma/client";
import { ProductRepository, ProductQualityContext } from "./product.repository";
import { ProductDataQualityMissingRule, ProductDataQualityResult } from "./product-data-quality.types";

@Injectable()
export class ProductDataQualityService {
  constructor(private readonly productRepository: ProductRepository) {}

  async evaluate(productId: string): Promise<ProductDataQualityResult> {
    const product = await this.productRepository.findQualityContext(productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const rules = await this.productRepository.findActiveChecklistRules(product.categoryId);
    const manualStatuses = new Map(
      product.checklistStatuses.map((status) => [status.rule.code, status.isCompleted]),
    );
    const completedWeight = rules.reduce(
      (total, rule) => total + (this.isRuleCompleted(rule.code, product, manualStatuses) ? Number(rule.weight) : 0),
      0,
    );
    const totalWeight = rules.reduce((total, rule) => total + Number(rule.weight), 0);
    const missingRequiredFields = rules
      .filter((rule) => rule.isRequired && !this.isRuleCompleted(rule.code, product, manualStatuses))
      .map<ProductDataQualityMissingRule>((rule) => ({
        code: rule.code,
        isCritical: rule.isCritical,
        name: rule.name,
      }));

    return {
      completionPercentage: totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100),
      isPublicationReady: !missingRequiredFields.some((rule) => rule.isCritical),
      missingRequiredFields,
    };
  }

  private isRuleCompleted(
    code: string,
    product: ProductQualityContext,
    manualStatuses: Map<string, boolean>,
  ): boolean {
    const automatedChecks: Record<string, boolean> = {
      "attributes.required": this.hasRequiredAttributeValues(product),
      "basic.category":
        product.category !== null && product.category.isActive && product.category.deletedAt === null,
      "basic.full-description": hasText(product.description),
      "basic.name": hasText(product.name),
      "basic.short-description": hasText(product.shortDescription),
      "basic.slug": hasText(product.slug),
      "classification.level": product.level !== null,
      "media.alt-text": product.media.length > 0 && product.media.every((media) => hasText(media.altText)),
      "media.detail-image": hasMediaType(product, ProductMediaType.DETAIL_IMAGE),
      "media.gallery-image": hasMediaType(product, ProductMediaType.GALLERY_IMAGE),
      "media.lifestyle-image": hasMediaType(product, ProductMediaType.LIFESTYLE_IMAGE),
      "media.main-image": hasMediaType(product, ProductMediaType.MAIN_IMAGE),
      "media.packaging-image": hasMediaType(product, ProductMediaType.PACKAGING_IMAGE),
      "seo.meta-description": hasText(product.metaDescription),
      "seo.meta-title": hasText(product.metaTitle),
    };

    return automatedChecks[code] ?? manualStatuses.get(code) ?? false;
  }

  private hasRequiredAttributeValues(product: ProductQualityContext): boolean {
    if (!product.category) {
      return false;
    }

    const valuesByAttributeId = new Map(
      product.attributeValues.map((attributeValue) => [attributeValue.attributeId, attributeValue.value]),
    );

    return product.category.attributeRequirements.every((requirement) => {
      const value = valuesByAttributeId.get(requirement.attributeId);

      if (value === undefined) {
        return false;
      }

      return hasMeaningfulJsonValue(value);
    });
  }
}

function hasMediaType(product: ProductQualityContext, type: ProductMediaType): boolean {
  return product.media.some((media) => media.type === type);
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasMeaningfulJsonValue(value: Prisma.JsonValue): boolean {
  if (value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0 && value.some((item) => hasMeaningfulJsonValue(item));
  }

  return Object.values(value).some(
    (item) => item !== undefined && hasMeaningfulJsonValue(item),
  );
}
