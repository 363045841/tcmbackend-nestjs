import { Body, Controller, Post } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AimessageService } from './aimessage.service';

export interface MessageInfo {
  message: string;
  conversation_id: string;
  stream?: boolean;
}

@Controller('aimessage')
export class AimessageController {
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly aiMessageService: AimessageService,
  ) {}

  @Post('create')
  async createNewConversation() {
    return {
      conversation_id: (await this.aiMessageService.generateMessage()).conversation_id,
      status: 'success' 
    };
  }


  @Post('chat')
  async chat(@Body() message: MessageInfo) {
    if (!message.stream) {
      // 非流式传输，直接返回静态响应
      console.log(message);
      return this.aiMessageService.sendMessage(message);
      /* return {

        zhengxing: '脑残症',
        tedian: '比较傻逼',
        zhiliaofangfa: '切除大脑',
        jibing: '脑残病',
      }; */
    } else {
      // 流式传输，通知 WebSocket 网关启动流式传输
      this.chatGateway.startStream(message.message, message.conversation_id);
      return { message: 'WebSocket 流式传输已启动' };
    }
  }
}
