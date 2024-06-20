import { GroupService } from '../group/group.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  async sendMessageToUser(
    senderId: bigint,
    receiverId: bigint,
    content: string,
  ) {
    const sender = await this.userService.findOneById(senderId);
    const receiver = await this.userService.findOneById(receiverId);
    const message = this.messageRepository.create({
      sender,
      receiver,
      content,
    });
    return await this.messageRepository.save(message);
  }

  async getMessagesForUser(userId: bigint) {
    return await this.messageRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver', 'group'],
      order: { sentAt: 'ASC' },
    });
  }

  async sendMessageToGroup(senderId: bigint, groupId: bigint, content: string) {
    const sender = await this.userService.findOneById(senderId);
    const group = await this.groupService.findOneById(groupId);
    const message = this.messageRepository.create({
      sender,
      group,
      content,
    });
    return await this.messageRepository.save(message);
  }
}
