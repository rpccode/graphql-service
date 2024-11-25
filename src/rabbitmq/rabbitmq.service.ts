import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy, // Usa el nombre registrado
  ) {}

  sendMessage(pattern: string, data: any) {
    this.logger.log(`Enviando mensaje con patrón "${pattern}"`, data);
    return this.client.emit(pattern, data); // Usa emit para eventos
  }

  sendRPCMessage(pattern: string, data: any) {
    this.logger.log(`Enviando RPC mensaje con patrón "${pattern}"`, data);
    return this.client.send(pattern, data); // Usa send para RPC
  }
}
