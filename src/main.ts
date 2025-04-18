import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import * as fastifyCors from '@fastify/cors';
import { INestApplication } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  // 创建一个 FastifyAdapter 实例
  const fastifyAdapter = new FastifyAdapter();

  // 在 FastifyAdapter 上注册 fastifyCors 插件，允许所有来源跨域
  fastifyAdapter.register(fastifyCors, {
    origin: true,  // 允许所有来源
    methods: ['GET', 'POST', 'OPTIONS'],  // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type'],  // 允许的请求头部
  });

  // 使用 FastifyAdapter 创建应用
  const app: INestApplication = await NestFactory.create(AppModule, fastifyAdapter);

  app.setGlobalPrefix("api/v1");

  // 启动应用
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);

  // 热重载处理
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
