import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { FindOneOptions } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb';
import { Role } from 'src/entities/role.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepository,
    @InjectRepository(Role)
    private readonly roleRepo: EntityRepository<Role>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleRepo.findOne({ name: 'user' });
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!role) {
      throw new InternalServerErrorException();
    }
    const user = this.repo.create({
      ...rest,
      password: hashedPassword,
      role,
    });
    await this.em.flush();
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne({ id, options }: { id: number; options?: FindOneOptions<User> }) {
    return this.repo.findOne(id, options);
  }
  findOneWithUsername({
    username,
    options,
  }: {
    username: string;
    options?: FindOneOptions<User>;
  }) {
    return this.repo.findOne({ username }, options);
  }
  update({ id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto }) {
    return `This action updates a #${id} user`;
  }

  remove({ id }: { id: number }) {
    return `This action removes a #${id} user`;
  }
}
