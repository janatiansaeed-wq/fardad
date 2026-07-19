import { SetMetadata } from "@nestjs/common";
import { PERMISSIONS_KEY } from "../authorization.constants";
import { validateAccessCodes } from "./roles.decorator";

export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, validateAccessCodes(permissions));
