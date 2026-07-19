import { Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthenticatedRequest } from "./token.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() input: RegisterDto, @Headers("user-agent") userAgent?: string) {
    return this.authService.register(input, userAgent);
  }

  @Post("login")
  login(@Body() input: LoginDto, @Headers("user-agent") userAgent?: string) {
    return this.authService.login(input, userAgent);
  }

  @Post("refresh")
  refresh(@Body() input: RefreshTokenDto) {
    return this.authService.refresh(input.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Body() input: LogoutDto, @Req() request: AuthenticatedRequest) {
    await this.authService.logout(request.user.sub, input.refreshToken);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return this.authService.getIdentity(request.user);
  }
}
