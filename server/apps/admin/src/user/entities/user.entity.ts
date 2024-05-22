import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
