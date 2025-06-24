import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { IsUnique } from 'src/common/validators/is-unique.validator';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([User, Role, Permission])],
  providers: [IsUnique],
  exports: [IsUnique],
})
export class ValidatorsModule {}
