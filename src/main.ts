import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.setGlobalPrefix("api/v1");
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
