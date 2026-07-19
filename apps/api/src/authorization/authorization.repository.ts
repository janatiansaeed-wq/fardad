import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database";

@Injectable()
export class AuthorizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRoleCodesForActiveUser(userId: string, roleCodes: readonly string[]): Promise<string[]> {
    const assignments = await this.prisma.userRole.findMany({
      where: {
        role: {
          code: {
            in: [...roleCodes],
          },
        },
        user: {
          deletedAt: null,
          isActive: true,
        },
        userId,
      },
      select: {
        role: {
          select: {
            code: true,
          },
        },
      },
    });

    return assignments.map(({ role }) => role.code);
  }

  async findPermissionCodesForActiveUser(
    userId: string,
    permissionCodes: readonly string[],
  ): Promise<string[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        code: {
          in: [...permissionCodes],
        },
        roleAssignments: {
          some: {
            role: {
              userAssignments: {
                some: {
                  user: {
                    deletedAt: null,
                    isActive: true,
                  },
                  userId,
                },
              },
            },
          },
        },
      },
      select: {
        code: true,
      },
    });

    return permissions.map(({ code }) => code);
  }
}
