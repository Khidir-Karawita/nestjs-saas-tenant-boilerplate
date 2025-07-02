import { Inject, Injectable } from '@nestjs/common';
import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { Tenant } from 'src/entities/tenant.entity';
import { ConfigType } from '@nestjs/config';
import tenantConfig from 'src/config/tenant.config';

@Injectable()
export class TenantSubscriber implements EventSubscriber<Tenant> {
  constructor(
    em: EntityManager,
    @Inject(tenantConfig.KEY)
    private readonly tenantConfigService: ConfigType<typeof tenantConfig>,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<Tenant>[] {
    return [Tenant];
  }
  beforeCreate(args: EventArgs<Tenant>): void | Promise<void> {
    args.entity.domain =
      args.entity.domain + '.' + this.tenantConfigService.domain!;
  }
}
