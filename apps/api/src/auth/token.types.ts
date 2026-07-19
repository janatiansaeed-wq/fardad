export interface TokenPayload {
  email: string;
  roles: string[];
  sub: string;
  type: "access";
}

export interface RefreshTokenPayload {
  jti: string;
  roles: string[];
  sid: string;
  sub: string;
  type: "refresh";
}

export interface AuthenticatedRequest {
  user: TokenPayload;
}
