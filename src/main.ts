import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './lib/interceptor/response.interceptor';
import { AllExceptionsFilter } from './lib/helpers/AllExceptionFilter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Configuration
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  
  app.enableCors();

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HR ERP API (2026)')
    .setDescription('The API documentation for the Human Resource Management system.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 5001;
  await app.listen(port);
  Logger.log(`🚀 Fresh App running on http://localhost:${port}`);
}

bootstrap();
