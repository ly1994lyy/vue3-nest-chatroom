import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UserService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const group = new Group();
    group.name = createGroupDto.name;
    group.createdBy = await this.userService.findOneById(
      createGroupDto.createdBy,
    );
    group.members = await this.userService.findByIds(createGroupDto.members);
    return this.groupRepository.save(group);
  }

  async findGroupById(userId: bigint) {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'user')
      .where('group.createdBy = :userId OR user.id = :userId', { userId })
      .getMany();
  }

  async findOneById(id: bigint) {
    return await this.groupRepository.findOne({ where: { id } });
  }
}
