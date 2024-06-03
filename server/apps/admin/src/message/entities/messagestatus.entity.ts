import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class MessageStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Message)
  message: Message;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ nullable: true })
  readAt: Date;
}
