import { Inject, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('products') // Etiqueta para agrupar endpoints
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al crear el producto' })
  async create(data: Partial<Product>): Promise<Product> {
    const item = this.productRepository.create(data);
    const savedItem = await this.productRepository.save(item);

    // Enviar mensaje a RabbitMQ
    this.client.emit('product_created', savedItem);
    return savedItem;
  }

  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito' })
  @ApiResponse({ status: 400, description: 'Error al actualizar el producto' })
  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, data);
    const updatedItem = await this.productRepository.findOne({ where: { id } });

    // Enviar mensaje a RabbitMQ
    this.client.emit('product_updated', updatedItem);
    return updatedItem;
  }

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [Product] })
  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async remove(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected > 0;
  }
}
