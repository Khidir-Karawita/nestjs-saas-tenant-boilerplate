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

/**
 * Users service that handles user-related business logic.
 * Provides CRUD operations for user entities with password hashing and tenant management.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly repo: UserRepository,
    @InjectRepository(Role)
    private readonly roleRepo: EntityRepository<Role>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new user with hashed password and default role.
   * @param {CreateUserDto} createUserDto - The user creation data.
   * @returns {Promise<User>} The newly created user.
   * @throws {InternalServerErrorException} When default role is not found.
   */
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

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} Array of all users.
   */
  findAll() {
    return this.repo.findAll();
  }

  /**
   * Finds a user by ID with optional population options.
   * @param {Object} params - The search parameters.
   * @param {number} params.id - The user ID to find.
   * @param {FindOneOptions<User>} [params.options] - Optional MikroORM find options.
   * @returns {Promise<User>} The found user.
   */
  findOne({ id, options }: { id: number; options?: FindOneOptions<User> }) {
    if (options) {
      return this.repo.findOne(id, options);
    }
    return this.repo.findOne(id);
  }

  /**
   * Finds a user by username with optional population options.
   * @param {Object} params - The search parameters.
   * @param {string} params.username - The username to find.
   * @param {FindOneOptions<User>} [params.options] - Optional MikroORM find options.
   * @returns {Promise<User>} The found user.
   */
  findOneWithUsername({
    username,
    options,
  }: {
    username: string;
    options?: FindOneOptions<User>;
  }) {
    return this.repo.findOne({ username }, options);
  }

  /**
   * Updates an existing user by ID.
   * @param {Object} params - The update parameters.
   * @param {number} params.id - The user ID to update.
   * @param {UpdateUserDto} params.updateUserDto - The user update data.
   * @returns {Promise<User>} The updated user.
   * @throws {BadRequestException} When user is not found.
   */
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

  /**
   * Removes a user by ID.
   * @param {Object} params - The removal parameters.
   * @param {number} params.id - The user ID to remove.
   * @returns {Promise<User>} The removed user.
   * @throws {BadRequestException} When user is not found.
   */
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
