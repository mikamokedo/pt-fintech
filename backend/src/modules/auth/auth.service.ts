import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: LoginDto) {
    const user = await this.usersService.validateCredentials({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp({ username, password, email, role }: SignupDto) {
    const user = await this.usersService.create({
      username,
      password,
      email,
      role,
    });
    if (!user) {
      throw new InternalServerErrorException();
    }
    delete user.password;
    delete user.salt;
    return user;
  }
}
