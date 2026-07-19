import { Module } from "@nestjs/common";
import { AuthModule } from "./auth";
import { PrismaModule } from "./database";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
