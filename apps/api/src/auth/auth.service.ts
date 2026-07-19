import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma, UserRole } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { env } from "../config";
import { AuthRepository, UserWithCredential } from "./auth.repository";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PasswordHasher } from "./password-hasher";
import { RefreshTokenPayload, TokenPayload } from "./token.types";
import { TokenHasher } from "./token-hasher";

const invalidCredentialsMessage = "Invalid credentials";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto, userAgent?: string) {
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new ConflictException("An account already exists for this email address");
    }

    const passwordHash = await PasswordHasher.hash(input.password);
    let user: UserWithCredential;

    try {
      user = await this.authRepository.createUserWithPassword(input.email, passwordHash);
    } catch (error) {
      if (this.isEmailConflict(error)) {
        throw new ConflictException("An account already exists for this email address");
      }

      throw error;
    }

    return this.createSessionTokens(user, input.deviceName, userAgent);
  }

  async login(input: LoginDto, userAgent?: string) {
    const user = await this.authRepository.findUserByEmail(input.email);
    const credential = user?.passwordCredential;

    if (!user || !credential || !user.isActive || this.isLocked(credential.lockedUntil)) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    const isPasswordValid = await PasswordHasher.verify(input.password, credential.passwordHash);

    if (!isPasswordValid) {
      await this.recordFailedLogin(user);
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    await this.authRepository.resetPasswordFailures(user.id);

    return this.createSessionTokens(user, input.deviceName, userAgent);
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const token = await this.authRepository.findRefreshToken(payload.jti);

    if (!token || !this.isRefreshTokenValid(token, refreshToken, payload)) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const expiresAt = this.getRefreshExpiry();
    const wasRevoked = await this.authRepository.revokeActiveRefreshToken(token.id);

    if (!wasRevoked) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.authRepository.refreshSession(token.sessionId, expiresAt);

    return this.issueTokens(token.session.user, token.sessionId, expiresAt);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const payload = await this.verifyRefreshToken(refreshToken);

    if (payload.sub !== userId) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const token = await this.authRepository.findRefreshToken(payload.jti);

    if (!token || !this.isRefreshTokenValid(token, refreshToken, payload)) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.authRepository.revokeSession(token.sessionId);
  }

  getIdentity(payload: TokenPayload) {
    return {
      email: payload.email,
      id: payload.sub,
      role: payload.role,
    };
  }

  private async createSessionTokens(
    user: UserWithCredential,
    deviceName?: string,
    userAgent?: string,
  ) {
    const sessionId = randomUUID();
    const expiresAt = this.getRefreshExpiry();

    await this.authRepository.createSession({
      deviceName,
      expiresAt,
      id: sessionId,
      userAgent: userAgent?.slice(0, 512),
      userId: user.id,
    });

    return this.issueTokens(user, sessionId, expiresAt);
  }

  private async issueTokens(
    user: { email: string; id: string; role: UserRole },
    sessionId: string,
    refreshExpiresAt: Date,
  ) {
    const refreshTokenId = randomUUID();
    const accessPayload: TokenPayload = {
      email: user.email,
      role: user.role,
      sub: user.id,
      type: "access",
    };
    const refreshPayload: RefreshTokenPayload = {
      jti: refreshTokenId,
      role: user.role,
      sid: sessionId,
      sub: user.id,
      type: "refresh",
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: env.JWT_ACCESS_TTL_SECONDS,
        secret: env.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(refreshPayload, {
        expiresIn: env.JWT_REFRESH_TTL_SECONDS,
        secret: env.JWT_REFRESH_SECRET,
      }),
    ]);

    await this.authRepository.createRefreshToken({
      expiresAt: refreshExpiresAt,
      id: refreshTokenId,
      sessionId,
      tokenHash: TokenHasher.hash(refreshToken),
    });

    return {
      accessToken,
      refreshToken,
      user: this.authRepository.toIdentity(user),
    };
  }

  private getRefreshExpiry(): Date {
    return new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1_000);
  }

  private isLocked(lockedUntil: Date | null): boolean {
    return lockedUntil !== null && lockedUntil > new Date();
  }

  private async recordFailedLogin(user: UserWithCredential): Promise<void> {
    const credential = user.passwordCredential;

    if (!credential) {
      return;
    }

    const failedLoginAttempts = credential.failedLoginAttempts + 1;
    const lockedUntil =
      failedLoginAttempts >= env.AUTH_MAX_LOGIN_ATTEMPTS
        ? new Date(Date.now() + env.AUTH_LOGIN_LOCK_MINUTES * 60_000)
        : null;

    await this.authRepository.recordPasswordFailure(user.id, failedLoginAttempts, lockedUntil);
  }

  private async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: env.JWT_REFRESH_SECRET,
      });

      if (payload.type !== "refresh" || !payload.jti || !payload.sid) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      return payload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private isEmailConflict(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }

  private isRefreshTokenValid(
    token: {
      expiresAt: Date;
      revokedAt: Date | null;
      session: { expiresAt: Date; revokedAt: Date | null; user: { isActive: boolean } };
      sessionId: string;
      tokenHash: string;
    },
    refreshToken: string,
    payload: RefreshTokenPayload,
  ): boolean {
    return (
      token.expiresAt > new Date() &&
      token.revokedAt === null &&
      token.session.expiresAt > new Date() &&
      token.session.revokedAt === null &&
      token.session.user.isActive &&
      TokenHasher.matches(refreshToken, token.tokenHash) &&
      payload.sid === token.sessionId
    );
  }
}
