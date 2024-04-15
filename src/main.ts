import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true //Ignore input validation variables not declared
  }));
  app.enableCors({
    origin: '*', // Allow requests from a specific origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow only specified methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers
  });
  await app.listen(5005);
}

bootstrap();