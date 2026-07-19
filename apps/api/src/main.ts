import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.setGlobalPrefix("api/v1");

  await app.listen(env.API_PORT);
}

bootstrap();
