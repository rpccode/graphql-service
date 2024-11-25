import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientProxy, EventPattern, Transport } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('rabbitmq') // Agrupar los eventos de RabbitMQ
@Injectable()
export class RabbitMQService {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:56680'],  // URL de RabbitMQ
      queue: 'product_queue',            // Nombre de la cola
      queueOptions: { durable: true },
    },
  })
  private client: ClientProxy;

  private readonly logger = new Logger(RabbitMQService.name);

  @ApiOperation({ summary: 'Maneja la creación de un producto' })
  @EventPattern('product_created')
  handleProductCreated(data: any) {
    this.logger.log('Producto creado:', data);
    // Aquí puedes agregar la lógica que desees, por ejemplo, guardar en la base de datos.
  }

  @ApiOperation({ summary: 'Maneja la actualización de un producto' })
  @EventPattern('product_updated')
  handleProductUpdated(data: any) {
    this.logger.log('Producto actualizado:', data);
    // Aquí puedes agregar la lógica que desees, por ejemplo, actualizar un producto en la base de datos.
  }

  sendMessage(pattern: string, data: any) {
    return this.client.send(pattern, data);
  }
}
