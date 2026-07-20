import { Controller, Get, Ip, Param } from "@nestjs/common";
import { env } from "../config";
import { CommerceRateLimitService } from "./commerce-rate-limit.service";
import { CommerceService } from "./commerce.service";
import { PurchasingOptionParamsDto } from "./dto/purchasing-option.params.dto";
import { StoreContextService } from "./store-context.service";

@Controller("public/commerce")
export class PublicCommerceController {
  constructor(
    private readonly commerceRateLimit: CommerceRateLimitService,
    private readonly commerceService: CommerceService,
    private readonly storeContext: StoreContextService,
  ) {}

  @Get("products/:slug/purchasing-option")
  getPurchasingOption(@Param() params: PurchasingOptionParamsDto, @Ip() ip: string) {
    this.commerceRateLimit.consume(
      `purchasing-option:${env.COMMERCE_STORE_KEY}:${ip}`,
      120,
      60_000,
    );
    return this.commerceService.getPurchasingOption(
      this.storeContext.getActiveStore(),
      params.slug,
    );
  }
}
