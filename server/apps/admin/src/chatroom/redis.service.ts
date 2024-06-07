import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import * as process from 'process';
import { messageType } from './dto/chatroom.model';

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;
  constructor() {
    this.redisClient = createClient({
      url: `redis://${process.env['RD_HOST']}:${process.env['RD_PORT']}`,
    });

    this.redisClient.connect().catch(console.error);
  }

  async getSocketId(userId: bigint) {
    return this.redisClient.get(`user:${userId}:socketId`);
  }

  async storeSocketId(userId: bigint, socketId: string) {
    await this.redisClient.set(`user:${userId}:socketId`, socketId);
  }

  async delSocketId(userId: bigint) {
    await this.redisClient.DEL(`user:${userId}:socketId`);
  }

  async storeOfflineMessage(
    userId: bigint,
    message: messageType,
  ): Promise<void> {
    await this.redisClient.lPush(
      `user:${userId}:offlineMessages`,
      JSON.stringify(message),
    );
  }
  async getOfflineMessage(userId: bigint) {
    const messages = await this.redisClient.lRange(
      `user:${userId}:offlineMessages`,
      0,
      -1,
    );
    return messages.map((msg) => JSON.parse(msg));
  }

  async clearOfflineMessages(userId: bigint): Promise<void> {
    await this.redisClient.del(`user:${userId}:offlineMessages`);
  }

  async storeAddFriendRequestMessage(
    userId: bigint,
    message: any,
  ): Promise<void> {
    await this.redisClient.lPush(
      `user:${userId}:offlineMessages`,
      JSON.stringify(message),
    );
  }
  async getAddFriendRequestMessage(userId: bigint) {
    const messages = await this.redisClient.lRange(
      `user:${userId}:offlineMessages`,
      0,
      -1,
    );
    return messages.map((msg) => JSON.parse(msg));
  }

  async clearAddFriendRequestMessage(userId: bigint): Promise<void> {
    await this.redisClient.del(`user:${userId}:offlineMessages`);
  }
}
