import {
  BigIntType,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

export abstract class CustomBaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
  @PrimaryKey({ type: new BigIntType('bigint') })
  id: number;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();
}
