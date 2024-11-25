import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => RabbitmqModule)
    
  ],
  exports: [ProductService, TypeOrmModule],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver]
})
export class ProductModule {}
