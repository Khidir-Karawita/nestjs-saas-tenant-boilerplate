import {
  Actions,
  AppAbility,
  Subjects,
} from 'src/common/factories/casl-ability.factory';
import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
import { Organization } from 'src/entities/organization.entity';

export class DeleteOrganizationPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, Subjects.Organization);
  }
}
