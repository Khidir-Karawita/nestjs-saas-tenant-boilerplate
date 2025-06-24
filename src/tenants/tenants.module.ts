import { Module } from '@nestjs/common';
import { TenantSubscriber } from './tenants.subscriber';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './tenants.interceptor';
@Module({
  providers: [
    TenantSubscriber,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [TenantSubscriber],
})
export class TenantModule {}
