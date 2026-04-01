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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HR ERP - NextGen API (2026)')
    .setDescription(
      `### Enterprise Human Resource Management API
      \n- **Multi-tenant Isolation**: Strict tenant-awareness using subdomains.
      \n- **RBAC & Permissions**: Dynamic role-based access control.
      \n- **Audit Logs**: Full lifecycle tracking of every record.
      \n- **Global Standards**: Standardized responses and error handling.`,
    )
    .setVersion('1.2.0')
    .addBearerAuth()
    .addTag('Organization Onboarding', 'Tenant registration and system bootstrapping')
    .addTag('Authentication', 'Identity and access management')
    .addTag('Settings - Roles', 'Dynamic Role and Permission management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'HR ERP - API Documentation',
  });

  const port = process.env.PORT ?? 5001;
  await app.listen(port);
  Logger.log(`🚀 Fresh App running on http://localhost:${port}`);
}

bootstrap();
