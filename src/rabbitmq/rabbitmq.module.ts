import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQController } from './rabbitmq.controller';



@Module({
  imports: [],
  controllers: [RabbitMQController],
  providers: [
    {
      provide: 'RABBITMQ_SERVICE',
      useClass: RabbitMQService,
    },
  ],
  exports: ['RABBITMQ_SERVICE'],
})
export class RabbitmqModule {}
