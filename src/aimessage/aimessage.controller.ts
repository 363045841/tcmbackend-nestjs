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
    // let temp: string = await this.aimessageService.sendMessage(message);
    let temp: string = "你脑残"
    console.log(temp);
    return {
        "zhengxing": "脑残症",
        "tedian": "比较傻逼",
        "zhiliaofangfa": "切除大脑",
        "jibing": "脑残病"
    }
  }
}

