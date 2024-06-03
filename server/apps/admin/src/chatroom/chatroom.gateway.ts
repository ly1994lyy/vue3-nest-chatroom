import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { Server, Socket } from 'socket.io';
import {
  addFriendType,
  onlineUserDto,
  sendMsgType,
  userInfoDto,
} from './dto/chatroom.model';
import * as process from 'process';
import { FriendshipService } from '../friendship/friendship.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CHATROOM_URL,
  },
})
export class ChatroomGateway {
  private onlineUserList: onlineUserDto[] = [];

  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly friendshipService: FriendshipService,
  ) {}

  @SubscribeMessage('online')
  async online(
    @MessageBody() onlineUser: userInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.onlineUserList.find((e) => e.id === onlineUser.id);
    const friends = await this.friendshipService.getFriends(onlineUser.id);
    if (user) {
      user.socketId = client.id;
    } else {
      this.onlineUserList.push({ ...onlineUser, socketId: client.id });
    }
    // client.broadcast.emit('onlineUserList', this.onlineUserList);
    return {
      data: friends,
    };
  }

  @SubscribeMessage('offline')
  offline(@MessageBody() id: bigint, @ConnectedSocket() client: Socket) {
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

  @SubscribeMessage('addFriend')
  addFriend(@MessageBody() add: addFriendType) {
    console.log(add.friendId);
  }
}
