import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity()
export class Tenant extends CustomBaseEntity {
  constructor(domain: string) {
    super();
    this.domain = domain;
  }
  @Property({ unique: true })
  domain: string;
  @Property({ nullable: true })
  isActive: boolean = true;

  @OneToMany(() => Organization, (organization) => organization.tenant, {
    cascade: [Cascade.REMOVE],
  })
  organizations = new Collection<Organization>(this);

  @OneToMany(() => User, (user) => user.tenant, {
    cascade: [Cascade.REMOVE],
  })
  users = new Collection<User>(this);
}
