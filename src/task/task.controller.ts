import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('cleanup')
  manualCleanup() {
    return this.taskService.handleCleanup();
  }
}
