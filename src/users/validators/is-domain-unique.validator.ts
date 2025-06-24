import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from '@mikro-orm/mariadb';
import { Tenant } from 'src/entities/tenant.entity';
import { ConfigType } from '@nestjs/config';
import tenantConfig from 'src/config/tenant.config';

@ValidatorConstraint({ name: 'IsDomainUniqueConstraint', async: true })
@Injectable()
export class IsDomainUnique implements ValidatorConstraintInterface {
  constructor(
    private readonly em: EntityManager,
    @Inject(tenantConfig.KEY)
    private readonly tenantConfigService: ConfigType<typeof tenantConfig>,
  ) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const dataExist = await this.em
      .getRepository(Tenant)
      .findOne({ domain: value + '.' + this.tenantConfigService.domain });
    return !dataExist;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const field = validationArguments.property;

    return `${field} is already exist.`;
  }
}
