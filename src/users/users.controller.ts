import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies } from 'src/common/decorators/metadata/check-policy.decorator';
import { ReadUserPolicyHandler } from './policies/read-user.policy';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { ReadAnyUserPolicyHandler } from './policies/read-any-user.policy';
import { UpdateUserPolicyHandler } from './policies/update-user.policy';
import { DeleteUserPolicyHandler } from './policies/delete-user.policy';

/**
 * Users controller that handles user management operations.
 * Provides CRUD endpoints for user entities with policy-based authorization.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user account.
   * @param {CreateUserDto} createUserDto - The user creation data.
   * @returns {Promise<User>} The newly created user.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users in the system.
   * Requires authorization through policies guard.
   * @returns {Promise<User[]>} Array of all users.
   */
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadAnyUserPolicyHandler())
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a specific user by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The user ID to retrieve.
   * @returns {Promise<User>} The user with populated role and permissions.
   */
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadUserPolicyHandler())
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({
      id: +id,
      options: { populate: ['role', 'role.permissions'] as never },
    });
  }

  /**
   * Updates a specific user by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The user ID to update.
   * @param {UpdateUserDto} updateUserDto - The user update data.
   * @returns {Promise<User>} The updated user.
   */
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateUserPolicyHandler())
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ id: +id, updateUserDto });
  }

  /**
   * Removes a specific user by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The user ID to remove.
   * @returns {Promise<User>} The removed user.
   */
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteUserPolicyHandler())
  remove(@Param('id') id: string) {
    return this.usersService.remove({ id: +id });
  }
}
