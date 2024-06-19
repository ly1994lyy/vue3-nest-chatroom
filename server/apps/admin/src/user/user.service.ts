import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ApiException } from '@app/common/http-exception/api.exception';
import { ErrorCodeEnum } from '@app/common/enums/errorCodeEnum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.user.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (user) {
      throw new ApiException(ErrorCodeEnum.USER_EXISTED);
    }
    return this.user.save(this.user.create(createUserDto));
  }

  findAll() {
    return this.user.find();
  }

  findOneById(id: bigint) {
    return this.user.findOne({
      where: { id },
    });
  }

  findUserByName(username: string) {
    return this.user.findOne({ where: { username } });
  }

  findUserByNameWithPass(username: string) {
    return this.user.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });
  }

  async updateUserInfo(id: bigint, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    user.password = updateUserDto.password;
    return await this.user.update('' + id, user);
  }

  async findByIds(userIds: bigint[]) {
    return await this.user.find({ where: { id: In(userIds) } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
