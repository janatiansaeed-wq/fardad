import { Module } from "@nestjs/common";
import { PrismaModule } from "../database";
import { AuthorizationRepository } from "./authorization.repository";
import { AuthorizationService } from "./authorization.service";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  exports: [AuthorizationService, AuthorizationGuard, PermissionsGuard, RolesGuard],
  imports: [PrismaModule],
  providers: [
    AuthorizationRepository,
    AuthorizationService,
    AuthorizationGuard,
    PermissionsGuard,
    RolesGuard,
  ],
})
export class AuthorizationModule {}
