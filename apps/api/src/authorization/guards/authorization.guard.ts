import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthenticatedRequest } from "../../auth";
import { PERMISSIONS_KEY, ROLES_KEY } from "../authorization.constants";
import { AuthorizationService } from "../authorization.service";

/**
 * Enforces a complete route policy. A route with no policy is denied.
 * Apply this guard after JwtAuthGuard so request.user is established by Passport.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = getAuthenticatedUserId(context);
    const roles = this.getMetadata(ROLES_KEY, context);
    const permissions = this.getMetadata(PERMISSIONS_KEY, context);

    if (!roles && !permissions) {
      return false;
    }

    if (roles && !(await this.authorizationService.hasAnyRole(userId, roles))) {
      return false;
    }

    if (permissions && !(await this.authorizationService.hasAllPermissions(userId, permissions))) {
      return false;
    }

    return true;
  }

  private getMetadata(key: string, context: ExecutionContext): string[] | undefined {
    return this.reflector.getAllAndOverride<string[]>(key, [context.getHandler(), context.getClass()]);
  }
}

export function getAuthenticatedUserId(context: ExecutionContext): string {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  const userId = request.user?.sub;

  if (!userId) {
    throw new UnauthorizedException();
  }

  return userId;
}
