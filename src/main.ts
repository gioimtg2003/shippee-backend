import { ClientLoginResponseDto, ResponseDTO } from '@common/dto';
import { TransformationInterceptor } from '@common/interceptor';
import { buildConfig } from '@config';
import { TransportTypeDTO } from '@features/transport-type/dto';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { AppModule } from './app.module';

const appConfig = buildConfig();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || 3000;
  app.setGlobalPrefix('api');

  if (appConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Shipppee system API')
      .setDescription('The Shipppee system API description')
      .setVersion('1.0.0')
      .setBasePath('api')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseDTO, ClientLoginResponseDto, TransportTypeDTO],
    });
    const yamlString = yaml.dump(document);
    const dirPath = path.join(__dirname, '..', 'swagger-docs');
    const filePath = path.join(dirPath, 'swagger.yaml');

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, yamlString);

    SwaggerModule.setup('/api/doc', app, document);
  }
  app.useGlobalInterceptors(new TransformationInterceptor());

  logger.debug(`🔥 Application listening on http://localhost:${PORT}/api`);
  logger.debug(`🔥 Swagger running on http://localhost:${PORT}/api/doc`);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: appConfig.origin,
    credentials: true,
  });

  await app.listen(PORT);
}

bootstrap();
