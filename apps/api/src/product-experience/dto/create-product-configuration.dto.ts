import { ArrayUnique, IsArray, IsObject, IsOptional, IsUUID } from "class-validator";

export class CreateProductConfigurationDto {
  @IsOptional()
  @ArrayUnique()
  @IsArray()
  @IsUUID("4", { each: true })
  addonServiceIds?: string[];

  @IsOptional()
  @IsUUID()
  giftBoxId?: string;

  @IsOptional()
  @IsObject()
  personalizationData?: Record<string, unknown>;

  @IsUUID()
  productId!: string;
}
