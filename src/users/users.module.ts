import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
