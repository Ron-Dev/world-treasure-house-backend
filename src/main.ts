import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (adjust origin accordingly)
  app.enableCors({
    origin: 'http://localhost:3000', // ✅ your frontend domain
    credentials: true,
  });

  app.use(cookieParser());

  // 🛡️ Global error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  // 🎁 Global success response wrapper
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('World Treasure House API')
    .setDescription('E-commerce API documentation')
    .setVersion('1.0')
    .addTag('ecommerce')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Accessible at /api-docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
