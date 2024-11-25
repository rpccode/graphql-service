import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentación de la API GraphQL y REST')
    .setVersion('1.0')
    .addTag('products')
    .addTag('tasks')
    .addTag('rabbitmq')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3100);
}
bootstrap();
