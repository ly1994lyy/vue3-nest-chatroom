import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findOne(id: number) {
    return this.user.findOne({
      where: {},
    });
  }

  findUserName(username: string) {
    return this.user.findOne({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
