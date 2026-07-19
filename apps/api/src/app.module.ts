import { Module } from "@nestjs/common";
import { AuthorizationModule } from "./authorization";
import { AuthModule } from "./auth";
import { PrismaModule } from "./database";
import { ProductModule } from "./product";

@Module({
  imports: [PrismaModule, AuthModule, AuthorizationModule, ProductModule],
  controllers: [],
  providers: []
})
export class AppModule {}
