import { Module } from "@nestjs/common";
import { PrismaModule } from "../database";
import { ProductDataQualityService } from "./product-data-quality.service";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

@Module({
  exports: [ProductDataQualityService, ProductService],
  imports: [PrismaModule],
  providers: [ProductRepository, ProductDataQualityService, ProductService],
})
export class ProductModule {}
