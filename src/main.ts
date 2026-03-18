import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ 
  whitelist: true, // Strips out properties that don't have decorators in the DTO
  transform: true  // Automatically transforms payloads to match DTO classes
}));

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
