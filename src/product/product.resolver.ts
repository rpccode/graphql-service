import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';


@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product], { name: 'products', description: 'Obtiene todos los productos' })
  getAllItems(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { nullable: true, name: 'product', description: 'Obtiene un producto por ID' })
  getItemById(@Args('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product, { name: 'createProduct', description: 'Crea un nuevo producto' })
  createItem(
    @Args('nombre') nombre: string,
    @Args('descripcion') descripcion: string,
  ): Promise<Product> {
    return this.productService.create({ nombre, descripcion });
  }

  @Mutation(() => Product, { name: 'updateProduct', description: 'Actualiza un producto' })
  updateItem(
    @Args('id') id: number,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('descripcion', { nullable: true }) descripcion?: string,
  ): Promise<Product> {
    return this.productService.update(id, { nombre, descripcion });
  }

  @Mutation(() => Boolean, { name: 'deleteProduct', description: 'Elimina un producto por ID' })
  deleteItem(@Args('id') id: number): Promise<boolean> {
    return this.productService.remove(id);
  }
}
