import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection } from "@mikro-orm/core";

@Entity()
export class User {

  @PrimaryKey()
  id: bigint;

  @Property({unique: true})
  username: string;

  @Property({unique: true})
  email: string;

  @Property()
  password: string;
}