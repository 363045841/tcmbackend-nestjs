import { Controller, Get, Options, Query, Res, Sse } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { StreamService } from './stream/stream.service';
import { Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(private readonly streamService: StreamService) {}

  // 处理 OPTIONS 请求，以允许跨域
  @Options('stream')
  async options(@Res() reply: FastifyReply) {
    console.log('Handling OPTIONS request');
    reply
      .header('Access-Control-Allow-Origin', '*') // 允许所有来源
      .header('Access-Control-Allow-Methods', 'GET, OPTIONS') // 允许的请求方法
      .header('Access-Control-Allow-Headers', 'Content-Type') // 允许的请求头部
      .status(204)
      .send();
  }

  // 使用 @Sse 装饰器来处理 SSE 请求
  @Get('stream')
  @Sse('stream')
  async startStream(
    @Query() message: { message: string; conversation_id: string },
  ): Promise<Observable<any>> {
    console.log('Setting response headers for stream');
    // 设置响应头，启用 SSE
    // `@Sse` 装饰器会自动处理设置 `Content-Type: text/event-stream` 和其他 SSE 必需的标头
    // 你不需要手动设置这些标头，NestJS 会自动处理

    let isComplete = false;

    // 返回一个 Observable，处理流式数据
    return new Observable((observer) => {
      console.log('Starting to stream data...');
      this.streamService.getStreamedAnswers(
        message.conversation_id,
        message.message,
        (chunk: string) => {
          if (chunk) {
            console.log('Incoming chunk:', chunk);
            // 解析 chunk 并处理
            try {
              const parsedChunk = JSON.parse(chunk);
              if (parsedChunk.is_completion) {
                // 收到结束标志，发送完成标志并立即结束流
                observer.next({ data: { is_complete: true, answer: '' } });
                isComplete = true;
              } else {
                // 继续推送数据s
                observer.next({ data: {message: chunk} });
              }
            } catch (error) {
              console.log('Error parsing chunk:', error);
            }
          }

          // 如果标记为完成，则结束流
          if (isComplete) {
            observer.complete();
          }
        },
      );

      // 处理连接关闭事件
      observer.complete = () => {
        console.log('Connection closed');
      };
    });
  }
}
