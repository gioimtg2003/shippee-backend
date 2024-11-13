import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || 3000;

  app.setGlobalPrefix('api');
  logger.debug(`🔥 Application listening on http://localhost:${PORT}/api`);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}

bootstrap();
