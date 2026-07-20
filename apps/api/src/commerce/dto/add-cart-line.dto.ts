import { Transform } from "class-transformer";
import { IsInt, IsString, Matches, Max, MaxLength, Min } from "class-validator";

export class AddCartLineDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  productSlug!: string;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}
