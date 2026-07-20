import { IsString, Matches, MaxLength } from "class-validator";

export class PublicCategorySlugParamsDto {
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;
}
