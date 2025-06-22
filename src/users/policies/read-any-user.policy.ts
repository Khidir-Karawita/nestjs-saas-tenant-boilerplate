import {
  Actions,
  AppAbility,
  Subjects,
} from 'src/common/factories/casl-ability.factory';
import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

export class ReadAnyUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, user: User, request: Request) {
    return ability.can(Actions.ReadAny, Subjects.User);
  }
}
