import { Module } from "@nestjs/common";
import { AuthorizationModule } from "./authorization";
import { AuthModule } from "./auth";
import { PrismaModule } from "./database";
import { MediaModule } from "./media";
import { ProductModule } from "./product";
import { ProductExperienceModule } from "./product-experience";
import { PublicCatalogModule } from "./public-catalog/public-catalog.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuthorizationModule,
    MediaModule,
    ProductModule,
    ProductExperienceModule,
    PublicCatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
