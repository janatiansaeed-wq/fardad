import { Injectable } from "@nestjs/common";
import { CommerceExtensionStatus } from "@prisma/client";
import { PrismaService } from "../database";

@Injectable()
export class ProductExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAvailableOptions(productId: string) {
    return this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        id: productId,
      },
      select: {
        addonServices: {
          where: {
            addonService: {
              status: CommerceExtensionStatus.ACTIVE,
            },
          },
          select: {
            addonServiceId: true,
          },
        },
        giftBoxes: {
          where: {
            giftBox: {
              status: CommerceExtensionStatus.ACTIVE,
            },
          },
          select: {
            giftBoxId: true,
          },
        },
      },
    });
  }
}
