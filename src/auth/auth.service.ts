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

/**
 * Authentication service that handles user authentication logic.
 * Provides methods for user validation, login, and registration.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials by checking username and password.
   * @param {string} username - The username to validate.
   * @param {string} pass - The password to validate.
   * @returns {Promise<any>} The validated user object with role and permissions.
   * @throws {BadRequestException} When user is not found.
   * @throws {UnauthorizedException} When password is invalid.
   */
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

  /**
   * Generates an access token for a logged-in user.
   * @param {User} user - The user object to generate token for.
   * @returns {Object} Object containing the JWT access token.
   */
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    this.logger.log('User logged in', user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user and generates an access token.
   * @param {CreateUserDto} user - The user registration data.
   * @returns {Promise<Object>} Object containing the JWT access token for the new user.
   */
  async register(user: CreateUserDto) {
    const createdUser = await this.usersService.create(user);
    this.logger.log('User registered', createdUser);
    const payload = { username: createdUser.username, sub: createdUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
