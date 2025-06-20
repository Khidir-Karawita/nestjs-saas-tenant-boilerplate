import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

export abstract class CustomBaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
  @PrimaryKey()
  id : bigint;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();

}