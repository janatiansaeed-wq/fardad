import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../authorization.constants";
import { AuthorizationService } from "../authorization.service";
import { getAuthenticatedUserId } from "./authorization.guard";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!permissions) {
      return false;
    }

    return this.authorizationService.hasAllPermissions(
      getAuthenticatedUserId(context),
      permissions,
    );
  }
}
