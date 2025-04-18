import { Body, Controller, Post } from '@nestjs/common';
import { AimessageService } from './aimessage.service';

export interface MessageInfo {
  message: string;
  conversation_id: string;
  stream?: boolean;
}

@Controller('aimessage')
export class AimessageController {
  constructor(
    private readonly aiMessageService: AimessageService,
  ) {}

  @Post('create')
  async createNewConversation() {
    return {
      conversation_id: (await this.aiMessageService.generateMessage())
        .conversation_id,
      status: 'success',
    };
  }

  @Post('chat')
  async chat(@Body() message: MessageInfo) {
    if (!message.stream) {
      // 非流式传输，直接返回静态响应
      console.log(message);
      return this.aiMessageService.sendMessage(message);
    } else {
      // 修改为调用 SSE 路由
      
      return { message: 'SSE 流式传输已启动' };
    }
  }
}
