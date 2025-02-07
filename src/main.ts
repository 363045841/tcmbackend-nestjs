import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
