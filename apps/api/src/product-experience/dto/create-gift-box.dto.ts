import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { CommerceExtensionStatus } from "@prisma/client";

export class CreateGiftBoxDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  dimensionUnit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  material?: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsEnum(CommerceExtensionStatus)
  status?: CommerceExtensionStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  weightUnit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  width?: number;
}
