import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity } from './base.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role extends CustomBaseEntity {
  @Property({ unique: true })
  name: string;

  @ManyToMany(() => Permission, 'roles', { owner: true })
  permissions = new Collection<Permission>(this);

  @OneToMany(() => User, 'role')
  users = new Collection<User>(this);
}
