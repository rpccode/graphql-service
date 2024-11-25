import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('tasks') // Agrupamos las tareas en este tag
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @ApiOperation({ summary: 'Limpiar productos antiguos' })
  @Cron('0 0 * * *')  // Este cron job se ejecuta a la medianoche
  async handleCleanup() {
    this.logger.log('Ejecutando limpieza de registros antiguos...');
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const resultado = await this.productRepository
      .createQueryBuilder()
      .delete()
      .where('fechaCreacion < :fecha', { fecha: fechaLimite })
      .execute();

    this.logger.log(`${resultado.affected} registros eliminados.`);
  }
}
