/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.disable('x-powered-by');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const globalPrefix = 'sales';
  const docsPath = `${globalPrefix}/docs`;
  app.setGlobalPrefix(globalPrefix);
  if (process.env.ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle('sales Api!')
      .setDescription('API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .setContact(process.env.AUTHOR, process.env.URL, process.env.EMAIL)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsPath, app, document);
    Logger.log('Swagger Enabled', 'NestApplication');
  }
  const port = process.env.HTTP_PORT || 3531;
  const host = process.env.HTTP_HOST || 'localhost';
  await app.listen(port);
  // server.setTimeout(parseInt(process.env.APP_TIMEOUT) || 1000);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
    'NestApplication',
  );
  Logger.log(
    `😎 Swagger UI on: http://${host}:${port}/${docsPath}`,
    'NestApplication',
  );
}

bootstrap();
