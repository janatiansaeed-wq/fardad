import { Module } from "@nestjs/common";
import { AuthorizationModule } from "./authorization";
import { AuthModule } from "./auth";
import { PrismaModule } from "./database";
import { ProductModule } from "./product";
import { ProductExperienceModule } from "./product-experience";

@Module({
  imports: [PrismaModule, AuthModule, AuthorizationModule, ProductModule, ProductExperienceModule],
  controllers: [],
  providers: []
})
export class AppModule {}
