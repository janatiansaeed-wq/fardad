import { Injectable, OnModuleInit, ServiceUnavailableException } from "@nestjs/common";
import { CommerceCurrency, StoreStatus } from "@prisma/client";
import { env } from "../config";
import { CommerceRepository, ResolvedStore } from "./commerce.repository";

@Injectable()
export class StoreContextService implements OnModuleInit {
  private store: ResolvedStore | null = null;

  constructor(private readonly commerceRepository: CommerceRepository) {}

  async onModuleInit(): Promise<void> {
    await this.loadActiveStore();
  }

  getActiveStore(): ResolvedStore {
    if (
      !this.store ||
      this.store.status !== StoreStatus.ACTIVE ||
      this.store.currency !== CommerceCurrency.IRR
    ) {
      throw new ServiceUnavailableException("Commerce is unavailable");
    }

    return this.store;
  }

  private async loadActiveStore(): Promise<void> {
    const store = await this.commerceRepository.findActiveStoreByKey(env.COMMERCE_STORE_KEY);

    if (!store || store.status !== StoreStatus.ACTIVE || store.currency !== CommerceCurrency.IRR) {
      throw new Error("Configured commerce Store is unavailable");
    }

    this.store = store;
  }
}
