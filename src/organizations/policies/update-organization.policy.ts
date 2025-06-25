import {
  Actions,
  AppAbility,
  Subjects,
} from 'src/common/factories/casl-ability.factory';
import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
export class UpdateOrganizationPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, Subjects.Organization);
  }
}
