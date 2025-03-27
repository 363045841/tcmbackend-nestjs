import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AimessageController } from './aimessage.controller';
import { AimessageService } from './aimessage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './messages.entity';
import { Conversations } from './conversations.entity';
import { LoggingMiddleware } from '../logging/logging.middleware'; // 导入日志中间件
import { StreamService } from './stream/stream.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Conversations])],
  controllers: [AimessageController],
  providers: [AimessageService, StreamService, ChatGateway],
})
export class AimessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware) // 应用日志中间件
      .forRoutes(''); // 应用于所有路由
  }
}