import { IsString, MaxLength, MinLength } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4_096)
  refreshToken!: string;
}
