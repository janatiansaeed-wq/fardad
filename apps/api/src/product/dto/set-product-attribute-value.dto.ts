import { IsDefined, IsUUID } from "class-validator";

export class SetProductAttributeValueDto {
  @IsUUID()
  attributeId!: string;

  @IsUUID()
  productId!: string;

  @IsDefined()
  value!: unknown;
}
