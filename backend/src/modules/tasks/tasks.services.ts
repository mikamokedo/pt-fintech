import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TasksEntity } from './tasks.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './tasks.entity';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private readonly tasksRepository: Repository<TasksEntity>,
  ) {}

  async create(task: CreateTaskDto, user: UsersEntity): Promise<TasksEntity> {
    const newTask = this.tasksRepository.create({
      ...task,
      status: TaskStatus.TODO,
      userId: user.id,
    });
    return await this.tasksRepository.save(newTask);
  }

  async delete(id: number, user: UsersEntity): Promise<number> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    const role = user.role;
    if (role !== 'admin' && task.userId !== user.id) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
    await this.tasksRepository.delete(id);
    return task.id;
  }

  async getList(query: any, user: UsersEntity): Promise<TasksEntity[]> {
    const where = {};
    if (user.role !== 'admin') {
      where['userId'] = user.id;
    }

    for (const q in query) {
      switch (q) {
        case 'status':
          where['status'] = query[q];
          break;
        case 'title':
          where['title'] = Like(`%${query[q]}%`);
          break;
        case 'description':
          where['description'] = Like(`%${query[q]}%`);
          break;
        case 'dueDate':
          where['dueDate'] = query[q];
          break;
      }
    }
    return this.tasksRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getDetail(id: number, user: UsersEntity): Promise<TasksEntity> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    const role = user.role;
    if (role !== 'admin' && task.userId !== user.id) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
    return task;
  }

  async update(
    id: number,
    update: UpdateTaskDto,
    user: UsersEntity,
  ): Promise<TasksEntity> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    const role = user.role;
    if (role !== 'admin' && task.userId !== user.id) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
    await this.tasksRepository.update(id, update);
    return this.tasksRepository.findOneBy({ id });
  }
}
