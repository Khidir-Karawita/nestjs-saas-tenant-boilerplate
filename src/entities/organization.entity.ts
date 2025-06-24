import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

@Entity()
export class Organization extends CustomBaseEntity {
  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Property()
  name: string;

  @Property()
  description?: string;
}
