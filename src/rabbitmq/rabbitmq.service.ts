import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ 连接地址
      queue: 'FP_Growth_Input', // 输入队列名称
      queueOptions: {
        durable: true, // 队列持久化
      },
    },
  })
  private client: ClientProxy;

  async onModuleInit() {
    await this.client.connect(); // 确保客户端连接成功
  }

  /**
   * 发布任务到 FP_Growth_Input 队列，并等待响应
   * @param task 要发布的任务数据
   * @returns 服务器返回的结果
   */
  async publishFP_GrowthTask(task: any): Promise<any> {
    try {
      const result = await this.client.send('FP_Growth_Input', task).toPromise();
      return result;
    } catch (error) {
      console.error(`Error sending task or receiving response: ${error.message}`);
      throw new Error('Failed to send task or receive response.');
    }
  }
}