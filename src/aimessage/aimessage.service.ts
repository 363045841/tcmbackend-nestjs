import { Injectable } from '@nestjs/common';
import { Messages } from './messages.entity';
import { Conversations } from './conversations.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageInfo } from './aimessage.controller';

export interface CreateNewConversation {
  request_id: string;
  conversation_id: string;
}

interface conversationRunParam {
  app_id: string;
  query: string;
  conversation_id: string;
  stream: boolean;
}
@Injectable()
export class AimessageService {
  constructor(
    @InjectRepository(Messages) private readonly messages: Repository<Messages>,
    @InjectRepository(Conversations)
    private readonly conversations: Repository<Conversations>,
  ) {}

  async generateMessage() {
    let return_data: CreateNewConversation = {
      request_id: 'error',
      conversation_id: 'error',
    };
    let X_Appbuilder_Authorization = `Bearer ${process.env.API_KEY}`;

    try {
      const response = await fetch(
        'https://qianfan.baidubce.com/v2/app/conversation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appbuilder-Authorization': X_Appbuilder_Authorization,
          },
          body: JSON.stringify({
            app_id: process.env.APP_ID,
          }),
        },
      );

      const data = await response.json();
      console.log(data);

      // 如果 API 响应中有 request_id 和 conversation_id，则返回正确的结构
      if (data?.request_id && data?.conversation_id) {
        return_data = {
          request_id: data.request_id,
          conversation_id: data.conversation_id,
        };
        return return_data;
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return return_data;
    }
    return return_data;
  }

  async sendMessage(message: MessageInfo): Promise<string> {
    let X_Appbuilder_Authorization = `Bearer ${process.env.API_KEY}`;
    let ans = 'error';
    await fetch('https://qianfan.baidubce.com/v2/app/conversation/runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appbuilder-Authorization': X_Appbuilder_Authorization,
      },
      body: JSON.stringify({
        app_id: process.env.APP_ID,
        query: message.message,
        conversation_id: message.conversation_id,
        stream: false,
      }),
    }).then((res) => res.json()).then((data) => {
      ans = (data as any).answer;
    })
    return ans;
  }
}
