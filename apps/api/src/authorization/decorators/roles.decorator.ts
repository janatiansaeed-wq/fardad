import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "../authorization.constants";

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, validateAccessCodes(roles));

export function validateAccessCodes(codes: readonly string[]): string[] {
  const normalizedCodes = [...new Set(codes.map((code) => code.trim()))];

  if (normalizedCodes.length === 0 || normalizedCodes.some((code) => code.length === 0)) {
    throw new Error("At least one non-empty authorization code is required");
  }

  return normalizedCodes;
}
