import { applyDecorators } from "@nestjs/common";
import { AccessPolicy } from "../authorization.types";
import { Permissions } from "./permissions.decorator";
import { Roles } from "./roles.decorator";

/**
 * Declares the RBAC policy for a route or controller.
 *
 * When both role and permission criteria are supplied, both must be satisfied.
 */
export function RequireAccess(policy: AccessPolicy): MethodDecorator & ClassDecorator {
  const decorators: Array<MethodDecorator | ClassDecorator> = [];

  if (policy.roles) {
    decorators.push(Roles(...policy.roles));
  }

  if (policy.permissions) {
    decorators.push(Permissions(...policy.permissions));
  }

  if (decorators.length === 0) {
    throw new Error("An access policy must require at least one role or permission");
  }

  return applyDecorators(...decorators);
}
