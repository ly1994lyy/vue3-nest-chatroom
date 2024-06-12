import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';
import { UserService } from '../user/user.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    private readonly userService: UserService,
  ) {}

  async addFriend(userId: bigint, friendId: bigint) {
    const user = await this.userService.findOneById(userId);
    const friend = await this.userService.findOneById(friendId);
    const friendship = this.friendshipRepository.create({
      user,
      friend,
    });
    return await this.friendshipRepository.save(friendship);
  }

  async getFriends(userId: bigint) {
    const friendships = await this.friendshipRepository.find({
      where: [{ user: { id: userId } }, { friend: { id: userId } }],
      relations: ['friend', 'user'],
    });
    return friendships.map((friendship) =>
      friendship.user.id === userId ? friendship.friend : friendship.user,
    );
  }

  async removeFriend(userId: bigint, friendId: bigint) {
    const friendships = await this.friendshipRepository.find({
      where: [
        { user: { id: userId }, friend: { id: friendId } },
        { user: { id: friendId }, friend: { id: userId } },
      ],
    });
    if (!friendships) {
      throw new WsException('Friendship not found');
    }
    await this.friendshipRepository.remove(friendships);
  }
}
