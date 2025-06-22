import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/common/decorators/metadata/auth.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoggedUser } from 'src/common/decorators/requests/logged-user.decorator';
import { User } from 'src/entities/user.entity';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@LoggedUser() user: User) {
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return this.usersService.findOne({
      id: user.id,
    });
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
