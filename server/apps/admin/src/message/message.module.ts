import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageStatus } from './entities/messagestatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageStatus])],
  providers: [MessageService],
})
export class MessageModule {}
