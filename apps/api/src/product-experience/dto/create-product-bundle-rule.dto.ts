import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from "class-validator";
import { CommerceExtensionStatus } from "@prisma/client";

export class CreateProductBundleRuleDto {
  @IsObject()
  actionDefinition!: Record<string, unknown>;

  @IsString()
  @MaxLength(150)
  code!: string;

  @IsObject()
  conditionDefinition!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  description?: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsEnum(CommerceExtensionStatus)
  status?: CommerceExtensionStatus;
}
