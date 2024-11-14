import { buildConfig } from '@config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const appConfig = buildConfig();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || 3000;

  if (appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Shipppee system API')
      .setDescription('The Shipppee system API description')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      yamlDocumentUrl: '/doc/api-documentation',
    });
  }

  app.setGlobalPrefix('api');

  logger.debug(`🔥 Application listening on http://localhost:${PORT}/api`);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}

bootstrap();
