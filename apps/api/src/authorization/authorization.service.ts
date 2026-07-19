import { Injectable } from "@nestjs/common";
import { AuthorizationRepository } from "./authorization.repository";

@Injectable()
export class AuthorizationService {
  constructor(private readonly authorizationRepository: AuthorizationRepository) {}

  async hasAnyRole(userId: string, roleCodes: readonly string[]): Promise<boolean> {
    const requestedCodes = normalizeCodes(roleCodes);

    if (requestedCodes.length === 0) {
      return false;
    }

    const assignedCodes = await this.authorizationRepository.findRoleCodesForActiveUser(
      userId,
      requestedCodes,
    );

    return assignedCodes.length > 0;
  }

  async hasAllPermissions(userId: string, permissionCodes: readonly string[]): Promise<boolean> {
    const requestedCodes = normalizeCodes(permissionCodes);

    if (requestedCodes.length === 0) {
      return false;
    }

    const assignedCodes = await this.authorizationRepository.findPermissionCodesForActiveUser(
      userId,
      requestedCodes,
    );

    return assignedCodes.length === requestedCodes.length;
  }
}

function normalizeCodes(codes: readonly string[]): string[] {
  return [...new Set(codes.map((code) => code.trim()).filter((code) => code.length > 0))];
}
