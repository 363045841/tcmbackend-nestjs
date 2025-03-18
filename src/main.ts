import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";

declare const module: any;

async function bootstrap() {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
    console.error('相关 Promise:', promise);

    // 如果需要，可以在这里记录日志、发送报警等
  });
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.setGlobalPrefix("api/v1");
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');

  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
