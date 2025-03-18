import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://tcm:925925@localhost:5672'], // 添加用户名和密码
          queue: 'FP_Growth_Input', // 队列名称
          queueOptions: {
            durable: true, // 持久化队列
          },
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}