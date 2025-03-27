import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { StreamService } from './stream/stream.service';

@WebSocketGateway({ cors: true }) // 启用跨域支持
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly streamService: StreamService) {}

  startStream(query: string) {
    this.streamService.getStreamedAnswers(query, (chunk: string) => {
      // 将每一块数据广播给所有客户端
      this.server.emit('receiveMessage', chunk);
    });
  }
}
