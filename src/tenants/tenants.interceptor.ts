import { EntityManager } from '@mikro-orm/mariadb';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Tenant } from 'src/entities/tenant.entity';
import { ConfigType } from '@nestjs/config';
import tenantConfig from 'src/config/tenant.config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/metadata/auth.decorator';
import { SKIP_TENANT_KEY } from 'src/common/decorators/metadata/skip-tenant.decorator';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly em: EntityManager,
    @Inject(tenantConfig.KEY)
    private readonly tenantConfigService: ConfigType<typeof tenantConfig>,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return next.handle();

    const shouldSkipTenant = this.reflector.getAllAndOverride<boolean>(
      SKIP_TENANT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (shouldSkipTenant) return next.handle();

    const { user } = request;

    if (!user) throw new InternalServerErrorException('User not found');
    const tenant = user.tenant as Tenant;
    if (!tenant) throw new InternalServerErrorException('Tenant not found');

    this.em.addFilter(
      'tenant',
      (args) => ({ tenant: args.tenantId }),
      this.tenantConfigService.entities,
    );

    this.em.setFilterParams('tenant', { tenantId: tenant.id });
    return next.handle();
  }
}
