import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { createMongoAbility, MongoAbility, RawRuleOf } from '@casl/ability';
import { Permission } from 'src/entities/permission.entity';

export enum Subjects {
  User = 'User',
  Role = 'Role',
  Permission = 'Permission',
}
export enum Actions {
  Manage = 'manage',
  Create = 'create',
  CreateAny = 'createAny',
  CreateOne = 'createOne',
  CreateOwn = 'createOwn',
  Read = 'read',
  ReadAny = 'readAny',
  ReadOne = 'readOne',
  ReadOwn = 'readOwn',
  Update = 'update',
  UpdateAny = 'updateAny',
  UpdateOne = 'updateOne',
  UpdateOwn = 'updateOwn',
  Delete = 'delete',
  DeleteAny = 'deleteAny',
  DeleteOne = 'deleteOne',
  DeleteOwn = 'deleteOwn',
}
export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const permissions = user.role.permissions.map((permission) => ({
      action: permission.action,
      subject: permission.subject,
    })) as RawRuleOf<AppAbility>[];
    return createMongoAbility(permissions);
  }
}
