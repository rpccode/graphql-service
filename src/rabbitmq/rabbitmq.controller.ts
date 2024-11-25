import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RabbitMQService } from './rabbitmq.service';

@ApiTags('rabbitmq')
@Controller('rabbitmq')
export class RabbitMQController {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitMQService: RabbitMQService) {}

  @Post('send-message')
  sendMessage(@Body() payload: { pattern: string; data: any }) {
    return this.rabbitMQService.sendMessage(payload.pattern, payload.data);
  }
}
