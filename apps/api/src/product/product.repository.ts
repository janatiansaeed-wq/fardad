import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database";

const productQualityContext = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    attributeValues: {
      select: {
        attributeId: true,
        value: true,
      },
    },
    category: {
      include: {
        attributeRequirements: {
          where: {
            isRequired: true,
          },
          select: {
            attributeId: true,
          },
        },
      },
    },
    media: {
      select: {
        altText: true,
        type: true,
      },
    },
    logistics: true,
    checklistStatuses: {
      select: {
        isCompleted: true,
        rule: {
          select: {
            code: true,
          },
        },
      },
    },
  },
});

export type ProductQualityContext = Prisma.ProductGetPayload<typeof productQualityContext>;

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  findQualityContext(productId: string): Promise<ProductQualityContext | null> {
    return this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        id: productId,
      },
      ...productQualityContext,
    });
  }

  findActiveChecklistRules(categoryId: string | null) {
    return this.prisma.productChecklistRule.findMany({
      where: {
        isActive: true,
        OR: categoryId ? [{ categoryId: null }, { categoryId }] : [{ categoryId: null }],
      },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    });
  }
}
