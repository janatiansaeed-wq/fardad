import {
  CommerceAuditActorType,
  CommerceAuditEventType,
  CommerceAuditSubjectType,
  CommerceCurrency,
  PrismaClient,
  StoreStatus,
} from "@prisma/client";

const storeKey = "fardad";
const profileKey = "fardad-production";

async function bootstrapStore(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    await prisma.$transaction(async (transaction) => {
      const existing = await transaction.store.findUnique({ where: { key: storeKey } });

      if (existing) {
        if (
          existing.currency !== CommerceCurrency.IRR ||
          existing.displayName !== "Fardad" ||
          existing.guestCartAbsoluteTtlSeconds !== 7_776_000 ||
          existing.guestCartIdleTtlSeconds !== 2_592_000 ||
          existing.maxCartLines !== 50 ||
          existing.maxLineQuantity !== 99 ||
          existing.profileKey !== profileKey ||
          existing.quoteTtlSeconds !== 900 ||
          existing.status !== StoreStatus.ACTIVE
        ) {
          throw new Error("Existing Fardad Store does not match the approved bootstrap profile");
        }

        return;
      }

      const store = await transaction.store.create({
        data: {
          currency: CommerceCurrency.IRR,
          displayName: "Fardad",
          guestCartAbsoluteTtlSeconds: 7_776_000,
          guestCartIdleTtlSeconds: 2_592_000,
          key: storeKey,
          maxCartLines: 50,
          maxLineQuantity: 99,
          profileKey,
          quoteTtlSeconds: 900,
          status: StoreStatus.ACTIVE,
        },
      });

      await transaction.commerceAuditEvent.create({
        data: {
          actorType: CommerceAuditActorType.SYSTEM,
          eventType: CommerceAuditEventType.STORE_CREATED,
          storeId: store.id,
          subjectReference: store.id,
          subjectType: CommerceAuditSubjectType.STORE,
        },
      });
    });
  } finally {
    await prisma.$disconnect();
  }
}

bootstrapStore().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown bootstrap failure";
  process.stderr.write(`Commerce Store bootstrap failed: ${message}\n`);
  process.exitCode = 1;
});
