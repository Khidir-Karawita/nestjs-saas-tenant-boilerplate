import { User } from 'src/entities/user.entity';
import { AppAbility } from '../factories/casl-ability.factory';
import { Request } from 'express';

export interface IPolicyHandler {
  handle(ability: AppAbility, user: User, request: Request): boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  user: User,
  request: Request,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
