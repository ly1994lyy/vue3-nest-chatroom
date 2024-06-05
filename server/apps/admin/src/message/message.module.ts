import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageStatus } from './entities/messagestatus.entity';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageStatus]),
    UserModule,
    GroupModule,
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
