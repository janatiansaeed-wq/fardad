import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database";

const userWithCredential = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    passwordCredential: true,
    roleAssignments: {
      include: {
        role: {
          select: {
            code: true,
          },
        },
      },
      orderBy: {
        role: {
          code: "asc",
        },
      },
    },
  },
});

export type UserWithCredential = Prisma.UserGetPayload<typeof userWithCredential>;

export interface AuthIdentity {
  email: string;
  id: string;
  roles: string[];
}

type RoleAssignedUser = Pick<UserWithCredential, "email" | "id" | "roleAssignments">;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string): Promise<UserWithCredential | null> {
    return this.prisma.user.findUnique({
      where: { email },
      ...userWithCredential,
    });
  }

  createUserWithPassword(email: string, passwordHash: string): Promise<UserWithCredential> {
    return this.prisma.user.create({
      data: {
        email,
        passwordCredential: {
          create: {
            passwordHash,
          },
        },
      },
      ...userWithCredential,
    });
  }

  resetPasswordFailures(userId: string): Promise<void> {
    return this.prisma.passwordCredential
      .update({
        where: { userId },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      })
      .then(() => undefined);
  }

  recordPasswordFailure(
    userId: string,
    failedLoginAttempts: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    return this.prisma.passwordCredential
      .update({
        where: { userId },
        data: {
          failedLoginAttempts,
          lockedUntil,
        },
      })
      .then(() => undefined);
  }

  createSession(input: {
    deviceName?: string;
    expiresAt: Date;
    id: string;
    userAgent?: string;
    userId: string;
  }): Promise<void> {
    return this.prisma.authSession
      .create({
        data: input,
      })
      .then(() => undefined);
  }

  createRefreshToken(input: {
    expiresAt: Date;
    id: string;
    sessionId: string;
    tokenHash: string;
  }): Promise<void> {
    return this.prisma.refreshToken
      .create({
        data: input,
      })
      .then(() => undefined);
  }

  findRefreshToken(id: string) {
    return this.prisma.refreshToken.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            user: {
              include: {
                roleAssignments: {
                  include: {
                    role: {
                      select: {
                        code: true,
                      },
                    },
                  },
                  orderBy: {
                    role: {
                      code: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  revokeActiveRefreshToken(id: string): Promise<boolean> {
    return this.prisma.refreshToken
      .updateMany({
        where: {
          id,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      })
      .then(({ count }) => count === 1);
  }

  refreshSession(sessionId: string, expiresAt: Date): Promise<void> {
    return this.prisma.authSession
      .update({
        where: { id: sessionId },
        data: {
          expiresAt,
          lastUsedAt: new Date(),
        },
      })
      .then(() => undefined);
  }

  revokeSession(sessionId: string): Promise<void> {
    return this.prisma.$transaction(async (transaction) => {
      const revokedAt = new Date();

      await transaction.authSession.update({
        where: { id: sessionId },
        data: { revokedAt },
      });

      await transaction.refreshToken.updateMany({
        where: {
          sessionId,
          revokedAt: null,
        },
        data: { revokedAt },
      });
    });
  }

  toIdentity(user: RoleAssignedUser): AuthIdentity {
    return {
      email: user.email,
      id: user.id,
      roles: user.roleAssignments.map(({ role }) => role.code),
    };
  }
}
