import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import tenantConfig from 'src/config/tenant.config';
import { User } from 'src/entities/user.entity';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantAwareSubscriber implements EventSubscriber<any> {
  private readonly logger = new Logger(TenantAwareSubscriber.name);

  constructor(
    em: EntityManager,
    @Inject(tenantConfig.KEY)
    private readonly tenantConfigService: ConfigType<typeof tenantConfig>,
    private readonly cls: ClsService,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  getSubscribedEntities(): EntityName<any>[] {
    const entities = this.tenantConfigService.entities.filter(
      (entity) => entity !== User,
    );
    this.logger.debug(
      `Subscribing to entities: ${entities.map((e) => e.name).join(', ')}`,
    );
    return entities;
  }
  beforeCreate(args: EventArgs<any>): void | Promise<void> {
    this.logger.log('Registering tenant for entity', {
      entity: args.entity,
      tenant: this.cls.get('tenant'),
    });
    args.entity.tenant = this.cls.get('tenant');
  }
}
