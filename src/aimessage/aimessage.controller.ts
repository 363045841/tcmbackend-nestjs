import { Body, Controller, Post } from '@nestjs/common';
import { AimessageService } from './aimessage.service';
import { expression, string } from 'joi';

export interface MessageInfo {
  message: string;
  conversation_id: string;
}

@Controller('aimessage')
export class AimessageController {
  constructor(private readonly aimessageService: AimessageService) {}

  @Post('create')
  async createNewConversation() {
    return await this.aimessageService.generateMessage();
  }

  @Post('chat')
  async chat(@Body() message: MessageInfo) {
    let temp: string = await this.aimessageService.sendMessage(message);
    return await this.aimessageService.sendMessage(message);
  }
}
