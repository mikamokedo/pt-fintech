import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/users/users.entity';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
