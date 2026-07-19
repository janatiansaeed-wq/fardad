import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { ProductLevel, ProductPublicationState, ProductStatus } from "@prisma/client";

export class CreateProductDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  englishName?: string;

  @IsOptional()
  @IsEnum(ProductLevel)
  level?: ProductLevel;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsEnum(ProductPublicationState)
  publicationState?: ProductPublicationState;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  productType?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2_000)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
