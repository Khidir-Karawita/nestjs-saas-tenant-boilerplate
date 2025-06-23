import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneWithUsername({
      username,
      options: { populate: ['role', 'role.permissions'] as never },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatched = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    this.logger.log('User logged in', user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDto) {
    const createdUser = await this.usersService.create(user);
    this.logger.log('User registered', createdUser);
    const payload = { username: createdUser.username, sub: createdUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
