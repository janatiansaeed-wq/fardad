import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductConfigurationDto } from "./dto/create-product-configuration.dto";
import { ProductExperienceRepository } from "./product-experience.repository";
import { ProductConfigurationValidationResult } from "./product-experience.types";

@Injectable()
export class ProductExperienceService {
  constructor(private readonly productExperienceRepository: ProductExperienceRepository) {}

  async validateConfiguration(
    input: CreateProductConfigurationDto,
  ): Promise<ProductConfigurationValidationResult> {
    const product = await this.productExperienceRepository.findAvailableOptions(input.productId);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const availableGiftBoxIds = new Set(product.giftBoxes.map((option) => option.giftBoxId));
    const availableAddonServiceIds = new Set(
      product.addonServices.map((option) => option.addonServiceId),
    );
    const selectedAddonServiceIds = [...new Set(input.addonServiceIds ?? [])];
    const unavailableAddonServiceIds = selectedAddonServiceIds.filter(
      (addonServiceId) => !availableAddonServiceIds.has(addonServiceId),
    );
    const unavailableGiftBoxId = input.giftBoxId
      ? availableGiftBoxIds.has(input.giftBoxId)
        ? undefined
        : input.giftBoxId
      : undefined;

    return {
      isValid: unavailableAddonServiceIds.length === 0 && unavailableGiftBoxId === undefined,
      unavailableAddonServiceIds,
      unavailableGiftBoxId,
    };
  }
}
