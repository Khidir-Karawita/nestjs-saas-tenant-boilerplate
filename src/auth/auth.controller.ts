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

/**
 * Authentication controller that handles user authentication and authorization.
 * Provides endpoints for user login, registration, and profile management.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Authenticates a user and returns an access token.
   * Uses local authentication strategy to validate credentials.
   * @param {User} user - The authenticated user object.
   * @returns {Promise<Object>} Object containing the access token.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@LoggedUser() user: User) {
    return this.authService.login(user);
  }

  /**
   * Retrieves the current user's profile information.
   * @param {User} user - The currently logged-in user.
   * @returns {Promise<User>} The user's complete profile data.
   */
  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return this.usersService.findOne({
      id: user.id,
    });
  }

  /**
   * Registers a new user account.
   * Creates a new user and returns an access token for immediate authentication.
   * @param {CreateUserDto} body - The user registration data.
   * @returns {Promise<Object>} Object containing the access token for the new user.
   */
  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
