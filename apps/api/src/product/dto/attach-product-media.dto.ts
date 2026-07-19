import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ProductMediaType } from "@prisma/client";

export class AttachProductMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @IsString()
  @MaxLength(500)
  mediaReference!: string;

  @IsUUID()
  productId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsEnum(ProductMediaType)
  type!: ProductMediaType;
}
