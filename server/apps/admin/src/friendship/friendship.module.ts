import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship]), UserModule],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
