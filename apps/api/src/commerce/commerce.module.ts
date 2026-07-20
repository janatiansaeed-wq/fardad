import { Module } from "@nestjs/common";
import { ProductModule } from "../product";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { CommerceBffProofService } from "./commerce-bff-proof.service";
import { CommerceRateLimitService } from "./commerce-rate-limit.service";
import { CommerceRepository } from "./commerce.repository";
import { CommerceService } from "./commerce.service";
import { OfferManagementService } from "./offer-management.service";
import { PublicCartController } from "./public-cart.controller";
import { PublicCommerceController } from "./public-commerce.controller";
import { StoreContextService } from "./store-context.service";

@Module({
  controllers: [PublicCommerceController, PublicCartController],
  exports: [CommerceService, OfferManagementService, StoreContextService],
  imports: [ProductModule],
  providers: [
    CartRepository,
    CartService,
    CommerceBffProofService,
    CommerceRateLimitService,
    CommerceRepository,
    CommerceService,
    OfferManagementService,
    StoreContextService,
  ],
})
export class CommerceModule {}
