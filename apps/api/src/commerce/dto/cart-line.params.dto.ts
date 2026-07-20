import { IsString, Matches } from "class-validator";

export class CartLineParamsDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{22}$/)
  lineReference!: string;
}
