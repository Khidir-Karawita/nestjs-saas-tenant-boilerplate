import { IPolicyHandler } from 'src/common/interfaces/policy-handler.interface';
import {
  Actions,
  AppAbility,
  Subjects
} from 'src/common/factories/casl-ability.factory';
import { Organization } from 'src/entities/organization.entity';

export class ReadOrganizationPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, Subjects.Organization);
  }
}
