import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection, Enum } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base.entity";

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Entity()
export class User extends CustomBaseEntity {

  @Property({unique: true})
  username: string;

  @Property({unique: true})
  email: string;

  @Property()
  password: string;

  @Enum(() => UserRole)
  role: UserRole;
}