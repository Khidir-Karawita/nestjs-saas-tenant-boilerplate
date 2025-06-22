import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class Permission extends CustomBaseEntity {
  @Property({ unique: true })
  name: string;

  @Property({ nullable: true })
  action: string;

  @Property({ nullable: true })
  subject: string;

  @ManyToMany(() => Role, 'permissions')
  roles = new Collection<Role>(this);
}
