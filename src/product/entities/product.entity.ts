import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ description: 'Producto disponible en el sistema' }) // Define cómo se expone en GraphQL
@Entity() // Define la entidad en TypeORM
export class Product {
  @Field(() => Number) // Campo en GraphQL con tipo explícito
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  descripcion: string;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
}
