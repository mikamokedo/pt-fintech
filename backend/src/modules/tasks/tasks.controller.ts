import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.services';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getList(@Request() req, @Query() query) {
    return this.taskService.getList(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateTaskDto })
  @Post()
  create(@Body() task: CreateTaskDto, @Request() req) {
    return this.taskService.create(task, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateTaskDto })
  @Put(':id')
  signIn(
    @Body() update: UpdateTaskDto,
    @Request() req,
    @Param('id') id: number,
  ) {
    return this.taskService.update(id, update, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDetail(@Request() req, @Param('id') id: number) {
    return this.taskService.getDetail(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTask(@Request() req, @Param('id') id: number) {
    return this.taskService.delete(id, req.user);
  }
}
