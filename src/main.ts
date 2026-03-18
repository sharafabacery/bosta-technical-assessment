import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Book Service API')
    .setDescription('The Book Store API with Pagination and Search')
    .setVersion('1.0')
    .addTag('books')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // This sets the URL to /api
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
