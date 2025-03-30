import { Body, Controller, Post } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

export interface MessageInfo {
  message: string;
  conversation_id: string;
  stream?: boolean;
}

@Controller('aimessage')
export class AimessageController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post('create')
  async createNewConversation() {
    return { conversation_id: 'a117dcdb-0dbf-439f-9fe8-c1136c5681dd', status: 'success' };
  }

  @Post('chat')
  async chat(@Body() message: MessageInfo) {
    if (!message.stream) {
      // 非流式传输，直接返回静态响应
      return {
        zhengxing: '脑残症',
        tedian: '比较傻逼',
        zhiliaofangfa: '切除大脑',
        jibing: '脑残病',
      };
    } else {
      // 流式传输，通知 WebSocket 网关启动流式传输
      this.chatGateway.startStream(message.message, message.conversation_id);
      return { message: 'WebSocket 流式传输已启动' };
    }
  }
}