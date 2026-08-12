import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exec } from 'child_process';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

function openInBrowser(url: string): void {
  const command =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  exec(command, (error) => {
    if (error) {
      logger.warn(`Could not auto-open Swagger UI: ${error.message}`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: configService.get<string[]>('corsOrigins') });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pescamarche API')
    .setDescription('API documentation for Pescamarche backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);

  const docsUrl = `http://localhost:${port}/api/docs`;
  logger.log(`Swagger UI available at ${docsUrl}`);

  const shouldAutoOpen =
    process.env.NODE_ENV !== 'production' &&
    process.env.SWAGGER_AUTO_OPEN !== 'false';
  if (shouldAutoOpen) {
    openInBrowser(docsUrl);
  }
}
bootstrap();
