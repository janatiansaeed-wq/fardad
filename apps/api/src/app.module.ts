import { Module } from "@nestjs/common";
import { AuthorizationModule } from "./authorization";
import { AuthModule } from "./auth";
import { PrismaModule } from "./database";

@Module({
  imports: [PrismaModule, AuthModule, AuthorizationModule],
  controllers: [],
  providers: []
})
export class AppModule {}
