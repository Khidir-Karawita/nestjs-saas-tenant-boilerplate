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
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadAnyUserPolicyHandler())
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadUserPolicyHandler())
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({
      id: +id,
      options: { populate: ['role', 'role.permissions'] as never },
    });
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateUserPolicyHandler())
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ id: +id, updateUserDto });
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteUserPolicyHandler())
  remove(@Param('id') id: string) {
    return this.usersService.remove({ id: +id });
  }
}
