import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as fastifyCors from '@fastify/cors';
import * as jwt from '@fastify/jwt';
import { INestApplication } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  // 创建 FastifyAdapter 实例
  const fastifyAdapter = new FastifyAdapter();

  // 注册 fastifyCors 插件
  fastifyAdapter.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 注册 fastify-jwt 插件
  fastifyAdapter.register(jwt, {
    secret: process.env.JWT_SECRET || 'gjsda0opjgeo', // 推荐从 .env 文件读取
  });

  // 创建 NestJS 应用实例
  const app: INestApplication = await NestFactory.create(AppModule, fastifyAdapter);

  // 设置全局 API 前缀
  app.setGlobalPrefix('api/v1');

  // 启动服务器
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`Server is running on port ${process.env.PORT ?? 3001}`);

  // 热重载处理
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();