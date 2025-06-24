import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { FindOneOptions } from '@mikro-orm/core';
import { User } from 'src/entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb';
import { Role } from 'src/entities/role.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';
import { Tenant } from 'src/entities/tenant.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly repo: UserRepository,
    @InjectRepository(Role)
    private readonly roleRepo: EntityRepository<Role>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleRepo.findOne({ name: 'user' });
    const { password, domain, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!role) {
      throw new InternalServerErrorException();
    }
    const user = this.repo.create({
      ...rest,
      password: hashedPassword,
      role,
      tenant: this.em.create(Tenant, new Tenant(domain)),
    });
    await this.em.flush();
    this.logger.log('new User created', user);
    return user;
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne({ id, options }: { id: number; options?: FindOneOptions<User> }) {
    if (options) {
      return this.repo.findOne(id, options);
    }
    return this.repo.findOne(id);
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
  async update({
    id,
    updateUserDto,
  }: {
    id: number;
    updateUserDto: UpdateUserDto;
  }) {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    this.repo.assign(user, updateUserDto);
    await this.em.flush();
    this.logger.log('User updated', user);
    return user;
  }

  async remove({ id }: { id: number }) {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    this.em.remove(user);
    await this.em.flush();
    this.logger.log('User deleted', user);
    return user;
  }
}
