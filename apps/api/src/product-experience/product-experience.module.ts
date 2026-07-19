import { Module } from "@nestjs/common";
import { PrismaModule } from "../database";
import { ProductExperienceRepository } from "./product-experience.repository";
import { ProductExperienceService } from "./product-experience.service";

@Module({
  exports: [ProductExperienceService],
  imports: [PrismaModule],
  providers: [ProductExperienceRepository, ProductExperienceService],
})
export class ProductExperienceModule {}
