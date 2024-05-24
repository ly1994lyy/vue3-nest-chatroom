import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatroomGateway {
  constructor(private readonly chatroomService: ChatroomService) {}

  @SubscribeMessage('online')
  create(
    @MessageBody() createChatroomDto: CreateChatroomDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('online', '有人上线了');
    return this.chatroomService.create(createChatroomDto);
  }
}
