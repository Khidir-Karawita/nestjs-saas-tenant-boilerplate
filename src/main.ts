import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Logger } from 'pino-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
