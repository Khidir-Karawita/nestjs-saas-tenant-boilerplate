import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development.local','.env'],
    isGlobal: true,
    load: [databaseConfig]
  }),
  MikroOrmModule.forRootAsync(databaseConfig.asProvider()),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
