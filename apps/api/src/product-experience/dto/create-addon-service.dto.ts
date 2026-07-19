import { IsEnum, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { CommerceExtensionStatus } from "@prisma/client";

export class CreateAddonServiceDto {
  @IsOptional()
  @IsObject()
  configurationSchema?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  description?: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsEnum(CommerceExtensionStatus)
  status?: CommerceExtensionStatus;

  @IsString()
  @MaxLength(100)
  type!: string;
}
