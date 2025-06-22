import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import authConfig from './config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesModule } from './roles/roles.module';
import { ValidatorModule } from './validator/validator.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import throttleConfig from './config/throttle.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      isGlobal: true,
      load: [databaseConfig, authConfig],
    }),
    MikroOrmModule.forRootAsync(databaseConfig.asProvider()),
    ThrottlerModule.forRootAsync(throttleConfig.asProvider()),

    AuthModule,
    UsersModule,
    RolesModule,
    ValidatorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
