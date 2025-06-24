import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { IsDomainUnique } from './validators/is-domain-unique.validator';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, IsDomainUnique],
  exports: [UsersService],
})
export class UsersModule {}
