import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  dueDate: Date;
}
