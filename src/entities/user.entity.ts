import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection, Enum, EntityRepositoryType } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base.entity";
import { UserRepository } from "../users/users.repository";
import { Role } from "./role.entity";

@Entity({ repository: () => UserRepository })
export class User extends CustomBaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({unique: true})
  username: string;

  @Property({unique: true})
  email: string;

  @Property()
  password: string;

  @ManyToOne({ entity: () => Role })
  role: Role;
}