import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TaskService } from './task/task.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TaskModule } from './task/task.module';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Genera el esquema automáticamente
      playground: true,     // Habilita el playground para pruebas
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === 'production' ? 'localhost' : '127.0.0.1',
      port: parseInt(process.env.PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // No recomendado en producción
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Cambia por la URL de tu RabbitMQ
          queue: 'product_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
    ProductModule,
    RabbitmqModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [], // Exportamos los servicios para usarlos en otros módulos
})
export class AppModule {}
