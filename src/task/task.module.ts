import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
    imports: [ProductModule],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService]
})
export class TaskModule {

}
