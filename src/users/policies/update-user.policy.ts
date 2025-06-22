import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
import { AppAbility } from 'src/common/factories/casl-ability.factory';
import { User } from 'src/entities/user.entity';
import { Actions, Subjects } from 'src/common/factories/casl-ability.factory';
import { Request } from 'express';

export class UpdateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, user: User, request: Request) {
    return (
      ability.can(Actions.Update, Subjects.User) ||
      (ability.can(Actions.UpdateOwn, Subjects.User) &&
        user.id === parseInt(request.params.id))
    );
  }
}
