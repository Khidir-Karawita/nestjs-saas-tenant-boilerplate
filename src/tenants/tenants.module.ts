import { Module } from '@nestjs/common';
import { TenantSubscriber } from './subscribers/tenants.subscriber';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './tenants.interceptor';
import { TenantAwareSubscriber } from './subscribers/tenant-aware.subscriber';
@Module({
  providers: [
    TenantAwareSubscriber,
    TenantSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [TenantSubscriber, TenantAwareSubscriber],
})
export class TenantModule {}
