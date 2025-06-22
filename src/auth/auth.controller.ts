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
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from 'src/common/decorators/metadata/auth.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoggedUser } from 'src/common/decorators/requests/logged-user.decorator';
import { User } from 'src/entities/user.entity';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  async login(@LoggedUser() user: User) {
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return user;
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
