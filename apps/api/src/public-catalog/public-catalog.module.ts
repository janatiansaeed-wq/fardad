import { Module } from "@nestjs/common";
import { PrismaModule } from "../database";
import { MediaModule } from "../media";
import { ProductModule } from "../product";
import { PublicCatalogController } from "./public-catalog.controller";
import { PublicCatalogRepository } from "./public-catalog.repository";
import { PublicCatalogService } from "./public-catalog.service";

@Module({
  controllers: [PublicCatalogController],
  exports: [PublicCatalogService],
  imports: [MediaModule, PrismaModule, ProductModule],
  providers: [PublicCatalogRepository, PublicCatalogService],
})
export class PublicCatalogModule {}
