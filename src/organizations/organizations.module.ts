import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from 'src/entities/organization.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Organization])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
