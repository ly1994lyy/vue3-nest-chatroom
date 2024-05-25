import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { Server, Socket } from 'socket.io';
import { onlineUserDto, sendMsgType, userInfoDto } from './dto/chatroom.model';
import * as process from 'process';

@WebSocketGateway({
  cors: {
    origin: process.env.CHATROOM_URL,
  },
})
export class ChatroomGateway {
  private onlineUserList: onlineUserDto[] = [];

  @WebSocketServer()
  server: Server;
  constructor(private readonly chatroomService: ChatroomService) {}

  @SubscribeMessage('online')
  online(
    @MessageBody() onlineUser: userInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.onlineUserList.find((e) => e.id === onlineUser.id);
    if (user) {
      user.socketId = client.id;
    } else {
      this.onlineUserList.push({ ...onlineUser, socketId: client.id });
    }
    client.broadcast.emit('onlineUserList', this.onlineUserList);
    return {
      data: this.onlineUserList.filter((e) => e.id !== onlineUser.id),
    };
  }

  @SubscribeMessage('offline')
  offline(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    const user = this.onlineUserList.find((e) => e.id === id);
    if (user) {
      this.onlineUserList = this.onlineUserList.filter((e) => e.id !== id);
    }
    client.broadcast.emit('onlineUserList', this.onlineUserList);
  }

  @SubscribeMessage('sendMsg')
  sendMsg(@MessageBody() sendInfo: sendMsgType) {
    const user = this.onlineUserList.find((e) => e.id === sendInfo.toUserId);
    if (user) {
      const targetId = user.socketId;
      const socket = this.server.sockets.sockets.get(targetId);
      socket.emit('receiveMsg', {
        sendUserId: sendInfo.fromUserId,
        sendUserName: sendInfo.fromUsername,
        msg: sendInfo.msg,
        sendTime: sendInfo.sendTime,
      });
    }
  }
}
