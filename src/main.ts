import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  // Configure Swagger API Doc
  const config = new DocumentBuilder()
    .setTitle('Me.at Place API')
    .setDescription('API documentation for Me.at Place project')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT! || 4000);
}
bootstrap();
