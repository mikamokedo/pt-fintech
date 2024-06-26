import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRole, UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  private async comparePasswords(
    userPassword: string,
    currentPassword: string,
  ) {
    return await bcrypt.compare(currentPassword, userPassword);
  }

  async findOneByUsername(username: string): Promise<UsersEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<UsersEntity> {
    const user = await this.findOneByUsername(username);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create({
    username,
    password,
    email,
    role,
  }: SignupDto): Promise<UsersEntity> {
    const check = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (check) {
      throw new InternalServerErrorException('User has been created');
    }
    const user = new UsersEntity();
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.username = username;
    user.role = role ?? UserRole.USER;
    return user.save();
  }
}
