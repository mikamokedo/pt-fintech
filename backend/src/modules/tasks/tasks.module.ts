import { Module } from '@nestjs/common';
import { TasksService } from './tasks.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './tasks.entity';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
