// app.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('tasks')
export class RabbitmqController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('publish')
  async publishTask(@Body() task: any): Promise<string> {
    await this.rabbitMQService.publishFP_GrowthTask(task);
    return 'Task published successfully!';
  }

 
}