import { Injectable } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';

@Injectable()
export class ChatroomService {
  create(createChatroomDto: CreateChatroomDto) {
    return 'This action adds a new chatroom';
  }
}
