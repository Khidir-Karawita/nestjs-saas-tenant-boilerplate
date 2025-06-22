import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
import { AppAbility } from 'src/common/factories/casl-ability.factory';
import { User } from 'src/entities/user.entity';
import { Actions, Subjects } from 'src/common/factories/casl-ability.factory';
import { Request } from 'express';

export class DeleteUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, user: User, request: Request) {
    return (
      ability.can(Actions.Delete, Subjects.User) ||
      (ability.can(Actions.DeleteOwn, Subjects.User) &&
        user.id === parseInt(request.params.id))
    );
  }
}
