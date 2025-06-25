import {
  BeforeCreate,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
  RequestContext,
} from '@mikro-orm/core';
import { CustomBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { OrganizationRepository } from '../organizations/organizations.repository';

@Entity({ repository: () => OrganizationRepository })
export class Organization extends CustomBaseEntity {
  [EntityRepositoryType]?: OrganizationRepository;

  @ManyToOne({ entity: () => Tenant })
  tenant: Tenant;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;
}
