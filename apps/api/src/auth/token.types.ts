import { UserRole } from "@prisma/client";

export interface TokenPayload {
  email: string;
  role: UserRole;
  sub: string;
  type: "access";
}

export interface RefreshTokenPayload {
  jti: string;
  role: UserRole;
  sid: string;
  sub: string;
  type: "refresh";
}

export interface AuthenticatedRequest {
  user: TokenPayload;
}
