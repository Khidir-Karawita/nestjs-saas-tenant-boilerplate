import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from 'src/common/interfaces/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'checkPolicy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
