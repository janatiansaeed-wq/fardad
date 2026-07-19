import { IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class UpsertProductLogisticsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  finalShippingWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageHeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageWidth?: number;

  @IsUUID()
  productId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  width?: number;
}
