import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@ApiTags('products') // Grupo para Swagger
@Controller('products') // Ruta base: /products
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.productService.create(data);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Product>): Promise<Product> {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.productService.remove(id);
  }
}
