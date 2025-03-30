import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { StreamService } from './stream/stream.service';

@WebSocketGateway({ cors: true }) // 启用跨域支持
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly streamService: StreamService) {}

  startStream(query: string,conversation_id: string) {
    this.streamService.getStreamedAnswers(conversation_id, query, (chunk: string) => {
      // 将每一块数据广播给所有客户端 

      /* console.log(0);
      console.log(chunk); */
      this.server.emit('receiveMessage', chunk);
      /* try {
        let ans = JSON.parse(chunk);
        console.log("正确包,已转发");
       
      } catch (error) {
        console.log("错误的包,拦截:");
        console.log(chunk);
        return;
      } */
    });
  }
}
