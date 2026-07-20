import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { CommerceCurrency, StoreStatus } from "@prisma/client";
import { StoreContextService } from "../../src/commerce/store-context.service";
import type { ResolvedStore } from "../../src/commerce/commerce.repository";

const activeStore: ResolvedStore = {
  currency: CommerceCurrency.IRR,
  guestCartAbsoluteTtlSeconds: 7_776_000,
  guestCartIdleTtlSeconds: 2_592_000,
  id: "00000000-0000-4000-8000-000000000001",
  key: "fardad",
  maxCartLines: 50,
  maxLineQuantity: 99,
  profileKey: "fardad-production",
  quoteTtlSeconds: 900,
  status: StoreStatus.ACTIVE,
  version: 1,
};

describe("server-derived Store resolution", () => {
  test("resolves the configured active IRR Store", async () => {
    const service = new StoreContextService({
      findActiveStoreByKey: async (key: string) => {
        assert.equal(key, "fardad");
        return activeStore;
      },
    } as never);
    await service.onModuleInit();
    assert.equal(service.getActiveStore(), activeStore);
  });

  test("fails closed for missing, inactive, or non-IRR Store state", async () => {
    for (const resolved of [
      null,
      { ...activeStore, status: StoreStatus.INACTIVE },
      { ...activeStore, currency: "USD" },
    ]) {
      const service = new StoreContextService({
        findActiveStoreByKey: async () => resolved,
      } as never);
      await assert.rejects(
        () => service.onModuleInit(),
        /Configured commerce Store is unavailable/,
      );
    }
  });
});
